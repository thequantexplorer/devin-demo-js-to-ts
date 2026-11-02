import { add, fromMinor, multiply, type Money } from './money.js';
import { applyTax } from './tax.js';
import { dueDate, type PaymentTerms } from './terms.js';
import { toISODate } from './dates.js';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: Money;
}

export interface InvoiceInput {
  number: string;
  issued: Date;
  terms: PaymentTerms;
  lines: LineItem[];
  /** Defaults to 0. */
  taxRatePercent?: number | undefined;
  holidays?: readonly string[] | undefined;
}

export interface InvoiceSummary {
  number: string;
  /** YYYY-MM-DD */
  issued: string;
  /** YYYY-MM-DD */
  due: string;
  subtotal: Money;
  tax: Money;
  total: Money;
}

/**
 * Totals an invoice and works out its due date.
 */
export function summarizeInvoice(input: InvoiceInput): InvoiceSummary {
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
