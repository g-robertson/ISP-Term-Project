const {retrieveArticle} = require("../db/articles.js");
const {getUserFromSession} = require("../get-user-from-session.js");
const {validateClampedDate, validateClampedNumber} = require("../validate-primitives.js");
const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(req, res, next, config) {
    let date = validateClampedDate(req.body.date, new Date("2000/01/01"), new Date("9999/12/30"));
    let artnumber = validateClampedNumber(req.body.artnumber, 0, 99);
    let state = req.body.state;

    if (date === undefined || artnumber === undefined || state === undefined) {
        res.status(400).end();
        return;
    }

    let userId = (await getUserFromSession(req, res, next, config))?.id;
    if (userId === undefined) {
        res.status(200).send("No user session could be found").end();
        return;
    }

    let article = await retrieveArticle(`${date}UTC${artnumber}`);
    let read = state[0] === "t";

    let results = await client.any(`SELECT User_ID FROM ReadArticles WHERE User_ID=${userId} AND Article_ID='${article.article_id}';`);

    // unix time in seconds
    let currentTime = Math.floor(new Date().valueOf() / 1000);

    if (read && results.length > 0) {
        await client.result(`DELETE FROM ReadArticles WHERE User_ID=${userId} AND Article_ID=${article.article_id};`);
    } else if (!read && results.length === 0) {
        await client.result(`INSERT INTO ReadArticles VALUES (${userId}, ${article.article_id}, to_timestamp(${currentTime}));`);
    }

    res.status(200).send("Proper state set for article read").end();
}