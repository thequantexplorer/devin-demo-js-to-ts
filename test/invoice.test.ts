import { describe, it, expect } from 'vitest';
import { summarizeInvoice, money, parseISODate } from '../src/index.js';

describe('summarizeInvoice', () => {
  it('totals lines, adds tax and works out the due date', () => {
    const summary = summarizeInvoice({
      number: 'INV-1001',
      issued: parseISODate('2026-10-01'),
      terms: 14,
      taxRatePercent: 10,
      lines: [
        { description: 'Consulting', quantity: 3, unitPrice: money(150, 'USD') },
        { description: 'Hosting', quantity: 1, unitPrice: money(49.99, 'USD') },
      ],
    });
    expect(summary).toEqual({
      number: 'INV-1001',
      issued: '2026-10-01',
      due: '2026-10-15',
      subtotal: { amount: 49999, currency: 'USD' },
      tax: { amount: 5000, currency: 'USD' },
      total: { amount: 54999, currency: 'USD' },
    });
  });

  it('refuses an empty invoice', () => {
    expect(() =>
      summarizeInvoice({ number: 'INV-0', issued: parseISODate('2026-10-01'), terms: 30, lines: [] }),
    ).toThrow('has no lines');
  });

  it('refuses mixed currencies', () => {
    expect(() =>
      summarizeInvoice({
        number: 'INV-2',
        issued: parseISODate('2026-10-01'),
        terms: 30,
        lines: [
          { description: 'A', quantity: 1, unitPrice: money(1, 'USD') },
          { description: 'B', quantity: 1, unitPrice: money(1, 'EUR') },
        ],
      }),
    ).toThrow('Currency mismatch');
  });
});
