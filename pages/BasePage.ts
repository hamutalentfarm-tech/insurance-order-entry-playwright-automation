import { expect, type Locator, type Page } from '@playwright/test';

/** Shared behaviour: alerts, navigation and the helpers used by every page object. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get validationAlert(): Locator {
    return this.page.getByTestId('validation-error-alert');
  }

  get statusAlert(): Locator {
    return this.page.getByTestId('status-alert');
  }

  /** Messages in the red "Please review the following" alert (empty list when there is none). */
  async errorMessages(): Promise<string[]> {
    if ((await this.validationAlert.count()) === 0) return [];
    return (await this.validationAlert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  async expectErrorMatching(pattern: RegExp): Promise<void> {
    await expect(this.validationAlert, 'validation alert').toBeVisible();
    await expect(this.validationAlert).toContainText(pattern);
  }

  async expectNoErrors(): Promise<void> {
    await expect(this.validationAlert).toHaveCount(0);
  }

  async logout(): Promise<void> {
    await this.page.getByTestId('nav-logout-button').click();
  }

  async expectPath(pattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }
}
