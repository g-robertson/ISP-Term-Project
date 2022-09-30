/* set-state-read-article */
/*
import {createArticleInDB, articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getInfoFromSession} from "../get-info-from-session.js";
import {validateClampedDate, validateClampedNumber} from "../validate-primitives.js";
import {promisify} from "util";

export async function main(req, res, next, config) {
    let date = validateClampedDate(req.body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let artnumber = validateClampedNumber(req.body.artnumber, 0, 99);
    let state = req.body.state;
    
    if (date === undefined || artnumber === undefined || state === undefined) {
        res.status(400).end();
        return;
    }

    let name = (await getInfoFromSession(req, res, next, config))?.name;
    if (name === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let articleId = articleIdFromDateAndArtNumber(date, artnumber);
    await createArticleInDB(articleId);
    let read = state[0] === "t";

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    
    // unix time in seconds
    let currentTime = Math.floor(new Date().valueOf() / 1000);

    if (read && results.length === 0) {
        await aquery(`INSERT INTO UserReadArticles VALUES (?, ?, ?);`, [name, articleId, currentTime]);
    } else if (!read && results.length !== 0) {
        await aquery(`DELETE FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    }

    res.status(200).send("Proper state set for article read").end();
}
*/