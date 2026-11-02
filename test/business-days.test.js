import { describe, it, expect } from 'vitest';
import { isWeekend, isBusinessDay, nextBusinessDay, addBusinessDays, parseISODate, toISODate } from '../src/index.js';

const d = (s) => parseISODate(s);

describe('business days', () => {
  it('knows weekends', () => {
    expect(isWeekend(d('2026-11-07'))).toBe(true); // Saturday
    expect(isWeekend(d('2026-11-09'))).toBe(false); // Monday
  });

  it('treats holidays as non-business days', () => {
    expect(isBusinessDay(d('2026-11-26'), ['2026-11-26'])).toBe(false);
    expect(isBusinessDay(d('2026-11-25'), ['2026-11-26'])).toBe(true);
  });

  it('rolls forward to the next business day', () => {
    expect(toISODate(nextBusinessDay(d('2026-11-07')))).toBe('2026-11-09');
    expect(toISODate(nextBusinessDay(d('2026-11-26'), ['2026-11-26', '2026-11-27']))).toBe('2026-11-30');
    expect(toISODate(nextBusinessDay(d('2026-11-10')))).toBe('2026-11-10');
  });

  it('adds business days', () => {
    expect(toISODate(addBusinessDays(d('2026-11-06'), 1))).toBe('2026-11-09');
    expect(toISODate(addBusinessDays(d('2026-11-24'), 3, ['2026-11-26']))).toBe('2026-11-30');
    expect(() => addBusinessDays(d('2026-11-06'), -1)).toThrow(RangeError);
  });
});
