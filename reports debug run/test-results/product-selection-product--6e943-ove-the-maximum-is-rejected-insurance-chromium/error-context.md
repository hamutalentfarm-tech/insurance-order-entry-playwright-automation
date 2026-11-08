# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-004 | PROD-V04 | face value above the maximum is rejected
- Location: tests\product-selection\product-selection.spec.ts:90:7

# Error details

```
Error: HTTP status. Actual response body: {"status":"success","message":"Product configuration saved","data":{"id":204,"application_reference_number":null,"user_id":10,"insurance_product_id":1,"application_status":"DRAFT","current_step":"RIDERS","face_value":"1000001.00","premium_frequency":"MONTHLY","payment_term_years":20,"policy_term":"WHOLE_LIFE","base_premium":"395.83","rider_premium":"0.00","total_premium":"395.83","suitability_override_reason":null,"submitted_at":null,"created_at":"2026-11-04T20:32:03.000000Z","updated_at":"2026-11-04T20:32:24.000000Z","insurance_product":{"id":1,"product_code":"WL_SECURE_BASIC","product_name":"SecureLife Whole Life","product_type":"WHOLE_LIFE","short_description":"Basic lifelong coverage with fixed premium and guaranteed death benefit.","features":"Fixed premium, guaranteed death benefit, 

expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 200
```

# Page snapshot

```yaml
- generic [active] [ref=f15e1]:
  - navigation [ref=f15e2]:
    - generic [ref=f15e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f15e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f15e5]: IO
        - generic [ref=f15e6]:
          - generic [ref=f15e7]: Insurance Order Entry Demo Platform
          - generic [ref=f15e8]: QA Automation Training App
      - generic [ref=f15e9]:
        - list [ref=f15e10]:
          - listitem [ref=f15e11]:
            - link "Dashboard" [ref=f15e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f15e13]:
            - link "Applications" [ref=f15e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f15e15]:
            - link "Products" [ref=f15e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f15e17]:
            - link "Support" [ref=f15e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f15e19]:
          - link "Learner Agent 003" [ref=f15e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f15e22] [cursor=pointer]
  - main [ref=f15e23]:
    - alert [ref=f15e24]: Product configuration saved and premium recalculated.
    - generic [ref=f15e26]:
      - link "← Back to Product Configuration" [ref=f15e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/204/product
      - link "Application Summary" [ref=f15e28] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/204
    - generic [ref=f15e29]:
      - generic [ref=f15e31]:
        - generic [ref=f15e32]: "Application #204"
        - heading "Riders" [level=1] [ref=f15e33]
        - paragraph [ref=f15e34]: Select optional rider benefits for the policy.
      - generic [ref=f15e36]:
        - generic [ref=f15e37]: "Current rider premium: $0.00"
        - generic [ref=f15e38]:
          - table [ref=f15e40]:
            - rowgroup [ref=f15e41]:
              - row [ref=f15e42]:
                - columnheader "Select" [ref=f15e43]
                - columnheader "Rider" [ref=f15e44]
                - columnheader "Description" [ref=f15e45]
                - columnheader "Benefit Amount" [ref=f15e46]
            - rowgroup [ref=f15e47]:
              - row [ref=f15e48]:
                - cell [ref=f15e49]:
                  - checkbox [ref=f15e50]
                - cell "Accidental Death Benefit Rider" [ref=f15e51]
                - cell "Pays additional benefit if death is due to accident." [ref=f15e52]
                - cell [ref=f15e53]:
                  - spinbutton "$50,000" [ref=f15e54]
              - row [ref=f15e55]:
                - cell [ref=f15e56]:
                  - checkbox [ref=f15e57]
                - cell "Permanent Disability Rider" [ref=f15e58]
                - cell "Provides lump sum or income on total permanent disability." [ref=f15e59]
                - cell [ref=f15e60]:
                  - spinbutton "$50,000" [ref=f15e61]
              - row [ref=f15e62]:
                - cell [ref=f15e63]:
                  - checkbox [ref=f15e64]
                - cell "Term Rider Add-on" [ref=f15e65]
                - cell "Additional term coverage layered on top of the Whole Life base product." [ref=f15e66]
                - cell [ref=f15e67]:
                  - spinbutton "$50,000" [ref=f15e68]
              - row [ref=f15e69]:
                - cell [ref=f15e70]:
                  - checkbox [ref=f15e71]
                - cell "Critical Illness Rider" [ref=f15e72]
                - cell "Pays lump sum on diagnosis of covered critical illness." [ref=f15e73]
                - cell [ref=f15e74]:
                  - spinbutton "$50,000" [ref=f15e75]
              - row [ref=f15e76]:
                - cell [ref=f15e77]:
                  - checkbox [ref=f15e78]
                - cell "Hospital Cash Rider" [ref=f15e79]
                - cell "Pays daily cash benefit during hospitalization." [ref=f15e80]
                - cell [ref=f15e81]:
                  - spinbutton "$50,000" [ref=f15e82]
              - row [ref=f15e83]:
                - cell [ref=f15e84]:
                  - checkbox [ref=f15e85]
                - cell "Waiver of Premium - Disability" [ref=f15e86]
                - cell "Waives future premiums if insured becomes totally disabled." [ref=f15e87]
                - cell [ref=f15e88]:
                  - spinbutton "$50,000" [ref=f15e89]
              - row [ref=f15e90]:
                - cell [ref=f15e91]:
                  - checkbox [ref=f15e92]
                - cell "Waiver of Premium - Critical Illness" [ref=f15e93]
                - cell "Waives future premiums upon diagnosis of covered critical illness." [ref=f15e94]
                - cell [ref=f15e95]:
                  - spinbutton "$50,000" [ref=f15e96]
              - row [ref=f15e97]:
                - cell [ref=f15e98]:
                  - checkbox [ref=f15e99]
                - cell "Family Income Benefit Rider" [ref=f15e100]
                - cell "Provides monthly income to family for a defined period after insured death." [ref=f15e101]
                - cell [ref=f15e102]:
                  - spinbutton "$50,000" [ref=f15e103]
              - row [ref=f15e104]:
                - cell [ref=f15e105]:
                  - checkbox [ref=f15e106]
                - cell "Guaranteed Income Rider" [ref=f15e107]
                - cell "Provides guaranteed periodic income for a set duration." [ref=f15e108]
                - cell [ref=f15e109]:
                  - spinbutton "$50,000" [ref=f15e110]
          - button "Save and Continue" [ref=f15e112] [cursor=pointer]
  - contentinfo [ref=f15e113]:
    - generic [ref=f15e114]:
      - generic [ref=f15e115]: TalentFarm QA Automation Lab
      - generic [ref=f15e116]: Insurance Order Entry Demo
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
     |                                                                                            ^ Error: HTTP status. Actual response body: {"status":"success","message":"Product configuration saved","data":{"id":204,"application_reference_number":null,"user_id":10,"insurance_product_id":1,"application_status":"DRAFT","current_step":"RIDERS","face_value":"1000001.00","premium_frequency":"MONTHLY","payment_term_years":20,"policy_term":"WHOLE_LIFE","base_premium":"395.83","rider_premium":"0.00","total_premium":"395.83","suitability_override_reason":null,"submitted_at":null,"created_at":"2026-11-04T20:32:03.000000Z","updated_at":"2026-11-04T20:32:24.000000Z","insurance_product":{"id":1,"product_code":"WL_SECURE_BASIC","product_name":"SecureLife Whole Life","product_type":"WHOLE_LIFE","short_description":"Basic lifelong coverage with fixed premium and guaranteed death benefit.","features":"Fixed premium, guaranteed death benefit, 
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