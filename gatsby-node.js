const {insertArticles, insertArticlesKeywords} = require("./src/data-collection/collect-articles.js");
const {retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts} = require("./src/db/articles.js");
const {getFormattedDate} = require("./src/helpers/get-formatted-date");
const fs = require('fs');

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

exports.createPages = async function ({ actions }) {
    await insertArticles();
    await insertArticlesKeywords();
    const articles = await retrieveInsertedArticles();
    let articles_for_days = {};
    articles.forEach(article => {
        let day = getFormattedDate(article.publish_date);
        if (articles_for_days[day] === undefined) {
            articles_for_days[day] = [];
        }
        articles_for_days[day].push(article);
    });

    for (let day in articles_for_days) {
        // O(n) if array is already sorted, which it *should* usually be
        articles_for_days[day] = insertionSort(articles_for_days[day]);
        actions.createPage({
            path: `/${day}`,
            component: require.resolve("./src/components/article_layout.js"),
            context: {
                day: day,
                articles: articles_for_days[day]
            }
        });
    }
}