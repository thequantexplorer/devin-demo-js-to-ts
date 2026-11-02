import { getCurrency } from './currency.js';
import { roundHalfEven } from './rounding.js';

/**
 * An amount of money in integer minor units (cents for USD, yen for JPY).
 * @typedef {object} Money
 * @property {number} amount Integer number of minor units.
 * @property {import('./currency.js').CurrencyCode} currency
 */

/**
 * Builds a Money value from a decimal amount, e.g. money(19.99, 'USD').
 * @param {number} major Amount in major units (dollars, euros, yen).
 * @param {string} currency
 * @returns {Money}
 */
export function money(major, currency) {
  const info = getCurrency(currency);
  return { amount: roundHalfEven(major * 10 ** info.decimals), currency: info.code };
}

/**
 * Builds a Money value from integer minor units.
 * @param {number} amount
 * @param {string} currency
 * @returns {Money}
 */
export function fromMinor(amount, currency) {
  if (!Number.isInteger(amount)) {
    throw new RangeError(`Minor units must be an integer, got ${amount}`);
  }
  return { amount, currency: getCurrency(currency).code };
}

/**
 * Converts Money back to a decimal number of major units.
 * @param {Money} value
 * @returns {number}
 */
export function toMajor(value) {
  return value.amount / 10 ** getCurrency(value.currency).decimals;
}

/**
 * @param {Money} a
 * @param {Money} b
 */
function assertSameCurrency(a, b) {
  if (a.currency !== b.currency) {
    throw new TypeError(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

/**
 * Adds one or more Money values of the same currency.
 * @param {Money} first
 * @param {...Money} rest
 * @returns {Money}
 */
export function add(first, ...rest) {
  let amount = first.amount;
  for (const m of rest) {
    assertSameCurrency(first, m);
    amount += m.amount;
  }
  return { amount, currency: first.currency };
}

/**
 * @param {Money} a
 * @param {Money} b
 * @returns {Money}
 */
export function subtract(a, b) {
  assertSameCurrency(a, b);
  return { amount: a.amount - b.amount, currency: a.currency };
}

/**
 * Multiplies by a plain number (quantity, rate) and rounds half-even.
 * @param {Money} value
 * @param {number} factor
 * @returns {Money}
 */
export function multiply(value, factor) {
  return { amount: roundHalfEven(value.amount * factor), currency: value.currency };
}

/**
 * Splits Money into parts by weight without losing a cent. Leftover minor
 * units go to the earliest parts, one each.
 * @param {Money} value
 * @param {number[]} weights
 * @returns {Money[]}
 */
export function allocate(value, weights) {
  if (weights.length === 0) {
    throw new RangeError('allocate needs at least one weight');
  }
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    throw new RangeError('Weights must add up to more than zero');
  }
  const parts = weights.map((w) => Math.floor((value.amount * w) / total));
  let remainder = value.amount - parts.reduce((sum, p) => sum + p, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % parts.length) {
    parts[i] += 1;
    remainder -= 1;
  }
  return parts.map((amount) => ({ amount, currency: value.currency }));
}

/**
 * Formats Money for display, e.g. "$1,234.50".
 * @param {Money} value
 * @param {string} [locale] Defaults to the currency's usual locale.
 * @returns {string}
 */
export function formatMoney(value, locale) {
  const info = getCurrency(value.currency);
  return new Intl.NumberFormat(locale ?? info.locale, {
    style: 'currency',
    currency: info.code,
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(toMajor(value));
}
