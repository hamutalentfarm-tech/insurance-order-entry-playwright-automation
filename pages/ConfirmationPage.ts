import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /applications/{id}/confirmation */
export class ConfirmationPage extends BasePage {
  readonly root: Locator;
  readonly reference: Locator;
  readonly viewStatusLink: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('submission-confirmation-page');
    this.reference = page.getByTestId('confirmation-reference-number');
    this.viewStatusLink = page.getByTestId('confirmation-view-status-link');
    this.dashboardLink = page.getByTestId('confirmation-dashboard-link');
  }

  async expectShown(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.reference).toBeVisible();
  }

  /** Reference number such as WL2026102500123 (extracted from the text block). */
  async referenceNumber(): Promise<string> {
    const text = (await this.reference.innerText()).trim();
    const m = text.match(/WL\d+/);
    return m ? m[0] : text;
  }
}
