import { add, fromMinor, multiply } from './money.js';
import { applyTax } from './tax.js';
import { dueDate } from './terms.js';
import { toISODate } from './dates.js';

/**
 * @typedef {import('./money.js').Money} Money
 * @typedef {import('./terms.js').PaymentTerms} PaymentTerms
 */

/**
 * @typedef {object} LineItem
 * @property {string} description
 * @property {number} quantity
 * @property {Money} unitPrice
 */

/**
 * @typedef {object} InvoiceInput
 * @property {string} number
 * @property {Date} issued
 * @property {PaymentTerms} terms
 * @property {LineItem[]} lines
 * @property {number} [taxRatePercent] Defaults to 0.
 * @property {string[]} [holidays]
 */

/**
 * @typedef {object} InvoiceSummary
 * @property {string} number
 * @property {string} issued YYYY-MM-DD
 * @property {string} due YYYY-MM-DD
 * @property {Money} subtotal
 * @property {Money} tax
 * @property {Money} total
 */

/**
 * Totals an invoice and works out its due date.
 * @param {InvoiceInput} input
 * @returns {InvoiceSummary}
 */
export function summarizeInvoice(input) {
  if (input.lines.length === 0) {
    throw new RangeError(`Invoice ${input.number} has no lines`);
  }
  const currency = input.lines[0].unitPrice.currency;
  const lineTotals = input.lines.map((line) => multiply(line.unitPrice, line.quantity));
  const subtotal = add(fromMinor(0, currency), ...lineTotals);
  const { tax, gross } = applyTax(subtotal, input.taxRatePercent ?? 0);
  const due = dueDate(input.issued, input.terms, { holidays: input.holidays });

  return {
    number: input.number,
    issued: toISODate(input.issued),
    due: toISODate(due),
    subtotal,
    tax,
    total: gross,
  };
}
