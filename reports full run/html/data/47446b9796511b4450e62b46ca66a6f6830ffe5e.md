# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-004 | PROD-V04 | face value above the maximum is rejected
- Location: tests\product-selection\product-selection.spec.ts:83:7

# Error details

```
Error: No option matching Guaranteed Return Whole Life. Options: Select product | Elite Legacy Whole Life | FlexiPay Whole Life | SecureLife Whole Life | WealthBuilder Whole Life
```

# Page snapshot

```yaml
- generic [active] [ref=f16e1]:
  - navigation [ref=f16e2]:
    - generic [ref=f16e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f16e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f16e5]: IO
        - generic [ref=f16e6]:
          - generic [ref=f16e7]: Insurance Order Entry Demo Platform
          - generic [ref=f16e8]: QA Automation Training App
      - generic [ref=f16e9]:
        - list [ref=f16e10]:
          - listitem [ref=f16e11]:
            - link "Dashboard" [ref=f16e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f16e13]:
            - link "Applications" [ref=f16e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f16e15]:
            - link "Products" [ref=f16e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f16e17]:
            - link "Support" [ref=f16e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f16e19]:
          - link "Learner Agent 002" [ref=f16e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f16e22] [cursor=pointer]
  - main [ref=f16e23]:
    - generic [ref=f16e25]:
      - link "← Back to KYC & Financial" [ref=f16e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/135/kyc-financial
      - link "Application Summary" [ref=f16e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/135
    - generic [ref=f16e28]:
      - generic [ref=f16e30]:
        - generic [ref=f16e31]: "Application #135"
        - heading "Product & Policy Configuration" [level=1] [ref=f16e32]
        - paragraph [ref=f16e33]: Select the product, sum assured, premium payment frequency, premium payment term, and coverage term.
      - generic [ref=f16e36]:
        - generic [ref=f16e37]:
          - generic [ref=f16e38]:
            - generic [ref=f16e39]: Product
            - combobox "Product" [ref=f16e40]:
              - option "Select product"
              - option "Elite Legacy Whole Life"
              - option "FlexiPay Whole Life" [selected]
              - option "SecureLife Whole Life"
              - option "WealthBuilder Whole Life"
            - generic [ref=f16e41]: "Allowed Sum Assured: $100,000.00 to $1,200,000.00"
          - generic [ref=f16e42]:
            - generic [ref=f16e43]: Sum Assured
            - spinbutton "Sum Assured" [ref=f16e44]: "1200000.00"
          - generic [ref=f16e45]:
            - generic [ref=f16e46]: Premium Payment Frequency
            - combobox "Premium Payment Frequency" [ref=f16e47]:
              - option "Monthly" [selected]
              - option "Quarterly"
              - option "Semi-Annual"
              - option "Annual"
          - generic [ref=f16e48]:
            - generic [ref=f16e49]: Premium Payment Term
            - combobox "Premium Payment Term" [ref=f16e50]:
              - option "Select term"
              - option "10 years"
              - option "15 years"
              - option "20 years" [selected]
              - option "25 years"
              - option "30 years"
          - generic [ref=f16e51]:
            - generic [ref=f16e52]: Coverage Term
            - combobox "Coverage Term" [ref=f16e53]:
              - option "Whole Life" [selected]
              - option "To Age 100"
        - generic [ref=f16e55]:
          - generic [ref=f16e56]: Estimated Total Modal Premium
          - generic [ref=f16e57]: $515.00
          - generic [ref=f16e58]: Estimated premium will be saved when you continue.
        - button "Save and Continue" [ref=f16e60] [cursor=pointer]
  - contentinfo [ref=f16e61]:
    - generic [ref=f16e62]:
      - generic [ref=f16e63]: TalentFarm QA Automation Lab
      - generic [ref=f16e64]: Insurance Order Entry Demo
```

# Test source

