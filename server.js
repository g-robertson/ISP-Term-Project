const HOSTNAME = "localhost";
const PORT = 8080;

const express = require("express");
const app = express();
// make root dir public for app, and set default extension to html
app.use(express.static("./public", {extensions: ["html"]}));

app.listen(PORT, HOSTNAME);