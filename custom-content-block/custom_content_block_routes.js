const express = require('express'); 
const router = express.Router(); 
const controller = require('./custom_content_block_controller'); 

router.get('/',  async (req, res) => {
    let bannerImages = await controller.getFiles('BANNER');
    let linkImages = await controller.getFiles('LINK');
    let files = await controller.getFiles('FILE');
    console.log('load bannerImages', bannerImages);
    res.render('custom-content-block',{
        bannerImages: bannerImages == undefined ? [] : bannerImages.items,
        linkImages : linkImages == undefined ? [] : linkImages.items, 
        files : files == undefined ? [] : files.items
    });

});

router.get('/icon.png', async (req, res) => {
    res.writeHead(301, {
        Location: req.url.replace('/icon.png', '/assets/icons/viber_icon_80.png')
    }).end();
});


module.exports = router;