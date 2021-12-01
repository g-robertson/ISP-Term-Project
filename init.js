import * as mysql from "mysql2";
import {PICONFIG} from "./pre-init-config.js";
import {promisify} from "util";

async function main() {
    let dbcconn = mysql.createConnection(PICONFIG.MySQL);
    await promisify(dbcconn.connect).bind(dbcconn)();
    let aquery = promisify(dbcconn.query).bind(dbcconn);

    let dbs = await aquery(`SHOW DATABASES LIKE '${PICONFIG.DB}'`);
    if (dbs.length !== 0) {
        await aquery(`DROP DATABASE ${PICONFIG.DB}`);
    }
    await aquery(`CREATE DATABASE ${PICONFIG.DB}`);

    await aquery(`USE ${PICONFIG.DB}`);
    await aquery(`CREATE TABLE Users (Name varchar(30), Hash char(60), Token BINARY(64))`);

    dbcconn.end();
}

main();