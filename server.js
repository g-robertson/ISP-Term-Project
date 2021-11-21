const HOSTNAME = "localhost";
const PORT = 8080;
const APIS = require("./src/helpers.js").getAllAPIs();

const express = require("express");
const app = express();


app.all("/api/*", (req, res, next) => {
    let endpoint = req.path.substring("/api/".length);
    let apiFunction = APIS[endpoint];
    if (apiFunction !== undefined) {
        res.send(`${apiFunction(req.query)}`).end();
    } else {
        res.status(404).end("This API endpoint does not exist.");
    }
});

// make root dir public for app, and set default extension to html
app.use(express.static("./public", {extensions: ["html"]}));

app.listen(PORT, HOSTNAME);