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
