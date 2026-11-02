import { describe, it, expect } from 'vitest';
import { money, fromMinor, toMajor, add, subtract, multiply, allocate, formatMoney, roundHalfEven, getCurrency } from '../src/index.js';

describe('money', () => {
  it('stores amounts as integer minor units', () => {
    expect(money(19.99, 'USD')).toEqual({ amount: 1999, currency: 'USD' });
    expect(money(500, 'jpy')).toEqual({ amount: 500, currency: 'JPY' });
  });

  it('rejects unsupported currencies', () => {
    expect(() => money(1, 'XYZ')).toThrow(RangeError);
    expect(() => getCurrency('BTC')).toThrow('Unsupported currency: BTC');
  });

  it('round-trips through major units', () => {
    expect(toMajor(fromMinor(123456, 'EUR'))).toBe(1234.56);
    expect(() => fromMinor(1.5, 'USD')).toThrow(RangeError);
  });

  it('adds and subtracts the same currency only', () => {
    const a = money(10, 'USD');
    const b = money(2.5, 'USD');
    expect(add(a, b, b)).toEqual({ amount: 1500, currency: 'USD' });
    expect(subtract(a, b)).toEqual({ amount: 750, currency: 'USD' });
    expect(() => add(a, money(1, 'EUR'))).toThrow('Currency mismatch: USD vs EUR');
  });

  it('multiplies with half-even rounding', () => {
    expect(multiply(fromMinor(5, 'USD'), 0.5)).toEqual({ amount: 2, currency: 'USD' });
    expect(multiply(fromMinor(7, 'USD'), 0.5)).toEqual({ amount: 4, currency: 'USD' });
    expect(roundHalfEven(2.5)).toBe(2);
    expect(roundHalfEven(3.5)).toBe(4);
    expect(roundHalfEven(-2.5)).toBe(-2);
    expect(roundHalfEven(1.2)).toBe(1);
  });

  it('allocates without losing a cent', () => {
    const parts = allocate(fromMinor(100, 'USD'), [1, 1, 1]);
    expect(parts.map((p) => p.amount)).toEqual([34, 33, 33]);
    expect(allocate(fromMinor(1000, 'USD'), [70, 30]).map((p) => p.amount)).toEqual([700, 300]);
    expect(() => allocate(fromMinor(1, 'USD'), [])).toThrow(RangeError);
  });

  it('formats for display', () => {
    expect(formatMoney(money(1234.5, 'USD'))).toBe('$1,234.50');
    expect(formatMoney(money(1234.5, 'USD'), 'en-GB')).toBe('US$1,234.50');
    expect(formatMoney(money(1500, 'JPY'), 'en-US')).toBe('¥1,500');
  });
});
