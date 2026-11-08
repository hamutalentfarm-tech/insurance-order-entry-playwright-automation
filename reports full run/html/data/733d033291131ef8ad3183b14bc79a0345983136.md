# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\api.spec.ts >> API >> TC-API-003 | API-V03 | client API rejects invalid dates of birth
- Location: tests\api\api.spec.ts:82:7

# Error details

```
Error: HTTP status. Actual response body: {"status":"success","message":"Client information saved","data":{"application_id":164,"first_name":"Qa","last_name":"Tester","date_of_birth":"2026-11-05T00:00:00.000000Z","gender":"MALE","marital_status":"SINGLE","nationality":"United States","occupation":"Engineer","employer_name":"Acme","employer_address":"1 Corporate Way","calculated_age":0,"updated_at":"2026-11-04T20:23:35.000000Z","created_at":"2026-11-04T20:23:35.000000Z","id":147}}

expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 200
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
  33 |   expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
  34 | }
  35 | 
  36 | export function expectApiError(result: ApiResult, status: number, pattern?: RegExp): void {
  37 |   showResponse(result);
> 38 |   expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
     |                                                                                            ^ Error: HTTP status. Actual response body: {"status":"success","message":"Client information saved","data":{"application_id":164,"first_name":"Qa","last_name":"Tester","date_of_birth":"2026-11-05T00:00:00.000000Z","gender":"MALE","marital_status":"SINGLE","nationality":"United States","occupation":"Engineer","employer_name":"Acme","employer_address":"1 Corporate Way","calculated_age":0,"updated_at":"2026-11-04T20:23:35.000000Z","created_at":"2026-11-04T20:23:35.000000Z","id":147}}
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