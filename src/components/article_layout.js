import React from 'react';
import 'react-calendar/dist/Calendar.css';
import {
	heading
} from './layout.module.css';
import {
    articleTitle,
    articleTimestamp,
    articleContent,
    inputContainer
} from './article.module.css';
import DefaultLayout from "../components/default_layout";
export {Head} from "../components/default_layout";

export function toggleId(id, dis) {
		let item = document.getElementById(id);
		if (item.style.display === 'none') {
			item.style.display = dis;
		} else {
			item.style.display = 'none';
		}
}

function parseContent(content) {
    return content
      .replaceAll(`<img`,`<img alt="Article Image"`)
      .replaceAll(`src=">`, `src="`)
}

export function setArticleState(id) {
    let thisBox = document.getElementById(id);
    let url = new URL(window.location.href);
    fetch(
      "http://" + url.hostname + ":" + url.port + "/api/set-state-read-article",
      {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          date: window.location.pathname.substring(1),
          placement: thisBox.id.replace("input_", ""),
          state: thisBox.checked,
        })
      }
    );
}

const ArticleLayout = ( {pageContext: {day, articles}} ) => (
	<DefaultLayout>
		<title>{day}</title>
		<h1 className={heading}>{day}</h1>
        {articles.map(article => (
			<div id={article.placement}>
				<p className={articleTitle}>
					{article.title}
				</p>
				<p id="timestamp" className={articleTimestamp}>
					{article.publish_date}
				</p>
				<div className={articleContent} dangerouslySetInnerHTML={{__html:parseContent(article.content)}} />
				<div className={inputContainer}>
					<input id={`input_${article.placement}`}
					type="checkbox"
					class="articleCheckbox"
					onClick={(e) => setArticleState(e.target.id)}
					/>
					<p>Mark Article as Read</p>
				</div>
			</div>
		))}
	</DefaultLayout>
)

class ArticlePage extends React.Component {
	constructor(props) {
        super(props);
		this.articleResult = React.createRef();
    }

    componentDidMount() {
        (async () => {
            let response = await fetch("/api/get-user-info", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });
            let userInfo = await response.json();

			if (typeof(userInfo) === 'object' && userInfo !== null) {
				for (let i = 0; i < this.props.pageContext.articles.length; ++i) {
					let article = this.props.pageContext.articles[i];
					let results = await fetch("/api/get-state-read-article", {
						method: "POST",
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({
							date: new Date(article.publish_date),
							placement: article.placement
						})
					});

					let result = await results.json();
					if (typeof(result) === 'boolean') {
						const checkbox = document.getElementById(`input_${i+1}`);
						if (checkbox) {
							checkbox.checked = result;
						} else {
							this.observer = new MutationObserver(() => {
								const checkbox = document.getElementById(`input_${i+1}`);
								if (checkbox) {
									this.removeObserver();
									checkbox.checked = result;
								}
							});
							this.observer.observe(document, {subtree: true, childList: true});
						}
					}
				}
			}
        })();
	}

	componentWillUnmount = () => {
		this.removeObserver();
	}

	removeObserver = () => {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}

    render() {
        return (
			<ArticleLayout pageContext={this.props.pageContext}>
			</ArticleLayout>
		)
    }
}

export default ArticlePage;
