import * as React from 'react'
import Layout, { dateToPath } from '../components/default_layout'

export { Head } from "../components/default_layout"

const SearchResult = ({ article }) => (
    <li>
        <a href={`/${dateToPath(new Date(article.publish_date))}#${article.placement}`}>{
            (() => {
                // if there's no occurrence of keyword in article, it must be in title, so bold all occurrences in title
                if (article.first_occurrence_in_article === undefined) {
                    let query = new URLSearchParams(window.location.search).get("q");
                    let titleParts = article.title_text.split(query);
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
                    return article.title_text;
                }
            })()
        }</a>
        <p>{
            (() => {
                // if there's no occurrence of keyword in article, just send back the first 30 non-ascii characters
                if (article.first_occurrence_in_article === undefined) {
                    return article.content_text.substring(0, 30);
                // if there is occurrence of keyword in article, send back context weighted centered around the occurrence, then bold all occurrences
                } else {
                    let query = new URLSearchParams(window.location.search).get("q");

                    let contextBegin = article.first_occurrence_in_article - 10;
                    let contextEnd = article.first_occurrence_in_article + query.length + 20;
                    // if context begin overshoots beginning of article, shift it back to the beginning of article
                    if (contextBegin < 0) {
                        let contextOffset = -contextBegin;
                        contextBegin += contextOffset;
                        contextEnd += contextOffset;
                    }
                    let content = article.content_text.substring(contextBegin, contextEnd);
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