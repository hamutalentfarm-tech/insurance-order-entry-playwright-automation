import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { disableBrowserValidation } from '../utils/testHelpers';

/** /login, plus session checks (protected routes redirect here). */
export class LoginPage extends BasePage {
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId('login-form');
    this.email = page.getByTestId('login-email-input');
    this.password = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.form).toBeVisible();
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  /** Full happy-path login: navigates, signs in and waits until the dashboard is shown. */
    async loginAndWait(email: string, password: string): Promise<void> {
    await this.goto();
    await this.login(email, password);
    await expect(this.page).not.toHaveURL(/\/login/);
  }

  async submitIgnoringBrowserValidation(): Promise<void> {
    await disableBrowserValidation(this.page, 'login-form');
    await this.submit();
  }

  async expectOnLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.form).toBeVisible();
  }

  async expectSessionBlocked(path: string): Promise<void> {
    await this.page.goto(path);
    await this.expectOnLogin();
  }
}
