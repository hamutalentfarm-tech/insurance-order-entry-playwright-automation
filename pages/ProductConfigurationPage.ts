import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ProductData } from '../fixtures/applicationData';
import { product, type Frequency, type PolicyTerm } from '../fixtures/referenceData';
import { disableBrowserValidation, optionValues, parseMoney, selectByText } from '../utils/testHelpers';

/** /applications/{id}/product: product, face value, frequency, terms and the live premium preview. */
export class ProductConfigurationPage extends BasePage {
  readonly root: Locator;
  readonly productSelect: Locator;
  readonly faceValue: Locator;
  readonly frequency: Locator;
  readonly paymentTerm: Locator;
  readonly policyTerm: Locator;
  readonly totalPremium: Locator;
  readonly previewHelp: Locator;
  readonly rangeHelp: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('product-configuration-page');
    this.productSelect = page.getByTestId('product-select');
    this.faceValue = page.getByTestId('product-sum-assured-input');
    this.frequency = page.getByTestId('product-premium-frequency-select');
    this.paymentTerm = page.getByTestId('product-payment-term-select');
    this.policyTerm = page.getByTestId('product-coverage-term-select');
    this.totalPremium = page.getByTestId('product-current-total-premium');
    this.previewHelp = page.getByTestId('premium-preview-help');
    this.rangeHelp = page.getByTestId('product-range-help');
    this.saveButton = page.getByTestId('product-save-continue-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/product`);
    await expect(this.root).toBeVisible();
  }

  async selectProduct(code: string): Promise<void> {
    await selectByText(this.productSelect, product(code).name);
  }

  async setFaceValue(amount: number): Promise<void> {
    await this.faceValue.fill(String(amount));
  }

  async setFrequency(f: Frequency): Promise<void> {
    await this.frequency.selectOption(f);
  }

  async setPolicyTerm(t: PolicyTerm): Promise<void> {
    await this.policyTerm.selectOption(t);
  }

  async fill(d: ProductData): Promise<void> {
    await this.selectProduct(d.productCode);
    await this.setFaceValue(d.faceValue);
    await this.setFrequency(d.frequency);
    await this.paymentTerm.selectOption(String(d.paymentTerm));
    await this.setPolicyTerm(d.policyTerm);
  }

  async save(options: { ignoreBrowserValidation?: boolean } = {}): Promise<void> {
    if (options.ignoreBrowserValidation) await disableBrowserValidation(this.page, 'product-configuration-form');
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSave(d: ProductData): Promise<void> {
    await this.fill(d);
    await this.save();
    await expect(this.page).toHaveURL(/\/riders/);
  }

  /** Number shown in the premium box (live JavaScript preview until saved, then the stored total). */
  async premiumShown(): Promise<number> {
    return parseMoney(await this.totalPremium.innerText());
  }

  paymentTermOptions(): Promise<string[]> {
    return optionValues(this.paymentTerm).then((v) => v.filter(Boolean));
  }

  policyTermOptions(): Promise<string[]> {
    return optionValues(this.policyTerm).then((v) => v.filter(Boolean));
  }
}
