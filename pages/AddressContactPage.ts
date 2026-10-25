import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { AddressData } from '../fixtures/applicationData';
import { disableBrowserValidation } from '../utils/testHelpers';

/** /applications/{id}/address-contact */
export class AddressContactPage extends BasePage {
  readonly root: Locator;
  readonly resLine1: Locator;
  readonly resLine2: Locator;
  readonly resCity: Locator;
  readonly resState: Locator;
  readonly resPostal: Locator;
  readonly sameAsResidential: Locator;
  readonly mailLine1: Locator;
  readonly mailLine2: Locator;
  readonly mailCity: Locator;
  readonly mailState: Locator;
  readonly mailPostal: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly alternatePhone: Locator;
  readonly preferredMode: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('address-contact-page');
    this.resLine1 = page.getByTestId('residential-address-line-1-input');
    this.resLine2 = page.getByTestId('residential-address-line-2-input');
    this.resCity = page.getByTestId('residential-city-input');
    this.resState = page.getByTestId('residential-state-province-select');
    this.resPostal = page.getByTestId('residential-postal-code-input');
    this.sameAsResidential = page.getByTestId('address-same-as-residential-checkbox');
    this.mailLine1 = page.getByTestId('mailing-address-line-1-input');
    this.mailLine2 = page.getByTestId('mailing-address-line-2-input');
    this.mailCity = page.getByTestId('mailing-city-input');
    this.mailState = page.getByTestId('mailing-state-province-select');
    this.mailPostal = page.getByTestId('mailing-postal-code-input');
    this.email = page.getByTestId('contact-primary-email-input');
    this.mobile = page.getByTestId('contact-mobile-number-input');
    this.alternatePhone = page.getByTestId('contact-alternate-phone-input');
    this.preferredMode = page.getByTestId('contact-preferred-mode-select');
    this.saveButton = page.getByTestId('address-contact-save-continue-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/address-contact`);
    await expect(this.root).toBeVisible();
  }

  async fillResidential(a: Pick<AddressData, 'line1' | 'line2' | 'city' | 'state' | 'postalCode'>): Promise<void> {
    await this.resLine1.fill(a.line1);
    await this.resLine2.fill(a.line2 ?? '');
    await this.resCity.fill(a.city);
    await this.resState.selectOption(a.state);
    await this.resPostal.fill(a.postalCode);
  }

  async fillContact(a: Pick<AddressData, 'email' | 'mobile' | 'alternatePhone' | 'preferredMode'>): Promise<void> {
    await this.email.fill(a.email);
    await this.mobile.fill(a.mobile);
    await this.alternatePhone.fill(a.alternatePhone ?? '');
    await this.preferredMode.selectOption(a.preferredMode);
  }

  async setSameAsResidential(on: boolean): Promise<void> {
    await this.sameAsResidential.setChecked(on);
  }

  async fillMailing(m: NonNullable<AddressData['mailing']>): Promise<void> {
    await this.mailLine1.fill(m.line1);
    await this.mailLine2.fill(m.line2 ?? '');
    await this.mailCity.fill(m.city);
    await this.mailState.selectOption(m.state);
    await this.mailPostal.fill(m.postalCode);
  }

  async fill(a: AddressData): Promise<void> {
    await this.fillResidential(a);
    await this.setSameAsResidential(a.sameAsResidential);
    if (!a.sameAsResidential && a.mailing) await this.fillMailing(a.mailing);
    await this.fillContact(a);
  }

  async save(options: { ignoreBrowserValidation?: boolean } = {}): Promise<void> {
    if (options.ignoreBrowserValidation) await disableBrowserValidation(this.page, 'address-contact-form');
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSave(a: AddressData): Promise<void> {
    await this.fill(a);
    await this.save();
    await expect(this.page).toHaveURL(/kyc-financial/);
  }

  async mailingValues(): Promise<{ line1: string; city: string; state: string; postal: string }> {
    return {
      line1: await this.mailLine1.inputValue(),
      city: await this.mailCity.inputValue(),
      state: await this.mailState.inputValue(),
      postal: await this.mailPostal.inputValue(),
    };
  }

  async residentialValues(): Promise<{ line1: string; city: string; state: string; postal: string }> {
    return {
      line1: await this.resLine1.inputValue(),
      city: await this.resCity.inputValue(),
      state: await this.resState.inputValue(),
      postal: await this.resPostal.inputValue(),
    };
  }
}
