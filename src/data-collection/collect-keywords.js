const path = require('path');
const fs = require('fs');

const COLLECTION_DIR = path.join(__dirname, "../../scraped");
const KEYWORD_LENGTH = 20;

let files = fs.readdirSync(COLLECTION_DIR);


const TOTAL_FILES = 10;

let filesRan = 0;
for (let file of files) {
    if (!file.match(/\d{4}-\d{2}-\d{2}UTC\d{1,3}/)) {
        continue;
    }

    let articleKeywords = {};
    let filePath = path.join(COLLECTION_DIR, file);
    let contents = fs.readFileSync(filePath).toString();
    for (let i = 0; i < contents.length; ++i) {
        for (let j = 1; i + j <= contents.length && j <= KEYWORD_LENGTH; ++j) {
            let keyword = contents.substring(i, i + j);
            if (articleKeywords[keyword] === undefined) {
                articleKeywords[keyword] = 0;
            }
            ++articleKeywords[keyword];
        }
    }

    fs.writeFileSync(`${filePath}.keywords.json`, JSON.stringify(articleKeywords));
    ++filesRan;
    if (filesRan >= TOTAL_FILES) {
        break;
    }
}