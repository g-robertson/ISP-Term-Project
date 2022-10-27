const { client } = require("./db/test-db-interfacing.js");

module.exports.getUserFromSession = async function(req, res, next, config) {
    if (req.method !== "POST") {
        return undefined;
    } else if (req.cookies["auth-token"] === undefined) {
        return undefined;
    }

    let results = await client.oneOrNone(`SELECT Username, User_ID FROM Users WHERE Session_Token='${req.cookies["auth-token"]}';`);
    if (results === null) {
        return undefined;
    } else {
        return {
            name: results.username,
            id: results.user_id
        };
    }
}