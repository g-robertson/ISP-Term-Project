import fetch from "node-fetch";

class GetCache {
    _cache;

    constructor() {
        this._cache = {};
    }

    async get(page) {
        if (this._cache[page] === undefined) {
            let response = await fetch(page);
            if (response.status !== 200) {
                this._cache[page] = response.status;
            } else {
                this._cache[page] = await response.text();
            }
        }
        return this._cache[page];
    }
}

export const GET_CACHE = new GetCache();