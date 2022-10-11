const path = require('path');
const fs = require('fs');

const COLLECTION_DIR = path.join(__dirname, "../../public");

let files = fs.readdirSync(COLLECTION_DIR);
for (let file of files) {
    console.log(file);
}