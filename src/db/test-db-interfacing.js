const pg = require('pg');
const {CONFIG} = require("../../config.js");

let CLIENT;

module.exports.client = async function() {
    if (CLIENT !== undefined) {
        return CLIENT;
    }

    CLIENT = new pg.Client(CONFIG.SQL);

    try {
        console.log(CONFIG.SQL);
        await CLIENT.connect();
    } catch (err) {
        console.log(err);
        throw "Client could not connect to database";
    }

    return CLIENT;
}

module.exports.query = async function(text, values) {
    return await (await module.exports.client()).query(text, values);
}

module.exports.endDatabaseConnection = async function() {
    await CLIENT.end();
    CLIENT = undefined;
}