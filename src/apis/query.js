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

    return titledMatches.concat(...keywordMatches);
}