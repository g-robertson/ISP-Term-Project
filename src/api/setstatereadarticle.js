import {createArticleInDB, articleIdFromDateAndArtNumber} from "../article-helpers.js";
import {getInfoFromSession} from "../get-info-from-session.js";
import {promisify} from "util";

export async function main(req, res, next, config) {
    if (req.body.date === undefined || req.body.artnumber === undefined || req.body.state === undefined) {
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