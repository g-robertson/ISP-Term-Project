const {client} = require("../db/test-db-interfacing.js");

module.exports.main = async function(req, res, next, config) {
    if (req.query.name === undefined) {
        res.status(400).end();
        return;
    }
    let name = req.query.name;
    // Articles (Publish_Date, Placement)
    // ReadArticles(Read_Date)
    // User_ID in common
    let results = await client.manyOrNone(`
        WITH UserReadArticles AS ( 
            SELECT Article_ID, Publish_Date, Placement 
            FROM Articles 
            WHERE Article_ID IN ( 
                SELECT Article_ID 
                FROM ReadArticles 
                WHERE User_ID = ( 
                    SELECT User_ID 
                    FROM Users 
                    WHERE Username='${name}' 
                )
            )
        ) 
        SELECT Publish_Date, Placement, ReadArticles.Read_Date 
        FROM UserReadArticles 
        INNER JOIN ReadArticles 
        ON UserReadArticles.Article_ID = ReadArticles.Article_ID;
    `);

    res.status(200).send(
        JSON.stringify(
            results.map(v => 
                Object.assign(
                    {
                        date: v.publish_date,
                        articleNumber: v.placement,
                        read: v.read_date
                    }
                )
            )
        )
    ).end();
}