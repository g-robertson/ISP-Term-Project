const {getUserFromSession} = require("../get-user-from-session.js");

module.exports.main = async function(req, res, next, config) {
    let userInfo = await getUserFromSession(req, res, next, config);
    if (userInfo === undefined) {
        res.status(200).send(JSON.stringify({})).end();
    } else {
        res.status(200).send(JSON.stringify(userInfo)).end();
    }
}