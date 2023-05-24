const config = require('../config');
const mc = require('../modules/mc');

const controller = {}; 

controller.getFiles =  (type) => {
    let fields = ['Name', 'fileProperties'], 
        assetTypeId = '', 
        zaloFolderId = '';
    
    if(type == 'FILE'){
        zaloFolderId = config.MC_ContentCategories.Files, 
        assetTypeId = config.MC_AssetTypes.Files;
    }
    else if(type == 'BANNER'){
        zaloFolderId = config.MC_ContentCategories.BannerImages;
        assetTypeId = config.MC_AssetTypes.Images;
    }
    else {
        zaloFolderId = config.MC_ContentCategories.LinkImages;
        assetTypeId = config.MC_AssetTypes.Images;
    }

    let query = { 
        "leftOperand":
        {
            "property":"category.id",
            "simpleOperator":"equal",
            "value": zaloFolderId
        },
        "logicalOperator":"AND",
        "rightOperand":
        {
            "property":"assetType.id",
            "simpleOperator":"in",
            "value": assetTypeId
        }
    }

    return mc.getContent(fields, query);
    
}
module.exports = controller; 