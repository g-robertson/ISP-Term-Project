const getUserInfo = require("./get-user-info.js")
const {validateClampedDate, validateClampedNumber} = require("../validate-primitives.js");
const {retrieveArticle} = require("../db/articles.js");
const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    if (method !== "POST") {
        return "get-state-read-article called without POST method";
    }
    let date = validateClampedDate(body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let placement = validateClampedNumber(body.placement, 0, 99);
    if (date === undefined) {
        return "Date provided was invalid";
    } else if (placement === undefined) {
        return "Article number provided was invalid";
    }

    let user = await getUserInfo.main(body, method, cookies);
    if (user === null) {
        return "No user session could be found";
    }

    let article = await retrieveArticle(date, placement);
    if (article === null) {
        return "No matching article could be found";
    }

    let results = await client.oneOrNone("SELECT User_ID FROM ReadArticles WHERE User_ID=$1 AND ArticleId=$2;", [user.user_id, article.article_id]);
    if (results === null) {
        return false;
    } else {
        return true;
    }
} 