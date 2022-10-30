const { randomBytes } = require("crypto");
const { client } = require("../db/test-db-interfacing.js");
const bcrypt = require("bcrypt");

const MIN_USERNAME_LENGTH = 1;
const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;
module.exports.main = async function(body, method, cookies, cookie) {
    if (method !== "POST") {
        return "login called without POST method";
    }
    
    let name = body.name;
    let password = body.password;
    if (typeof(name) !== "string") {
        return "Username was not sent correctly";
    } else if (typeof(password) !== "string") {
        return "Password was not sent correctly";
    } else if (name.length < MIN_USERNAME_LENGTH || name.length >= MAX_USERNAME_LENGTH) {
        return `Username length must be greater than ${MIN_USERNAME_LENGTH} and less than ${MAX_USERNAME_LENGTH}`;
    } else if (password.length < MIN_PASSWORD_LENGTH || password.length >= MAX_PASSWORD_LENGTH) {
        return `Password length must be greater than ${MIN_PASSWORD_LENGTH} and less than ${MAX_PASSWORD_LENGTH}`;
    }
    

    let results = await client.oneOrNone("SELECT Hash FROM Users WHERE Username=$1;", [name]);
    let authToken = randomBytes(128);

    if (results === null) {
        let hash = await bcrypt.hash(password, 10);
        await client.none("INSERT INTO Users (Username, Hash, Session_Token VALUES($1, $2, $3", [name, hash, authToken]);
    } else {
        let hash = results.hash;
        if (!(await bcrypt.compare(password, hash))) {
            return "This username is taken";
        }

        await client.result("UPDATE Users SET Session_Token=$1 WHERE Username=$2", [authToken, name]);
    }
    
    const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
    
    cookie("auth-token", authToken, {httpOnly: true, maxAge: ONE_MONTH});
    return "Login successful";
}