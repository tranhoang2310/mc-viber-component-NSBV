const axios = require('axios');
const config = require('../config.json');
const logger = require('./logger');
const FormData = require('form-data');

const zalo = {};

zalo.getZNSTemplateDetail = (token, templateId) => {
    let endpoint = `${config.Zalo.ZNS_Endpoint}/template/info?template_id=${templateId}`;
    
    const options = {
        method : 'get',
        url : endpoint,
        responseType : 'json',
        headers : {
            'access_token' : token
        }
    }

    return axios(options);
}

zalo.getZNSTemplates = (token, offset = 0, limit = 100, data = []) => {
    let endpoint = `${config.Zalo.ZNS_Endpoint}/template/all?offset=${offset}&limit=${limit}&status=1`;
    const options = {
        method : 'get',
        url : endpoint,
        responseType : 'json',
        headers : {
            'access_token' : token
        }
    }
    
    return axios(options).then(response => {
        //console.log('response:', response.data);
        if(response.data.data.length < 1) return data; 

        data = [...data,...response.data.data]; 
        offset = offset + limit; 
        return zalo.getZNSTemplates(token, offset, limit, data); 
    });
}

zalo.sendMessage = (token, payload, messageType) => {
    //console.log('Zalo payload:', payload);
    const options = {
        method : 'post',
        url : (messageType === 'ZaloOA') ? config.Zalo.OA_Endpoint : `${config.Zalo.ZNS_Endpoint}/message/template` ,
        responseType : 'json',
        data : payload,
        headers : {
            'Content-Type': 'application/json',
            'access_token' : token,
        }
    }

    return axios(options);
   
}

zalo.uploadFile = (token, fileContent, fileName) => {
    const data = new FormData();
    data.append('file', fileContent, fileName);

    const options = {
        method : 'post',
        url: config.Zalo.UploadFile_Endpoint,
        responseType : 'json',
        headers : {
            'access_token' : token,
            ...data.getHeaders()
        } ,
        data: data 
    }

    return axios(options);
}

module.exports = zalo;