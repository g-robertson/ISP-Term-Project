import {articleIdFromDate, createArticleInDB} from "../article-helpers.js";
import {getNameFromSession} from "../get-name-from-session.js";

export async function main(req, res, next, config) {
    if (req.method !== "POST") {
        res.status(400).end();
        return;
    } else if (req.cookies["auth-token"] === undefined) {
        res.status(400).end();
        return;
    } else if (req.body.date === undefined) {
        res.status(400).end();
    }


    let name = getNameFromSession(req, res, next, config);
    if (user === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let articleId = articleIdFromDate(date);
    createArticleInDB(articleId);

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (results.length > 0) {
        await aquery(`DELETE FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    } else {
        await aquery(`INSERT INTO UserReadArticles VALUES (?, ?);`, [name, articleId]);
    }

    res.status(200).send("Read state successfully toggled for user").end();
}