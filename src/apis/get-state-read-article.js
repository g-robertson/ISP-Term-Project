const {getUserFromSession} = require("../get-user-from-session.js");
const {validateClampedDate, validateClampedNumber} = require("../validate-primitives.js");
const {retrieveArticle} = require("../db/articles.js");
const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(req, res, next, config) {
    let date = validateClampedDate(req.body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let artnumber = validateClampedNumber(req.body.artnumber, 0, 99);

    let name = (await getUserFromSession(req, res, next, config)).name;
    if (name === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let articleId = await retrieveArticle(`${date}UTC${artnumber}`)

    let results = await client.oneOrNone(`SELECT User_ID FROM ReadArticles WHERE UserName=${name} AND ArticleId=${articleId};`);
    if (results) {
        res.status(200).send("true").end();
    } else {
        res.status(200).send("false").end();
    }
} 