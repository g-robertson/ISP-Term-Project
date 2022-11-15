import * as React from 'react'
import Layout, { dateToPath } from '../components/default_layout'

export { Head } from "../components/default_layout"

const SearchResult = ({ article }) => (
    <li>
        <a href={`/${dateToPath(new Date(article.publish_date))}`}>{article.title}</a>
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

            this.setState({articles: await results.json()});
        })();
    }

    render() {
        return <Layout>{this.state.articles.map(article => (
            <SearchResult article={article}></SearchResult>
        ))}</Layout>
    }
}

export default SearchPage;