import React, { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import {
	container,
	content,
	date,
	heading,
	navbar,
	navContent,
	navLogo,
	navLinks,
	navLinkItem,
	navLinkText,
	calendar,
	mobileNav,
	drop
} from './layout.module.css'
import {
    articleTitle,
    articleTimestamp,
    articleContent,
    inputContainer
} from './article.module.css'
import DefaultLayout from "../components/default_layout"

export {Head} from "../components/default_layout"

export function toggleId(id, dis) {
		let item = document.getElementById(id);
		if (item.style.display === 'none') {
			item.style.display = dis;
		} else {
			item.style.display = 'none';
		}
}

export function updateDate() {
	let today = new Date();
	return <p>{today.getFullYear()}-{(today.getMonth()+1).toString().padStart(2, 0)}-{today.getDate().toString().padStart(2, 0)}</p>
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
          artnumber: thisBox.id.replace("input_", ""),
          state: thisBox.checked,
        })
      }
    );
}

const Layout = ( {pageContext: {day, articles, contents}} ) => {
	return (
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
					<div className={articleContent} dangerouslySetInnerHTML={{__html:parseContent(contents[article.placement - 1])}} />
					<div className={inputContainer}>
						<input id={"input_" + article.placement.toString()}
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
}

export default Layout
