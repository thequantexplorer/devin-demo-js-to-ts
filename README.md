# @acme/ledger-kit

Small date and money helpers used by Acme's invoicing services.

- **Money:** amounts are integer minor units (cents, yen), with half-even rounding, safe addition and splitting without losing a cent.
- **Dates:** UTC day math, month-end clamping, business days and holidays.
- **Payment terms:** `dueDate(issued, 30)`, `dueDate(issued, 'net30')`, `dueDate(issued, 'due_on_receipt')`.
- **Invoices:** `summarizeInvoice()` totals lines, adds tax and works out the due date.

The code is TypeScript (`strict`). `npm run build` compiles `src/` to `.js` and `.d.ts` files in `dist/`, which is what the package exports. It needs Node 22 or later.

```sh
npm ci
npm run typecheck     # type-checks src/ and test/
npm test              # Vitest suite
npm run build         # emits dist/ (.js + .d.ts)
npm run check:types   # compiles types-check/consumer.ts against dist/ the way a TypeScript app would
```

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
