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

const Layout = ({ children }) => {
	const [value, onChange] = useState(new Date());

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
								{updateDate()}
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
				<main>
					{children}
				</main>
			</div>
		</div>
	)
}

export default Layout
