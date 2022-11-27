const path = require('path');
const fs = require('fs-extra');
const {insertArticle, updateArticle, insertArticlesKeywords, deleteArticleKeywords, retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts, parsePublishDate} = require("../db/articles.js");

const COLLECTION_DIR = path.join(__dirname, "../../scraped");
const KEYWORD_LENGTH = 20;

let readArticles = {};

const TOTAL_ARTICLES = 200;
const ARTICLE_COLLATION = 20;
let articles = fs.readdirSync(COLLECTION_DIR).reverse();
let usingArticles = articles.slice(0, TOTAL_ARTICLES);

for (let i = 0; i < articles.length; ++i) {
    if (articles[i] === ".gitignore") {
        articles.splice(i, 1);
        --i;
        continue;
    }
    readArticles[articles[i]] = "valid";
}

async function scrapeArticle(article) {
    if (readArticles[article] === "valid") {
        let articlePath = path.join(COLLECTION_DIR, article);
        let articleHTML = (await fs.readFile(articlePath)).toString();

        let articleParts = article.split("UTC");
        if (articleParts.length < 2) {
            throw "A scraped article path must be formatted with the placement after the first instance of the phrase 'UTC'";
        }
        let articlePlacement = parseInt(articleParts[1]);
        if (!Number.isSafeInteger(articlePlacement)) {
            throw "A scraped article path after the first instance of the phrase 'UTC' must refer to an integer placement";
        }
        readArticles[article] = {
            date: parsePublishDate(articleHTML),
            articleHTML: articleHTML,
            placement: articlePlacement
        }
    }

    return readArticles[article];
}

function datePlacementHash(date, placement) {
    return `${date.valueOf()}-${placement}`;
}

module.exports.insertArticles = async function() {
    let alreadyInserted = await retrieveInsertedArticles();
    let alreadyInsertedContentPathMap = {};
    let alreadyInsertedDateMap = {};
    for (let inserted of alreadyInserted) {
        alreadyInsertedContentPathMap[inserted.content_path] = inserted;
        alreadyInsertedDateMap[datePlacementHash(inserted.publish_date, inserted.placement)] = inserted;
    }
    for (let articlePath of usingArticles) {
        if (alreadyInsertedContentPathMap[articlePath] !== undefined) {
            continue;
        }

        let article = await scrapeArticle(articlePath);
        if (alreadyInsertedDateMap[datePlacementHash(article.date, article.placement)] !== undefined) {
            await updateArticle(alreadyInsertedDateMap[datePlacementHash(article.publish_date, article.placement)].content_path, {content_path: articlePath});
            continue;
        }

        await insertArticle(article.placement, article.articleHTML, articlePath);
    }
}

module.exports.insertArticlesKeywords = async function() {
    let articles = {};
    let articlesCollected = 0;
    let totalArticlesCollected = 0;
    let ttime = Date.now();
    let time = Date.now();
    for (let i = 0; i < TOTAL_ARTICLES && i < usingArticles.length; ++i) {
        let articlePath = usingArticles[i];

        let article = await retrieveArticle(articlePath);
        let articleHasKeywordsOfLengthCounts = await retrieveArticlesKeywordsOfLengthCounts(articlePath);

        let finishedKeywordsCount = 0;
        for (let row of articleHasKeywordsOfLengthCounts) {
            if (row.keywords_count + row.keyword_length - 1 === article.content_text.length) {
                ++finishedKeywordsCount;
            }
        }

        if (finishedKeywordsCount === 20) {
            continue;
        }

        await deleteArticleKeywords(article.article_id);

        let articleKeywords = {};
        for (let i = 0; i < article.content_text.length; ++i) {
            for (let j = 1; i + j <= article.content_text.length && j <= KEYWORD_LENGTH; ++j) {
                let keyword = article.content_text.substring(i, i + j);
                if (articleKeywords[keyword] === undefined) {
                    articleKeywords[keyword] = {count: 0, firstOccurrence: i};
                }
                ++articleKeywords[keyword].count;
            }
        }

        articles[article.article_id] = articleKeywords;

        ++articlesCollected;

        if (articlesCollected % ARTICLE_COLLATION === 0 || i + 1 === TOTAL_ARTICLES) {
            console.log(`Gathering ${articlesCollected} articles keywords took ${Date.now() - time} ms`);
            time = Date.now();
            console.log(`Now inserting ${articlesCollected} articles`);
            await insertArticlesKeywords(articles);
            console.log(`Inserting ${articlesCollected} articles took ${Date.now() - time} ms`);
            articles = {};
            totalArticlesCollected += articlesCollected;
            articlesCollected = 0;
            time = Date.now();
        }
    }

    console.log(`Total time taken for ${totalArticlesCollected} articles keyword insertion was ${Date.now() - ttime} ms`);
}