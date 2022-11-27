module.exports.getFormattedDate = function(date) {
    return date.toISOString().substring(0, "0000-00-00".length);
}