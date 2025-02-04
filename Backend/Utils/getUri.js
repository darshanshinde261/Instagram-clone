const datauriparser = require('datauri/parser.js');
const path = require("path");

const parser = new datauriparser();

const getDataUri = (file) =>{
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer).content;
};

module.exports = getDataUri;