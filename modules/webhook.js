const mc = require('./mc'); 
const config = require('../config.json');
const logger = require('./logger');

const webhook = {}; 

webhook.process = async (req, res) => {
    var uri = req.params[0] && req.params[0].split('/');
    let oaId = uri  != null && uri.length > 0 ? uri[0]: '';
    const event = req.body;
    console.log('req header: ', req.headers);
    console.log('req uri:', uri);
    console.log('req.body:', req.body);
    console.log('req.body.message:', req.body.message);
    console.log('REQ PARAM ',req.params);
    console.log('ALL REQ ',req.query);

    const STEL_Event = req.query;

    /*
    try {
      switch (event.event) {
        case 'conversation_started':
          const user_Id = event.user.id;
          const first_fields = ['Id', 'Name', 'Status', 'Lang', 'Avatar_url', 'Country', 'Viber_OA'];
          const first_filter = {
            leftOperand: 'Id',
            operator: 'equals',
            rightOperand: user_Id
          };
          const first_rows = await mc.getDERows(config.MC.viberSubcriberDE, first_fields, first_filter);
          if(first_rows == undefined || first_rows.length == 0) {
            const record = {
              'Id' : user_Id,
              'Name':  event.user.name,
              'Status' : event.event,
              'Lang' : event.user.language,
              'Country': event.user.country,
              'Avatar_url': event.user.avatar,
              'Viber_OA': oaId
            };
            mc.createDERow(config.MC.viberSubcriberDE, record);
          }
          break;
        case 'message':
          const mes_userId = event.sender.id;
          const mes_fields = ['Id', 'Name', 'Status', 'Lang', 'Avatar_url', 'Country', 'Subscribe_Date', 'Unsubscribe_Date'];
          const mes_filter = {
            leftOperand: 'Id',
            operator: 'equals',
            rightOperand: mes_userId
          };
          const mes_rows = await mc.getDERows(config.MC.viberSubcriberDE, mes_fields, mes_filter);
          //console.log("event [message] - retrieve result :", mes_rows);
          if(mes_rows == undefined || mes_rows.length == 0) {
            const record = {
              'Id' : mes_userId,
              'Name':  event.sender.name,
              'Status' : event.event,
              'Lang' : event.sender.language,
              'Country': event.sender.country,
              'Avatar_url': event.sender.avatar,
              'Viber_OA': oaId,
              'Subscribe_Date':  new Date(parseInt(event.timestamp)).toISOString()
            };
            mc.createDERow(config.MC.viberSubcriberDE, record);
          } else if (mes_rows.length >= 0) {
            const updatedRecord = mes_rows[0];
            updatedRecord['Status'] = 'follow';
            if (updatedRecord['Subscribe_Date'] == null || updatedRecord['Subscribe_Date'] == undefined || updatedRecord['Subscribe_Date'] == ''
              || (updatedRecord['Subscribe_Date'] != '' && updatedRecord['Unsubscribe_Date'] != '' && new Date(updatedRecord['Subscribe_Date']) <= new Date(updatedRecord['Unsubscribe_Date'])  )
            ) {
              delete updatedRecord['Unsubscribe_Date'];
              updatedRecord['Subscribe_Date'] = new Date(parseInt(event.timestamp)).toISOString();
              mc.updateDERow(config.MC.viberSubcriberDE, updatedRecord);
            }
          }
          break;
        case 'subscribed':
            const sub_userId = event.sender.id;
            const sub_fields = ['Id', 'Name', 'Status', 'Lang', 'Avatar_url', 'Country', 'Subscribe_Date'];
            const sub_filter = {
              leftOperand: 'Id',
              operator: 'equals',
              rightOperand: sub_userId
            };
            const sub_rows = await mc.getDERows(config.MC.viberSubcriberDE, sub_fields, sub_filter);
            if(sub_rows == undefined || sub_rows.length == 0) {
              const record = {
                'Id' : sub_userId,
                'Name':  event.sender.name,
                'Status' : event.event,
                'Lang' : event.sender.language,
                'Country': event.sender.country,
                'Avatar_url': event.sender.avatar,
                'Viber_OA': oaId,
                'Subscribe_Date':  new Date(parseInt(event.timestamp)).toISOString()
              };
              mc.createDERow(config.MC.viberSubcriberDE, record);
            } else if (sub_rows.length >= 0) {
              const updatedRecord = sub_rows[0];
              updatedRecord['Status'] = 'subscribed';
              updatedRecord['Subscribe_Date'] = new Date(parseInt(event.timestamp)).toISOString();
              mc.updateDERow(config.MC.viberSubcriberDE, updatedRecord);
            }
            break;
          case 'unsubscribed':
            const userId = event.user_id;
            const fields = ['Id', 'Status', 'Unsubscribe_Date'];
            const filter = {
              leftOperand: 'Id',
              operator: 'equals',
              rightOperand: userId
            };
            const rows = await mc.getDERows(config.MC.viberSubcriberDE, fields, filter);
            if(rows == undefined || rows.length == 0) {
              const record = {
                'Id' : userId,
                'Status': 'unsubscribed',
                'Viber_OA': oaId,
                'Unsubscribe_Date':  new Date(parseInt(event.timestamp)).toISOString()
              };
              mc.createDERow(config.MC.viberSubcriberDE, record);
            } else if (rows.length >= 0) {
              const updatedRecord = rows[0];
              updatedRecord['Status'] = 'unsubscribed';
              updatedRecord['Unsubscribe_Date'] = new Date(parseInt(event.timestamp)).toISOString();
              mc.updateDERow(config.MC.viberSubcriberDE, updatedRecord);
            }
            break;
        case 'delivered':
          let de_mesgId= '' + event.message_token;
          let de_preMesg = de_mesgId != null && de_mesgId.length > 4 ? de_mesgId.substring(0,de_mesgId.length -4): 'UNKNOWN';
          
          var filter1 = {
            leftOperand: "Message_ID", 
            operator: "equals", 
            rightOperand: de_mesgId
          }
          var filter2 = {
            leftOperand: "Message_ID", 
            operator: "like", 
            rightOperand: de_preMesg
          }
          var filter3 = {
            leftOperand: "Receiver_Id", 
            operator: "equals", 
            rightOperand: event.user_id
          }
          var filter12 = {
              leftOperand: filter1,
              operator: "OR",
              rightOperand: filter2
          }
          var complexFilter = {
              leftOperand: filter12,
              operator: "AND",
                rightOperand: filter3
          }
          //console.log('event: [' + event.event +'] - filter', complexFilter);
          let de_messages = await mc.getDERows(config.MC.viberSendLogDE, ['Message_ID', 'Delivery_Status', 'Delivery_Date', 'Ref_Delivery', 'Receiver_Id', 'Viber_Id'],
          complexFilter); 
          //console.log('event: [' + event.event +'] - result retries:', de_messages);
          if(de_messages.length > 0){
            const msg = de_messages[0];
            msg['Delivery_Status'] = true;
            msg['Delivery_Date'] = new Date(parseInt(event.timestamp)).toISOString();
            mc.updateDERow(config.MC.viberSendLogDE, msg);
          }
          break;
        case 'seen':
          let mesgId= event.message_token;
          let preMesg = mesgId != null && mesgId.length > 4 ? mesgId.substring(0,mesgId.length -4): 'UNKNOWN';
          var filter1 = {
            leftOperand: "Message_ID", 
            operator: "equals", 
            rightOperand: mesgId
          }
          var filter2 = {
            leftOperand: "Message_ID", 
            operator: "like", 
            rightOperand: preMesg
          }
          var filter3 = {
            leftOperand: "Receiver_Id", 
            operator: "equals", 
            rightOperand: event.user_id
          }
          var filter12 = {
              leftOperand: filter1,
              operator: "OR",
              rightOperand: filter2
          }
          var complexFilter = {
              leftOperand: filter12,
              operator: "AND",
                rightOperand: filter3
          }
          const messages = await mc.getDERows(config.MC.viberSendLogDE, ['Message_ID', 'Seen_Status', 'Seen_Date', 'Receiver_Id', 'Viber_Id'], 
          complexFilter); 
          if(messages.length > 0){
            const msg = messages[0];
            msg['Seen_Status'] = true;
            msg['Seen_Date'] = new Date(parseInt(event.timestamp)).toISOString();
            mc.updateDERow(config.MC.viberSendLogDE, msg);
          } 
          break;
          
      }
    }
    catch(ex){
      logger.error('[Exception in webhook]', ex);
    } 
    */


    //HoangT - 08/05/2023
    try{
      switch (STEL_Event.status) {
        case 'follow':
          const mes_userId = STEL_Event.to;
          const mes_fields = ['Id', 'Name', 'Status', 'Lang', 'Avatar_url', 'Country', 'Subscribe_Date', 'Unsubscribe_Date'];
          const mes_filter = {
            leftOperand: 'Id',
            operator: 'equals',
            rightOperand: mes_userId
          };
          const mes_rows = await mc.getDERows(config.MC.viberSubcriberDE, mes_fields, mes_filter);
          if(mes_rows == undefined || mes_rows.length == 0) {
            const record = {
              'Id' : mes_userId,
              'Status' : STEL_Event.status,
              'Viber_OA': STEL_Event.from,
              'Subscribe_Date':  new Date(parseInt(STEL_Event.delivery_time)).toISOString(),
              'Phone':mes_userId
            };
            mc.createDERow(config.MC.viberSubcriberDE, record);
          } else if (mes_rows.length >= 0) {
            const updatedRecord = mes_rows[0];
            updatedRecord['Status'] = 'follow';
            if (updatedRecord['Subscribe_Date'] == null || updatedRecord['Subscribe_Date'] == undefined || updatedRecord['Subscribe_Date'] == ''
              || (updatedRecord['Subscribe_Date'] != '' && updatedRecord['Unsubscribe_Date'] != '' && new Date(updatedRecord['Subscribe_Date']) <= new Date(updatedRecord['Unsubscribe_Date'])  )
            ) {
              delete updatedRecord['Unsubscribe_Date'];
              updatedRecord['Subscribe_Date'] = new Date(parseInt(STEL_Event.delivery_time)).toISOString();
              mc.updateDERow(config.MC.viberSubcriberDE, updatedRecord);
            }
          }
          break;

          case 'unfollow':
            const userId = STEL_Event.to;
            const fields = ['Id', 'Status', 'Unsubscribe_Date'];
            const filter = {
              leftOperand: 'Id',
              operator: 'equals',
              rightOperand: userId
            };
            const rows = await mc.getDERows(config.MC.viberSubcriberDE, fields, filter);
            if(rows == undefined || rows.length == 0) {
              const record = {
                'Id' : userId,
                'Status': 'unfollow',
                'Viber_OA': STEL_Event.from,
                'Unsubscribe_Date':  new Date(parseInt(STEL_Event.delivery_time)).toISOString()
              };
              mc.createDERow(config.MC.viberSubcriberDE, record);
            } else if (rows.length >= 0) {
              const updatedRecord = rows[0];
              updatedRecord['Status'] = 'unfollow';
              updatedRecord['Unsubscribe_Date'] = new Date(parseInt(STEL_Event.delivery_time)).toISOString();
              mc.updateDERow(config.MC.viberSubcriberDE, updatedRecord);
            }
            break;

            //Status = 0 => Error
            //Tracking Sent Messages : DRL
            case '0':
            const mcRecord = { 
                'Message_ID':STEL_Event.smsid,
                'API_Response_Error': STEL_Event.otterrorcode,
                'Viber_Id': STEL_Event.from, 
                'Receiver_Id': STEL_Event.to,
                'Sent_Date': new Date(parseInt(STEL_Event.receivedts)).toISOString(),
                'Delivery_Date': new Date(parseInt(STEL_Event.deliveredts)).toISOString(),
                'Message_Content': STEL_Event.text,
                'Message_Type': STEL_Event.ott,
                'Ref_Delivery' : STEL_Event.errorcode,
                'OTTstatus' : STEL_Event.ottstatus,
                'User' : STEL_Event.user,
                'SMSstatus' : STEL_Event.status
              };

              console.log('STEL DLR Tracking - ERROR : Status = 0 => ',mcRecord);

              //Tracking Sent Messages ERROR
              const DLR_fields = ['Message_ID','Message_Type','API_Response_Error','Viber_Id', 'Receiver_Id','Sent_Date','Delivery_Date','Message_Content','Ref_Delivery','OTTstatus','User' ,'SMSstatus'];
              const DLR_filter = {
                leftOperand: 'Message_ID',
                operator: 'equals',
                rightOperand: STEL_Event.smsid
              };
              const DLR_rows = await mc.getDERows(config.MC.viberSendLogDE, DLR_fields, DLR_filter);

              console.log('DLR ROW IS ', DLR_rows[0]);

              if(DLR_rows == undefined || rows.length == 0) {
                mc.createDERow(config.MC.viberSendLogDE, mcRecord);
              } 
              else if (DLR_rows.length >= 0) {
                const updatedRecord = DLR_rows[0];
                Object.assign(mcRecord, updatedRecord);
                mc.updateDERow(config.MC.viberSendLogDE, updatedRecord);
              }
            break;

            //Status = 1 => SUCCESS
            case '1':
              const mc_Record = { 
                'Message_ID':STEL_Event.smsid,
                'API_Response_Error': STEL_Event.otterrorcode,
                'Viber_Id': STEL_Event.from, 
                'Receiver_Id': STEL_Event.to,
                'Sent_Date': new Date(parseInt(STEL_Event.receivedts)).toISOString(),
                'Delivery_Date': new Date(parseInt(STEL_Event.deliveredts)).toISOString(),
                'Message_Content': STEL_Event.text,
                'Message_Type': STEL_Event.ott,
                'Ref_Delivery' : STEL_Event.errorcode,
                'OTTstatus' : STEL_Event.ottstatus,
                'User' : STEL_Event.user,
                'SMSstatus' : STEL_Event.status
              };

              console.log('STEL DLR Tracking - SUCCESS : Status = 1 => ',mc_Record);

              //Tracking Sent Messages SUCCESS
              const DLR_Suc_fields = ['Message_ID','Message_Type','API_Response_Error','Viber_Id', 'Receiver_Id','Sent_Date','Delivery_Date','Message_Content','Ref_Delivery','OTTstatus','User' ,'SMSstatus' ];
              const DLR_Suc_filter = {
                leftOperand: 'Message_ID',
                operator: 'equals',
                rightOperand: STEL_Event.smsid
              };
              const DLR_Suc_rows = await mc.getDERows(config.MC.viberSendLogDE, DLR_Suc_fields, DLR_Suc_filter);

              console.log('DLR ROW IS ', DLR_Suc_rows[0]);

              if(DLR_Suc_rows == undefined || DLR_Suc_rows.length == 0) {
                mc.createDERow(config.MC.viberSendLogDE, mc_Record);
              } 
              else if (DLR_Suc_rows.length >= 0) {
                const updatedRecord = DLR_Suc_rows[0];
                Object.assign(mc_Record, updatedRecord);
                mc.updateDERow(config.MC.viberSendLogDE, updatedRecord);
              }
            break;
        }
    }
    catch(ex){
      logger.error('[Exception in webhook]', ex);
    }

    res.sendStatus(200);
}

module.exports = webhook; 