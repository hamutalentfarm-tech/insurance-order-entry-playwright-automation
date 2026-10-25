import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ClientData } from '../fixtures/applicationData';
import { disableBrowserValidation } from '../utils/testHelpers';

/** /applications/{id}/client */
export class ClientInformationPage extends BasePage {
  readonly root: Locator;
  readonly firstName: Locator;
  readonly middleName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly gender: Locator;
  readonly maritalStatus: Locator;
  readonly nationality: Locator;
  readonly occupation: Locator;
  readonly employerName: Locator;
  readonly employerAddress: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('client-information-page');
    this.firstName = page.getByTestId('client-first-name-input');
    this.middleName = page.getByTestId('client-middle-name-input');
    this.lastName = page.getByTestId('client-last-name-input');
    this.dob = page.getByTestId('client-dob-input');
    this.gender = page.getByTestId('client-gender-select');
    this.maritalStatus = page.getByTestId('client-marital-status-select');
    this.nationality = page.getByTestId('client-nationality-input');
    this.occupation = page.getByTestId('client-occupation-input');
    this.employerName = page.getByTestId('client-employer-name-input');
    this.employerAddress = page.getByTestId('client-employer-address-input');
    this.saveButton = page.getByTestId('client-save-continue-button');
  }

  /** Locator for each mandatory field, keyed like ClientData. */
  field(key: 'firstName' | 'lastName' | 'dob' | 'gender' | 'maritalStatus' | 'nationality' | 'occupation' | 'employerName' | 'employerAddress'): Locator {
    return this[key];
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/client`);
    await expect(this.root).toBeVisible();
  }

  async fill(d: ClientData): Promise<void> {
    await this.firstName.fill(d.firstName);
    await this.middleName.fill(d.middleName ?? '');
    await this.lastName.fill(d.lastName);
    await this.dob.fill(d.dob);
    await this.gender.selectOption(d.gender);
    await this.maritalStatus.selectOption(d.maritalStatus);
    await this.nationality.fill(d.nationality);
    await this.occupation.fill(d.occupation);
    await this.employerName.fill(d.employerName);
    await this.employerAddress.fill(d.employerAddress);
  }

  async save(options: { ignoreBrowserValidation?: boolean } = {}): Promise<void> {
    if (options.ignoreBrowserValidation) await disableBrowserValidation(this.page, 'client-information-form');
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSave(d: ClientData): Promise<void> {
    await this.fill(d);
    await this.save();
    await expect(this.page).toHaveURL(/address-contact/);
  }

  async values(): Promise<Record<string, string>> {
    return {
      firstName: await this.firstName.inputValue(),
      lastName: await this.lastName.inputValue(),
      dob: await this.dob.inputValue(),
      gender: await this.gender.inputValue(),
      maritalStatus: await this.maritalStatus.inputValue(),
      nationality: await this.nationality.inputValue(),
      occupation: await this.occupation.inputValue(),
      employerName: await this.employerName.inputValue(),
      employerAddress: await this.employerAddress.inputValue(),
    };
  }
}
