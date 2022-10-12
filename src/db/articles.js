const {client, pgp} = require("./test-db-interfacing.js");

module.exports.retrieveArticle = async function(contentPath) {
    if (typeof(contentPath) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    

    return await client.oneOrNone("SELECT * FROM Articles WHERE Content_Path=$1", [contentPath]);
}

module.exports.retrieveArticlesKeywordsOfLengthCounts = async function(contentPath) {
    if (typeof(contentPath) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return await client.manyOrNone("SELECT Keyword_Length, Keywords_Of_Length_Count FROM ArticleHasKeywordsOfLength WHERE Article_ID=("
                          + "SELECT Article_ID FROM Articles WHERE Content_Path=$1"
                      + ");", [contentPath]
    );
}

module.exports.retrieveInsertedArticles = async function() {
    return await client.manyOrNone("SELECT * FROM Articles");
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

    await client.none("INSERT INTO Articles(Publish_Date, Placement, Title, Content_Path, Content_Length)"
                  + "VALUES($1,$2,$3,$4,$5);", [publishDate, placement, title, contentPath, contentLength]
    );
}

module.exports.deleteArticleKeywords = async function(articleId) {
    if (!Number.isSafeInteger(articleId)) {
        throw "Attempted to delete article keywords with a non-integer article id";
    }

    await client.none("DELETE FROM ArticleKeywords WHERE Article_ID = $1", [articleId]);
}

module.exports.insertArticleKeywords = async function(articleId, keywordPairs) {
    const COLUMN_SET = new pgp.helpers.ColumnSet(['article_id', 'keyword', 'keyword_count'], {table: 'articlekeywords'});

    let values = [];
    for (let keyword in keywordPairs) {
        values.push({
            article_id: articleId,
            keyword: keyword,
            keyword_count: keywordPairs[keyword]
        })
    }

    const query = pgp.helpers.insert(values, COLUMN_SET);
    await client.none(query);
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

    await client.none("INSERT INTO ArticleKeywords(Article_ID, Keyword, Keyword_Count)"
                  + "VALUES($1,$2,$3);", [articleId, keyword, keywordCount]
    );
}