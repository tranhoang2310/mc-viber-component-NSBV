const axios = require('axios');
const config = require('../config.json');
const logger = require('./logger');
const FormData = require('form-data');

const messenger = {};

messenger.sendMessage = (token, payload) => {
    const options = {
        method : 'post',
        url : config.FB.FB_Endpoint + "?access_token=" +  token,
        responseType : 'json',
        data : payload,
        headers : {
            'Content-Type': 'application/json',
            //'access_token' : token,
        }
    }
    /*
    axios(options).catch(error => {
        return error.response.data;
    }).then(response => {
        return response.data;
    });
    */
    return axios(options);
   
}

module.exports = messenger;