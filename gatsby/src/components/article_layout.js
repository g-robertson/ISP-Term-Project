import React from "react"
import Layout from '../components/default_layout'
import { StaticImage, GatsbyImage } from 'gatsby-plugin-image'
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
          <StaticImage
            alt="Article Image"
            src="../images/article_img.jpg"
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