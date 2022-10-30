module.exports.validateClampedDate = function(date, lower, upper) {
    if (!(date instanceof Date)) {
        try {
            parsedDate = new Date(date);
        } catch {
            return undefined;
        }
    }
    if (parsedDate < lower || parsedDate > upper) {
        return undefined;
    }
    return date;
}

module.exports.validateClampedNumber = function(number, lower, upper) {
    if (typeof(number) !== "number") {
        number = Number(number);
    }
    if (!Number.isFinite(number) || number < lower || number > upper) {
        return undefined;
    }
    return number;
}