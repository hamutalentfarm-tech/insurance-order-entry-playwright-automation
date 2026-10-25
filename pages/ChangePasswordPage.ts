import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /change-password (authenticated; no OTP needed, unlike /forgot-password). */
export class ChangePasswordPage extends BasePage {
  readonly root: Locator;
  readonly current: Locator;
  readonly newPassword: Locator;
  readonly confirm: Locator;
  readonly strength: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('change-password-page');
    this.current = page.getByTestId('change-password-current');
    this.newPassword = page.getByTestId('change-password-new');
    this.confirm = page.getByTestId('change-password-confirm');
    this.strength = page.getByTestId('change-password-strength');
    this.submitButton = page.getByTestId('change-password-submit');
  }

  async goto(): Promise<void> {
    await this.page.goto('/change-password');
    await expect(this.root).toBeVisible();
  }

  async submit(current: string, next: string, confirm = next): Promise<void> {
    await this.current.fill(current);
    await this.newPassword.fill(next);
    await this.confirm.fill(confirm);
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
