import {CONFIG} from "../config.js";

export function articleFromDate(date) {
    let fullYear = date.getFullYear().toString();
    let fullMonth = date.getMonth().toString();
    if (fullMonth.length < 2) fullMonth = "0" + fullMonth;
    let fullDate = date.getDate().toString();
    if (fullDate.length < 2) fullDate = "0" + fullDate;
    return `https://nhkeasier.com/${fullYear}/${fullMonth}/${fullDate}`;
}

export function articleIdFromDateAndArtNumber(date, artnumber) {
    // heavily bodged together, each day can only have 8 articles (should be enough)
    if (artnumber > 8) artnumber = 8;
    if (artnumber < 0) artnumber = 0;
    let articleId = ((date.getFullYear() - 2000) * 12 * 31 * 9) + (date.getMonth() * 31 * 9) + (date.getDate() * 9) + artnumber;
    if (articleId < 0) articleId = 0;
    if (articleId > 65535) articleId = 65535;
    return articleId;
}

export async function createArticleInDB(articleId) {
    const aquery = promisify(CONFIG.CONN.query).bind(CONFIG.CONN);
    await aquery(`USE ${CONFIG.DB}`);

    await aquery(`INSERT INTO Articles VALUES (?)`, articleId);
}