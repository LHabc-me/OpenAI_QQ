const fs = require("fs");

function reloadModule(moduleName) {
    delete require.cache[require.resolve(moduleName)];
    return require(moduleName);
}


let fileContent = '';
let module_ = null;

function dynamicLoadModule(moduleName) {
    const content = fs.readFileSync(moduleName).toString();
    if (fileContent !== content) {
        fileContent = content;
        module_ = reloadModule(moduleName);
    }
    return module_;
}

module.exports = {dynamicLoadModule};