const {client, pgp} = require("./test-db-interfacing.js");
const {getFormattedDate} = require("../helpers/get-formatted-date.js");

module.exports.parsePublishDate = function(articleHTML) {
    if (typeof(articleHTML) !== "string") {
        throw "Tried to parse publish date from non-string article HTML";
    }
    let match = articleHTML.match(/<time datetime="(.*?)">/);
    if (match === null) {
        return null;
    }
    return new Date(match[1]);
}

module.exports.parseTitleHTML = function(articleHTML) {
    if (typeof(articleHTML) !== "string") {
        throw "Tried to parse title HTML from non-string article HTML";
    }
    let match = articleHTML.match(/<h3>.*?<\/h3>/);
    if (match === null) {
        return null;
    }
    return match[0];
}

module.exports.parseContentHTML = function(articleHTML) {
    if (typeof(articleHTML) !== "string") {
        throw "Tried to parse title HTML from non-string article HTML";
    }
    let match = articleHTML.match(/(<img.*?>)|(<p>.*?<\/p>)/g);
    if (match === null) {
        return null;
    }
    return match.join("");
}

module.exports.parseTextFromHTML = function(html) {
    if (typeof(html) !== "string") {
        throw "Tried to parse text from html with non-string HTML";
    }
    return html.replace(/<.*?>/g, "");
}

module.exports.parseArticleHTML = function(articleHTML) {
    if (typeof(articleHTML) !== "string") {
        throw "Tried to parse article attributes from non-string article HTML";
    }
    let publishDate = module.exports.parsePublishDate(articleHTML);
    let titleHTML = module.exports.parseTitleHTML(articleHTML);
    let contentHTML = module.exports.parseContentHTML(articleHTML);
    return {
        publishDate: publishDate,
        titleHTML: titleHTML,
        titleText: module.exports.parseTextFromHTML(titleHTML),
        contentHTML: contentHTML,
        contentText: module.exports.parseTextFromHTML(contentHTML)
    };
}

module.exports.retrieveArticle = async function(contentPathOrTimestamp, placement) {
    if (typeof(contentPathOrTimestamp) === "string") {
        return await client.oneOrNone("SELECT * FROM Articles WHERE Content_Path=$1;", [contentPathOrTimestamp]);
    } else if ((contentPathOrTimestamp instanceof Date) && Number.isSafeInteger(placement)) {
        return await client.oneOrNone("SELECT * FROM Articles WHERE Publish_Date>=$1::date AND Publish_Date<($1::date + '1 day'::interval) AND Placement=$2;", [getFormattedDate(contentPathOrTimestamp).replaceAll('-', '/'), placement]);
    } else {
        throw "Attempted to retrieve an article by content path with neither a string content path or timestamp and placement";
    }
}

