import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RIDERS } from '../fixtures/referenceData';
import { disableBrowserValidation } from '../utils/testHelpers';

export type RiderKey = keyof typeof RIDERS;

/** /applications/{id}/riders */
export class RiderSelectionPage extends BasePage {
  readonly root: Locator;
  readonly premiumSummary: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('riders-page');
    this.premiumSummary = page.getByTestId('rider-premium-summary');
    this.saveButton = page.getByTestId('rider-save-continue-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/riders`);
    await expect(this.root).toBeVisible();
  }

  /** The table row of a rider, found by its name text (rows have numeric ids in their test id). */
  row(key: RiderKey): Locator {
    return this.page.locator('[data-testid^="rider-row-"]').filter({ hasText: RIDERS[key].rowPattern });
  }

  checkbox(key: RiderKey): Locator {
    return this.row(key).locator('[data-testid^="rider-selected-"]');
  }

  coverage(key: RiderKey): Locator {
    return this.row(key).locator('[data-testid^="rider-coverage-amount-"]');
  }

  async select(key: RiderKey, coverageAmount?: number): Promise<void> {
    await this.checkbox(key).check();
    if (coverageAmount !== undefined) await this.coverage(key).fill(String(coverageAmount));
  }

  async deselect(key: RiderKey): Promise<void> {
    await this.checkbox(key).uncheck();
  }

  async isSelected(key: RiderKey): Promise<boolean> {
    return this.checkbox(key).isChecked();
  }

  async selectedCount(): Promise<number> {
    return this.page.locator('[data-testid^="rider-selected-"]:checked').count();
  }

  async save(options: { ignoreBrowserValidation?: boolean } = {}): Promise<void> {
    if (options.ignoreBrowserValidation) await disableBrowserValidation(this.page, 'rider-selection-form');
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async saveAndExpectNext(): Promise<void> {
    await this.save();
    await expect(this.page).toHaveURL(/beneficiaries/);
  }

  async summaryText(): Promise<string> {
    return (await this.premiumSummary.innerText()).replace(/\s+/g, ' ').trim();
  }
}
