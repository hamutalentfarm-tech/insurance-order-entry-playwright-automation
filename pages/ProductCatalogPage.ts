import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /products and /products/{id} */
export class ProductCatalogPage extends BasePage {
  readonly root: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByTestId('product-catalog-page');
  }

  async goto(): Promise<void> {
    await this.page.goto('/products');
    await expect(this.root).toBeVisible();
  }

  card(code: string): Locator {
    return this.page.getByTestId(`product-card-${code}`);
  }

  async productCodes(): Promise<string[]> {
    const ids = await this.page
      .locator('[data-testid^="product-card-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-testid') ?? ''));
    return ids.map((t) => t.replace('product-card-', ''));
  }

  async openDetails(code: string): Promise<void> {
    await this.page.getByTestId(`product-details-${code}`).click();
    await expect(this.page.getByTestId('product-detail-page')).toBeVisible();
  }

  async detail(): Promise<{ name: string; code: string; features: string }> {
    return {
      name: (await this.page.getByTestId('product-name').innerText()).trim(),
      code: (await this.page.getByTestId('product-code').innerText()).trim(),
      features: (await this.page.getByTestId('product-features').innerText()).trim(),
    };
  }
}
