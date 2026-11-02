// What a TypeScript app sees when it imports @acme/ledger-kit.
// `npm run check:types` compiles this file with strict mode.
// Every `@ts-expect-error` line must really be an error. If the package's
// types are missing or loose (`any`), those lines stop being errors and the
// check fails.
import { addDays, dueDate, formatMoney, money, summarizeInvoice, type Money } from '@acme/ledger-kit';

const price: Money = money(19.99, 'USD');
const label: string = formatMoney(price);
const due: Date = dueDate(new Date('2026-01-15T00:00:00Z'), 'net30', { holidays: ['2026-02-16'] });

const summary = summarizeInvoice({
  number: 'INV-1',
  issued: due,
  terms: 30,
  lines: [{ description: 'Support plan', quantity: 2, unitPrice: price }],
});
const totalCents: number = summary.total.amount;
const dueText: string = summary.due;

// @ts-expect-error days must be a number
addDays(due, '30');

// @ts-expect-error formatMoney returns a string
const notANumber: number = formatMoney(price);

// @ts-expect-error a Money value needs a currency
const noCurrency: Money = { amount: 100 };

// @ts-expect-error lines must be LineItem objects
summarizeInvoice({ number: 'INV-2', issued: due, terms: 30, lines: ['Support plan'] });

export { label, totalCents, dueText, notANumber, noCurrency };
