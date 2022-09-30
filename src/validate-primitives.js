export function validateClampedDate(date, lower, upper) {
    if (!(date instanceof Date) || date < lower || date > upper) {
        throw `Invalid date ${date} with regard to clamps [${lower}, ${upper}]`;
    }
}

export function validateClampedNumber(number, lower, upper) {
    if (typeof(number) !== "number" || number < lower || number > higher) {
        throw `Invalid number ${number} with regard to clamps [${lower}, ${upper}]`;
    }
}