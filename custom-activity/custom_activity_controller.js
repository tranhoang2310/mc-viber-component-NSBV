const config = require('../config');
const mc = require('../modules/mc');
const zalo = require('../modules/zalo');
const messenger = require('../modules/messenger');
const viber = require('../modules/viber');
const logger = require('../modules/logger');
const axios = require('axios');
const { Console } = require('winston/lib/winston/transports');

const controller = {}; 

controller.getOAs = () => {
    let dataExtensionName = config.MC.viberDEName;
    let fields = ['Viber_OA_Id','Viber_OA_Name', 'Active'];
    let filter = {				
        	leftOperand: 'Active',
        	operator: 'equals',
        	rightOperand: true
   	}

    return mc.getDERows(dataExtensionName, fields, filter)
  
};

controller.getDataExtensions = () => {
    return mc.getAllDataExtensions();
};

controller.getDataExtensionFields = (dataExtensionKey) => {
    return mc.getDataExtensionFields(dataExtensionKey);
};

controller.getCustomContentBlocks = () => {
    let fields = ['Id', 'Name'], 
        contentFolderName = config.MC_ContentCategories.CustomBlockPrefix, 
        assetTypeId = config.MC_AssetTypes.CustomBlock;

    console.log('HoangT check right '+assetTypeId);
    console.log('HoangT check left 2'+contentFolderName);

    let query = { 
        "leftOperand":
        {
            "property":"name",
            "simpleOperator":"startsWith",
            "value": contentFolderName
        },
        "logicalOperator":"AND",
        "rightOperand":
        {
            "property":"assetType.id",
            "simpleOperator":"equals",
            "value": assetTypeId
        }
    }

    return mc.getContent(fields, query);
}

controller.getContentById = (contentId) => {
    let fields = ['content'];
    return mc.getContentById(contentId, fields)
};

