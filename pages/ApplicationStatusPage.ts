import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /applications/{id}/status: current status, reference number and status history. */
export class ApplicationStatusPage extends BasePage {
  readonly root: Locator;
  readonly current: Locator;
  readonly reference: Locator;
  readonly historyTable: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('status-page');
    this.current = page.getByTestId('status-current-value');
    this.reference = page.getByTestId('status-reference-number');
    this.historyTable = page.getByTestId('status-history-table');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/status`);
    await expect(this.root).toBeVisible();
  }

  async currentStatus(): Promise<string> {
    return (await this.current.innerText()).trim();
  }

  async referenceNumber(): Promise<string> {
    const text = (await this.reference.innerText()).trim();
    const m = text.match(/WL\d+|DRAFT[-\w]*/);
    return m ? m[0] : text;
  }

  historyRows(): Locator {
    return this.page.locator('[data-testid^="status-row-"]');
  }
}
