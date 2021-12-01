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
  title, timestamp, img, text, children
}) {
  return (
    <Layout>
        <p className={articleTitle}>
          {title}
        </p>
        <p className={articleTimestamp}>
          {timestamp}
        </p>
        <div>
          <img
            alt="Article Image"
            src={"https://nhkeasier.com" + img}
            className={articleImage}
          />
        </div>
        {
          text.map( txt  => (
            <p
              className={articleText}
              key={txt}
            >
              {txt}
            </p>
          ))
        }
        <div className={inputContainer}>
          <input type="checkbox" />
          <p>Mark Article as Read</p>
        </div>
        {children}
    </Layout>
  )
}