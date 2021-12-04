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