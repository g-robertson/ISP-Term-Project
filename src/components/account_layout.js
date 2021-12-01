import React from "react"
import { Link } from 'gatsby'
import Layout from '../components/default_layout'
import {
	heading,
	inputBox,
	articleLink,
	kanjiEntry,
	caret,
	flexer,
	articleDetails
} from '../components/layout.module.css'

export function toggleEntry(id) {
	let item = document.getElementById(id)
	let itemDetails = item.querySelector("#details");
	if (itemDetails.style.display === 'none') {
		itemDetails.style.display = 'block';
		item.querySelector("#caret").textContent = "▲"
	} else {
		itemDetails.style.display = 'none';
		item.querySelector("#caret").textContent = "▼"
	}
}

export default function accountLayout({
  user, kanjiEntries, children
}) {
  return (
    <Layout>
        <div id="login">
            <h1 className={heading}>
                Login
            </h1>
            <div className={inputBox}>
                <p>Username: </p>
                <input type="text" name="username"/>
            </div>
            <div className={inputBox}>
                <p>Password: </p>
                <input type="password" name="password"/>
            </div>
        </div>
        <div id="accountContent">
            <h1 className={heading}>
                Welcome, {user}!<br />
                Kanji You've Seen:
            </h1>
            {
                kanjiEntries.map(currentEntry => (
                    <div id={currentEntry.kanji} onClick={() => toggleEntry(currentEntry.kanji)}>
                        <div className={kanjiEntry}>
                            <p>
                                {currentEntry.kanji}
                            </p>
                            <span className={flexer}>
                                <p>
                                    {currentEntry.count.toString() + " Times"}
                                </p>
                                <p id="caret" className={caret}>
                                    ▼
                                </p>
                            </span>
                        </div>
                        <div id="details" style={{display:'none'}}>
                            {
                                currentEntry.articles.map(articleEntry => (
                                    <div className={articleDetails}>
                                        <p>
                                            {articleEntry.checkedDate}
                                        </p>
                                        <p>
                                            <Link to={articleEntry.articleLink.toString()} className={articleLink}>
                                                {articleEntry.articleLink.toString()}
                                            </Link>
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
        {children}
    </Layout>
  )
}