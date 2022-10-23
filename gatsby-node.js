const {retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts} = require("./src/db/articles.js");

exports.createPages = async function ({ actions }) {
    const articles = await retrieveInsertedArticles();
    console.log(articles);
}