# Devin demo: Convert a JavaScript project to TypeScript

**What it shows:** Devin moves a small JavaScript library to TypeScript with `strict` mode and no `any`. The tests still pass, the build ships `.d.ts` files, and the PR lists the real bug the new types found.

**Needs:** GitHub only

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-js-to-ts`. The links and prompt below assume that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.
3. Optional: see the problem for yourself. In your new repo, open the **Actions** tab, click **CI**, click **Run workflow**, then click the green **Run workflow** button. After about a minute, the **Tests** job passes and the **Types for TypeScript users** job fails with `TS7016: Could not find a declaration file for module '@acme/ledger-kit'`.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Convert https://github.com/<you>/devin-demo-js-to-ts from JavaScript to TypeScript.

The package ships no types today, so the "Types for TypeScript users" CI job fails (npm run check:types reports TS7016).

1. First run npm ci, npm test and npm run check:types, and note the results.
2. Rename every file in src/ to .ts. Turn the JSDoc types into real TypeScript types, and export the public types (Money, CurrencyCode, PaymentTerms, LineItem, InvoiceInput, InvoiceSummary and so on) from src/index.ts.
3. Add a tsconfig.json with "strict": true. Do not use any, explicit or implicit. Do not use @ts-ignore, @ts-expect-error or casts to silence errors in src/. Do not edit types-check/.
4. Make npm run build run tsc and emit .js and .d.ts files to dist/. Point "exports" in package.json at dist/, with a "types" condition.
5. Convert the tests to TypeScript and type-check them too. Every existing test must still pass with the same assertions.
6. If the compiler flags code that really behaves wrongly at runtime, do not hide it. Fix it in its own commit, with a new test that fails before the fix.

Open a PR and make sure both CI jobs are green. In the description, include: npm test and npm run check:types output before and after, the list of .d.ts files in dist/, and a "Bugs the types found" table (file and line, the compiler error, a concrete input with the wrong output it gave, the fix, the new test). If the types found no bugs, say so.
```
