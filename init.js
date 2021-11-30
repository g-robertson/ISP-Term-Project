import * as mysql from "mysql";
import {PICONFIG} from "./pre-init-config.js";
import {promisify} from "util";

async function main() {
    let dbcconfig = {
        host: PICONFIG.MySQL.host,
        user: PICONFIG.MySQL.user,
        password: PICONFIG.MySQL.password
    };
    let dbcconn = mysql.createConnection(dbcconfig);
    dbcconn.connect(async (err) => {
        if (err) throw err;
        const aquery = promisify(dbcconn.query).bind(dbcconn);

        let dbs = await aquery(`SHOW DATABASES LIKE '${PICONFIG.MySQL.db}'`);
        if (dbs.length !== 0) {
            await aquery(`DROP DATABASE ${PICONFIG.MySQL.db}`);
        }
        await aquery(`CREATE DATABASE ${PICONFIG.MySQL.db}`);
        dbcconn.end();
    });
}

main();