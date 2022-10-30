const articles = require("../db/articles.js");

/* 
    Called with parameters:
    {
        query: keyword string
    }

    Gets all articles with titles similar to query or keywords matching query
*/
module.exports.main = async function(body) {
    let query = body.query;
    if (typeof(query) !== "string") {
        return "Query request wasn't of type string";
    }
    
    let titledMatches = await articles.retrieveArticlesWithSimilarTitle(query);
    let keywordMatches = await articles.retrieveArticlesWithKeywordByFrequency(query);

    let idsUsed = {};
    let undupedMatches = [];
    for (let match of titledMatches.concat(...keywordMatches)) {
        if (idsUsed[match.article_id] !== true) {
            idsUsed[match.article_id] = true;
            undupedMatches.push(match);
        }
    }

    return undupedMatches;
}