# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\password-policy.spec.ts >> Authentication: password policy >> TC-AUTH-008 | AUTH-V08 | weak passwords are rejected on /change-password
- Location: tests\auth\password-policy.spec.ts:11:7

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
  - alert: Password changed successfully.
  - heading "Agent Dashboard" [level=1]
  - paragraph: Track drafts, submitted applications, and policy order entry work.
  - link "Start New Application":
    - /url: http://34.100.166.72:8081/applications/new
  - text: Draft 32 Submitted 8 Under Review 0 Approved 0 Requires Info 0
  - heading "Recent Applications" [level=2]
  - link "View all":
    - /url: http://34.100.166.72:8081/applications
  - table:
    - rowgroup:
      - row "Reference Client Product Status Updated":
        - columnheader "Reference"
        - columnheader "Client"
        - columnheader "Product"
        - columnheader "Status"
        - columnheader "Updated"
        - columnheader
    - rowgroup:
      - 'row "Draft #99 Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #99"'
        - cell
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/99
      - row "WL2026110485822 Qaahaqzt Hpgcjmu SecureLife Whole Life SUBMITTED 04 Nov 2026 Open":
        - cell "WL2026110485822"
        - cell "Qaahaqzt Hpgcjmu"
        - cell "SecureLife Whole Life"
        - cell "SUBMITTED"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/98
      - row "WL2026110467520 Qabpvtqe Brdhqeb SecureLife Whole Life SUBMITTED 04 Nov 2026 Open":
        - cell "WL2026110467520"
        - cell "Qabpvtqe Brdhqeb"
        - cell "SecureLife Whole Life"
        - cell "SUBMITTED"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/97
      - 'row "Draft #96 Qaehksjh Euvoyxm SecureLife Whole Life DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #96"'
        - cell "Qaehksjh Euvoyxm"
        - cell "SecureLife Whole Life"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/96
      - 'row "Draft #95 Qa Tester Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #95"'
        - cell "Qa Tester"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/95
      - 'row "Draft #94 Qaukswej Hlffwzh Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #94"'
        - cell "Qaukswej Hlffwzh"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/94
      - 'row "Draft #93 Qakdqznp Axfqkur Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #93"'
        - cell "Qakdqznp Axfqkur"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/93
      - 'row "Draft #92 Qaypllyi Olggdgz Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #92"'
        - cell "Qaypllyi Olggdgz"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/92
      - 'row "Draft #91 Qagaipsm Phaosim Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #91"'
        - cell "Qagaipsm Phaosim"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/91
      - 'row "Draft #90 Qaslxvbw Qjvptxa Not selected DRAFT 04 Nov 2026 Open"':
        - 'cell "Draft #90"'
        - cell "Qaslxvbw Qjvptxa"
        - cell "Not selected"
        - cell "DRAFT"
        - cell "04 Nov 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/90
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