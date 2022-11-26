import * as React from 'react'
import Layout, { dateToPath } from '../components/default_layout'

export { Head } from "../components/default_layout"

const SearchResult = ({ article }) => (
    <li>
        <a href={`/${dateToPath(new Date(article.publish_date))}`}>{
            (() => {
                // if there's no occurrence of keyword in article, it must be in title, so bold all occurrences in title
                if (article.first_occurrence_in_article === undefined) {
                    let query = new URLSearchParams(window.location.search).get("q");
                    let titleParts = article.title.split(query);
                    for (let i = 0; i < titleParts.length - 1; ++i) {
                        titleParts[i] = (
                            <>{titleParts[i]}<b>{query}</b></>
                        );
                    }
                    titleParts[titleParts.length - 1] = (
                        <>{titleParts[titleParts.length - 1]}</>
                    );
                    return titleParts;
                // if there is occurrence of keyword in article, bold that instead
                } else {
                    return article.title;
                }
            })()
        }</a>
        <p>{
            (() => {
                // if there's no occurrence of keyword in article, just send back the first 30 non-ascii characters
                if (article.first_occurrence_in_article === undefined) {
                    // this regex solution sometimes cuts off really early if a tag is immediately following because it cannot parse it 
                    // TODO: proper solution would involve some form of skipping over tags properly, or storing a non-tag set of data
                    // hack solution, only works assuming that there aren't 20 character long numeric expressions in a tag
                    // assumes the text that we want isn't in ascii (it isn't for our very specific use case)
                    let nonASCII = article.content.match(/([^\x00-\xFF]|[0-9]){20,}/)[0];
                    console.log(article, nonASCII);
                    return nonASCII.substring(0, 30);
                // if there is occurrence of keyword in article, send back 30 characters starting at the occurrence, then bold all occurrences
                } else {
                    let content = article.content.substring(article.first_occurrence_in_article, article.first_occurrence_in_article + 30);
                    content = content.match(/([^\x00-\xFF]|[0-9])+/)[0];
                    let query = new URLSearchParams(window.location.search).get("q");
                    let contentParts = content.split(query);
                    for (let i = 0; i < contentParts.length - 1; ++i) {
                        contentParts[i] = (
                            <>{contentParts[i]}<b>{query}</b></>
                        );
                    }
                    contentParts[contentParts.length - 1] = (
                        <>{contentParts[contentParts.length - 1]}</>
                    )
                    return contentParts;
                }
            })()
        }</p>
    </li>
);

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {articles: []};
    }

    componentDidMount() {
        (async () => {
            let results = await fetch("/api/query", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: new URLSearchParams(window.location.search).get("q")
                })
            });
            let res = await results.json();
            this.setState({articles: res});
        })();
    }

    render() {
        return <Layout>{this.state.articles.map(article => (
            <SearchResult article={article}></SearchResult>
        ))}</Layout>
    }
}

export default SearchPage;