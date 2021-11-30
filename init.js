import * as mysql from "mysql";
import {PICONFIG} from "./pre-init-config.js";

async function main() {
    let dbcconfig = {
        host: PICONFIG.MySQL.host,
        user: PICONFIG.MySQL.user,
        password: PICONFIG.MySQL.password
    };
    let dbcconn = mysql.createConnection(dbcconfig);
    dbcconn.connect(err => {
        if (err) throw err;
        dbcconn.query(`CREATE DATABASE ${PICONFIG.MySQL.db}`, (err, result) => {
            if (err) throw err;
            console.log(`DB ${PICONFIG.MySQL.db} successfully created.`);
        });
    });
}

main();