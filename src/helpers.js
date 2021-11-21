const fs = require("fs");

module.exports.getAllAPIs = function() {
    let apiFiles = fs.readdirSync(`${__dirname}/api`);
    let apis = {};
    for (let apiFile of apiFiles) {
        if (apiFile === "API_IMPL.md") continue;

        let apiName = apiFile.substring(0, apiFile.length - ".js".length);
        apis[apiName] = require(`./api/${apiFile}`).main;
    }
    return apis;
}