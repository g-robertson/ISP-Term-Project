const path = require('path');
const fs = require('fs-extra');
const {insertArticle, insertArticleKeyword, retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts} = require("../db/articles.js");

const COLLECTION_DIR = path.join(__dirname, "../../scraped");
const KEYWORD_LENGTH = 20;

let readArticles = {};

let articles = fs.readdirSync(COLLECTION_DIR);
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
        let scrapeContents = (await fs.readFile(articlePath)).toString();
        let scrapeParts = scrapeContents.split(",");
        if (scrapeParts.length !== 4) {
            scrapeParts = scrapeContents.split("!!DELIMITER!!");
            if (scrapeParts.length !== 4) {
                throw `Article ${article} required as CSV {Placement,Title,Date,Content} had ${scrapeParts.length - 1} commas instead of 3.\n`
                    + `Replace the commas intended to be split on with '!!DELIMITER!!' to fix.`;
            }
        }

        readArticles[article] = {
            placement: parseInt(scrapeParts[0]),
            title: scrapeParts[1],
            // changes format from "YYYY-MM-DD HH:MM:SS" with implicit GMT+0900 (JST)
            //      to format      "YYYY MM DD HH:MM:SS GMT+0900"
            date: new Date(`${scrapeParts[2].replace(/-/g, ' ')} GMT+0900`),
            content: scrapeParts[3]
        };
    }

    return readArticles[article];
}

const TOTAL_FILES = 10;
module.exports.insertArticles = async function() {
    let alreadyInserted = await retrieveInsertedArticles();
    let alreadyInsertedMap = {};
    for (let inserted of alreadyInserted) {
        alreadyInsertedMap[inserted.content_path] = true;
    }
    for (let articlePath of articles) {
        if (alreadyInsertedMap[articlePath]) {
            continue;
        }

        let article = await scrapeArticle(articlePath);
        await insertArticle(article.date, article.placement, article.title, articlePath, article.content.length);
    }
}

module.exports.insertArticlesKeywords = async function() {
    for (let articlePath of articles) {
        let article = await retrieveArticle(articlePath);
        let articleHasKeywordsOfLengthCounts = await retrieveArticlesKeywordsOfLengthCounts(articlePath);
        
        let finishedKeywords = {};
        let finishedKeywordsCount = 0;
        for (let row of articleHasKeywordsOfLengthCounts) {
            console.log(row);
        }

        if (finishedKeywordsCount === 20) {
            continue;
        }

        let articleContent = (await scrapeArticle(articlePath)).content;
    
        let articleKeywords = {};
        for (let i = 0; i < articleContent.length; ++i) {
            for (let j = 1; i + j <= articleContent.length && j <= KEYWORD_LENGTH; ++j) {
                let keyword = articleContent.substring(i, i + j);
                if (articleKeywords[keyword] === undefined) {
                    articleKeywords[keyword] = 0;
                }
                ++articleKeywords[keyword];
            }
        }

        for (let keyword in articleKeywords) {
            insertArticleKeyword(article.article_id, keyword, articleKeywords[keyword]);
        }

        break;
    }
}