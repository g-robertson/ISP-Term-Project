import React, { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import Helmet from 'react-helmet'
import Calendar from 'react-calendar'
import { StaticImage } from 'gatsby-plugin-image'
import { Link, useStaticQuery, graphql } from 'gatsby'
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
import {CONFIG} from "../../../config.js"


export function toggleId(id, dis) {
		let item = document.getElementById(id);
		if (item.style.display === 'none') {
			item.style.display = dis;
		} else {
			item.style.display = 'none';
		}
}

const Layout = ({ pageTitle, children }) => {
	const [value, onChange] = useState(new Date());

	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
				}
			}
		}
	`)
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
							<p>11/28/21</p>
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
						onClickDay={(value) => {window.location.assign(`${CONFIG.HTTP.host}/${CONFIG.HTTP.port}/` + (value.toISOString().substring(0,10)))}}
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
				<title>{pageTitle} | {data.site.siteMetadata.title}</title>
				<main>
					<h1 className={heading}>{pageTitle}</h1>
					{children}
				</main>
			</div>
		</div>
	)
}

export default Layout
