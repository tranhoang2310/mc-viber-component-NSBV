'use strict';

var sdk = new window.sfdc.BlockSDK({
  blockEditorWidth: 740
});

function onMessageTypeChange(selection) {
    document.querySelectorAll('.section').forEach(function(section){
      section.classList.add('slds-hide');
    });
    
    if(selection.value)
      document.querySelector(`#${selection.value}`).classList.remove('slds-hide');
}

function showOptions(select) {
  let row = select.dataset.row;

  let type = document.querySelector('#messageType').value; 
  if(type === 'form-list'){ //form-list type
    let linkSelector = '#list-link' + row,
        responseSelector = '#list-response' + row;
    if(select.value === 'button' || select.value === 'text') {
      document.querySelector(responseSelector).classList.remove('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
    } else if(select.value === 'link') {
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.remove('slds-hide');
    }
    else{
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
    }
  }
  else if(type === 'list-button'){ // list button type
    let linkSelector = '#link' + row,
        responseSelector = '#response' + row,
        phoneSelector = '#phone' + row,
        smsSelector = '#sms' + row;

    if(select.value === 'button' || select.value === 'text') {
      document.querySelector(responseSelector).classList.remove('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
      document.querySelector(phoneSelector).classList.add('slds-hide');
      document.querySelector(smsSelector).classList.add('slds-hide');

    } else if(select.value === 'link') {
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.remove('slds-hide');
      document.querySelector(phoneSelector).classList.add('slds-hide');
      document.querySelector(smsSelector).classList.add('slds-hide');

    }
    else if(select.value === 'phone'){
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
      document.querySelector(phoneSelector).classList.remove('slds-hide');
      document.querySelector(smsSelector).classList.add('slds-hide');
    }
    else if(select.value === 'sms') {
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
      document.querySelector(phoneSelector).classList.remove('slds-hide');
      document.querySelector(smsSelector).classList.remove('slds-hide');
    }
    else {
      document.querySelector(responseSelector).classList.add('slds-hide');
      document.querySelector(linkSelector).classList.add('slds-hide');
      document.querySelector(phoneSelector).classList.add('slds-hide');
      document.querySelector(smsSelector).classList.add('slds-hide');
    }
  }
}

function restoreParms() {
	sdk.getData(function(objData) {
    let messageType = (objData.type ) ? objData.type : ''; 
    document.getElementById('messageType').value = messageType;
    document.getElementById('messageType').onchange();

    if(messageType) {
      if(messageType === 'text-area'){
        document.getElementById('txtBlock1').value = objData.u.txtBlock1;
      }
      else if(messageType === 'form-photo'){
        document.getElementById('txtBlock2').value = objData.u.txtBlock2;
        document.getElementById('txtBlock2a').value = objData.u.txtBlock2a;
        document.getElementById('photo').value = objData.u.photo;
      }
      else if(messageType === 'form-list'){
        objData.u.forEach((item) =>{
          let el = document.querySelector('#' + item.id);
          el.value = item.value;
          if(el.tagName.toLocaleLowerCase() == 'select' && el.id.startsWith('form-list-type'))
            el.onchange();
        });
      }
      else if(messageType === 'list-button'){
        objData.u.forEach((item) =>{
          let el = document.querySelector('#' + item.id);
          el.value = item.value;
          if(el.tagName.toLocaleLowerCase() == 'select' && el.id.startsWith('list-button-type'))
            el.onchange();
        });
      }
      else if(messageType === 'user-info'){
        document.querySelector('#user-info-title').value = objData.u['user-info-title'];
        document.querySelector('#user-info-subTitle').value = objData.u['user-info-subTitle'];
        document.querySelector('#user-info-image').value = objData.u['user-info-image'];
      }
      else if(messageType === 'notice'){
         document.querySelector("#notice-file").value = objData.u['notice-file'];
      }
    }
	});
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function paint(messageType) {
  let hostService = window.location.hostname;
  if(messageType === 'text-area'){
    let content = `<div id="step_preview_content" class="step"><h3 style="text-align: center"> Preview Message</h3><div id="display_review" style="width: 292px; height:200px; margin: auto;"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="Line Multi-Content Preview"><style>@font-face{font-family: "Roboto - Regular" !important;src: url("./fonts/Roboto-Regular.woff") format("woff") !important;font-weight: normal !important;font-style: normal !important;}@font-face{font-family: "Helvetica Neue - Roman" !important;src: url("./fonts/HelveticaNeue-Roman.woff") format("woff") !important;font-weight: normal !important;font-style: normal !important;}html,body{margin: 0 !important;padding: 0 !important; height: 100% !important;width: 100% !important;font-family: "Roboto - Regular", sans-serif !important;background-color: #ECEBEA !important;line-height: 1.4 !important;}header{background-color: #16325C !important;text-align: center !important;color: #fff !important;padding: 12px 8px 8px !important;display: flex !important;}.home-icon{width: 22px !important;height: 22px !important;margin: 20px 10px 0 0 !important;}.home-icon svg{fill: #FFFFFF !important;}.chevron-left-icon{width: 22px !important;height: 22px !important;margin-top: 20px !important;}.chevron-left-icon svg{fill: #FFFFFF !important;}.chevron-down-icon{width: 22px !important;height: 22px !important;margin: 25px 0 0 0 !important;}.chevron-down-icon svg{fill: #FFFFFF !important;}.blue-bar{flex-grow: 10 !important;background-color: #0070D2 !important;margin: 25px 20px 5px 20px !important;}#previewer-container{height: calc(520px - 65px) !important;overflow-x: hidden !important;overflow-y: auto !important;}#previewer-container.landscape{height: calc(292px - 65px) !important;}.container{position: relative !important;padding: 10px 10px 0 10px !important;}.container:last-child{padding-bottom: 10px !important;}.container > div{display: inline-block !important;vertical-align: top !important;}.container > div:first-child{padding-right: 10px !important;}.container > div:last-child{border-radius: .5rem !important;}.user-icon{width: 22px !important;height: 22px !important;background: url("https://${hostService}/assets/images/bdf53405-b91f-461f-b82c-d4d8fbe46097.png") !important;background-repeat: no-repeat !important;}.audio-empty{width: 136px !important;height: 30px !important;background: url("https://${hostService}/assets/images/d79fe4e7-727c-47fa-a290-6a0c111d96f7.png") !important;background-repeat: no-repeat !important;}.text{max-width: 202px !important;padding: 10px !important;color: #555555 !important;font-size: 10px !important;background-color: #FFFFFF !important;word-break: break-word !important;-ms-word-wrap: break-word !important;display: -webkit-box !important;position: relative !important;border-radius: .5rem !important;}.bubble-arrow{position: absolute !important;width: 0 !important;left: 30px !important;height: 0 !important;top: 0px !important;}.bubble-arrow:after{content: "" !important;position: absolute !important;border: 0 solid transparent !important;border-top: 9px solid #FFFFFF !important;border-radius: 0 25px 0 !important;width: 15px !important;height: 30px !important;transform: rotate(145deg) !important;}.image-container{position: relative !important;line-height: 0!important;border-radius: .5rem !important;}.image{max-width: 202px !important;max-height: 340px !important;border-radius: .5rem !important;background-color: #E3F7FF !important;}.video{position: relative !important;line-height: 0 !important;}.video-opacity{height: 100% !important;width: 100% !important;position: absolute !important;top: 0 !important;background-color: #000000 !important;opacity: .4 !important;border-radius: .5rem !important;}.video svg{position: absolute !important;top: 50% !important;left: 50% !important;transform: translate(-50%, -50%) !important;width: 100% !important;}.video svg #bkgd{fill: transparent !important;}.audio-time{position: absolute !important;top: 19px !important;left: 75px !important;color: #555555 !important;font-size: 10px !important;background-color: #FFFFFF !important;}.landscape .text{max-width: 302px !important;min-width: 302px !important;}.landscape .image,.landscape .video{max-width: 322px !important;}.map-container{position: relative !important;margin-left: -5px !important;}.map-container .imagemap{position: relative !important;padding: 0px !important;border-radius: .5rem !important;width: 282px !important;height: 282px !important;background-size: cover !important;background-repeat: no-repeat !important;}.map-container .imagemap canvas{position: absolute !important; left: 0px !important;top: 0px !important;padding: 0px !important;width: 282px !important;height: 282px !important;border: 0px !important;opacity: 1 !important;}.map-container .imagemap img{position: absolute !important;display: block !important;top: 0px !important;left: 0px !important;height: 282px !important;width: 282px !important;padding: 0px !important;border: 0px !important;opacity: 0 !important;}.map-container .highlight{position: absolute !important;background-color: #FFFFFF !important;opacity: .5 !important;}.landscape .map-container .imagemap,.landscape .map-container .imagemap canvas,.landscape .map-container .imagemap img{width: 368px !important;height: 368px !important;}.line-sticker-container{position: relative !important;max-width: 220px !important;}.landscape .line-sticker-container{max-width: none !important;}.line-sticker{height: 58px !important; width: 57px !important;margin: 0 .5rem .5rem 0 !important;}</style><div class="line-multi-content-previewer"><header><div class="chevron-left-icon"><svg viewBox="0 0 24 24" id="chevronleft" width="100%" height="100%"><path d="M15.8 22l-9.6-9.4c-.3-.3-.3-.8 0-1.1l9.6-9.4c.3-.3.7-.3 1 0l1 1c.3.3.3.7 0 1l-7.6 7.4c-.3.3-.3.8 0 1.1l7.5 7.4c.3.3.3.7 0 1l-1 1c-.2.2-.6.2-.9 0z"></path></svg></div><div class="blue-bar"></div><div class="home-icon"><svg viewBox="0 0 24 24" id="home" width="100%" height="100%"><path d="M22.6 12.5h-2.3v10.1c0 .3-.2.5-.5.5h-4.6c-.2 0-.4-.2-.4-.5v-7.8H9.2v7.8c0 .3-.2.5-.4.5H4.2c-.3 0-.5-.2-.5-.5V12.5H1.4c-.2 0-.4-.1-.4-.3-.1-.2-.1-.4.1-.5L11.7 1.1c.2-.2.5-.2.6 0l10.6 10.6c.2.1.2.3.1.5s-.2.3-.4.3z"></path></svg></div><div class="chevron-down-icon"><svg viewBox="0 0 24 24" id="chevrondown" width="100%" height="100%"><path d="M22 8.2l-9.5 9.6c-.3.2-.7.2-1 0L2 8.2c-.2-.3-.2-.7 0-1l1-1c.3-.3.8-.3 1.1 0l7.4 7.5c.3.3.7.3 1 0l7.4-7.5c.3-.2.8-.2 1.1 0l1 1c.2.3.2.7 0 1z"></path></svg></div></header><div id="previewer-container" class="portrait scroll" style="background-color: #ECEBEA;"><div class="container"><div class="user-icon-container"><div class="user-icon"></div></div><div id="previewer_message" class="text">${document.querySelector('#txtBlock1').value}</div><div class="bubble-arrow"></div></div></div></div></div></div>`;
    //`<p style="width:300px;margin-left:auto; margin-right:auto;">${document.querySelector('#txtBlock1').value}</p>`;
    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'u' : { 
        'txtBlock1': document.querySelector('#txtBlock1').value
      },
      'message':{
        'text': document.querySelector('#txtBlock1').value
      }
    })
  }
  else if(messageType === 'form-photo'){
    let img = '';
    if(document.querySelector('#photo').value)
      img = `<img src="${document.querySelector('#photo').value}" style="width:250px; height:130px;"/>`;

    let content = `<div style="width:300px; margin-left:auto; margin-right:auto">
                  <div style="padding:5px; background-color:#FFF">${document.querySelector('#txtBlock2a').value}</div>
                  <div style="padding:5px; background-color:#FFF">${document.querySelector('#txtBlock2').value}</div>
                  ${img}
                </div>`;

    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'u' : {
        'txtBlock2' : document.querySelector('#txtBlock2').value,
        'txtBlock2a' : document.querySelector('#txtBlock2a').value,
        'photo': document.querySelector('#photo').value
      },
      'message':{
        'text': document.querySelector('#txtBlock2').value,
        'text2a':document.querySelector('#txtBlock2a').value,
        'attachment' : {
          'type': 'template',
          'payload': {
            'template_type': 'media',
            'elements': [{
              'media_type': 'image',
              'url' : document.querySelector('#photo').value
            }]
          }
        }
      }
    });
  }
  else if(messageType === 'form-list'){
    let elements = [];
    let contents = [];
    let currentContent = '';
    let ui = [];

    
    document.querySelectorAll('#form-list div.slds-form-element__row').forEach( (el, index) => {
      let linkOrButton = el.querySelector('select.selectType').value;
      if(linkOrButton){
        let title = el.querySelector('input.title').value;
        let e = {};
        e.title = title; 
        
        if(linkOrButton === 'link'){
          let url = el.querySelector('input.link').value;
          e.default_action = {
            'type': 'oa.open.url', 
            'url': url
          };
        }
        else if(linkOrButton === 'button') {
          let responseMessage = el.querySelector('input.responseMessage').value;
          e.default_action = {
            'type': 'oa.query.show',
            'payload': responseMessage
          };
        }
        else if(linkOrButton === 'text'){ //only for the first item
          e.default_action = {
            'type': 'oa.query.hide',
            'payload': el.querySelector('input.responseMessage').value
          };
        } 
  
        if(index === 0){
          let subTitle = el.querySelector('textarea.subTitle').value;
          let bannerImage =  el.querySelector('select.bannerImage').value;
          e.subtitle = subTitle;
          e.image_url = bannerImage; 
          
          currentContent = `<div style="margin-bottom:10px">
                      <div><img src="${bannerImage}" style="width:280px; hieght:200px;" /></div>
                      <div style="margin-top:5px">
                        <span>${title}</span> <br />
                        <span style="color:#A2A4A7;">${subTitle}</span>
                      </div>
                   </div>`;
     
        }
        else {
          let linkImage =  el.querySelector('select.linkImage').value;

          e.image_url = linkImage;
          currentContent = `<div style="padding:15px 5px 15px 70px;border-bottom:1px solid #EBEAE9; background-image: url(\'${linkImage}\');background-position: left center;background-repeat: no-repeat; background-size:40px 40px">
                                ${title}
                            </div>`;
     
        }

        elements.push(e);
        contents.push(currentContent);
 
        //Store the values for UI
        el.querySelectorAll('select, input, textarea').forEach( item =>  {
          let obj = { 'id': item.id, 'value': item.value};
          ui.push(obj);
        });
      }
    });

    let content = `<div style="width:300px; margin-left:auto; margin-right:auto; font-weight:600">
                    ${contents.join('')}
                  </div>`; 
    
    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'u': ui,
      'message': {
        'attachment' : {
          'type': 'template',
          'payload': {
            'template_type': 'list',
            'elements' : elements
          }
        }
      }
    });

  }
  else if(messageType === 'list-button'){
    let elements = [];
    let contents = [];
    let currentContent = '';
    let ui = [];
    
    document.querySelectorAll('#list-button div.slds-form-element__row').forEach( (el, index) => {
      if(el.querySelector('select.selectType')){
        let selectedType = el.querySelector('select.selectType').value;
        if(selectedType){
          let title = el.querySelector('input.title').value;
          let e = {};
          e.title = title; 
          
          if(selectedType === 'link'){
            let url = el.querySelector('input.link').value;
            e.type = 'oa.open.url';
            e.payload =  {
              'url': url
            };
          }
          else if(selectedType === 'button') {
            let responseMessage = el.querySelector('input.responseMessage').value;
            e.type = 'oa.query.show';
            e.payload = responseMessage;
          }
          else if(selectedType === 'phone'){ //only for the first item
            e.type = 'oa.open.phone';
            e.payload = {
                'phone_code' : el.querySelector('input.phone').value
            }
          }
          else if(selectedType === 'sms'){ //only for the first item
            e.type = 'oa.open.sms';
            e.payload = {
                'content' : el.querySelector('input.sms').value,
                'phone_code': el.querySelector('input.phone').value
            }
          } 
          
          currentContent = `<div style="margin-top:4px;padding:5px;border-radius:8px;background-color:#B5BBC0;text-align:center;min-height:18px">${title}</div>`;
        
          elements.push(e);
          contents.push(currentContent);
  
          //Store the values for UI
          el.querySelectorAll('select, input').forEach( item =>  {
            let obj = { 'id': item.id, 'value': item.value};
            ui.push(obj);
          });
        }
      }
    });

    ui.push({'id': 'list-button-message', 'value' : document.querySelector('#list-button-message').value})

    let content = `<div style="width:300px; margin-left:auto; margin-right:auto; font-weight:600">
                    <div style="margin-bottom:10px">${document.querySelector('#list-button-message').value}</div>
                    ${contents.join('')}
                  </div>`; 
    
    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'u': ui,
      'message': {
        'text' : document.querySelector('#list-button-message').value,
        'attachment' : {
          'type': 'template',
          'payload': {
            'buttons' : elements
          }
        }
      }
    });
  }
  else if(messageType === 'user-info'){
    let img = '';
    if(document.querySelector('#user-info-image').value)
      img = `<img src="${document.querySelector('#user-info-image').value}" style="width:280px; height:130px;"/>`;

    let content = `<div style="width:300px; margin-left:auto; margin-right:auto">
                  ${img}
                  <div style="padding:5px; background-color:#FFF">
                    <span>${document.querySelector('#user-info-title').value}</span> <br/>
                    <span style="color:#A2A4A7;">${document.querySelector('#user-info-subTitle').value}</span>  
                  </div>
                </div>`;

    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'u' : {
        'user-info-title' : document.querySelector('#user-info-title').value,
        'user-info-subTitle' : document.querySelector('#user-info-subTitle').value,
        'user-info-image': document.querySelector('#user-info-image').value
      },
      'message':{
        'attachment' : {
          'type': 'template',
          'payload': {
            'template_type': 'request_user_info',
            "elements": [{
              "title": document.querySelector('#user-info-title').value,
              "subtitle": document.querySelector('#user-info-subTitle').value,
              "image_url": document.querySelector('#user-info-image').value
            }]
          }
        }
      }
    });
  }
  else if(messageType === 'notice'){
    const el = document.querySelector('#notice-file'); 
    let fileName = el.options[el.selectedIndex].text,
        extension = el.options[el.selectedIndex].dataset.extension,
        fileSize = el.options[el.selectedIndex].dataset.size,
        fileId = el.options[el.selectedIndex].dataset.fileId,
        content;

    if(el.value) {
      let bgImage = '';
      if(extension =='pdf'){
        bgImage = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2056%2064%22%3E%3Cpath%20fill%3D%22%238C181A%22%20d%3D%22m5.1%200c-2.8%200-5.1%202.3-5.1%205.1v53.8c0%202.8%202.3%205.1%205.1%205.1h45.8c2.8%200%205.1-2.3%205.1-5.1v-38.6l-18.9-20.3h-32z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%236B0D12%22%20d%3D%22m56%2020.4v1h-12.8s-6.3-1.3-6.1-6.7c0%200%200.2%205.7%206%205.7h12.9z%22%3E%3C/path%3E%3Cpath%20opacity%3D%22.5%22%20fill%3D%22%23fff%22%20enable-background%3D%22new%22%20d%3D%22m37.1%200v14.6c0%201.7%201.1%205.8%206.1%205.8h12.8l-18.9-20.4z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22m14.9%2049h-3.3v4.1c0%200.4-0.3%200.7-0.8%200.7-0.4%200-0.7-0.3-0.7-0.7v-10.2c0-0.6%200.5-1.1%201.1-1.1h3.7c2.4%200%203.8%201.7%203.8%203.6%200%202-1.4%203.6-3.8%203.6z%20m-0.1-5.9h-3.2v4.6h3.2c1.4%200%202.4-0.9%202.4-2.3s-1-2.3-2.4-2.3z%20m10.4%2010.7h-3c-0.6%200-1.1-0.5-1.1-1.1v-9.8c0-0.6%200.5-1.1%201.1-1.1h3c3.7%200%206.2%202.6%206.2%206s-2.4%206-6.2%206z%20m0-10.7h-2.6v9.3h2.6c2.9%200%204.6-2.1%204.6-4.7%200.1-2.5-1.6-4.6-4.6-4.6z%20m16.3%200h-5.8v3.9h5.7c0.4%200%200.6%200.3%200.6%200.7s-0.3%200.6-0.6%200.6h-5.7v4.8c0%200.4-0.3%200.7-0.8%200.7-0.4%200-0.7-0.3-0.7-0.7v-10.2c0-0.6%200.5-1.1%201.1-1.1h6.2c0.4%200%200.6%200.3%200.6%200.7%200.1%200.3-0.2%200.6-0.6%200.6z%22%3E%3C/path%3E%3C/svg%3E")';
      } else if(extension === 'docx') {
        bgImage = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2056%2064%22%3E%3Cpath%20d%3D%22m5.1%200c-2.8%200-5.1%202.2-5.1%205v53.9c0%202.8%202.3%205.1%205.1%205.1h45.8c2.8%200%205.1-2.3%205.1-5.1v-38.6l-18.9-20.3h-32z%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20fill%3D%22%2314A9DA%22%3E%3C/path%3E%3Cg%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m56%2020.4v1h-12.8s-6.3-1.3-6.2-6.8c0%200%200.3%205.8%206.1%205.8h12.9z%22%20fill%3D%22%230F93D0%22%3E%3C/path%3E%3Cpath%20d%3D%22m37.1%200v14.6c0%201.6%201.1%205.8%206.1%205.8h12.8l-18.9-20.4z%22%20opacity%3D%22.5%22%20fill%3D%22%23fff%22%3E%3C/path%3E%3C/g%3E%3Cpath%20d%3D%22m14.2%2053.9h-3c-0.6%200-1.1-0.5-1.1-1.1v-9.9c0-0.6%200.5-1%201.1-1h3c3.8%200%206.2%202.6%206.2%206%200%203.4-2.4%206-6.2%206z%20m0-10.7h-2.6v9.3h2.6c3%200%204.7-2.1%204.7-4.6%200-2.6-1.7-4.7-4.7-4.7z%20m14.5%2010.9c-3.6%200-6-2.7-6-6.2s2.4-6.2%206-6.2c3.5%200%205.9%202.6%205.9%206.2%200%203.5-2.4%206.2-5.9%206.2z%20m0-11.1c-2.7%200-4.4%202.1-4.4%204.9%200%202.8%201.7%204.8%204.4%204.8%202.6%200%204.4-2%204.4-4.8%200-2.8-1.8-4.9-4.4-4.9z%20m18.4%200.4c0.1%200.1%200.2%200.3%200.2%200.5%200%200.4-0.3%200.7-0.7%200.7-0.2%200-0.4-0.1-0.5-0.2-0.7-0.9-1.9-1.4-3-1.4-2.6%200-4.6%202-4.6%204.9%200%202.8%202%204.8%204.6%204.8%201.1%200%202.2-0.4%203-1.3%200.1-0.2%200.3-0.3%200.5-0.3%200.4%200%200.7%200.4%200.7%200.8%200%200.2-0.1%200.3-0.2%200.5-0.9%201-2.2%201.7-4%201.7-3.5%200-6.2-2.5-6.2-6.2s2.7-6.2%206.2-6.2c1.8%200%203.1%200.7%204%201.7z%22%20fill%3D%22%23fff%22%3E%3C/path%3E%3C/svg%3E");';
      } else {
        bgImage = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2056%2064%22%3E%3Cpath%20d%3D%22m5.1%200c-2.8%200-5.1%202.3-5.1%205.1v53.8c0%202.8%202.3%205.1%205.1%205.1h45.8c2.8%200%205.1-2.3%205.1-5.1v-38.6l-18.9-20.3h-32z%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20fill%3D%22%233C8CEA%22%3E%3C/path%3E%3Cpath%20d%3D%22m10.1%2037.4h21.6v2.1h-21.6z%20m0%204.8h21.6v2.1h-21.6z%20m0%204.8h21.6v2.1h-21.6z%20m0%204.8h12.3v2.1h-12.3z%22%20fill%3D%22%23fff%22%3E%3C/path%3E%3Cg%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m56%2020.4v1h-12.8s-6.4-1.3-6.2-6.7c0%200%200.2%205.7%206%205.7h13z%22%20fill%3D%22%232D6FE4%22%3E%3C/path%3E%3Cpath%20d%3D%22m37.1%200v14.6c0%201.6%201.1%205.8%206.1%205.8h12.8l-18.9-20.4z%22%20opacity%3D%22.5%22%20fill%3D%22%23fff%22%3E%3C/path%3E%3C/g%3E%3C/svg%3E");';
      }

      let style = `<style>
                      div.bg {
                        padding: 10px 10px 10px 90px;height:100px;width:280px;
                        background-repeat:no-repeat;background-position:left center;background-size:80px 80px;
                        background-image:${bgImage};
                        margin-left:auto;
                        margin-right:auto;
                      }
                  </style>`;

      content = `${style}<div class="bg">
                    <div style="margin:10px 0 10px 0">${fileName}</div>
                    <div>${formatBytes(fileSize)}</div>
                  </div>`;
    }
    else 
      content = '';

    sdk.setContent(content);
    sdk.setData({
      'type': messageType,
      'fileName': fileName,
      'fileType' : extension,
      'fileSize' : fileSize,
      'fileId' : fileId,
      'u' : {
        'notice-file': document.querySelector('#notice-file').value
      },
      'message':{
        'attachment' : {
          'type': 'file',
          'payload': {
            'token' : ''
          }
        }
      }
    });
  }
}

