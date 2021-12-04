import {CONFIG} from "../config.js";
import {promisify} from "util";

export function articleFromDate(date) {
    let fullYear = date.getFullYear().toString();
    let fullMonth = (date.getMonth() + 1).toString();
    if (fullMonth.length < 2) fullMonth = "0" + fullMonth;
    let fullDate = date.getDate().toString();
    if (fullDate.length < 2) fullDate = "0" + fullDate;
    return `https://nhkeasier.com/${fullYear}/${fullMonth}/${fullDate}`;
}

export function articleIdFromDateAndArtNumber(date, artnumber) {
    let fullYear = date.getFullYear().toString();
    let fullMonth = (date.getMonth() + 1).toString();
    if (fullMonth.length < 2) fullMonth = "0" + fullMonth;
    let fullDate = date.getDate().toString();
    if (fullDate.length < 2) fullDate = "0" + fullDate;
    let fullArtNumber = artnumber.toString();
    if (fullArtNumber.length < 2) fullArtNumber = "0" + fullArtNumber;
    let articleId = parseInt(`${fullYear}${fullMonth}${fullDate}${fullArtNumber}`);
    return articleId;
}

export function dateAndArtNumberFromArticleId(articleId) {
    let date = `${Math.floor(articleId / 1000000)}/${Math.floor((articleId / 10000) % 100)}/${Math.floor((articleId / 100) % 100)}`;
    let artnumber = Math.floor(articleId % 100);
    return {date: new Date(date).valueOf(), artnumber: artnumber};
}

export async function createArticleInDB(articleId) {
    const aquery = promisify(CONFIG.CONN.query).bind(CONFIG.CONN);
    await aquery(`USE ${CONFIG.DB}`);

    let articles = await aquery(`SELECT * FROM Articles WHERE Id=?`, articleId);
    if (articles.length !== 0) {
        return;
    }
    await aquery(`INSERT INTO Articles VALUES (?)`, articleId);
}