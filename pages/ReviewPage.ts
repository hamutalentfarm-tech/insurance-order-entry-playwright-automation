import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { firstInt, parseMoney } from '../utils/testHelpers';

/** /applications/{id}/review: blocking validation errors, submit button and the application snapshot. */
export class ReviewPage extends BasePage {
  readonly root: Locator;
  readonly errorBox: Locator;
  readonly passedBox: Locator;
  readonly validateButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('review-page');
    this.errorBox = page.getByTestId('review-validation-errors');
    this.passedBox = page.getByTestId('review-validation-passed');
    this.validateButton = page.getByTestId('review-validate-button');
    this.submitButton = page.getByTestId('review-submit-application-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/review`);
    await expect(this.root).toBeVisible();
  }

  /** Blocking validation errors listed on the page (plain list items). */
  async errors(): Promise<string[]> {
    if ((await this.errorBox.count()) === 0) return [];
    return (await this.errorBox.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  /** Number of links inside the error list (the app currently renders plain text). */
  async errorLinkCount(): Promise<number> {
    if ((await this.errorBox.count()) === 0) return 0;
    return this.errorBox.locator('a').count();
  }

  async runValidation(): Promise<void> {
    await this.validateButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.root).toBeVisible();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
    await expect(this.page).toHaveURL(/\/confirmation/);
  }

  async calculatedAge(): Promise<number> {
    return firstInt(await this.page.getByTestId('review-client-calculated-age').innerText());
  }

  async totalPremium(): Promise<number> {
    return parseMoney(await this.page.getByTestId('review-total-premium').innerText());
  }
}
