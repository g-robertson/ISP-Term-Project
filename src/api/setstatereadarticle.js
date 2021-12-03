import {articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getNameFromSession} from "../get-name-from-session.js";

export async function main(req, res, next, config) {
    if (req.body.date === undefined || req.body.artnumber === undefined) {
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
    let state = req.body.state[0] === "t";

    const aquery = promisify(config.CONN.query).bind(config.CONN);
    await aquery(`USE ${config.DB}`);

    let results = await aquery(`SELECT UserName FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    if (state && results.length === 0) {
        await aquery(`INSERT INTO UserReadArticles VALUES (?, ?);`, [name, articleId]);
    } else if (!state && results.length !== 0) {
        await aquery(`DELETE FROM UserReadArticles WHERE UserName=? AND ArticleId=?;`, [name, articleId]);
    }

    res.status(200).send("Proper state set for article read").end();
}