```ts
  1  | import type { Dialog, Locator, Page } from '@playwright/test';
  2  | 
  3  | /** "$1,234.56" -> 1234.56 */
  4  | export function parseMoney(text: string | null | undefined): number {
  5  |   const cleaned = (text ?? '').replace(/[^0-9.\-]/g, '');
  6  |   const n = Number(cleaned);
  7  |   if (Number.isNaN(n)) throw new Error(`Cannot parse money from "${text}"`);
  8  |   return n;
  9  | }
  10 | 
  11 | /** First integer in a text such as "Draft 3" -> 3 */
  12 | export function firstInt(text: string | null | undefined): number {
  13 |   const m = (text ?? '').match(/\d+/);
  14 |   if (!m) throw new Error(`No number in "${text}"`);
  15 |   return Number(m[0]);
  16 | }
  17 | 
  18 | export function applicationIdFromUrl(url: string): number {
  19 |   const m = url.match(/\/applications\/(\d+)/);
  20 |   if (!m) throw new Error(`No application id in URL ${url}`);
  21 |   return Number(m[1]);
  22 | }
  23 | 
  24 | /**
  25 |  * The forms use HTML "required" attributes, so the browser blocks blank submissions before the server sees them.
  26 |  * This switches browser validation off so server-side validation messages can be tested.
  27 |  */
  28 | export async function disableBrowserValidation(page: Page, formTestId: string): Promise<void> {
  29 |   await page.getByTestId(formTestId).evaluate((form) => {
  30 |     (form as HTMLFormElement).noValidate = true;
  31 |   });
  32 | }
  33 | 
  34 | /** True if the browser itself reports the field as invalid (e.g. required but empty). */
  35 | export async function isNativelyInvalid(field: Locator): Promise<boolean> {
  36 |   return field.evaluate((el) => !(el as HTMLInputElement).checkValidity());
  37 | }
  38 | 
  39 | /** Selects the first <option> whose text matches (the Product dropdown shows names, values are ids). */
  40 | export async function selectByText(select: Locator, pattern: RegExp | string): Promise<string> {
  41 |   const options = await select.locator('option').evaluateAll((els) =>
  42 |     els.map((e) => ({ value: (e as HTMLOptionElement).value, text: (e.textContent ?? '').trim() })),
  43 |   );
  44 |   const match = options.find((o) => (typeof pattern === 'string' ? o.text.includes(pattern) : pattern.test(o.text)));
> 45 |   if (!match) throw new Error(`No option matching ${pattern}. Options: ${options.map((o) => o.text).join(' | ')}`);
     |                     ^ Error: No option matching Guaranteed Return Whole Life. Options: Select product | Elite Legacy Whole Life | FlexiPay Whole Life | SecureLife Whole Life | WealthBuilder Whole Life
  46 |   await select.selectOption(match.value);
  47 |   return match.text;
  48 | }
  49 | 
  50 | export async function optionValues(select: Locator): Promise<string[]> {
  51 |   return select.locator('option').evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value));
  52 | }
  53 | 
  54 | /** Runs `action` while answering any browser alert()/confirm() dialogs; returns the dialog messages. */
  55 | export async function withDialogs(page: Page, action: () => Promise<void>, decision: 'accept' | 'dismiss' = 'accept'): Promise<string[]> {
  56 |   const messages: string[] = [];
  57 |   const handler = async (d: Dialog): Promise<void> => {
  58 |     messages.push(d.message());
  59 |     if (decision === 'accept') await d.accept();
  60 |     else await d.dismiss();
  61 |   };
  62 |   page.on('dialog', handler);
  63 |   try {
  64 |     await action();
  65 |   } finally {
  66 |     page.off('dialog', handler);
  67 |   }
  68 |   return messages;
  69 | }
  70 | 
  71 | export function range(n: number): number[] {
  72 |   return Array.from({ length: n }, (_, i) => i);
  73 | }
  74 | 
```