'use strict';

const connection = new Postmonger.Session();
let targetFields = [];
let authTokens = {};
let payload = {};

document.addEventListener('DOMContentLoaded',  onRender);

connection.on('initActivity', initialize);
connection.on('requestedTokens', onGetTokens);
connection.on('requestedEndpoints', onGetEndpoints);
connection.on('clickedNext', save);

const buttonSettings = {
    button: 'next',
    text: 'done',
    visible: true,
    enabled: false,
};

function onRender() {
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');

    document.querySelector('#workspace').addEventListener('input', () => {
        buttonSettings.enabled = isSettingsValid();
        connection.trigger('updateButton', buttonSettings);
    });

}

function initialize(data) {
    if (data) {
        payload = data;
    }

    const hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : [{}];

    let currentMessageType = (inArguments[0].messageType) ? inArguments[0].messageType : '', 
        currentOA = (inArguments[0].oa) ? inArguments[0].oa : '', 
        currentDataExtension = (inArguments[0].dataExtensionKey)? inArguments[0].dataExtensionKey : '', 
        currentContent = (inArguments[0].contentId) ? inArguments[0].contentId : '', 
        currentSubscriberKey = (inArguments[0].subscriberKeyField) ? inArguments[0].subscriberKeyField : '', 
        currentSocial = (inArguments[0].zaloIdField) ? inArguments[0].zaloIdField : '',
        currentMessageName =  (inArguments[0].messageName) ? inArguments[0].messageName : '';

    document.querySelector('#messageType').value = currentMessageType;
    document.querySelector('#messageName').value = currentMessageName;
    loadContent(currentMessageType, currentContent, currentOA);
    loadDEFields(currentDataExtension, currentSubscriberKey, currentSocial);

    document.querySelector('#oa-id-select').value = currentOA;
    document.querySelector('#data-extension-name-select').value = currentDataExtension;
    
    if(currentContent)
        loadPreviewContent(currentContent, currentOA);    

    if(currentMessageType && currentOA && currentDataExtension && currentContent
        && currentSubscriberKey && currentSocial ){
        buttonSettings.enabled = true;
    }
    
    connection.trigger('updateButton', buttonSettings);
    
}

function onGetTokens(tokens) {
    console.log('ongGetTokens:', tokens);
    authTokens = tokens;
}


function onGetEndpoints(endpoints) {
    console.log('ongGetEndpints:', endpoints);
}

function save() {
    payload['metaData'].isConfigured = true;

    payload['arguments'].execute.inArguments = [
        {
            "contactKey": "{{Contact.Key}}",
        }
    ];
 
    const obj = payload['arguments'].execute.inArguments[0];
    obj.messageType = document.querySelector('#messageType').value;
    obj.oa = document.querySelector('#oa-id-select').value;
    obj.page_id = document.querySelector('#oa-id-select').value;
    obj.contentId = document.querySelector('#content-name-select').value;
    obj.dataExtensionKey = document.querySelector('#data-extension-name-select').value;
    obj.dataExtensionName =  document.querySelector('#data-extension-name-select').options[document.querySelector('#data-extension-name-select').selectedIndex].text;
    obj.subscriberKeyField = document.querySelector('#subscriber-key-select').value;
    obj.zaloIdField = document.querySelector('#social-id-select').value;
    obj.recipient_id = document.querySelector('#social-id-select').value;
    obj.targetFields = targetFields;
    obj.messageName = document.querySelector('#messageName').value;
    //obj.messageTagType = document.querySelector('#messageTagType').value;

    connection.trigger('updateActivity', payload);
}

//Load the content base on which Zalo OA / Zalo ZNS
function loadContent(messageType, selectedValue, oa) {
    document.querySelector('#content-name-select').innerHTML = '';
    const  emptyOption = document.createElement('option'); 
    emptyOption.text = 'Please select'; 
    emptyOption.value = '';
    document.querySelector('#content-name-select').add(emptyOption);

    //Load the Custom Content Blocks
    //if (messageType === 'ZaloOA') {
    if (messageType === 'text') {
        
        fetch('/custom-activity/getCustomContentBlocks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                data.items.forEach((item) => {
                    let optionText = item['name'];
                    let optionValue = item['id'];

                    let option = document.createElement('option');
                    option.text = optionText;
                    option.value = optionValue; 
                    if(parseInt(selectedValue) === optionValue)
                        option.selected = true;
                    
                    document.querySelector('#content-name-select').add(option);
                });

            })
            .catch((err) => console.log('Error occurred in /getCustomContentBlocks: ', err));
    }
}

function loadPreviewContent(content, selectedOA) {
    //console.log('loadPreviewContent:', content);
    if(content){
        let endpoint = '', 
            messageType = document.querySelector('#messageType').value;
        //if( messageType === 'ZaloOA')
        if( messageType != undefined && messageType !== '')
            endpoint = `/custom-activity/getContent/${content}`;

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
        .then(data => {
            //if(messageType === 'ZaloOA')
            if(messageType !== 'ZaloOA')
                document.querySelector('#previewContent').innerHTML = data.content; 
            else{ //ZaloZNS
                const iframe = document.createElement('iframe');
                iframe.src = data.data.previewUrl;
                iframe.style.height = '100%';
                iframe.style.width = '100%';
                iframe.style.position = 'absolute';
                document.querySelector('#previewContent').innerHTML = iframe.outerHTML;
            }
        })
        .catch((err) => console.log('Error occurred in loadPreviewContent: ', err));
    }
}

function loadDEFields(selectedDataExtension, selectedSubscriberKey, selectedSocialID) {
    document.querySelector('#social-id-select').innerHTML = '';
    let  emptyOption = document.createElement('option'); 
    emptyOption.text = 'Please select'; 
    emptyOption.value = '';
    document.querySelector('#social-id-select').add(emptyOption);

    document.querySelector('#subscriber-key-select').innerHTML = '';
    emptyOption = document.createElement('option'); 
    emptyOption.text = 'Please select'; 
    emptyOption.value = '';
    document.querySelector('#subscriber-key-select').add(emptyOption);

    if (selectedDataExtension) {
        fetch(`/custom-activity/getDataExtensionFields/${selectedDataExtension}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                data.Results.forEach(field => {
                    let optionText = field['Name'];
                    let optionValue = field['Name'];

                    let option = document.createElement('option');
                    option.text = optionText;
                    option.value = optionValue; 
                    if(selectedSocialID === optionValue)
                        option.selected = true;
                    document.querySelector('#social-id-select').add(option);

                    option = document.createElement('option');
                    option.text = optionText;
                    option.value = optionValue; 
                    if(selectedSubscriberKey === optionValue)
                        option.selected = true;
                    document.querySelector('#subscriber-key-select').add(option);
                    
                    targetFields.push(optionValue);
                    
                });
            })
            .catch((err) => console.log('Error occurred in /loadDEFields: ', err));
    }
}

function isSettingsValid() {
    
    let els = document.querySelectorAll('select, input');
    console.log("isSettingsValid() => check number select item: " + els.length);
    for(let i=0; i<els.length; i++){
        console.log("isSettingsValid() => item [" + i + "] => " + els[i].id + " = "  + els[i].value );
        let val = els[i].value;
        if (els[i].id === 'messageTagType' && !val && document.querySelector('#messageTagType_block').classList.contains('slds-hide')) {
            continue;
        }
        if(!val)
            return false;
    }  

    return true;
}