// Helper functions

export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get the day of the year
export function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}