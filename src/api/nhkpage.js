import {articleFromDate} from "../article-helpers.js";
import {GET_CACHE} from "../getcache.js";

export async function main(req, res, next, config) {
    if (req.query.date === undefined ||
        req.query.artnumber === undefined
    ) {
        res.status(400).end();
        return;
    }

    let date = new Date(parseInt(req.query.date));
    let articleNumber = parseInt(req.query.artnumber);
    let page = articleFromDate(date);
    
    let response = await GET_CACHE.get(page);
    if (response === 404) {
        // old no page message
        // .send(`There is no page from nhkeasier on ${date.toISOString()}.`)
        res.status(404).end();
        return;
    } else if (typeof(response) === "number") {
        res.status(500).send("nhkeasier sent back an unexpected status code. If you see this, please report it back.").end();
        return;
    }
    let articles = [...response.matchAll(/<article.*?>((.|\n)*?)<\/article>/g)];
    if (articleNumber === -1) {
        if (articles.length === 0) {
            res.status(200).send(`There are no articles from nhkeasier on ${date.toISOString()}.`).end();
            return;
        }
        var mappedArticles = "";
        for (let i = 0; i < articles.length; ++i) {
            if (i == 0) {
                mappedArticles += (articles[i][1]);
            } else {
                mappedArticles += ("|~|" + articles[i][1]);
            }
        }
        res.status(200).send(mappedArticles).end();
    } else {
        let article = articles[articleNumber];
        if (article === undefined) {
            res.status(200).send(`There is no ${articleNumber}th article from nhkeasier on ${date.toISOString()}.`).end();
            return;
        }
        let articleGroup1 = article[1];
        res.status(200).send(articleGroup1).end();
    }
}