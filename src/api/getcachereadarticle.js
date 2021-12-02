import {articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getNameFromSession} from "../get-name-from-session.js";

export async function main(req, res, next, config) {
    if (req.method !== "POST") {
        res.status(400).end();
        return;
    } else if (req.cookies["auth-token"] === undefined) {
        res.status(400).end();
        return;
    } else if (req.body.date === undefined || req.body.artnumber === undefined) {
        res.status(400).end();
        return;
    }

    let name = getNameFromSession(req, res, next, config);
    if (user === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let date = new Date(Number(req.body.date));
    let articleId = articleIdFromDateAndArtNumber(date);
    createArticleInDB(articleId);

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (results.length !== 0) {
        res.status(200).send("t").end();
    } else {
        res.status(200).send("f").end();
    }

    res.status(200).send("Proper state set for article read").end();
}