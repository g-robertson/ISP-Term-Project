const { randomBytes } = require("crypto");
const { client } = require("../db/test-db-interfacing.js");
const bcrypt = require("bcrypt");

const MIN_PASSWORD_LENGTH = 8;
module.exports.main = async function(req, res, next, config) {
    if (req.query.name === undefined || req.query.password === undefined) {
        res.status(400).end();
        return;
    } else if (req.query.name.length === 0 || req.query.name.length >= 30) {
        res.status(200).send("Username length must be greater than 0 and less than 30").end();
        return;
    } else if (req.query.password.length <= MIN_PASSWORD_LENGTH) {
        res.status(200).send(`Password length must be greater than ${MIN_PASSWORD_LENGTH}.`).end();
        return;
    }

    let results = await client.oneOrNone(`SELECT Hash FROM Users WHERE Username='${req.query.name}';`);

    let rndBytes = randomBytes(64).toString('hex');
    if (results) {
        let hash = results.hash;
        if (!(await bcrypt.compare(req.query.password, hash))) {
            res.status(200).send(`This username is taken`).end();
            return;
        }
        await client.result(`UPDATE Users SET Session_Token='${rndBytes}' WHERE Username='${req.query.name}'`);
    } else {
        let hash = await bcrypt.hash(req.query.password, 10);
        await client.result(`INSERT INTO Users (Username, Hash, Session_Token) VALUES ('${req.query.name}', '${hash}', '${rndBytes}');`);
    }
    const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
    res.cookie("auth-token", rndBytes.toString("hex"), {httpOnly: true, maxAge: ONE_MONTH});
    res.status(200).send("User successfully logged in").end();
}