# @acme/ledger-kit

Small date and money helpers used by Acme's invoicing services.

- **Money:** amounts are integer minor units (cents, yen), with half-even rounding, safe addition and splitting without losing a cent.
- **Dates:** UTC day math, month-end clamping, business days and holidays.
- **Payment terms:** `dueDate(issued, 30)`, `dueDate(issued, 'net30')`, `dueDate(issued, 'due_on_receipt')`.
- **Invoices:** `summarizeInvoice()` totals lines, adds tax and works out the due date.

The code is plain JavaScript with JSDoc comments. It needs Node 22 or later.

```sh
npm ci
npm test              # Vitest suite
npm run check:types   # compiles types-check/consumer.ts the way a TypeScript app would
```

## Known problem

Most of our services are TypeScript now, and they get no types from this package. CI's **Types for TypeScript users** job fails today:

```text
$ npm run check:types
types-check/consumer.ts(6,84): error TS7016: Could not find a declaration file for module '@acme/ledger-kit'. '.../src/index.js' implicitly has an 'any' type.
types-check/consumer.ts(21,1): error TS2578: Unused '@ts-expect-error' directive.
types-check/consumer.ts(24,1): error TS2578: Unused '@ts-expect-error' directive.
types-check/consumer.ts(27,1): error TS2578: Unused '@ts-expect-error' directive.
types-check/consumer.ts(30,1): error TS2578: Unused '@ts-expect-error' directive.
```

Without declarations, every import is `any`, so mistakes like `addDays(date, '30')` compile without a warning. The plan is to move the package itself to TypeScript with `strict` mode and ship `.d.ts` files from `dist/`.

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
