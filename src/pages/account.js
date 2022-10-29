import React from "react"
import DefaultLayout from '../components/default_layout'
import {
	heading,
	inputBox,
	articleDetails,
    headsUp,
    loginButton,
    errorMsg
} from '../components/layout.module.css'

export { Head } from "../components/default_layout"

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
    document.getElementById("userGreeting").innerHTML = "Welcome, " + username + "!<br/>Articles You've Read:";
    fetch("http://" + url.hostname + ":" + url.port + "/api/get-user-read-articles?name=" + username).then(async response => {
        const articles = await response.json();
        console.log(articles);
        let contentTitle = document.getElementById("accountContent");
        contentTitle.innerHTML = 
            "<p style='font-weight: bold;'>Date Article Read:</p><p style='font-weight: bold;'>Date Article Posted:</p>";
        articles.map(article => {
            console.log(article);
            let articleRead = getFormattedDate(new Date(article.read));
            let articleDate = getFormattedDate(new Date(article.date));
            let entry = contentTitle.cloneNode(true);
            entry.innerHTML = `<p>${articleRead}</p>
                <p>
                    <a href="/${article.date.split("T")[0]}#${article.articleNumber}">
                        ${articleDate}/${article.articleNumber}
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
        "http://" + url.hostname + ":" + url.port + "/api/get-user-info",
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
    

const AccountPage = () => (
    <DefaultLayout>
        <div id="login">
        <p className={headsUp}>If you've already logged-in once this session, just press "Submit" with both fields empty.</p>
            <h1 className={heading}>
                Signup / Login
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
    </DefaultLayout>
)
export default AccountPage;