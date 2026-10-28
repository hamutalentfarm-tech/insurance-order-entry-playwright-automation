# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-001 | PROD-V01 | catalog shows the expected Whole Life products
- Location: tests\product-selection\product-selection.spec.ts:22:7

# Error details

```
Error: The response has no "status" field. Actual response body: <!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Products | Insurance Order Entry</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f6f8fb; }
        .page-shell { padding-top: 24px; padding-bottom: 48px; }
        .tf-card { border: 0; border-radius: 16px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06); }
        .step-link { text-decoration:none; }
        .small-label { font-size: .76rem; letter-spacing:.02em; text-transform:uppercase; color:#6c757d; }
        .status-pill { font-size:.75rem; }

        .tf-brand-logo {
            width: 42px;
            height: 42px;
            bo

expect(received).toBe(expected) // Object.is equality

Expected: "success"
Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=e4] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/dashboard
        - generic [aria-hidden] [ref=e5]: IO
        - generic [ref=e6]:
          - generic [ref=e7]: Insurance Order Entry Demo Platform
          - generic [ref=e8]: QA Automation Training App
      - generic [ref=e9]:
        - list [ref=e10]:
          - listitem [ref=e11]:
            - link "Dashboard" [ref=e12] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/dashboard
          - listitem [ref=e13]:
            - link "Applications" [ref=e14] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/applications
          - listitem [ref=e15]:
            - link "Products" [ref=e16] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/products
          - listitem [ref=e17]:
            - link "Support" [ref=e18] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/support
        - generic [ref=e19]:
          - link "Learner Agent 001" [ref=e20] [cursor=pointer]:
            - /url: http://35.244.49.205:8081/profile
          - button "Logout" [ref=e22] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e24]:
      - heading "Whole Life Product Catalog" [level=1] [ref=e25]
      - paragraph [ref=e26]: Use these products while configuring an insurance application.
    - generic [ref=e27]:
      - generic [ref=e30]:
        - generic [ref=e31]: WL_ELITE_LEGACY
        - heading "Elite Legacy Whole Life" [level=2] [ref=e32]
        - paragraph [ref=e33]: High-net-worth offering for estate planning and tax efficiency.
        - generic [ref=e34]:
          - term [ref=e35]: Age
          - definition [ref=e36]: 30 - 65
          - term [ref=e37]: Sum Assured
          - definition [ref=e38]: 500,000 - 5,000,000
          - term [ref=e39]: Rate / 1000
          - definition [ref=e40]: "6.1000"
        - link "View Details" [ref=e41] [cursor=pointer]:
          - /url: http://35.244.49.205:8081/products/3
      - generic [ref=e44]:
        - generic [ref=e45]: WL_FLEXI_PAY
        - heading "FlexiPay Whole Life" [level=2] [ref=e46]
        - paragraph [ref=e47]: Flexible premium payment options with adjustable premiums.
        - generic [ref=e48]:
          - term [ref=e49]: Age
          - definition [ref=e50]: 19 - 62
          - term [ref=e51]: Sum Assured
          - definition [ref=e52]: 100,000 - 1,200,000
          - term [ref=e53]: Rate / 1000
          - definition [ref=e54]: "5.1500"
        - link "View Details" [ref=e55] [cursor=pointer]:
          - /url: http://35.244.49.205:8081/products/4
      - generic [ref=e58]:
        - generic [ref=e59]: WL_SECURE_BASIC
        - heading "SecureLife Whole Life" [level=2] [ref=e60]
        - paragraph [ref=e61]: Basic lifelong coverage with fixed premium and guaranteed death benefit.
        - generic [ref=e62]:
          - term [ref=e63]: Age
          - definition [ref=e64]: 18 - 65
          - term [ref=e65]: Sum Assured
          - definition [ref=e66]: 100,000 - 1,000,000
          - term [ref=e67]: Rate / 1000
          - definition [ref=e68]: "4.7500"
        - link "View Details" [ref=e69] [cursor=pointer]:
          - /url: http://35.244.49.205:8081/products/1
      - generic [ref=e72]:
        - generic [ref=e73]: WL_WEALTH_BUILDER
        - heading "WealthBuilder Whole Life" [level=2] [ref=e74]
        - paragraph [ref=e75]: Growth and protection product with cash value accumulation.
        - generic [ref=e76]:
          - term [ref=e77]: Age
          - definition [ref=e78]: 21 - 60
          - term [ref=e79]: Sum Assured
          - definition [ref=e80]: 150,000 - 1,500,000
          - term [ref=e81]: Rate / 1000
          - definition [ref=e82]: "5.3500"
        - link "View Details" [ref=e83] [cursor=pointer]:
          - /url: http://35.244.49.205:8081/products/2
  - contentinfo [ref=e84]:
    - generic [ref=e85]:
      - generic [ref=e86]: TalentFarm QA Automation Lab
      - generic [ref=e87]: Insurance Order Entry Demo
```

