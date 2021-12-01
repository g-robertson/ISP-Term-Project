export function articleFromDate(date) {
    return `https://nhkeasier.com/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}