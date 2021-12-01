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
    await aquery(`CREATE TABLE Users (Name nvarchar(30) PRIMARY KEY, Hash char(60), Token BINARY(64))`);
    // basically this table only exists to state that each article can only happen once
    await aquery(`CREATE TABLE Articles (Id int unsigned PRIMARY KEY);`);
    await aquery(`CREATE TABLE UserReadArticles (UserName nvarchar(30), ArticleId int unsigned,` + 
        `FOREIGN KEY (UserName) REFERENCES Users(Name),` +
        `FOREIGN KEY (ArticleId) REFERENCES Articles(Id)` +
    `);`);

    dbcconn.end();
}

main();