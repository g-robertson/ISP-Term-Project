const {retrieveArticle} = require("../db/articles.js");
const {validateClampedDate, validateClampedNumber} = require("../validate-primitives.js");
const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    if (method !== "POST") {
        return "set-state-read-article called without POST method";
    }
    let date = validateClampedDate(body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let articleNumber = validateClampedNumber(body.articleNumber, 0, 99);
    let state = body.state;
    if (date === undefined) {
        return "Date provided was invalid";
    } else if (articleNumber === undefined) {
        return "Article number provided was invalid";
    } else if (typeof(state) !== "boolean") {
        return "State provided was not a boolean";
    }

    let user = (await getUserInfo.main(body, method, cookies));
    if (typeof(user) !== "object") {
        return "No user session could be found";
    }

    let article = await retrieveArticle(date, articleNumber);
    if (article === null) {
        return "No matching article could be found";
    }

    
    if (state && results.length > 0) {
        await client.result("DELETE FROM ReadArticles WHERE User_ID=$1 AND Article_ID=$2;", [user.user_id, article.article_id]);
    } else if (!state && results.length === 0) {
        await client.result(`
            INSERT INTO ReadArticles (User_ID, Article_ID, Read_Date) VALUES ($1, $2, CURRENT_TIMESTAMP())
            ON CONFLICT (User_ID, Article_ID) DO UPDATE SET Read_Date = CURRENT_TIMESTAMP();`, [user.user_id, article.article_id]);
    }

    return "Proper state set for article";
}