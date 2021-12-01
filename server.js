import express from "express";

import {CONFIG} from "./config.js"
import {getAllAPIs} from "./src/helpers.js";

const APIS = await getAllAPIs();

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.all("/api/*", async (req, res, next) => {
    if (req.method === "POST") {
        let endpoint = req.path.substring("/api/".length);
        let apiFunction = APIS[endpoint];
        if (apiFunction !== undefined) {
            await apiFunction(req, res, next, CONFIG);
        } else {
            res.redirect("/404");
        }
    } else {
        res.status(400).end();
    }
});

// make root dir public for app, and set default extension to html
app.use(express.static("./public", {extensions: ["html"]}));

app.use((req, res, next) => {
    res.redirect("/404");
})

app.listen(CONFIG.HTTP.port, CONFIG.HTTP.host);