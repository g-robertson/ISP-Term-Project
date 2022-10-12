const {query} = require("./test-db-interfacing.js");

module.exports.retrieveArticle = async function(contentPath) {
    if (typeof(contentPath) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return (await query("SELECT * FROM Articles WHERE Content_Path=$1", [contentPath])).rows[0];
}

module.exports.retrieveArticlesKeywordsOfLengthCounts = async function(contentPath) {
    if (typeof(contentPath) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return (await query("SELECT Keyword_Length, Keywords_Of_Length_Count FROM ArticleHasKeywordsOfLength WHERE Article_ID=("
                          + "SELECT Article_ID FROM Articles WHERE Content_Path=$1"
                      + ");", [contentPath]
    )).rows;
}

module.exports.retrieveInsertedArticles = async function() {
    return (await query("SELECT * FROM Articles")).rows;
}

module.exports.insertArticle = async function(publishDate, placement, title, contentPath, contentLength) {
    if (!(publishDate instanceof Date)) {
        throw "Attempted to insert an article with a non-Date valued publish date";
    }
    if (!Number.isSafeInteger(placement)) {
        throw "Attempted to insert an article with a non-integer placement";
    }
    if (typeof(title) !== "string") {
        throw "Attempted to insert an article with a non-string title";
    }
    if (typeof(contentPath) !== "string") {
        throw "Attempted to insert an article with a non-string content path";
    }
    if (!Number.isSafeInteger(contentLength)) {
        throw "Attempted to insert an article with a non-integer content length";
    }

    await query("INSERT INTO Articles(Publish_Date, Placement, Title, Content_Path, Content_Length)"
                  + "VALUES($1,$2,$3,$4,$5);", [publishDate, placement, title, contentPath, contentLength]
    );
}

module.exports.insertArticleKeyword = async function(articleId, keyword, keywordCount) {
    if (!Number.isSafeInteger(articleId)) {
        throw "Attempted to insert an article keyword with a non-integer article id";
    }
    if (typeof(keyword) !== "string") {
        throw "Attempted to insert an article keyword with a non-string keyword";
    }
    if (!Number.isSafeInteger(keywordCount)) {
        throw "Attempted to insert an article keyword with a non-integer keyword count";
    }

    await query("INSERT INTO ArticleKeywords(Article_ID, Keyword, Keyword_Count)"
                  + "VALUES($1,$2,$3);", [articleId, keyword, keywordCount]
    );
}