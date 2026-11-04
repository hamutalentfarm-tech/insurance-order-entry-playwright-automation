# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\login.spec.ts >> Authentication: login, logout and access control >> TC-AUTH-006 | AUTH-V06 | locked user cannot access the dashboard (UI and API)
- Location: tests\auth\login.spec.ts:109:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://34.100.166.72:8081/change-password"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://34.100.166.72:8081/change-password"

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
  - link "Locked Agent":
    - /url: http://34.100.166.72:8081/profile
  - button "Logout"
- main:
  - alert: Please change your password before continuing.
  - heading "Change Password" [level=1]
  - paragraph: Your password must be changed before you continue.
  - text: Please change your password before continuing. Current Password
  - textbox "Current Password"
  - text: New Password
  - textbox "New Password"
  - text: Minimum 12 characters with uppercase, lowercase, digit, and special character. Confirm New Password
  - textbox "Confirm New Password"
  - button "Change Password"
  - button "Sign out"
- contentinfo: TalentFarm QA Automation Lab Insurance Order Entry Demo
```

# Test source

```ts
  1  | import { expect, type Locator, type Page } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | import { disableBrowserValidation } from '../utils/testHelpers';
  4  | 
  5  | /** /login, plus session checks (protected routes redirect here). */
  6  | export class LoginPage extends BasePage {
  7  |   readonly form: Locator;
  8  |   readonly email: Locator;
  9  |   readonly password: Locator;
  10 |   readonly submitButton: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     super(page);
  14 |     this.form = page.getByTestId('login-form');
  15 |     this.email = page.getByTestId('login-email-input');
  16 |     this.password = page.getByTestId('login-password-input');
  17 |     this.submitButton = page.getByTestId('login-submit-button');
  18 |   }
  19 | 
  20 |   async goto(): Promise<void> {
  21 |     await this.page.goto('/login');
  22 |     await expect(this.form).toBeVisible();
  23 |   }
  24 | 
  25 |   async fillCredentials(email: string, password: string): Promise<void> {
  26 |     await this.email.fill(email);
  27 |     await this.password.fill(password);
  28 |   }
  29 | 
  30 |   async submit(): Promise<void> {
  31 |     await this.submitButton.click();
  32 |   }
  33 | 
  34 |   async login(email: string, password: string): Promise<void> {
  35 |     await this.fillCredentials(email, password);
  36 |     await this.submit();
  37 |   }
  38 | 
  39 |   /** Full happy-path login: navigates, signs in and waits until the dashboard is shown. */
  40 |     async loginAndWait(email: string, password: string): Promise<void> {
  41 |     await this.goto();
  42 |     await this.login(email, password);
  43 |     await expect(this.page).not.toHaveURL(/\/login/);
  44 |   }
  45 | 
  46 |   async submitIgnoringBrowserValidation(): Promise<void> {
  47 |     await disableBrowserValidation(this.page, 'login-form');
  48 |     await this.submit();
  49 |   }
  50 | 
  51 |   async expectOnLogin(): Promise<void> {
> 52 |     await expect(this.page).toHaveURL(/\/login/);
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  53 |     await expect(this.form).toBeVisible();
  54 |   }
  55 | 
  56 |   async expectSessionBlocked(path: string): Promise<void> {
  57 |     await this.page.goto(path);
  58 |     await this.expectOnLogin();
  59 |   }
  60 | }
  61 | 
```