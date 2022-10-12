const pgp = require('pg-promise')();
const {CONFIG} = require("../../config.js");
const db = pgp(CONFIG.SQL);

module.exports.client = db;
module.exports.pgp = pgp;

module.exports.endDatabaseConnection = async function() {
    pgp.end()
}