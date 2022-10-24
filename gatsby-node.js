const {insertArticles, insertArticlesKeywords} = require("./src/data-collection/collect-articles.js");
const {retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts} = require("./src/db/articles.js");
const fs = require('fs'); 

function parseDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
}

function insertionSort(arr) {
    for (let i = 0; i < arr.length; ++i) {
        let j = i;
        while (j > 0 && arr[j-1].placement > arr[j].placement) {
            let k = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = k;
            j -= 1;
        }
    }
    return arr;
}

function retrieveContent(content_path) {
    let file_content = fs.readFileSync(`./scraped/${content_path}`);
    return file_content.toString().split(/:[0-9][0-9],/).pop();
}

exports.createPages = async function ({ actions }) {
    await insertArticles();
    await insertArticlesKeywords();
    const articles = await retrieveInsertedArticles();
    let articles_for_day = [];
    let current_date = parseDate(articles[0].publish_date);
    articles.forEach(article => {
        if (current_date != parseDate(article.publish_date)) {
            sorted_articles = insertionSort(articles_for_day);
            actions.createPage({
                path: `/${current_date}`,
                component: require.resolve(`./src/components/article_layout.js`),
                context: {
                    day: `${current_date}`,
                    articles: sorted_articles,
                    contents: sorted_articles.map(x => retrieveContent(x.content_path)),
                }
            })
            current_date = parseDate(article.publish_date);
            articles_for_day = [];
        }
        articles_for_day.push(article);
    });
}