# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow\workflow.spec.ts >> Submission and status tracking >> TC-WF-003 | WF-V03 | a valid application can be submitted end to end
- Location: tests\workflow\workflow.spec.ts:110:7

# Error details

```
Error: The response has no "status" field. Actual response body: <!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application Status | Insurance Order Entry</title>
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
    

expect(received).toBe(expected) // Object.is equality

Expected: "success"
Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=f15e1]:
  - navigation [ref=f15e2]:
    - generic [ref=f15e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f15e4] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/dashboard
        - generic [aria-hidden] [ref=f15e5]: IO
        - generic [ref=f15e6]:
          - generic [ref=f15e7]: Insurance Order Entry Demo Platform
          - generic [ref=f15e8]: QA Automation Training App
      - generic [ref=f15e9]:
        - list [ref=f15e10]:
          - listitem [ref=f15e11]:
            - link "Dashboard" [ref=f15e12] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/dashboard
          - listitem [ref=f15e13]:
            - link "Applications" [ref=f15e14] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/applications
          - listitem [ref=f15e15]:
            - link "Products" [ref=f15e16] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/products
          - listitem [ref=f15e17]:
            - link "Support" [ref=f15e18] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/support
        - generic [ref=f15e19]:
          - link "Learner Agent 001" [ref=f15e20] [cursor=pointer]:
            - /url: http://35.244.49.205:8081/profile
          - button "Logout" [ref=f15e22] [cursor=pointer]
  - main [ref=f15e23]:
    - generic [ref=f15e24]:
      - generic [ref=f15e25]:
        - heading "Agent Dashboard" [level=1] [ref=f15e26]
        - paragraph [ref=f15e27]: Track drafts, submitted applications, and policy order entry work.
      - link "Start New Application" [ref=f15e28] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/applications/new
    - generic [ref=f15e29]:
      - generic [ref=f15e32]:
        - generic [ref=f15e33]: Draft
        - generic [ref=f15e34]: "4"
      - generic [ref=f15e37]:
        - generic [ref=f15e38]: Submitted
        - generic [ref=f15e39]: "3"
      - generic [ref=f15e42]:
        - generic [ref=f15e43]: Under Review
        - generic [ref=f15e44]: "0"
      - generic [ref=f15e47]:
        - generic [ref=f15e48]: Approved
        - generic [ref=f15e49]: "0"
      - generic [ref=f15e52]:
        - generic [ref=f15e53]: Requires Info
        - generic [ref=f15e54]: "0"
    - generic [ref=f15e55]:
      - generic [ref=f15e56]:
        - heading "Recent Applications" [level=2] [ref=f15e57]
        - link "View all" [ref=f15e58] [cursor=pointer]:
          - /url: http://35.244.49.205:8081/applications
      - table [ref=f15e60]:
        - rowgroup [ref=f15e61]:
          - row [ref=f15e62]:
            - columnheader "Reference" [ref=f15e63]
            - columnheader "Client" [ref=f15e64]
            - columnheader "Product" [ref=f15e65]
            - columnheader "Status" [ref=f15e66]
            - columnheader "Updated" [ref=f15e67]
            - columnheader [ref=f15e68]
        - rowgroup [ref=f15e69]:
          - row [ref=f15e70]:
            - cell "WL2026102569639" [ref=f15e71]
            - cell "Qazlelsi Ajvzpkn" [ref=f15e72]
            - cell "SecureLife Whole Life" [ref=f15e73]
            - cell "SUBMITTED" [ref=f15e74]
            - cell "25 Oct 2026" [ref=f15e76]
            - cell [ref=f15e77]:
              - link "Open" [ref=f15e78] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/55
          - row [ref=f15e79]:
            - 'cell "Draft #54" [ref=f15e80]'
            - cell "Qaxduiqx Ldvzstl" [ref=f15e81]
            - cell "Not selected" [ref=f15e82]
            - cell "DRAFT" [ref=f15e83]
            - cell "25 Oct 2026" [ref=f15e85]
            - cell [ref=f15e86]:
              - link "Open" [ref=f15e87] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/54
          - row [ref=f15e88]:
            - cell "WL2026102599273" [ref=f15e89]
            - cell "Qaxakinb Yrpcrri" [ref=f15e90]
            - cell "SecureLife Whole Life" [ref=f15e91]
            - cell "SUBMITTED" [ref=f15e92]
            - cell "25 Oct 2026" [ref=f15e94]
            - cell [ref=f15e95]:
              - link "Open" [ref=f15e96] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/53
          - row [ref=f15e97]:
            - 'cell "Draft #52" [ref=f15e98]'
            - cell "Qawqjuio Nogqmud" [ref=f15e99]
            - cell "Not selected" [ref=f15e100]
            - cell "DRAFT" [ref=f15e101]
            - cell "25 Oct 2026" [ref=f15e103]
            - cell [ref=f15e104]:
              - link "Open" [ref=f15e105] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/52
          - row [ref=f15e106]:
            - cell "WL2026102587562" [ref=f15e107]
            - cell "Qaoyczym Jntfmjq" [ref=f15e108]
            - cell "SecureLife Whole Life" [ref=f15e109]
            - cell "SUBMITTED" [ref=f15e110]
            - cell "25 Oct 2026" [ref=f15e112]
            - cell [ref=f15e113]:
              - link "Open" [ref=f15e114] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/51
          - row [ref=f15e115]:
            - 'cell "Draft #50" [ref=f15e116]'
            - cell "Qampupnf Rrbcbsz" [ref=f15e117]
            - cell "Not selected" [ref=f15e118]
            - cell "DRAFT" [ref=f15e119]
            - cell "25 Oct 2026" [ref=f15e121]
            - cell [ref=f15e122]:
              - link "Open" [ref=f15e123] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/50
          - row [ref=f15e124]:
            - cell "WL-LNR-001-DRAFT" [ref=f15e125]
            - cell "Learner Client 001" [ref=f15e126]
            - cell "SecureLife Whole Life" [ref=f15e127]
            - cell "DRAFT" [ref=f15e128]
            - cell "17 May 2026" [ref=f15e130]
            - cell [ref=f15e131]:
              - link "Open" [ref=f15e132] [cursor=pointer]:
                - /url: http://35.244.49.205:8081/applications/7
  - contentinfo [ref=f15e133]:
    - generic [ref=f15e134]:
      - generic [ref=f15e135]: TalentFarm QA Automation Lab
      - generic [ref=f15e136]: Insurance Order Entry Demo
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