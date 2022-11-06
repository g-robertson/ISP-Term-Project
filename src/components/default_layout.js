import React from 'react'
import 'react-calendar/dist/Calendar.css'
import Calendar from 'react-calendar'
import { StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'
import {
	container,
	content,
	date,
	navbar,
	navContent,
	navLogo,
	navLinks,
	navLinkItem,
	navLinkSearch,
	navLinkSearchBox,
	navLinkSearchButton,
	navLinkDropSearch,
	navLinkDropSearchBox,
	navLinkText,
	calendar,
	mobileNav,
	searchBar,
	drop
} from './layout.module.css'
import searchIcon from '../images/search.png'
import searchIconAlt from '../images/search_black.png'

export function toggleId(id, dis) {
	let item = document.getElementById(id);
	if (item.style.display === 'none') {
		item.style.display = dis;
	} else {
		item.style.display = 'none';
	}
}

export function dateToPath(date) {
    return `${date.toISOString().slice(0, "2000-00-00".length)}`;
}

export function updateDate() {
	return <p>{dateToPath(new Date())}</p>
}

export function search(clickedId) {
	if (clickedId === "searchButton" || clickedId === "searchTextbox") {
		if (window.getComputedStyle(document.getElementById("navSearch")).visibility === 'hidden') {
			const bar = document.getElementById("searchBarAlt");
			const inputBar = document.getElementById("searchTextboxAlt");
			const inputButton = document.getElementById("searchButtonAlt");
			if (window.getComputedStyle(bar).display === 'none') {
				bar.style.display = 'flex';
				inputBar.style.display = 'flex';
				inputButton.style.display = 'flex';
			} else {
				bar.style.display = 'none';
				inputBar.style.display = 'none';
				inputButton.style.display = 'none';
			}
		} else {
			let searchUrl = `/search?q=${document.getElementById("searchTextbox").value}`;
			window.location.assign(searchUrl);
		}
	} else if (clickedId === "searchButtonAlt" || clickedId === "searchTextboxAlt") {
		let searchUrl = `/search?q=${document.getElementById("searchTextboxAlt").value}`;
		window.location.assign(searchUrl);
	} else {
		let searchUrl = `/search?q=${document.getElementById("searchTextboxDrop").value}`;
		window.location.assign(searchUrl);
	}
}

export const Head = ({ children }) => (
	<>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link href="https://fonts.googleapis.com/css2?family=Noto+Sans&amp;family=Noto+Sans+JP&amp;display=swap" rel="stylesheet" />
		{children}
	</>
);

const DefaultLayout = ({ children }) => (
	<div>
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
							<ul className={`${navLinkItem} ${navLinkSearch}`}>
								<li className={navLinkSearchBox} id="navSearch">
									<input className={navLinkText} id="searchTextbox" type="text" placeholder="Search..." defaultValue="" 
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												search(e.target.id);
											}
										}}
									/>
								</li>
								<li className={navLinkSearchButton}>
									<input id="searchButton" type="image" src={searchIcon} width="22" height="22" onClick={e => search(e.target.id)}/>
								</li>
							</ul>

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
					value={new Date()}
					maxDate={new Date()}
					onClickDay={(date) => {
						window.location.assign(`/${dateToPath(date)}`);
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
					<ul className={`${navLinkItem} ${navLinkDropSearch}`}>
						<li className={navLinkDropSearchBox} id="navSearchDrop">
							<input className={navLinkText} id="searchTextboxDrop" type="text" placeholder="Search..." defaultValue="" 
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										search(e.target.id);
									}
								}}
							/>
						</li>
						<li className={navLinkSearchButton}>
							<input id="searchButtonDrop" type="image" src={searchIcon} width="22" height="22" onClick={e => search(e.target.id)}/>
						</li>
					</ul>
				</ul>
			</div>
			<div className={searchBar} id="searchBarAlt">
				<input id="searchTextboxAlt" type="text" placeholder="Search..." defaultValue="" style={{height: '40px', width: '100%'}} 
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							search(e.target.id);
						}
					}}
				/>
				<input id="searchButtonAlt" type="image" src={searchIconAlt} style={{width: 22, height: 22}} onClick={e => search(e.target.id)}/>
			</div>
		</div>
		<div className={content}>
			<main>
				{children}
			</main>
		</div>
	</div>
)
export default DefaultLayout;
