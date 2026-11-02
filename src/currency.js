/**
 * @typedef {'USD' | 'EUR' | 'GBP' | 'JPY'} CurrencyCode
 */

/**
 * @typedef {object} CurrencyInfo
 * @property {CurrencyCode} code
 * @property {number} decimals Number of minor-unit digits (2 for cents, 0 for yen).
 * @property {string} locale Default locale used when formatting.
 */

/** @type {Record<CurrencyCode, CurrencyInfo>} */
const CURRENCIES = {
  USD: { code: 'USD', decimals: 2, locale: 'en-US' },
  EUR: { code: 'EUR', decimals: 2, locale: 'de-DE' },
  GBP: { code: 'GBP', decimals: 2, locale: 'en-GB' },
  JPY: { code: 'JPY', decimals: 0, locale: 'ja-JP' },
};

/**
 * Returns true if `code` is a currency this library supports.
 * @param {string} code
 * @returns {code is CurrencyCode}
 */
export function isCurrencyCode(code) {
  return Object.prototype.hasOwnProperty.call(CURRENCIES, code);
}

/**
 * Looks up a supported currency.
 * @param {string} code ISO 4217 code, e.g. "USD".
 * @returns {CurrencyInfo}
 */
export function getCurrency(code) {
  const upper = code.toUpperCase();
  if (!isCurrencyCode(upper)) {
    throw new RangeError(`Unsupported currency: ${code}`);
  }
  return CURRENCIES[upper];
}

/**
 * @returns {CurrencyCode[]}
 */
export function supportedCurrencies() {
  return /** @type {CurrencyCode[]} */ (Object.keys(CURRENCIES));
}
