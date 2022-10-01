import React from "react"
import { Link } from 'gatsby'
import Layout from '../components/default_layout'
import {
	heading,
	inputBox,
	articleDetails,
    headsUp,
    loginButton,
    errorMsg
} from '../components/layout.module.css'

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
  

function greetUser(username, url) {
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("login").remove();
    document.getElementById("userGreeting").textContent = "Welcome, " + username + "!\nArticles You've Read:";
    fetch("http://" + url.hostname + ":" + url.port + "/api/getuserreadarticles?name=" + username).then(async response => {
        const articles = await response.json();
        let contentTitle = document.getElementById("accountContent");
        contentTitle.innerHTML = 
            "<p style='font-weight: bold;'>Date Article Clicked:</p><p style='font-weight: bold;'>Date Article Posted:</p>";
        articles.map(article => {
            let articleClick = getFormattedDate(new Date(article.timestamp));
            let articleDate = getFormattedDate(new Date(article.date));
            let entry = contentTitle.cloneNode(true);
            entry.innerHTML = `<p>${articleClick}</p>
                <p>
                    <a href="/?date=${article.date}&artnumber=${article.artnumber}">
                        ${articleDate}/${article.artnumber}
                    </a>
                </p>`;
            insertAfter(contentTitle, entry);
        })
    });
}

export function submitLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let url = new URL(window.location.href);
    fetch(
        "http://" + url.hostname + ":" + url.port + "/api/getuserinfo",
        {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
        }
    ).then(async response => {
        const userInfo = await response.json();
        if (userInfo.name && username === "" && password === "") {
            greetUser(userInfo.name, url);
        } else {
                fetch("http://" + url.hostname + ":" + url.port + "/api/login?name=" + username + "&password=" + password).then(async response => {
                const msg = await response.text();
                if (msg === "User successfully logged in") {
                    greetUser(username, url);
                }
                else {
                    document.getElementById("errorMessage").textContent = msg;
                }
            });
        }
    })
}
    

export default function accountLayout({
  children
}) {
  return (
    <Layout>
        <div id="login">
        <p className={headsUp}>If you've already logged-in once this session, just press "Submit" with both fields empty.</p>
            <h1 className={heading}>
                Login
            </h1>
            <div className={inputBox}>
                <p>Username: </p>
                <input type="text" name="username" id="username"/>
            </div>
            <div className={inputBox}>
                <p>Password: </p>
                <input type="password" name="password" id="password"/>
            </div>
            <button className={loginButton} type="button" onClick={() => submitLogin()}>Submit</button>
        </div>
        <p id="errorMessage" className={errorMsg}></p>
        <h1 id="userGreeting" className={heading}>
        </h1>
        <div id="accountContent" className={articleDetails}>
        </div>
        {children}
    </Layout>
  )
}