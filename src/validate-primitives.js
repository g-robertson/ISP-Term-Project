module.exports.validateClampedDate = function(date, lower, upper) {
    if (!(date instanceof Date)) {
        try {
            parsedDate = new Date(date);
        } catch {
            `${date} is not a vaild date object.`;
        }
    }
    if (parsedDate < lower || parsedDate > upper) {
        throw `Invalid date ${date} with regard to clamps [${lower}, ${upper}]`;
    }
    return date;
}

module.exports.validateClampedNumber = function(number, lower, upper) {
    if (typeof(number) !== "number") {
            Number(number);
    }
    if (number === NaN || number < lower || number > upper) {
        throw `Invalid number ${number} with regard to clamps [${lower}, ${upper}]`;
    }
    return number;
}