module.exports.retrieveArticlesKeywordsOfLengthCounts = async function(contentPath) {
    if (typeof(contentPath) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return await client.manyOrNone("SELECT Keyword_Length, Keywords_Count FROM ArticleKeywordsOfLength WHERE Article_ID=(" +
        "SELECT Article_ID FROM Articles WHERE Content_Path=$1" +
        ");", [contentPath]
    );
}

module.exports.retrieveArticlesWithSimilarTitle = async function(title) {
    if (typeof(title) !== "string") {
        throw "Attempted to retrieve an article by title with a non-string title";
    }

    title = title.replaceAll('_', '\\_');
    title = title.replaceAll('%', '\\%');

    return await client.manyOrNone("SELECT * FROM Articles WHERE Title_Text LIKE $1", [`%${title}%`]);
}

module.exports.retrieveArticlesWithKeywordByFrequencyWithFirstOccurrence = async function(keyword) {
    if (typeof(keyword) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return await client.manyOrNone("SELECT Articles.*, ArticleKeywords.First_Occurrence_In_Article FROM Articles JOIN " +
        "(SELECT Article_ID, Keyword_Count, First_Occurrence_In_Article FROM ArticleKeywords WHERE Keyword=$1) AS ArticleKeywords " +
        "ON ArticleKeywords.Article_ID = Articles.Article_ID " +
        "ORDER BY Keyword_Count DESC;", [keyword]
    );
}

module.exports.retrieveArticlesWithKeyword = async function(keyword) {
    if (typeof(keyword) !== "string") {
        throw "Attempted to retrieve an article by content path with a non-string content path";
    }

    return await client.manyOrNone("SELECT Articles.*, ArticleKeywords.First_Occurrence_In_Article FROM Articles JOIN " +
        "(SELECT Article_ID, First_Occurrence_In_Article FROM ArticleKeywords WHERE Keyword=$1) AS ArticleKeywords " +
        "ON ArticleKeywords.Article_ID = Articles.Article_ID;", [keyword]
    );
}

module.exports.retrieveInsertedArticles = async function() {
    return await client.manyOrNone("SELECT * FROM Articles");
}

module.exports.insertArticle = async function(placement, articleHTML, contentPath) {
    if (!Number.isSafeInteger(placement)) {
        throw "Attempted to insert an article with a non-integer placement";
    }
    if (typeof(articleHTML) !== "string") {
        throw "Attempted to insert an article with a non-string article HTML";
    }
    if (typeof(contentPath) !== "string") {
        throw "Attempted to insert an article with a non-string content path";
    }

    let articleAttributes = module.exports.parseArticleHTML(articleHTML);
    await client.none("INSERT INTO Articles(Placement, Publish_Date, Title_HTML, Title_Text, Content_HTML, Content_Text, Content_Path)" +
        "VALUES($1,$2,$3,$4,$5,$6,$7);",
        [
            placement,
            articleAttributes.publishDate,
            articleAttributes.titleHTML,
            articleAttributes.titleText,
            articleAttributes.contentHTML,
            articleAttributes.contentText,
            contentPath
        ]
    );
}

module.exports.updateArticle = async function(contentPathOrTimestamp, placementOrOptions, options) {
    let queryString = [];
    let parameters = [];
    let onParameter = 0;
    // set up to either use content_path, or timestamp & placement,
    // puts lhs and rhs of query into queryString[0] and queryString[1] with an empty 
    if (typeof(contentPathOrTimestamp) === "string") {
        options = placementOrOptions;
        queryString = ["UPDATE Articles SET", "WHERE Content_Path=$1;"];
        parameters = [contentPathOrTimestamp];
        onParameter = 2;
    } else if ((contentPathOrTimestamp instanceof Date) && Number.isSafeInteger(placementOrOptions)) {
        queryString = ["UPDATE Articles SET", "WHERE Publish_Date>=$1::date AND Publish_Date<($1::date + '1 day'::interval) AND Placement=$2;"];
        parameters = [getFormattedDate(contentPathOrTimestamp), placement];
        onParameter = 3;
    } else {
        throw "Attempted to retrieve an article by content path with neither a string content path or timestamp and placement";
    }

    let queryStringMiddle = "";
    if (Number.isSafeInteger(options.placement)) {
        queryStringMiddle += `,placement = $${onParameter}`;
        ++onParameter;
        parameters.push(options.placement);
    }
    if (typeof(options.articleHTML) === "string") {
        queryStringMiddle += `,publish_date = $${onParameter},title_html = $${onParameter + 1}, title_text = $${onParameter + 2}, content_html = $${onParameter + 3}, content_text = $${onParameter + 4}`;
        onParameter += 5;
        let articleAttributes = module.exports.parseArticleHTML(options.articleHTML);
        parameters.push(
            articleAttributes.publishDate,
            articleAttributes.titleHTML,
            articleAttributes.titleText,
            articleAttributes.contentHTML,
            articleAttributes.contentText
        );
    }
    if (typeof(options.content_path) === "string") {
        queryStringMiddle += `,content_path = $${onParameter}`;
        ++onParameter;
        parameters.push(options.content_path);
    }

    if (queryStringMiddle === "") {
        return;
    } else {
        // sets first comma to space
        queryStringMiddle = ` ${queryStringMiddle.substring(1)}`;
    }
    
    return await client.none(`${queryString[0]}${queryStringMiddle}${queryString[1]}`, parameters)
}

module.exports.deleteArticleKeywords = async function(articleId) {
    if (!Number.isSafeInteger(articleId)) {
        throw "Attempted to delete article keywords with a non-integer article id";
    }

    await client.none("DELETE FROM ArticleKeywords WHERE Article_ID = $1", [articleId]);
}

module.exports.insertArticlesKeywords = async function(articleKeywordPairs) {
    const COLUMN_SET = new pgp.helpers.ColumnSet(['article_id', 'keyword', 'first_occurrence_in_article', 'keyword_count'], {table: 'articlekeywords'});

    let values = [];
    for (let article in articleKeywordPairs) {
        for (let keyword in articleKeywordPairs[article]) {
            values.push({
                article_id: parseInt(article),
                keyword: keyword,
                first_occurrence_in_article: articleKeywordPairs[article][keyword].firstOccurrence,
                keyword_count: articleKeywordPairs[article][keyword].count
            });
        }
    }

    const query = pgp.helpers.insert(values, COLUMN_SET);
    await client.none(query);
}

module.exports.insertArticleKeywords = async function(articleId, keywordPairs) {
    const COLUMN_SET = new pgp.helpers.ColumnSet(['article_id', 'keyword', 'first_occurrence_in_article', 'keyword_count'], {table: 'articlekeywords'});

    let values = [];
    for (let keyword in keywordPairs) {
        values.push({
            article_id: articleId,
            keyword: keyword,
            first_occurrence_in_article: keywordPairs[keyword].firstOccurrence,
            keyword_count: keywordPairs[keyword].count
        })
    }

    const query = pgp.helpers.insert(values, COLUMN_SET);
    await client.none(query);
}

module.exports.insertArticleKeyword = async function(articleId, keyword, firstOccurrence, keywordCount) {
    if (!Number.isSafeInteger(articleId)) {
        throw "Attempted to insert an article keyword with a non-integer article id";
    }
    if (typeof(keyword) !== "string") {
        throw "Attempted to insert an article keyword with a non-string keyword";
    }
    if (!Number.isSafeInteger(firstOccurrence)) {
        throw "Attempted to insert an article keyword with a non-integer first occurrence index";
    }
    if (!Number.isSafeInteger(keywordCount)) {
        throw "Attempted to insert an article keyword with a non-integer keyword count";
    }

    await client.none("INSERT INTO ArticleKeywords(Article_ID, Keyword, First_Occurrence_In_Article, Keyword_Count)" +
        "VALUES($1,$2,$3,$3);", [articleId, keyword, firstOccurrence, keywordCount]
    );
}