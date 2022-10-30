const { client } = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    if (method !== "POST") {
        return "get-user-info called without POST method";
    } else if (cookies["auth-token"] === undefined) {
        return "No authentication token sent with request";
    }

    return await client.oneOrNone("SELECT Username, User_ID FROM Users WHERE Session_Token=$1;", [Buffer.from(cookies["auth-token"])]);
}