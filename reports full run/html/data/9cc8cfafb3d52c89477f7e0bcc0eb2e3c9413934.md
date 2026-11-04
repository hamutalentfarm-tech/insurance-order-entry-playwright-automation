# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-002 | RIDER-V02 | rider coverage cannot exceed the base face value
- Location: tests\riders\riders.spec.ts:52:7

# Error details

```
Error: validation alert

expect(locator).toBeVisible() failed

Locator: getByTestId('validation-error-alert')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - validation alert getByTestId('validation-error-alert') with timeout 10000ms
  - waiting for getByTestId('validation-error-alert')

```

```yaml
- navigation:
  - link "Insurance Order Entry Demo Platform QA Automation Training App":
    - /url: http://34.100.166.72:8081/dashboard
  - list:
    - listitem:
      - link "Dashboard":
        - /url: http://34.100.166.72:8081/dashboard
    - listitem:
      - link "Applications":
        - /url: http://34.100.166.72:8081/applications
    - listitem:
      - link "Products":
        - /url: http://34.100.166.72:8081/products
    - listitem:
      - link "Support":
        - /url: http://34.100.166.72:8081/support
  - link "Learner Agent 002":
    - /url: http://34.100.166.72:8081/profile
  - button "Logout"
- main:
  - link "← Back to Product Configuration":
    - /url: http://34.100.166.72:8081/applications/140/product
  - link "Application Summary":
    - /url: http://34.100.166.72:8081/applications/140
  - text: "Application #140"
  - heading "Riders" [level=1]
  - paragraph: Select optional rider benefits for the policy.
  - text: "Current rider premium: $0.00"
  - table:
    - rowgroup:
      - row "Select Rider Description Benefit Amount":
        - columnheader "Select"
        - columnheader "Rider"
        - columnheader "Description"
        - columnheader "Benefit Amount"
    - rowgroup:
      - row "Accidental Death Benefit Rider Pays additional benefit if death is due to accident.":
        - cell:
          - checkbox [checked]
        - cell "Accidental Death Benefit Rider"
        - cell "Pays additional benefit if death is due to accident."
        - cell:
          - spinbutton "$50,000": "250001"
      - row "Permanent Disability Rider Provides lump sum or income on total permanent disability.":
        - cell:
          - checkbox
        - cell "Permanent Disability Rider"
        - cell "Provides lump sum or income on total permanent disability."
        - cell:
          - spinbutton "$50,000"
      - row "Term Rider Add-on Additional term coverage layered on top of the Whole Life base product.":
        - cell:
          - checkbox
        - cell "Term Rider Add-on"
        - cell "Additional term coverage layered on top of the Whole Life base product."
        - cell:
          - spinbutton "$50,000"
      - row "Critical Illness Rider Pays lump sum on diagnosis of covered critical illness.":
        - cell:
          - checkbox
        - cell "Critical Illness Rider"
        - cell "Pays lump sum on diagnosis of covered critical illness."
        - cell:
          - spinbutton "$50,000"
      - row "Hospital Cash Rider Pays daily cash benefit during hospitalization.":
        - cell:
          - checkbox
        - cell "Hospital Cash Rider"
        - cell "Pays daily cash benefit during hospitalization."
        - cell:
          - spinbutton "$50,000"
      - row "Waiver of Premium - Disability Waives future premiums if insured becomes totally disabled.":
        - cell:
          - checkbox
        - cell "Waiver of Premium - Disability"
        - cell "Waives future premiums if insured becomes totally disabled."
        - cell:
          - spinbutton "$50,000"
      - row "Waiver of Premium - Critical Illness Waives future premiums upon diagnosis of covered critical illness.":
        - cell:
          - checkbox
        - cell "Waiver of Premium - Critical Illness"
        - cell "Waives future premiums upon diagnosis of covered critical illness."
        - cell:
          - spinbutton "$50,000"
      - row "Family Income Benefit Rider Provides monthly income to family for a defined period after insured death.":
        - cell:
          - checkbox
        - cell "Family Income Benefit Rider"
        - cell "Provides monthly income to family for a defined period after insured death."
        - cell:
          - spinbutton "$50,000"
      - row "Guaranteed Income Rider Provides guaranteed periodic income for a set duration.":
        - cell:
          - checkbox
        - cell "Guaranteed Income Rider"
        - cell "Provides guaranteed periodic income for a set duration."
        - cell:
          - spinbutton "$50,000"
  - button "Save and Continue"
- contentinfo: TalentFarm QA Automation Lab Insurance Order Entry Demo
```

# Test source

```ts
  1  | import { expect, type Locator, type Page } from '@playwright/test';
  2  | 
  3  | /** Shared behaviour: alerts, navigation and the helpers used by every page object. */
  4  | export abstract class BasePage {
  5  |   constructor(protected readonly page: Page) {}
  6  | 
  7  |   get validationAlert(): Locator {
  8  |     return this.page.getByTestId('validation-error-alert');
  9  |   }
  10 | 
  11 |   get statusAlert(): Locator {
  12 |     return this.page.getByTestId('status-alert');
  13 |   }
  14 | 
  15 |   /** Messages in the red "Please review the following" alert (empty list when there is none). */
  16 |   async errorMessages(): Promise<string[]> {
  17 |     if ((await this.validationAlert.count()) === 0) return [];
  18 |     return (await this.validationAlert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  19 |   }
  20 | 
  21 |   async expectErrorMatching(pattern: RegExp): Promise<void> {
> 22 |     await expect(this.validationAlert, 'validation alert').toBeVisible();
     |                                                            ^ Error: validation alert
  23 |     await expect(this.validationAlert).toContainText(pattern);
  24 |   }
  25 | 
  26 |   async expectNoErrors(): Promise<void> {
  27 |     await expect(this.validationAlert).toHaveCount(0);
  28 |   }
  29 | 
  30 |   async logout(): Promise<void> {
  31 |     await this.page.getByTestId('nav-logout-button').click();
  32 |   }
  33 | 
  34 |   async expectPath(pattern: RegExp): Promise<void> {
  35 |     await expect(this.page).toHaveURL(pattern);
  36 |   }
  37 | }
  38 | 
```