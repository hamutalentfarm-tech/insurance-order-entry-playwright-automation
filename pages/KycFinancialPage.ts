import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { KycData } from '../fixtures/applicationData';
import { disableBrowserValidation } from '../utils/testHelpers';

/** /applications/{id}/kyc-financial (ID, financial suitability, PEP and compliance declaration). */
export class KycFinancialPage extends BasePage {
  readonly root: Locator;
  readonly idType: Locator;
  readonly idNumber: Locator;
  readonly issueDate: Locator;
  readonly expiryDate: Locator;
  readonly annualIncome: Locator;
  readonly netWorth: Locator;
  readonly sourceOfFunds: Locator;
  readonly riskProfile: Locator;
  readonly pep: Locator;
  readonly pepDetails: Locator;
  readonly declaration: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('kyc-financial-page');
    this.idType = page.getByTestId('kyc-id-type-select');
    this.idNumber = page.getByTestId('kyc-id-number-input');
    this.issueDate = page.getByTestId('kyc-issue-date-input');
    this.expiryDate = page.getByTestId('kyc-expiry-date-input');
    this.annualIncome = page.getByTestId('financial-annual-income-input');
    this.netWorth = page.getByTestId('financial-net-worth-input');
    this.sourceOfFunds = page.getByTestId('financial-source-of-funds-select');
    this.riskProfile = page.getByTestId('financial-risk-profile-select');
    this.pep = page.getByTestId('compliance-pep-select');
    this.pepDetails = page.getByTestId('compliance-pep-details-input');
    this.declaration = page.getByTestId('compliance-declaration-checkbox');
    this.saveButton = page.getByTestId('kyc-financial-save-continue-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/kyc-financial`);
    await expect(this.root).toBeVisible();
  }

  async fill(k: KycData): Promise<void> {
    await this.idType.selectOption(k.idType);
    await this.idNumber.fill(k.idNumber);
    await this.issueDate.fill(k.issueDate ?? '');
    await this.expiryDate.fill(k.expiryDate ?? '');
    await this.annualIncome.fill(String(k.annualIncome));
    await this.netWorth.fill(String(k.netWorth));
    await this.sourceOfFunds.selectOption(k.sourceOfFunds);
    await this.riskProfile.selectOption(k.riskProfile);
    await this.setPep(k.isPep, k.pepDetails);
    await this.declaration.setChecked(k.declaration);
  }

  /** The PEP dropdown uses 0 = No, 1 = Yes. */
  async setPep(isPep: boolean, details?: string): Promise<void> {
    await this.pep.selectOption(isPep ? '1' : '0');
    if (details !== undefined) await this.pepDetails.fill(details);
  }

  async save(options: { ignoreBrowserValidation?: boolean } = {}): Promise<void> {
    if (options.ignoreBrowserValidation) await disableBrowserValidation(this.page, 'kyc-financial-form');
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSave(k: KycData): Promise<void> {
    await this.fill(k);
    await this.save();
    await expect(this.page).toHaveURL(/\/product/);
  }
}
