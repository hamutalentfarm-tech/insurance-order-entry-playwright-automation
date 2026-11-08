# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\lockout.spec.ts >> Authentication: lockout (destructive) >> TC-AUTH-007 | AUTH-V07 | account locks after five failed attempts
- Location: tests\auth\lockout.spec.ts:15:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('validation-error-alert')
Timeout: 10000ms
Expected pattern: /account is locked|account locked/i
Received string:  "
        Please review the following:·········
                            Invalid credentials.·····················
    "

Call log:
  - Expect "toContainText" getByTestId('validation-error-alert') with timeout 10000ms
  - waiting for getByTestId('validation-error-alert')
    23 × locator resolved to <div role="alert" class="alert alert-danger" data-testid="validation-error-alert">…</div>
       - unexpected value "
        Please review the following:
        
                            Invalid credentials.
                    
    "

```

```yaml
- alert:
  - text: "Please review the following:"
  - list:
    - listitem: Invalid credentials.
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
  22 |     await expect(this.validationAlert, 'validation alert').toBeVisible();
> 23 |     await expect(this.validationAlert).toContainText(pattern);
     |                                        ^ Error: expect(locator).toContainText(expected) failed
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