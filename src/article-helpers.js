import {CONFIG} from "../config.js";

export function articleFromDate(date) {
    return `https://nhkeasier.com/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function articleIdFromDate(date) {
    return ((date.getFullYear() - 2000) * 365) + (date.getMonth() * 30) + (date.getDate());
}

export async function createArticleInDB(articleId) {
    const aquery = promisify(CONFIG.CONN.query).bind(CONFIG.CONN);
    await aquery(`USE ${CONFIG.DB}`);

    await aquery(`INSERT INTO Articles VALUES (?)`, articleId);
}