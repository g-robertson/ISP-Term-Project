export function validateClampedDate(str, lower, upper) {
    let date = validateDate(str);
    if (date === undefined) {
        return undefined;
    }
    if (date < lower) {
        return lower;
    }
    if (date > upper) {
        return upper;
    }
    return date;
}

export function validateDate(str) {
    let date = new Date(validateNumber(str));
    if (isNaN(date.valueOf())) {
        return undefined;
    }
    return date;
}

export function validateClampedNumber(str, lower, upper) {
    let num = validateNumber(str);
    if (num === undefined) {
        return undefined;
    }
    if (num < lower) {
        return lower;
    }
    if (num > upper) {
        return upper;
    }
    return num;
}

export function validateNumber(str) {
    let num = Number(str);
    if (isNaN(num)) {
        return undefined;
    }
    return num;
}