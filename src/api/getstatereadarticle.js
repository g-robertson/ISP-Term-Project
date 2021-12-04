import {createArticleInDB, articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getInfoFromSession} from "../get-info-from-session.js";
import {promisify} from "util";

export async function main(req, res, next, config) {
    if (req.body.date === undefined || req.body.artnumber === undefined) {
        res.status(400).end();
        return;
    }

    let name = (await getInfoFromSession(req, res, next, config))?.name;
    if (name === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let date = new Date(Number(req.body.date));
    let articleId = articleIdFromDateAndArtNumber(date, parseInt(req.body.artnumber));
    await createArticleInDB(articleId);

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (results.length !== 0) {
        res.status(200).send("t").end();
    } else {
        res.status(200).send("f").end();
    }
}