function validate() {
  let messageType = document.getElementById('messageType').value;
  if(messageType) {
    if(messageType === 'text-area'){
      if(!document.querySelector('#txtBlock1').value) {
        document.querySelector('#txtBlock1').classList.add('slds-has-error');
        window.alert("Please check the text message content! Not empty and length less than or equal 2000 characters.");
      }
      else {
        document.querySelector('#txtBlock1').classList.remove('slds-has-error');
      }
    }
    else if(messageType === 'form-photo'){
      document.querySelectorAll('#form-photo textarea, #form-photo select').forEach( (el) => {
        if(!el.value)
          el.classList.add('slds-has-error');
        else
          el.classList.remove('slds-has-error');

      });
    }
    else if(messageType === 'form-list'){
      document.querySelectorAll('#form-list div.slds-form-element__row').forEach( (el, index) => {
        let linkOrButton = el.querySelector('select.selectType').value;
       
        if(linkOrButton) {
          if(index == 0) {
            el.classList.remove('slds-has-error');
          }

          if(linkOrButton === 'link'){
            el.querySelectorAll('input.title, textarea.subTitle, input.link, select').forEach((inputEl) => {
              if(!inputEl.value)
                inputEl.classList.add('slds-has-error');
              else
                inputEl.classList.remove('slds-has-error');
            });
          }
          else if(linkOrButton === 'button') {
            el.querySelectorAll('input.title, textarea.subTitle, input.responseMessage, select').forEach((inputEl) => {
              if(!inputEl.value)
                inputEl.classList.add('slds-has-error');
              else
                inputEl.classList.remove('slds-has-error');
            });
          }
        }
        else {
          el.querySelectorAll('input.title, textare.subTitle, input.responseMessage, select').forEach((inputEl) => {
            inputEl.classList.remove('slds-has-error');
          });

          if(index == 0) {
            el.classList.add('slds-has-error');
          }
        }
      });
    }
    else if(messageType === 'list-button'){
      if(!document.querySelector('#list-button-message').value)
        document.querySelector('#list-button-message').classList.add('slds-has-error');
      else
        document.querySelector('#list-button-message').classList.remove('slds-has-error');

      document.querySelectorAll('#list-button div.slds-form-element__row').forEach( (el, index) => {
        if(el.querySelector('select.selectType')) {
          let option = el.querySelector('select.selectType').value;
          if(option) {
            if(option === 'link'){
              el.querySelectorAll('input.title, input.link, textarea').forEach((inputEl) => {
                if(!inputEl.value)
                  inputEl.classList.add('slds-has-error');
                else
                  inputEl.classList.remove('slds-has-error');
              });
            }
            else if(option === 'button') {
              el.querySelectorAll('input.title, input.responseMessage, textarea').forEach((inputEl) => {
                if(!inputEl.value)
                  inputEl.classList.add('slds-has-error');
                else
                  inputEl.classList.remove('slds-has-error');
              });
            }
            else if(option === 'phone') {
              el.querySelectorAll('input.title, input.phone, textarea').forEach((inputEl) => {
                if(!inputEl.value)
                  inputEl.classList.add('slds-has-error');
                else
                  inputEl.classList.remove('slds-has-error');
              });
            }
            else if(option === 'sms') {
              el.querySelectorAll('input.title, input.phone, input.sms, textarea').forEach((inputEl) => {
                if(!inputEl.value)
                  inputEl.classList.add('slds-has-error');
                else
                  inputEl.classList.remove('slds-has-error');
              });
            }
          }
          else {
            el.querySelectorAll('input.title, input.responseMessage, input.link, input.phone, input.sms').forEach((inputEl) => {
              inputEl.classList.remove('slds-has-error');
            });
          }
        }
      });
    }
    else if(messageType === 'user-info'){
      document.querySelectorAll('#user-info div.slds-form-element__row').forEach( (el) => {
        el.querySelectorAll('input, select, textarea').forEach((inputEl) => {
          if(!inputEl.value)
            inputEl.classList.add('slds-has-error');
          else
            inputEl.classList.remove('slds-has-error');
        });
      });
    }
    else if(messageType === 'notice'){
      if(!document.querySelector('#notice-file').value)
        document.querySelector('#notice-file').classList.add('slds-has-error');
      else
        document.querySelector('#notice-file').classList.remove('slds-has-error');
    }
  }
}


//Capture event on the UI
document.getElementById('workspace').addEventListener("input", function () {
  paint(document.querySelector('#messageType').value);
});


//Document ready
document.addEventListener('DOMContentLoaded', function(event) {
  restoreParms();
});

