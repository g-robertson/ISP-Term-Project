import React from "react"
import Layout from '../components/default_layout'
import {
    articleTitle,
    articleTimestamp,
    articleImage,
    articleText,
    inputContainer
} from './article.module.css'

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

export default function articleLayout({
  articles
}) {

  return (
    <Layout>
        {articles?.map(article => (
          <div>
            <p className={articleTitle}>
              {article.title}
            </p>
            <p id="timestamp" className={articleTimestamp}>
              {article.publish_date}
            </p>
            <div className={inputContainer}>
              <input id={article.placement} 
                type="checkbox"
                class="articleCheckbox"
                onClick={(e) => setArticleState(e.target.id)}
              />
              <p>Mark Article as Read</p>
            </div>
            {children}
          </div>
        ))}
    </Layout>
  );
}