import { describe, it, expect } from 'vitest';
import { dueDate, parseISODate, toISODate } from '../src/index.js';

const d = (s) => parseISODate(s);

describe('dueDate', () => {
  it('adds a number of days', () => {
    expect(toISODate(dueDate(d('2026-01-15'), 30))).toBe('2026-02-16'); // Feb 14 is a Saturday
    expect(toISODate(dueDate(d('2026-01-15'), 30, { rollToBusinessDay: false }))).toBe('2026-02-14');
  });

  it('is due the same day for due_on_receipt', () => {
    expect(toISODate(dueDate(new Date('2026-03-10T15:00:00Z'), 'due_on_receipt'))).toBe('2026-03-10');
  });

  it('skips holidays when rolling', () => {
    expect(toISODate(dueDate(d('2026-11-26'), 0, { holidays: ['2026-11-26'] }))).toBe('2026-11-27');
  });

  it('rejects unknown terms', () => {
    expect(() => dueDate(d('2026-01-15'), 'end of month')).toThrow('Unknown payment terms');
  });
});
