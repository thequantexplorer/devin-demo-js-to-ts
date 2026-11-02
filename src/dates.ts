const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns a copy of `date` set to 00:00:00.000 UTC on the same UTC day.
 */
export function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Adds whole calendar days (UTC). Negative values go back in time.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Adds calendar months (UTC). If the target month is shorter, the day is
 * clamped to its last day: Jan 31 + 1 month = Feb 28 (or 29).
 */
export function addMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(date.getUTCDate(), lastDay);
  const result = new Date(date.getTime());
  result.setUTCFullYear(year, month, day);
  return result;
}

/**
 * Whole UTC days from `from` to `to` (negative if `to` is earlier).
 */
export function diffDays(from: Date, to: Date): number {
  return Math.round((startOfDayUTC(to).getTime() - startOfDayUTC(from).getTime()) / MS_PER_DAY);
}

/**
 * Formats a date as YYYY-MM-DD (UTC).
 */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Parses YYYY-MM-DD as midnight UTC.
 */
export function parseISODate(text: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) {
    throw new RangeError(`Expected YYYY-MM-DD, got "${text}"`);
  }
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (toISODate(date) !== text) {
    throw new RangeError(`Not a real calendar date: "${text}"`);
  }
  return date;
}
