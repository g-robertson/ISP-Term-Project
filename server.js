import express from "express";
import cookieParser from "cookie-parser";

import {CONFIG} from "./config.js"
import {getAllAPIs} from "./src/helpers.js";

const APIS = await getAllAPIs();

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use((req, res, next) => {
    // stringify all possible query or body parameters
    for (let key in req.query) {
        req.query[key] = req.query[key].toString();
    }
    for (let key in req.body) {
        req.body[key] = req.body[key].toString();
    }

    next();
});

app.all("/api/*", async (req, res, next) => {
    let endpoint = req.path.substring("/api/".length);
    let apiFunction = APIS[endpoint];
    if (apiFunction !== undefined) {
        await apiFunction(req, res, next, CONFIG);
    } else {
        res.redirect("/404");
    }
});

// make root dir public for app, and set default extension to html
app.use(express.static("./public", {extensions: ["html"]}));

app.use((req, res, next) => {
    res.redirect("/404");
})

app.listen(CONFIG.HTTP.port, CONFIG.HTTP.host);