import {getUserFromSession} from "../get-user-from-session.js";

export async function main(req, res, next, config) {
    let userInfo = await getUserFromSession(req, res, next, config);
    if (userInfo === undefined) {
        res.status(200).send(JSON.stringify({})).end();
    } else {
        res.status(200).send(JSON.stringify(userInfo)).end();
    }
}