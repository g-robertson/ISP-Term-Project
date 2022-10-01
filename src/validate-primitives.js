module.exports.validateClampedDate = function(date, lower, upper) {
    if (!(date instanceof Date) || date < lower || date > upper) {
        throw `Invalid date ${date} with regard to clamps [${lower}, ${upper}]`;
    }
}

module.exports.validateClampedNumber = function(number, lower, upper) {
    if (typeof(number) !== "number" || number < lower || number > higher) {
        throw `Invalid number ${number} with regard to clamps [${lower}, ${upper}]`;
    }
}