controller.execute = async (req, res) => {
    //console.log('Activity controller.execute is called - req.body:', req.body);
    //console.log('Activity controller.execute is called - req', req);
    
    let obj = req.body.inArguments[0];

    console.log('Chu Y!!!');
    //console.log('Object la :',obj);

    let oa = obj.oa,
        oaName = obj.oaName, 
        contactKey = obj.contactKey, 
        contentId = obj.contentId, 
        dataExtensionName = obj.dataExtensionName, 
        dataExtensionKey = obj.dataExtensionKey, 
        subscriberKeyField = obj.subscriberKeyField, 
        zaloIdField = obj.zaloIdField, //ZNS this field will be the phone field
        recipientId = obj.recipient_id,
        targetFields = obj.targetFields,
        journeyId = req.body.journeyId,
        activityId = req.body.activityId,
        activityInstanceId = req.body.activityInstanceId,
        messageType = obj.messageType,
        messageName = obj.messageName;
        //messageTagType = obj.messageTagType;

    console.log('contactKey:', contactKey);
    console.log('oa:', oa); 
    console.log('contentId:', contentId);
    console.log('dataExtensionKey:', dataExtensionKey);
    console.log('dataExtensionName:', dataExtensionName);
    console.log('subscriberKeyField:', subscriberKeyField);
    console.log('zaloIdField:', zaloIdField);
    console.log('targetField:', targetFields);
    console.log('journeyId:', journeyId);
    console.log('actvityId:', activityId);
    console.log('actvityInstanceId:', activityInstanceId);
    console.log('messageType:', messageType);
    console.log('messageName:', messageName);
    
    const filter = {
        'leftOperand' : subscriberKeyField, 
        'operator' : 'equals',
        //'rightOperand' : contactKey
        'rightOperand' : contactKey
    };

    try {
        const targetRecords = await mc.getDERows(dataExtensionName, targetFields, filter); 
        console.log('get DE row',targetRecords);
        console.log('dataExtensionName la ',dataExtensionName);
        console.log('targetFields ',targetFields);
        console.log('filter ',filter);
        if(targetRecords && targetRecords.length > 0){
            //console.log('enter target record');
            const record = targetRecords[0]; 
            const fields = 'meta';
            const recipient_id = record[recipientId];
            //console.log('recipient_id ', recipient_id);
            //console.log('Enter target record', targetRecords);
            let oaRecords = await mc.getDERows(config.MC.viberDEName, ['token', 'Viber_OA_Name', 'Avatar','Viber_OA_Id'], {
                'leftOperand' : 'Viber_OA_Id', 
                'operator' : 'equals',
                'rightOperand' : oa
            });

            console.log('oaRecords ', oaRecords);
            const token = oaRecords[0].token; 
            oaName = oaRecords[0].Viber_OA_Name;
            let oa_ID = oaRecords[0].Viber_OA_Id; // HoangT - add this field
            const avatar =  oaRecords[0].Avatar;
            const content = await mc.getContentById(contentId, fields); 
            //console.log('content ', content);
            let contentMessage = content.meta.options.customBlockData.message;
            console.log('contentMessage ', contentMessage);
            //Only personalize the content for 3 types of messages
            if(content.meta.options.customBlockData.type === 'text-area' || content.meta.options.customBlockData.type === 'form-photo'
            || content.meta.options.customBlockData.type === 'list-button'){
                for(const prop in record){
                    let expr = `%%${prop}%%`;
                    const replacer = new RegExp(expr, 'gi')
                    contentMessage.text = contentMessage.text.replace(replacer, record[prop]);
                }
            }
            
            //File message
            console.log('File message');
            if(content.meta.options.customBlockData.type === 'notice') {
                console.log('Enter File message 1');
                let fileName = content.meta.options.customBlockData.fileName,
                fileType = content.meta.options.customBlockData.fileType,
                fileId = content.meta.options.customBlockData.fileId,
                fileUrl = content.meta.options.customBlockData.u['notice-file'];

                //Download file from MC 
                let fileResponse = await axios({
                    method : 'get',
                    url : fileUrl,
                    responseType : 'Stream',
                });
                console.log('enter File message 2');    
                const zaloFileResponse = await zalo.uploadFile(token, fileResponse.data, fileName);
                const zaloFileToken = zaloFileResponse.data.data.token;
                contentMessage.attachment.payload.token = zaloFileToken;

            }
            
            //FOR CHAT BOT - VIBER
            // let messengerPayload = {
            //     "receiver":recipient_id,
            //     "min_api_version":1,
            //     "sender":{
            //        "name": oaName,
            //        "avatar":avatar
            //     },
            //     "tracking_data":"tracking data",
            //     "type":"text",
            //     "text": ("text" in contentMessage ? contentMessage.text : contentMessage)
            //  };
            
            //FOR SOUTH TELECOM REQUEST - HoangT
            let req_id = new Date(Date.now()).toISOString();
            let client_req_id = req_id + ' ' + recipient_id;
            
            let messengerPayload = {};

            if ("text2a" in contentMessage) //Nếu có tồn tại text2a => đang sử dụng Template Viber && Template ID = Text2a 
            {
                console.log("contentMessage.text la ",contentMessage.text);
                console.log("template data la ",'{'+ contentMessage.text +'}');

                messengerPayload = {
                    "from": oa_ID,
                    "to":recipient_id,
                    "client_req_id":client_req_id,
                    "template_id": ("text2a" in contentMessage ? contentMessage.text2a : contentMessage),
                    "template_data": JSON.parse('{'+ contentMessage.text +'}' )
                 };

            }
            else //Nếu ko tồn tại text2a => Chỉ gửi Text Only
            {
                 messengerPayload = {
                    "from": oa_ID,
                    "to":recipient_id,
                    "client_req_id":client_req_id,
                    "text": ("text" in contentMessage ? contentMessage.text : contentMessage),
                 };
            }
            
            
             console.log('HoangT - Check Request')
             console.log('messengerPayload ',messengerPayload);

             //logger.info('[Viber Request]' + '= ' +  JSON.stringify(messengerPayload));
            let messengerResponse = undefined;

            //SEND MESSAGE - POST REQUEST
            try {
                const messengerResponseFull = await viber.sendMessage(token, messengerPayload);
                messengerResponse = ("data" in messengerResponseFull? messengerResponseFull.data : undefined);
                console.log('Enter Send message ',messengerResponse);
            } catch(err) {
                if (err) {
                    messengerResponse = err;
                    console.log("err->", err);
                    console.log('Enter Send message error',messengerResponse);
                }
            } 
            
            //Internal Tracking Sent Messages
            const mcRecord = { 
                'Viber_Id': oa, 
                "Receiver_Id": recipient_id,
                'Message_Name': messageName,
                'Message_Content': ("text" in contentMessage ? contentMessage.text : contentMessage),
                'Campaign_Journey_Name' : journeyId,
                'Journey_Activity_ID': activityInstanceId,
            };

            console.log('After Send message ',mcRecord);

            
            //logger.info('[Viber Response]' + '= ' +  JSON.stringify(messengerResponse));

            if(messengerResponse != undefined && messengerResponse.status == '1') 
            {
                mcRecord['Message_ID'] = client_req_id;
                mcRecord['Sent_Date'] = new Date(Date.now()).toISOString();
                mcRecord['Delivery_Status'] = true;
                console.log("Viber Success");
            }
            else if (messengerResponse != undefined  && messengerResponse.status == '0'){ //Messenger return error
                mcRecord['Sent_Date'] = new Date(Date.now()).toISOString();
                mcRecord['Delivery_Status'] = false;
                mcRecord['Message_ID'] = client_req_id;
                mcRecord['Ref_Delivery'] = messengerResponse.errorcode;
                console.log("Viber Fail with Error Code ", messengerResponse.errorcode);
            }
        
            //Internal Tracking Sent Messages
            mc.createDERow(config.MC.viberSendLogDE, mcRecord)
            .then(mcResponse => {
                logger.info('MC Response:', mcResponse);
            }).catch(mcError =>{
                logger.error('MC Error:', mcError);
            });
            res.status(200).send({
                status: 'ok',
            });
            
        }
    }
    catch(err) {
        logger.error('[Exception in custom_activity_controller.execute]', err);
        res.sendStatus(500);
    }
};

module.exports = controller; 
