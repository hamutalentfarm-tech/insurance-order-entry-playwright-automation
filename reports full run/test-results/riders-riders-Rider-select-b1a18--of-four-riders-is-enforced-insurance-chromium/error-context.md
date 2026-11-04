# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-004 | RIDER-V04 | maximum of four riders is enforced
- Location: tests\riders\riders.spec.ts:104:7

# Error details

```
Error: HTTP status. Actual response body: {"status":"success","message":"Rider selection saved","data":{"id":142,"application_reference_number":null,"user_id":9,"insurance_product_id":1,"application_status":"DRAFT","current_step":"BENEFICIARIES","face_value":"250000.00","premium_frequency":"MONTHLY","payment_term_years":20,"policy_term":"WHOLE_LIFE","base_premium":"98.96","rider_premium":"0.00","total_premium":"98.96","suitability_override_reason":null,"submitted_at":null,"created_at":"2026-11-04T18:36:19.000000Z","updated_at":"2026-11-04T18:36:25.000000Z","application_riders":[]}}

expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 200
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - navigation [ref=f1e2]:
    - generic [ref=f1e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f1e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f1e5]: IO
        - generic [ref=f1e6]:
          - generic [ref=f1e7]: Insurance Order Entry Demo Platform
          - generic [ref=f1e8]: QA Automation Training App
      - generic [ref=f1e9]:
        - list [ref=f1e10]:
          - listitem [ref=f1e11]:
            - link "Dashboard" [ref=f1e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f1e13]:
            - link "Applications" [ref=f1e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f1e15]:
            - link "Products" [ref=f1e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f1e17]:
            - link "Support" [ref=f1e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f1e19]:
          - link "Learner Agent 002" [ref=f1e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f1e22] [cursor=pointer]
  - main [ref=f1e23]:
    - alert [ref=f1e24]:
      - generic [ref=f1e25]: "Please review the following:"
      - list [ref=f1e26]:
        - listitem [ref=f1e27]: Maximum 4 riders can be selected for one application.
    - generic [ref=f1e29]:
      - link "← Back to Product Configuration" [ref=f1e30] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/142/product
      - link "Application Summary" [ref=f1e31] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/142
    - generic [ref=f1e32]:
      - generic [ref=f1e34]:
        - generic [ref=f1e35]: "Application #142"
        - heading "Riders" [level=1] [ref=f1e36]
        - paragraph [ref=f1e37]: Select optional rider benefits for the policy.
      - generic [ref=f1e39]:
        - generic [ref=f1e40]: "Current rider premium: $105.42"
        - generic [ref=f1e41]:
          - table [ref=f1e43]:
            - rowgroup [ref=f1e44]:
              - row [ref=f1e45]:
                - columnheader "Select" [ref=f1e46]
                - columnheader "Rider" [ref=f1e47]
                - columnheader "Description" [ref=f1e48]
                - columnheader "Benefit Amount" [ref=f1e49]
            - rowgroup [ref=f1e50]:
              - row [ref=f1e51]:
                - cell [ref=f1e52]:
                  - checkbox [checked] [ref=f1e53]
                - cell "Accidental Death Benefit Rider" [ref=f1e54]
                - cell "Pays additional benefit if death is due to accident." [ref=f1e55]
                - cell [ref=f1e56]:
                  - spinbutton "$50,000" [ref=f1e57]: "250000"
              - row [ref=f1e58]:
                - cell [ref=f1e59]:
                  - checkbox [checked] [ref=f1e60]
                - cell "Permanent Disability Rider" [ref=f1e61]
                - cell "Provides lump sum or income on total permanent disability." [ref=f1e62]
                - cell [ref=f1e63]:
                  - spinbutton "$50,000" [ref=f1e64]: "250000"
              - row [ref=f1e65]:
                - cell [ref=f1e66]:
                  - checkbox [checked] [ref=f1e67]
                - cell "Term Rider Add-on" [ref=f1e68]
                - cell "Additional term coverage layered on top of the Whole Life base product." [ref=f1e69]
                - cell [ref=f1e70]:
                  - spinbutton "$50,000" [ref=f1e71]: "250000"
              - row [ref=f1e72]:
                - cell [ref=f1e73]:
                  - checkbox [checked] [ref=f1e74]
                - cell "Critical Illness Rider" [ref=f1e75]
                - cell "Pays lump sum on diagnosis of covered critical illness." [ref=f1e76]
                - cell [ref=f1e77]:
                  - spinbutton "$50,000" [ref=f1e78]: "250000"
              - row [ref=f1e79]:
                - cell [ref=f1e80]:
                  - checkbox [checked] [ref=f1e81]
                - cell "Hospital Cash Rider" [ref=f1e82]
                - cell "Pays daily cash benefit during hospitalization." [ref=f1e83]
                - cell [ref=f1e84]:
                  - spinbutton "$50,000" [ref=f1e85]: "100000"
              - row [ref=f1e86]:
                - cell [ref=f1e87]:
                  - checkbox [ref=f1e88]
                - cell "Waiver of Premium - Disability" [ref=f1e89]
                - cell "Waives future premiums if insured becomes totally disabled." [ref=f1e90]
                - cell [ref=f1e91]:
                  - spinbutton "$50,000" [ref=f1e92]
              - row [ref=f1e93]:
                - cell [ref=f1e94]:
                  - checkbox [ref=f1e95]
                - cell "Waiver of Premium - Critical Illness" [ref=f1e96]
                - cell "Waives future premiums upon diagnosis of covered critical illness." [ref=f1e97]
                - cell [ref=f1e98]:
                  - spinbutton "$50,000" [ref=f1e99]
              - row [ref=f1e100]:
                - cell [ref=f1e101]:
                  - checkbox [ref=f1e102]
                - cell "Family Income Benefit Rider" [ref=f1e103]
                - cell "Provides monthly income to family for a defined period after insured death." [ref=f1e104]
                - cell [ref=f1e105]:
                  - spinbutton "$50,000" [ref=f1e106]
              - row [ref=f1e107]:
                - cell [ref=f1e108]:
                  - checkbox [ref=f1e109]
                - cell "Guaranteed Income Rider" [ref=f1e110]
                - cell "Provides guaranteed periodic income for a set duration." [ref=f1e111]
                - cell [ref=f1e112]:
                  - spinbutton "$50,000" [ref=f1e113]
          - button "Save and Continue" [ref=f1e115] [cursor=pointer]
  - contentinfo [ref=f1e116]:
    - generic [ref=f1e117]:
      - generic [ref=f1e118]: TalentFarm QA Automation Lab
      - generic [ref=f1e119]: Insurance Order Entry Demo
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
     |                                                                                            ^ Error: HTTP status. Actual response body: {"status":"success","message":"Rider selection saved","data":{"id":142,"application_reference_number":null,"user_id":9,"insurance_product_id":1,"application_status":"DRAFT","current_step":"BENEFICIARIES","face_value":"250000.00","premium_frequency":"MONTHLY","payment_term_years":20,"policy_term":"WHOLE_LIFE","base_premium":"98.96","rider_premium":"0.00","total_premium":"98.96","suitability_override_reason":null,"submitted_at":null,"created_at":"2026-11-04T18:36:19.000000Z","updated_at":"2026-11-04T18:36:25.000000Z","application_riders":[]}}
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