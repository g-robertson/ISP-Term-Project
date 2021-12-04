import React from "react"
import Layout from '../components/default_layout'
import {
	articleTitle,
  articleTimestamp,
  articleImage,
  articleText,
  inputContainer
} from './article.module.css'

var idCounter = -1;

export function setSrc(src) {
  if (src.startsWith("http")) {
    return src;
  } else {
    return "https://nhkeasier.com" + src;
  }
}

export function setArticleState(id) {
  var thisBox = document.getElementById(`${id}`);
  thisBox.checked = (thisBox.checked === "checked" ? "unchecked" : "checked")
  let url = new URL(window.location.href);
  fetch(
    "http://" + url.hostname + ":" + url.port + "/api/setstatereadarticle",
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: url.search.split('&')[0].replace('?', ''),
        artnumber: id,
        state: (thisBox.checked === "checked" ? "true" : "false"),
      })
    }
  );
}

export function getArticleState(id) {
  let url = new URL(window.location.href);
  fetch(
    "http://" + url.hostname + ":" + url.port + "/api/getstatereadarticle",
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: url.search.split('&')[0].replace('?', ''),
        artnumber: id,
      })
    }
  ).then(response => {
    if (response === "true") {
      return "checked";
    } else {
      return "unchecked";
    }
  });
}

export function resetCounter() {
  idCounter = -1;
}

export default function articleLayout({
  pages, children
}) {

  return (
    <Layout>
      {resetCounter()}
        {pages.map(page => (
          <div>
            <p className={articleTitle}>
              {page.titleText}
            </p>
            <p id="timestamp" className={articleTimestamp}>
              {page.timestampText}
            </p>
            <div>
              <img
                alt="Article Image"
                src={setSrc(page.imgSrc)}
                className={articleImage}
              />
            </div>
            <div>
              {
                page.bodyText.map(txt => (
                  <p
                    className={articleText}
                    key={txt}
                  >
                    {txt}
                  </p>
                ))
              }
            </div>
            <div className={inputContainer}>
              <input id={++idCounter} type="checkbox" checked={() => getArticleState(idCounter)} onClick={() => setArticleState(idCounter)}/>
              <p>Mark Article as Read</p>
            </div>
            {children}
          </div>
        ))}
    </Layout>
  )
}