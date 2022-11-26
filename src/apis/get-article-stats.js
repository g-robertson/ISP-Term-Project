const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    let id = body.id;
    if (typeof(id) !== "number") {
        return "Article ID was not sent correctly";
    }

    let results = await client.manyOrNone(`
        SELECT * FROM Article_Kanji_Stats($1);
    `, [id]);

    return results.map(v => {
        return {
            kanji: v.kanji,
            count: v.amount,
        };
    });
}