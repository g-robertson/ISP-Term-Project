const HOSTNAME = "localhost";
const PORT = 8080;
import {getAllAPIs} from "./src/helpers.js";
const APIS = await getAllAPIs();

import express from "express";
const app = express();


app.all("/api/*", async (req, res, next) => {
    let endpoint = req.path.substring("/api/".length);
    let apiFunction = APIS[endpoint];
    if (apiFunction !== undefined) {
        await apiFunction(req, res, next);
    } else {
        res.status(404).end("This API endpoint does not exist.");
    }
});

// make root dir public for app, and set default extension to html
app.use(express.static("./public", {extensions: ["html"]}));

app.listen(PORT, HOSTNAME);