const config = require('../config.json');
const ET_Client = require('sfmc-fuelsdk-node');
const {JSONPath} = require('jsonpath-plus');
const logger = require('./logger');

const clientId = config.MC.clientId;
const clientSecret = config.MC.clientSecret;
const stack = config.MC.stack;
const authVersion = config.MC.authVersion;
const MID = config.MC.MID;
const authURL = config.MC_Endpoint.authURL;
const restURL = config.MC_Endpoint.restURL;
const soapURL = config.MC_Endpoint.soapURL;


const IET_Client = new ET_Client(clientId, clientSecret, stack, {
    origin: restURL,
    soapOrigin: soapURL,
    authOrigin: authURL,
    authOptions: {
        authVersion: authVersion,
        accountId: MID,
        applicationType: 'server',
        scope: ''
    }
});

const mc = {};

mc.getDERows =  (dataExtensionName, fields, filter) => {
    return new Promise((resolve, reject) => {
        const options = {
        Name: dataExtensionName, 
        props: fields
        }

        if(filter)
            options.filter = filter;
        console.log('Filter là '+ JSON.stringify(filter))
        let lData= [];
        let deRow = IET_Client.dataExtensionRow(options);

        console.log('derow la ' + JSON.stringify(deRow))
        deRow.get((err, response) => {
            console.log('Derow.get ' + JSON.stringify(response))
            if (err) {
                logger.error('[mc.getDERows] - Error: ' + JSON.stringify(err));
                reject(err);
            } 
            else {
                console.log('ko bi loi ')
                let hasRows = response.body.Results.length > 0 && 'Properties' in response.body.Results[0] && 'Property' in response.body.Results[0]['Properties'];
                console.log('Has row la ' + hasRows)
                if (hasRows) {
                    let body = response.body.Results;
                    
                    JSONPath('$..Property',body,  (payload) => {
                        var data = new Object;

                        if(Array.isArray(payload)){
                            payload.forEach(member => {
                                if ('Name' in member && 'Value' in member) {
                                    data[member['Name']] = member['Value'];                                
                                }
                            });
                        }
                        else {
                            let member = payload;
                            if ('Name' in member && 'Value' in member) {
                                data[member['Name']] = member['Value'];                                
                            }
                        }
                        
                        lData.push(data);
                        
                    });
                    
                    resolve(lData);
                }
                else{//No data
                    resolve( response.body.Results);
                    //resolve(JSON.stringify(body));
                }
            }
        });
    });
},

mc.createDERow = (dataExtensionName, Record) => {
    return new Promise((resolve, reject) => {
        let options = {
            Name: dataExtensionName,
            props: Record
        };
        
        var deRow = IET_Client.dataExtensionRow(options)
        deRow.post((err, response) => {
            if (err) {
                logger.error('[mc.createDERow] - Error: ' + JSON.stringify(err));
                reject(err);
            } else {
                console.log('[mc.createDERow] - successed: ' + JSON.stringify(response.body.Results));
                resolve(response.body.Results);
            }
        });
    });
},

mc.updateDERow = (dataExtensionName, Record) => {
    return new Promise((resolve, reject) => {
        let options = {
            Name: dataExtensionName,
            props: Record
        };
        let deRow = IET_Client.dataExtensionRow(options)
        deRow.patch((err, response) => {
            if (err) {
                logger.error('[mc.updateDERow] - Error: ' + JSON.stringify(err));
                reject(err);
            } else {
                resolve(response.body.Results);
            }
        });
    });
},

mc.deleteDERow = (dataExtensionName, Record) => {
    return new Promise((resolve, reject) => {
        let options = {
            Name: dataExtensionName,
            props: Record
        };
        let deRow = IET_Client.dataExtensionRow(options)
        deRow.delete((err, response) => {
            if (err) {
                logger.error('[mc.deleteDERow] - Error: ' + JSON.stringify(err));
                reject(err);
            } else {
                resolve(response.body.Results);
            }
        });
    });
},

mc.getAllDataExtensions = () => {
    return new Promise((resolve, reject) => {
        const options = {
            props: ['Name', 'CustomerKey', 'IsSendable']
        };
        
        const dataExtension = IET_Client.dataExtension(options);

        dataExtension.get((err, response) => {
            if (err) {
                logger.error('[mc.getAllDataExtension] - Error: ' + JSON.stringify(err));
                reject(err);
            } else {
                let dataExtensionMapNameWithCustomerKey = new Object;
                let dataExtensionNames = [];
                response.body.Results.forEach(result => {
                    let sendableStatus = result['IsSendable'];
                    if (sendableStatus == 'true') {
                        dataExtensionNames.push(result['Name']);
                        dataExtensionMapNameWithCustomerKey[result['Name']] = result['CustomerKey'];
                    }
                });

                dataExtensionNames.sort();
                
                let dataExtensions = [];
                dataExtensionNames.forEach(dataExtensionName => {
                    let dataExtension = new Object;
                    dataExtension['Name'] = dataExtensionName;
                    dataExtension['CustomerKey'] = dataExtensionMapNameWithCustomerKey[dataExtensionName];
                    dataExtensions.push(dataExtension);
                });
                
                resolve(dataExtensions);
            }
        });
    });
},

mc.getDataExtensionFields = (dataExtensionKey) => {
    return new Promise((resolve, reject) => {
        let options = {
            props: ['Name', 'CustomerKey', 'FieldType'],
            filter: {						
                leftOperand: 'DataExtension.CustomerKey',
                operator: 'equals',
                rightOperand: dataExtensionKey
            }
        };	
        let deColumn = IET_Client.dataExtensionColumn(options);
        deColumn.get(function(err,response) {
            if (err) {
                logger.error('[mc.getAllDataExtensionFields] - Error: ' + JSON.stringify(err));
                reject(err);
            } else {
                let result = response && response.body ? response.body : response;
                resolve(result);
            }
        });	
    });
},

//Content Builder
mc.getContent= (fields, query) => {
    //console.log('mc.getContent');
    return new Promise((resolve, reject) => {
        let payload = {
            "fields" : fields,
            "sort" : [
                {
                    "property" : "Name",
                    "direction" : "ASC"
                }
            ],
            "query" : query,
            "page":
            {
                "page":1,
                "pageSize":10000
            }
        };

        IET_Client.RestClient
            .post({uri: '/asset/v1/content/assets/query', body: JSON.stringify(payload)})
            .then(function(response) {
                resolve(response.body);
            }.bind(this))
            .catch(function(err) {
                logger.error('[mc.getContent] - Error: ' + JSON.stringify(err));
                reject(err);
            }.bind(this));
    });
},

mc.getContentById = (contentId, fields) => {
    return new Promise((resolve, reject) => {
        let endpoint = (fields) ? `${config.MC_Endpoint.restURL}/asset/v1/content/assets/${contentId}?$fields=${fields}` : `${config.MC_Endpoint.restURL}/asset/v1/content/assets/${contentId}`;
        IET_Client.RestClient
            .get(endpoint)
            .then(function (response) {
                let result = response.body;
                resolve(result);
            }.bind(this))
            .catch(function (err) {
                logger.error('[mc.getContentById] - Error: ' + err);
                reject(err);
            }.bind(this));
    });
}

module.exports = mc;