import {promisify} from "util"

export async function getInfoFromSession(req, res, next, config) {
    if (req.method !== "POST") {
        return undefined;
    } else if (req.cookies["auth-token"] === undefined) {
        return undefined;
    }

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);
    let results = await aquery(`SELECT Name FROM Users WHERE Token=?;`, [Buffer.from(req.cookies["auth-token"], "hex")]);
    if (results.length === 0) {
        return undefined;
    } else {
        return {name: results[0].Name};
    }
}