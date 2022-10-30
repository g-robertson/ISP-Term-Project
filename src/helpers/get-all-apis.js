const {readdirSync} = require("fs")

module.exports.getAllAPIs = async function() {
    let apiFiles = readdirSync(`/${__dirname}/../apis`);
    let apis = {};
    for (let apiFile of apiFiles) {
        if (apiFile === "API_IMPL.md") continue;

        let apiName = apiFile.substring(0, apiFile.length - ".js".length);
        apis[apiName] = (await import(`../apis/${apiFile}`)).main;
    }
    return apis;
}