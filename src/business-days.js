import { addDays, toISODate } from './dates.js';

/**
 * Saturday or Sunday, in UTC.
 * @param {Date} date
 * @returns {boolean}
 */
export function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

/**
 * True if the date is a weekday and not in `holidays`.
 * @param {Date} date
 * @param {string[]} [holidays] Dates as YYYY-MM-DD.
 * @returns {boolean}
 */
export function isBusinessDay(date, holidays = []) {
  return !isWeekend(date) && !holidays.includes(toISODate(date));
}

/**
 * Moves forward to the next business day, or returns the same day if it
 * already is one.
 * @param {Date} date
 * @param {string[]} [holidays]
 * @returns {Date}
 */
export function nextBusinessDay(date, holidays = []) {
  let current = date;
  while (!isBusinessDay(current, holidays)) {
    current = addDays(current, 1);
  }
  return current;
}

/**
 * Adds business days, skipping weekends and holidays.
 * @param {Date} date
 * @param {number} days Must be zero or more.
 * @param {string[]} [holidays]
 * @returns {Date}
 */
export function addBusinessDays(date, days, holidays = []) {
  if (days < 0 || !Number.isInteger(days)) {
    throw new RangeError(`days must be a whole number >= 0, got ${days}`);
  }
  let current = date;
  let remaining = days;
  while (remaining > 0) {
    current = addDays(current, 1);
    if (isBusinessDay(current, holidays)) {
      remaining -= 1;
    }
  }
  return current;
}
