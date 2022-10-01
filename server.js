const express = require("express");
const cookieParser = require("cookie-parser");

const {CONFIG} = require("./config.js");
const {getAllAPIs} = require("./src/helpers.js");

async function main() {
    const APIS = await getAllAPIs();

    const app = express();
    
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser())
    
    app.use((req, res, next) => {
        console.log(req.url)
        next();
    });

    app.all("/api/*", async (req, res, next) => {
        let endpoint = req.path.substring("/api/".length);
        let apiFunction = APIS[endpoint];
        if (apiFunction !== undefined) {
            try {
                await apiFunction(req, res, next, CONFIG);
            } catch {
                res.status(400).end();
            }
        } else {
            res.redirect("/404");
        }
    });
    
    // for all defined status code, respond with according page and status
    const STATUS_CODE_RESPONSES = [404];
    for (let statusCodeResponse of STATUS_CODE_RESPONSES) {
        app.all(`/${statusCodeResponse}`, async (req, res, next) => {
            res.status(statusCodeResponse);
            next();
        })
    }

    // make root dir public for app, and set default extension to html
    app.use(express.static("./public", {extensions: ["html"]}));
    
    app.use((req, res, next) => {
        res.redirect("/404");
    })
    
    app.listen(CONFIG.HTTP.PORT, CONFIG.HTTP.HOST);

    console.log(`Server actively running on ${CONFIG.HTTP.HOST}:${CONFIG.HTTP.PORT}`);
}

main();