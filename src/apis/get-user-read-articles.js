const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(body, method, cookies) {
    let name = body.name;
    if (typeof(name) !== "string") {
        return "Username was not sent correctly";
    }

    let results = await client.manyOrNone(`
        SELECT Publish_Date, Placement, UserReadArticles.Read_Date
        FROM Articles JOIN
           (SELECT Article_ID, Read_Date
            FROM ReadArticles WHERE User_ID = (
                SELECT User_ID FROM Users WHERE Username=$1
            )
           ) AS UserReadArticles ON Articles.Article_ID = UserReadArticles.Article_ID;
    `, [name]);

    return results.map(v => {
        return {
            date: v.publish_date,
            articleNumber: v.placement,
            read: v.read_date
        };
    });
}