# Test source

```ts
  1  | import { expect,test, type Page } from '@playwright/test';
  2  | import type { ApiResult } from './apiClient';
  3  | 
  4  | 
  5  | /** Flattens an API envelope ({message, errors:{field:[...]}}) into a list of strings. */
  6  | export function errorTexts(result: ApiResult): string[] {
  7  |   const out: string[] = [];
  8  |   const body = result.body;
  9  |   if (body && typeof body.message === 'string') out.push(body.message);
  10 |   const errors = body?.errors;
  11 |   if (Array.isArray(errors)) out.push(...errors.map(String));
  12 |   else if (errors && typeof errors === 'object') {
  13 |     for (const v of Object.values(errors as Record<string, unknown>)) {
  14 |       if (Array.isArray(v)) out.push(...v.map(String));
  15 |       else if (typeof v === 'string') out.push(v);
  16 |     }
  17 |   }
  18 |   return out;
  19 | }
  20 | /** Prints the real response and attaches it to the HTML report for this test. */
  21 | function showResponse(result: ApiResult): void {
  22 |   console.log(`[api] HTTP ${result.status} ${result.text.slice(0, 500)}`);
  23 |   try {
  24 |     void test.info().attach('api-response', { body: `HTTP ${result.status}\n${result.text}`, contentType: 'text/plain' });
  25 |   } catch {
  26 |     /* not inside a running test */
  27 |   }
  28 | }
  29 | 
  30 | export function expectApiSuccess(result: ApiResult, status = 200): void {
  31 |   showResponse(result);
  32 |   expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
> 33 |   expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
     |                                                                                                                         ^ Error: The response has no "status" field. Actual response body: <!doctype html>
  34 | }
  35 | 
  36 | export function expectApiError(result: ApiResult, status: number, pattern?: RegExp): void {
  37 |   showResponse(result);
  38 |   expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
  39 |   expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('error');
  40 |   if (pattern) {
  41 |     const texts = errorTexts(result).join(' | ');
  42 |     expect(texts, `error messages. Actual response body: ${result.text.slice(0, 800)}`).toMatch(pattern);
  43 |   }
  44 | }
  45 | 
  46 | /** Texts currently shown in the red validation alert (server-side validation on a form page). */
  47 | export async function alertTexts(page: Page): Promise<string[]> {
  48 |   const alert = page.getByTestId('validation-error-alert');
  49 |   if ((await alert.count()) === 0) return [];
  50 |   return (await alert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  51 | }
  52 | 
  53 | export async function expectAlertMatches(page: Page, pattern: RegExp): Promise<void> {
  54 |   const alert = page.getByTestId('validation-error-alert');
  55 |   await expect(alert, 'validation alert should be visible').toBeVisible();
  56 |   await expect(alert).toContainText(pattern);
  57 | }
  58 | 
  59 | export async function expectNoAlert(page: Page): Promise<void> {
  60 |   await expect(page.getByTestId('validation-error-alert')).toHaveCount(0);
  61 | }
  62 | 
  63 | /** True if some message in the list matches. Used where the app may report an error in more than one place. */
  64 | export function anyMatches(texts: string[], pattern: RegExp): boolean {
  65 |   return texts.some((t) => pattern.test(t));
  66 | }
  67 | 
```