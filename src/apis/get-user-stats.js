const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    let name = body.name;
    if (typeof(name) !== "string") {
        return "Username was not sent correctly";
    }

    let results = await client.manyOrNone(`
        SELECT * FROM User_Kanji_Stats((SELECT user_id FROM users WHERE username=$1));
    `, [name]);

    return results.map(v => {
        return {
            kanji: v.kanji,
            count: v.amount,
            first_seen: v.first_seen,
            last_seen: v.last_seen
        };
    });
}