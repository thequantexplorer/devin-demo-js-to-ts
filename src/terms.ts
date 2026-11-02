import { addDays, startOfDayUTC } from './dates.js';
import { nextBusinessDay } from './business-days.js';

/**
 * Payment terms: a number of days (30), a "net" string ("net30", "NET 45"),
 * or "due_on_receipt".
 */
export type PaymentTerms = number | string;

export interface DueDateOptions {
  /** YYYY-MM-DD dates to skip. */
  holidays?: readonly string[] | undefined;
  /** Move a weekend/holiday due date to the next business day. Defaults to true. */
  rollToBusinessDay?: boolean | undefined;
}

/**
 * Works out when an invoice is due.
 * @param issued Invoice date.
 */
export function dueDate(issued: Date, terms: PaymentTerms, options: DueDateOptions = {}): Date {
  const { holidays = [], rollToBusinessDay = true } = options;
  const start = startOfDayUTC(issued);

  let due: Date;
  if (typeof terms === 'number') {
    due = addDays(start, terms);
  } else if (terms.trim().toLowerCase() === 'due_on_receipt') {
    due = start;
  } else {
    const match = /^net\s*(\d+)$/i.exec(terms.trim());
    if (!match) {
      throw new RangeError(`Unknown payment terms: "${terms}"`);
    }
    due = addDays(start, Number(match[1]));
  }

  return rollToBusinessDay ? nextBusinessDay(due, holidays) : due;
}
