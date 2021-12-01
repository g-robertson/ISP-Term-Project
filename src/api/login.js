import * as bcrypt from "bcrypt"
import { randomBytes } from "crypto";
import {promisify} from "util";

const MIN_PASSWORD_LENGTH = 8;
export async function main(req, res, next, config) {
    if (req.method !== "POST") {
        res.status(400).end();
        return;
    } else if (req.body.name === undefined || req.body.password === undefined) {
        res.status(400).end();
        return;
    } else if (req.body.password.length <= MIN_PASSWORD_LENGTH) {
        res.status(200).send(`Password length must be greater than ${MIN_PASSWORD_LENGTH}.`).end();
        return;
    }

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);
    let results = await aquery(`SELECT Hash FROM Users WHERE Name=?;`, [req.body.name]);
    if (results.length > 0) {
        let hash = results[0].Hash;
        if (!(await bcrypt.compare(req.body.password, hash))) {
            res.status(200).send(`This username is taken`).end();
            return;
        }
        let rndBytes = randomBytes(64);
        await aquery(`UPDATE Users SET Token=? WHERE Name=?`, [rndBytes, req.body.name]);

        res.status(200).send(rndBytes.toString("hex")).end();
        return;
    }

    let hash = await bcrypt.hash(req.body.password, 10);
    let rndBytes = randomBytes(64);
    await aquery(`INSERT INTO Users VALUES (?, ?, ?);`, [req.body.name, hash, rndBytes]);

    res.status(200).send(rndBytes.toString("hex")).end();
}