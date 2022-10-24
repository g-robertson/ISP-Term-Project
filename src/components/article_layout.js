import React from "react"
import Layout from './default_layout'
import {
    articleTitle,
    articleTimestamp,
    articleContent,
    inputContainer
} from './article.module.css'

function parseContent(content) {
  return content
    .replaceAll(`<img`,`<img alt="Article Image"`)
    .replaceAll(`src=">`, `src="`)
}

export function setArticleState(id) {
  let thisBox = document.getElementById(id);
  let url = new URL(window.location.href);
  fetch(
    "http://" + url.hostname + ":" + url.port + "/api/setstatereadarticle",
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: url.search.split('&')[0].replace('?date=', ''),
        artnumber: thisBox.id,
        state: thisBox.checked,
      })
    }
  );
}

export default ({pageContext: {articles, contents}}) => (
  <Layout>
      {articles.map(article => (
        <div>
          <p className={articleTitle}>
            {article.title}
          </p>
          <p id="timestamp" className={articleTimestamp}>
            {article.publish_date}
          </p>
          <div className={articleContent} dangerouslySetInnerHTML={{__html:parseContent(contents[article.placement - 1])}} />
          <div className={inputContainer}>
            <input id={article.placement}
              type="checkbox"
              class="articleCheckbox"
              onClick={(e) => setArticleState(e.target.id)}
            />
            <p>Mark Article as Read</p>
          </div>
        </div>
      ))}
  </Layout>
);
