import React from "react"
import Layout from '../components/default_layout'
import {
	articleTitle,
  articleTimestamp,
  articleImage,
  articleText,
  inputContainer
} from './article.module.css'

export default function articleLayout({
  pages, children
}) {

  return (
    <Layout>
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
                src={"https://nhkeasier.com" + page.imgSrc}
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
              <input type="checkbox" />
              <p>Mark Article as Read</p>
            </div>
            {children}
          </div>
        ))}
    </Layout>
  )
}