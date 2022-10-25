const articles = require("../db/articles.js");

/* 
    Called with parameters:
    {
        query: keyword string
    }

    Gets all articles with titles similar to query or keywords matching query
*/
module.exports.main = async function(req) {
    if (typeof(req.query.query) !== "string") {
        throw "Query request wasn't of type string";
    }

    let query = req.query.query;
    let titledMatches = await articles.retrieveArticlesWithSimilarTitle(query);
    let keywordMatches = await articles.retrieveArticlesWithKeyword(query);

    return titledMatches.concat(...keywordMatches);
}