import { addDays, toISODate } from './dates.js';

/**
 * Saturday or Sunday, in UTC.
 */
export function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

/**
 * True if the date is a weekday and not in `holidays`.
 * @param holidays Dates as YYYY-MM-DD.
 */
export function isBusinessDay(date: Date, holidays: readonly string[] = []): boolean {
  return !isWeekend(date) && !holidays.includes(toISODate(date));
}

/**
 * Moves forward to the next business day, or returns the same day if it
 * already is one.
 */
export function nextBusinessDay(date: Date, holidays: readonly string[] = []): Date {
  let current = date;
  while (!isBusinessDay(current, holidays)) {
    current = addDays(current, 1);
  }
  return current;
}

/**
 * Adds business days, skipping weekends and holidays.
 * @param days Must be zero or more.
 */
export function addBusinessDays(date: Date, days: number, holidays: readonly string[] = []): Date {
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
