import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { applicationIdFromUrl, firstInt } from '../utils/testHelpers';

export type SummaryKey = 'draft' | 'submitted' | 'under-review' | 'approved' | 'requires-info';

/** /dashboard (latest 10 applications and status counters) and the start-new-application flow. */
export class DashboardPage extends BasePage {
  readonly root: Locator;
  readonly newApplicationButton: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('dashboard-page');
    this.newApplicationButton = page.getByTestId('dashboard-new-application-button');
    this.table = page.getByTestId('dashboard-applications-table');
    this.emptyState = page.getByTestId('dashboard-empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await expect(this.root).toBeVisible();
  }

  summaryCard(key: SummaryKey): Locator {
    return this.page.getByTestId(`dashboard-summary-${key}`);
  }

  async summaryCount(key: SummaryKey): Promise<number> {
    return firstInt(await this.summaryCard(key).innerText());
  }

  /** Application ids of the rows currently listed (the dashboard shows the latest 10). */
  async applicationIds(): Promise<number[]> {
    const ids = await this.page
      .locator('[data-testid^="application-open-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
    return ids.map((t) => Number(t.replace('application-open-', ''))).filter((n) => !Number.isNaN(n));
  }

  async statusOf(id: number): Promise<string> {
    return (await this.page.getByTestId(`application-status-${id}`).innerText()).trim();
  }

  async openApplication(id: number): Promise<void> {
    await this.page.getByTestId(`application-open-${id}`).click();
    await expect(this.page).toHaveURL(new RegExp(`/applications/${id}(\\b|/)`));
  }

  /** Dashboard -> Start New Application -> Create Draft. Returns the new application id. */
  async startNewApplication(): Promise<number> {
    await this.newApplicationButton.click();
    await expect(this.page.getByTestId('application-start-page')).toBeVisible();
    await this.page.getByTestId('application-create-draft-button').click();
    await this.page.waitForURL(/\/applications\/\d+\/client/);
    return applicationIdFromUrl(this.page.url());
  }
}
