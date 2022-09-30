/* get-state-read-article.js */
/*
import {getInfoFromSession} from "../get-user-from-session.js";
import {validateClampedDate, validateClampedNumber} from "../validate-primitives.js";
import {promisify} from "util";

export async function main(req, res, next, config) {
    throw "no db impl'd";
    let date = validateClampedDate(req.body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let artnumber = validateClampedNumber(req.body.artnumber, 0, 99);

    let name = (await getInfoFromSession(req, res, next, config)).name;
    if (name === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    // TODO: reimpl with new db schema
    //let articleId = articleIdFromDateAndArtNumber(date, artnumber);
    //await createArticleInDB(articleId);

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (results.length !== 0) {
        res.status(200).send("true").end();
    } else {
        res.status(200).send("false").end();
    }
} 
*/
/* get-user-read-article.js */
/*
import {promisify} from "util";
import {dateAndArtNumberFromArticleId} from "../article-helpers.js";

export async function main(req, res, next, config) {
    if (req.query.name === undefined) {
        res.status(400).end();
        return;
    }
    let name = req.query.name;

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT ArticleId, Timestamp FROM UserReadArticles WHERE UserName=?;`, [name]);

    res.status(200).send(JSON.stringify(results.map(v => Object.assign(dateAndArtNumberFromArticleId(v.ArticleId), {timestamp: v.Timestamp * 1000})))).end();
}
*/