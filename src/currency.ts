export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyInfo {
  code: CurrencyCode;
  /** Number of minor-unit digits (2 for cents, 0 for yen). */
  decimals: number;
  /** Default locale used when formatting. */
  locale: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', decimals: 2, locale: 'en-US' },
  EUR: { code: 'EUR', decimals: 2, locale: 'de-DE' },
  GBP: { code: 'GBP', decimals: 2, locale: 'en-GB' },
  JPY: { code: 'JPY', decimals: 0, locale: 'ja-JP' },
};

/**
 * Returns true if `code` is a currency this library supports.
 */
export function isCurrencyCode(code: string): code is CurrencyCode {
  return Object.prototype.hasOwnProperty.call(CURRENCIES, code);
}

/**
 * Looks up a supported currency.
 * @param code ISO 4217 code, e.g. "USD".
 */
export function getCurrency(code: string): CurrencyInfo {
  const upper = code.toUpperCase();
  if (!isCurrencyCode(upper)) {
    throw new RangeError(`Unsupported currency: ${code}`);
  }
  return CURRENCIES[upper];
}

export function supportedCurrencies(): CurrencyCode[] {
  return Object.values(CURRENCIES).map((info) => info.code);
}
