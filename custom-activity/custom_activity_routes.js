const express = require('express'); 
const router = express.Router(); 
const controller = require('./custom_activity_controller'); 

router.get('/',  async (req, res) => {
    console.log('/:', req);
    const dataExtensions = await controller.getDataExtensions(); 
    const OAs = await controller.getOAs();
    
    res.render('custom-activity',{
        dataExtensions : dataExtensions,
        OAs : OAs
    });

});

router.get('/index.html',  async (req, res) => {
    console.log('index.html:', req.url);
    console.log('index.html:', req.headers);
    const dataExtensions = await controller.getDataExtensions(); 
    const OAs = await controller.getOAs();
    
    res.render('custom-activity',{
        dataExtensions : dataExtensions,
        OAs : OAs
    });

});

router.get('/config.json', (req, res) => {
    res.send({
        "workflowApiVersion": "1.1",
        "metaData": {
            "category": "message",
            "isConfigured ": false,
            "icon": "assets/icons/viber_icon_80.png"
        },
        "type": "Rest",
        "lang": {
            "en-US": {
                "name": "Viber OA Activity",
                "description": "Created by Beryl8 Plus"
            }
        },
        "arguments": {
            "execute": {
                "inArguments": [],
                "outArguments": [],
                "timeout": 90000,
                "retryDelay": 5000,
                "concurrentRequests": 1,
                "url": `https://${req.headers.host}/custom-activity/execute`
            }
        },
        "configurationArguments": {
            "save": {
                "url": `https://${req.headers.host}/custom-activity/save`
            },
            "publish": {
                "url": `https://${req.headers.host}/custom-activity/publish`
            },
            "validate": {
                "url": `https://${req.headers.host}/custom-activity/validate`
            }
        },
        "userInterfaces": {
            "configModal": {
                "fullscreen": true
            }
        }
    });
});

router.get('/assets/icons/viber_icon_80.png', async (req, res) => {
    res.writeHead(301, {
        Location: req.url.replace('/custom-activity', '')
    }).end();
});

router.get('/getDataExtensionFields/:dataExtensionKey', async (req, res) => {
    const dataExtensionKey = req.params['dataExtensionKey'];
    const fields = await controller.getDataExtensionFields(dataExtensionKey);

    res.send(fields);
});

router.get('/getCustomContentBlocks', async(req, res) => {
    const contentBlocks = await controller.getCustomContentBlocks(); 

    res.send(contentBlocks);
});

router.get('/getContent/:contentId', async (req, res) => {
    const contentId = req.params.contentId;
    const content = await controller.getContentById(contentId);

    res.send(content);
});

router.post('/save', (req, res) => {
    res.status(200).json({});
});

router.post('/validate', (req, res) => {
    res.status(200).json({});
});

router.post('/publish', (req, res) => {
    res.status(200).json({});
});

router.post('/execute', (req, res) => {
    controller.execute(req, res); 
});

module.exports = router;