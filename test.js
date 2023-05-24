//const zalo = require('./modules/zalo');
const axios = require('axios');
const config = require('./config.json');
const mc = require('./modules/mc');

//Download file from MC 
const fileUrl = 'https://image.s7.sfmc-content.com/lib/fe8e137276660d7e72/m/1/file-sample+DOCX.docx';
const token = 'GfiZFCXtcYPAa2OmmtQQBqkQ9p3UBU1rAv8c3jupvtanjJKp_bReHn75DXpdPUXKR-WsEOjNyra5unyYt4EXRmJIRWVdGATW2iP22UTuk5KLoa0p_skzL1tRNWxiQg9O6_P9FEvWlb1iXdS7ZJs0PGR5IIhvUF1m8F8qEib8oN14qX8oip7RS66Z4pYqBif5Vh01CwuzwLzPqGOMsa7W3mNMD52ELkeSTFCE2uGLztKBfGeqdG3bGaFc626Y1iT6Ve0G0ROMw60qfWSutqhe9LRy1qU1SEzPPRlLZIxAO9md'; 
const fileName='sample.docx';


async function test(){
    const zaloId = '1966748493356458945';
    const dataExtensionName = 'Zalo_Subscribers'; 
    const fields = ['Zalo_ID'];
    const filter = {
        leftOperand: 'Zalo_ID',
        operator: 'equals',
        rightOperand: zaloId
    };
    
    const rows = await mc.getDERows(dataExtensionName, fields, filter); 

    console.log('rows:', rows.length);
    
    
    if(rows.length > 0) 
        console.log('has record');
    else 
        console.log('no row');
    
    
    /*
    let fileResponse = await axios({
        method : 'get',
        url : fileUrl,
        responseType : 'Stream',
    });

    zalo.uploadFile(token, fileResponse.data, fileName)
    .then(response => {
        console.log('response:', response);
    }).catch(error =>{
        console.log('error:', error);
    });
    */
}

const myDate = Date.now(); 
console.log(myDate);


//test();
/*
const record = {
    Zalo_ID: '246845883529197980',
    Status: 'unfollow',
    Unsubscribe_Date: '1974-11-23T00:19:38.274Z'
};

mc.updateDERow('Zalo_Subscribers', record)
.then(response => {

}).catch(ex => {
    console.log('excepton here:', ex.results);
});
*/

//const myDate = new Date(154397978274); 
//console.log('myDate:', myDate.toISOString());
//console.log('myDate:', myDate.toUTCString());
//console.log('myDate:', myDate.toLocaleDateString());
//console.log('myDate:', myDate.toLocaleTimeString());


/*
const myDate = new Date('1974-11-23T00:19:38.274Z');
console.log('myDate:', myDate);
console.log('myDate:', myDate.toLocaleDateString());
console.log('myDate:', myDate.toLocaleTimeString());
*/