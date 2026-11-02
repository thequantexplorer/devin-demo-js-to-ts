import { multiply, add, type Money } from './money.js';

export interface TaxBreakdown {
  net: Money;
  tax: Money;
  gross: Money;
}

/**
 * Applies a percentage tax to a net amount.
 * @param ratePercent e.g. 8.25 for 8.25%.
 */
export function applyTax(net: Money, ratePercent: number): TaxBreakdown {
  if (ratePercent < 0) {
    throw new RangeError(`Tax rate cannot be negative: ${ratePercent}`);
  }
  const tax = multiply(net, ratePercent / 100);
  return { net, tax, gross: add(net, tax) };
}
