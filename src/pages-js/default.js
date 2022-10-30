async function xhrget(path) {
    if (typeof(path) !== "string") {
        throw "path must be a string";
    }
    
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.addEventListener("load", response => {
            resolve(response.target);
        });
        xhr.send();
    });
}

async function xhrpost(path, body = {}) {
    if (typeof(path) !== "string") {
        throw "path must be a string";
    }
    if (typeof(body) !== "object") {
        throw "Body must be of type object";
    }

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", path, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.addEventListener("load", response => {
            resolve(response.target);
        });
        xhr.send(JSON.stringify(body));
    });
} 

let __queryObject;
let QueryObject = () => {
    if (__queryObject !== undefined) {
        return __queryObject;
    }

    let url = window.location.href;
    let queryString = url.substring(url.indexOf("?") + 1);
    let queries = queryString.split("&");
    __queryObject = {};
    for (let query of queries) {
        let queryPair = query.split("=");
        let queryKey = decodeURIComponent(queryPair[0]).toLowerCase();
        let queryValue = decodeURIComponent(queryPair[1]);
        __queryObject[queryKey] = queryValue;
    }

    return __queryObject;
};

// Search bar
function search() {
    let searchUrl = `/search?q=${document.getElementById("searchTextbox").value}`;
    window.location.assign(searchUrl);
}

window.addEventListener("load", () => {
    document.getElementById("searchTextbox").addEventListener("keydown", e => {
        if (e.key === "Enter") {
            search();
        }
    });
    
    document.getElementById("searchButton").addEventListener("click", search);
});
