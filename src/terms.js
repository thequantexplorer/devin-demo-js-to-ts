import { addDays, startOfDayUTC } from './dates.js';
import { nextBusinessDay } from './business-days.js';

/**
 * Payment terms: a number of days (30), a "net" string ("net30", "NET 45"),
 * or "due_on_receipt".
 * @typedef {number | string} PaymentTerms
 */

/**
 * Works out when an invoice is due.
 * @param {Date} issued Invoice date.
 * @param {PaymentTerms} terms
 * @param {object} [options]
 * @param {string[]} [options.holidays] YYYY-MM-DD dates to skip.
 * @param {boolean} [options.rollToBusinessDay] Move a weekend/holiday due date to the next business day. Defaults to true.
 * @returns {Date}
 */
export function dueDate(issued, terms, options = {}) {
  const { holidays = [], rollToBusinessDay = true } = options;
  const start = startOfDayUTC(issued);

  /** @type {Date} */
  let due;
  if (typeof terms === 'number') {
    due = addDays(start, terms);
  } else if (terms.trim().toLowerCase() === 'due_on_receipt') {
    due = start;
  } else {
    const match = /^net\s*(\d+)$/i.exec(terms.trim());
    if (!match) {
      throw new RangeError(`Unknown payment terms: "${terms}"`);
    }
    due = addDays(start, match[1]);
  }

  return rollToBusinessDay ? nextBusinessDay(due, holidays) : due;
}
