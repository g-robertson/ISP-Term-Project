import React, { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import Helmet from 'react-helmet'
import Calendar from 'react-calendar'
import { StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'
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
	const [value, onChange] = useState(new Date(day));

	return (
		<div>
			<Helmet>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP&display=swap" rel="stylesheet" />
			</Helmet>
			<div className={container}>
				<div className={navbar}>
					<div className={navContent}>
						<div className={navLogo}>
							<Link to="/">
								<StaticImage
									alt="JPEZ Logo"
									src="../images/jpez_logo.png"
									width={40}
								/>
							</Link>
						</div>
						<div id="curDate" className={date} onClick={() => toggleId("cal", "inline-block")}>
								{day}
						</div>
						<nav>
							<ul className={navLinks}>
								<li className={navLinkItem}>
									<Link to="/" className={navLinkText}>
										Home
									</Link>
								</li>
								<li className={navLinkItem}>
									<Link to="/account" className={navLinkText}>
										Account
									</Link>
								</li>
								<li className={navLinkItem}>
									<Link to="/about" className={navLinkText}>
										About
									</Link>
								</li>
							</ul>
						</nav>
						<nav className={mobileNav} onClick={() => toggleId("dropLinks", "inline-flex")}>
							<StaticImage
								alt="JPEZ Logo"
								src="../images/hamburg.png"
								width={40}
							/>
						</nav>
					</div>
				</div>
				<div id="cal" className={calendar} style={{display:'none'}}>
					<Calendar
						onChange={onChange}
						value={value}
						maxDate={new Date()}
						onClickDay={(date) => {
							window.location.assign(`/${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`);
						}}
					/>
				</div>
				<div id="dropLinks" className={drop} style={{display:'none'}}>
					<ul>
						<li>
							<Link to="/" className={navLinkText}>
								Home
							</Link>
						</li>
						<li>
							<Link to="/account" className={navLinkText}>
								Account
							</Link>
						</li>
						<li>
							<Link to="/about" className={navLinkText}>
								About
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className={content}>
				<title>{day}</title>
				<main>
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
				</main>
			</div>
		</div>
	)
}

export default Layout
