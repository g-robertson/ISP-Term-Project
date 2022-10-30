(async function() {
    console.log(await xhrpost("/api/query", {query: QueryObject().q}));
}());