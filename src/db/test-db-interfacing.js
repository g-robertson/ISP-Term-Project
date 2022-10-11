const pg = require('pg');

let CLIENT;

module.exports.client = async function() {
    if (CLIENT !== undefined) {
        return CLIENT;
    }

    CLIENT = new pg.Client({
        database: "jpez",
        host: "jpez-postgres",
        user: "root",
        password: "testpw",
        port: 5432
    });

    try {
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