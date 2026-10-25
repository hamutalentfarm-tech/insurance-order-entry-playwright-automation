import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { TestFile } from '../utils/fileUploadHelper';

export type DocumentType = 'KYC_ID' | 'ADDRESS_PROOF' | 'INCOME_PROOF' | 'OTHER';

/** /applications/{id}/documents */
export class DocumentUploadPage extends BasePage {
  readonly root: Locator;
  readonly typeSelect: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;
  readonly continueLink: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('documents-page');
    this.typeSelect = page.getByTestId('document-type-select');
    this.fileInput = page.getByTestId('document-upload-kyc');
    this.uploadButton = page.getByTestId('document-upload-button');
    this.table = page.getByTestId('documents-table');
    this.emptyState = page.getByTestId('documents-empty-state');
    this.continueLink = page.getByTestId('documents-continue-review-button');
  }

  async goto(applicationId: number): Promise<void> {
    await this.page.goto(`/applications/${applicationId}/documents`);
    await expect(this.root).toBeVisible();
  }

  async upload(type: DocumentType, file: TestFile): Promise<void> {
    await this.typeSelect.selectOption(type);
    await this.fileInput.setInputFiles(file.path);
    await this.uploadButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  rows(): Locator {
    return this.page.locator('[data-testid^="document-row-"]');
  }

  async rowTexts(): Promise<string[]> {
    return (await this.rows().allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  }

  async continueToReview(): Promise<void> {
    await this.continueLink.click();
    await expect(this.page).toHaveURL(/\/review/);
  }
}
