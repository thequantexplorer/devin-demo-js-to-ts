import { describe, it, expect } from 'vitest';
import { addDays, addMonths, diffDays, startOfDayUTC, toISODate, parseISODate } from '../src/index.js';

const d = (s) => parseISODate(s);

describe('dates', () => {
  it('adds days across month and year ends', () => {
    expect(toISODate(addDays(d('2026-01-30'), 3))).toBe('2026-02-02');
    expect(toISODate(addDays(d('2026-12-31'), 1))).toBe('2027-01-01');
    expect(toISODate(addDays(d('2026-03-01'), -1))).toBe('2026-02-28');
  });

  it('clamps addMonths to the end of shorter months', () => {
    expect(toISODate(addMonths(d('2026-01-31'), 1))).toBe('2026-02-28');
    expect(toISODate(addMonths(d('2028-01-31'), 1))).toBe('2028-02-29');
    expect(toISODate(addMonths(d('2026-11-15'), 3))).toBe('2027-02-15');
  });

  it('counts whole days between dates', () => {
    expect(diffDays(d('2026-01-01'), d('2026-03-01'))).toBe(59);
    expect(diffDays(new Date('2026-05-02T23:00:00Z'), new Date('2026-05-03T01:00:00Z'))).toBe(1);
    expect(diffDays(d('2026-03-01'), d('2026-01-01'))).toBe(-59);
  });

  it('truncates to the start of the UTC day', () => {
    expect(startOfDayUTC(new Date('2026-07-04T18:30:00Z')).toISOString()).toBe('2026-07-04T00:00:00.000Z');
  });

  it('parses only real YYYY-MM-DD dates', () => {
    expect(parseISODate('2026-02-28').toISOString()).toBe('2026-02-28T00:00:00.000Z');
    expect(() => parseISODate('2026-02-30')).toThrow('Not a real calendar date');
    expect(() => parseISODate('02/28/2026')).toThrow(RangeError);
  });
});
