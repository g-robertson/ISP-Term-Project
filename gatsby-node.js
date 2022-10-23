const {insertArticles, insertArticlesKeywords} = require("./src/data-collection/collect-articles.js");
const {retrieveInsertedArticles, retrieveArticle, retrieveArticlesKeywordsOfLengthCounts} = require("./src/db/articles.js");

function parseDate(date) {
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
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

exports.createPages = async function ({ actions }) {
    await insertArticles();
    await insertArticlesKeywords();
    const articles = await retrieveInsertedArticles();
    let articles_for_day = [];
    console.log(articles[0]);
    let current_date = parseDate(articles[0].publish_date);
    articles.forEach(article => {
        console.log(current_date);
        if (current_date != parseDate(article.publish_date)) {
            actions.createPage({
                path: `/${current_date}`,
                component: require.resolve(`./src/components/article_page.js`),
                context: {
                    articles: insertionSort(articles_for_day.reverse()),
                }
            })
            current_date = parseDate(article.publish_date);
            articles_for_day = [];
        }
        articles_for_day.push(article);
    });
}