import {createArticleInDB, articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getInfoFromSession} from "../get-info-from-session.js";
import {validateClampedDate, validateClampedNumber} from "../validate-primitives.js";
import {promisify} from "util";

export async function main(req, res, next, config) {
    let date = validateClampedDate(req.body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let artnumber = validateClampedNumber(req.body.artnumber, 0, 99);
    if (date === undefined || artnumber === undefined) {
        res.status(400).end();
        return;
    }

    let name = (await getInfoFromSession(req, res, next, config))?.name;
    if (name === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let articleId = articleIdFromDateAndArtNumber(date, parseInt(artnumber));
    await createArticleInDB(articleId);

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (results.length !== 0) {
        res.status(200).send("true").end();
    } else {
        res.status(200).send("false").end();
    }
}