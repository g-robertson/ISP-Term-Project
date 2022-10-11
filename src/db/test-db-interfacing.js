const pg = require('pg');

let CLIENT;

module.exports.query;

module.exports.initializeDatabaseConnection = async function() {
    if (CLIENT !== undefined) {
        return;
    }
    CLIENT = new pg.Client({
        database: "jpez",
        host: "0.0.0.0",
        user: "root",
        password: "testpw",
        port: 5432
    });
    await CLIENT.connect();
    module.exports.query = CLIENT.query.bind(CLIENT);
}

module.exports.endDatabaseConnection = async function() {
    await CLIENT.end();
    CLIENT = undefined;
}