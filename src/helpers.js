import {readdirSync} from "fs"
import { dirname } from "path";
const __dirname = dirname(import.meta.url.substring('file://'.length));

export async function getAllAPIs() {
    let apiFiles = readdirSync(`${__dirname}/api`);
    let apis = {};
    for (let apiFile of apiFiles) {
        if (apiFile === "API_IMPL.md") continue;

        let apiName = apiFile.substring(0, apiFile.length - ".js".length);
        apis[apiName] = (await import(`./api/${apiFile}`)).main;
    }
    return apis;
}