const axios = require('axios');
const config = require('../config.json');
const logger = require('./logger');
const FormData = require('form-data');

const viber = {};
const username = config.Viber.User;
const password = config.Viber.Pass;
//const auth = Buffer.from(username + ':' + password).toString('base64');

viber.sendMessage = (token, payload) => {
    const options = {
        method : 'post',
        url : config.Viber.Viber_Endpoint ,
        responseType : 'json',
        data : payload,
        headers : {
            'Content-Type': 'application/json',
            //'X-Viber-Auth-Token' : token,
            'Accept':'application/json',
            'Authorization':'Basic ' + token
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

module.exports = viber;