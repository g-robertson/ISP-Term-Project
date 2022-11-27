import React from "react"
import Layout from '../components/default_layout'
import {
	heading,
    subheading,
    contentBox,
	inputBox,
	articleDetails,
    loginButton,
    errorMsg
} from '../components/layout.module.css'
export { Head } from "../components/default_layout"

function compareArticles(a, b) {
    return (
        a.date === b.date &&
        a.placement === b.placement &&
        a.read === b.read
    )
}

const ReadArticle = ({ article }) => (
    <div className={articleDetails}>
        <p>{article.read.split("T")[0]}</p>
        <p>
            <a href={`/${article.date.split("T")[0]}#${article.placement}`}>
                {article.date.split("T")[0]}#{article.placement}
            </a>
        </p>
    </div>
);

const KanjiStat = ({ stat }) => (
    <div className={articleDetails}>
        <p style={{width: '125px'}}>{stat.kanji}</p>
        <p style={{width: '125px'}}>{stat.count}</p>
        <p style={{width: '125px', textAlign: 'right'}}>{stat.first_seen.split("T")[0]}</p>
        <p style={{width: '125px', textAlign: 'right'}}>{stat.last_seen.split("T")[0]}</p>
    </div>
);

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {articles: []};
    }

    async submitLogin() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let result = await fetch("/api/login", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: username,
                password: password
            })
        })
        const msg = await result.json();
        if (msg === "Login successful") {
            this.setState({ state: this.state })
        }
        else {
            document.getElementById("errorMessage").textContent = msg;
        }
    }

    componentDidUpdate() {
        (async () => {
            let response = await fetch("/api/get-user-info", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });
            let userInfo = await response.json();
            if (typeof(userInfo) === 'object' && userInfo !== null) {
                let results = await fetch("/api/get-user-read-articles", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: userInfo.username
                    })
                });

                let result = await results.json();
                if (
                    this.state.last_updated_articles === undefined ||
                    result.length !== this.state.last_updated_articles.length || 
                    !result.every((val, idx) => compareArticles(val, this.state.last_updated_articles[idx]))
                ) {
                    let userStats = await fetch("/api/get-user-stats", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            name: userInfo.username
                        })
                    });

                    let stats = await userStats.json();
                    this.setState({
                        name: userInfo.username,
                        articles: result,
                        last_updated_articles: result,
                        kanji_stats: stats
                    });
                }
            }
        })();
    }

    componentDidMount() {
        this.setState({ state: this.state });
    }

    render() {
        if (Array.isArray(this.state.articles) && this.state.name !== undefined) {
            console.log(this.state.articles);
            return (
                <Layout>
                    <div className={contentBox}>
                        <h1 className={heading}>Welcome, {this.state.name}!<br/></h1>
                        <p className={subheading}>Article You've Read</p>
                        <div className={articleDetails}>
                            <p style={{fontWeight: 'bold'}}>Date Article Read:</p>
                            <p style={{fontWeight: 'bold'}}>Date Article Posted:</p>
                        </div>
                        {this.state.articles.map(article => (
                            <ReadArticle article={article}></ReadArticle>
                        ))}
                    </div>
                    <div className={contentBox}>
                        <p className={subheading}>Kanji You've Seen</p>
                        <div className={articleDetails}>
                            <p style={{fontWeight: 'bold', width: '125px'}}>Kanji:</p>
                            <p style={{fontWeight: 'bold', width: '125px'}}>Times Seen:</p>
                            <p style={{fontWeight: 'bold', width: '125px', textAlign: 'right'}}>First Seen:</p>
                            <p style={{fontWeight: 'bold', width: '125px', textAlign: 'right'}}>Last Seen:</p>
                        </div>
                        {this.state.kanji_stats.map(stat => (
                            <KanjiStat stat={stat}></KanjiStat>
                        ))}
                    </div>
                </Layout>
            )
        } else {
            return (
                <Layout>
                    <div id="login">
                        <h1 className={heading}>
                            Signup / Login
                        </h1>
                        <div className={inputBox}>
                            <p>Username: </p>
                            <input type="text" name="username" id="username"/>
                        </div>
                        <div className={inputBox}>
                            <p>Password: </p>
                            <input type="password" name="password" id="password"/>
                        </div>
                        <button className={loginButton} type="button" onClick={() => this.submitLogin()}>Submit</button>
                    </div>
                    <p id="errorMessage" className={errorMsg}></p>
                </Layout>
            )
        }
    }
}

export default AccountPage;