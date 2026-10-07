import { expect, Locator, Page } from '@playwright/test';
import { step } from '../utils/step';
import { BasePage } from './BasePage';
import { LoginModal } from '../components/LoginModal';
import { parsePrice } from '../utils/price';

export class ProductPage extends BasePage {
  protected path = '/';

  readonly title: Locator;
  readonly currentPrice: Locator;
  readonly originalPrice: Locator;
  readonly ratingSummary: Locator;
  readonly quantityInput: Locator;
  readonly quantityIncrease: Locator;
  readonly quantityDecrease: Locator;
  readonly buyNowButton: Locator;
  readonly addToCartButton: Locator;
  readonly loginModal: LoginModal;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('h1.pdp-mod-product-badge-title');
    this.currentPrice = page.locator('.pdp-price_type_normal').first();
    this.originalPrice = page.locator('.pdp-price_type_deleted').first();
    this.ratingSummary = page.locator('.pdp-review-summary__link').first();
    this.quantityInput = page.locator('.next-number-picker-input input');
    this.quantityIncrease = page.locator('.next-number-picker-handler-up');
    this.quantityDecrease = page.locator('.next-number-picker-handler-down');
    this.buyNowButton = page.getByRole('button', { name: 'Buy Now' });
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.loginModal = new LoginModal(page);
  }

  @step()
  async openByUrl(productPath: string): Promise<void> {
    this.path = productPath;
    await this.open();
  }

  override async waitForLoaded(): Promise<void> {
    await this.title.waitFor({ state: 'visible' });
  }

  async price(): Promise<number> {
    return parsePrice(await this.currentPrice.innerText());
  }

  async quantity(): Promise<number> {
    return Number(await this.quantityInput.inputValue());
  }

  @step()
  async increaseQuantity(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.clickAndWaitForQuantityChange(this.quantityIncrease);
  }

  @step()
  async decreaseQuantity(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.clickAndWaitForQuantityChange(this.quantityDecrease);
  }

  /** The picker can ignore clicks until the page hydrates, so retry until the value actually changes. */
  private async clickAndWaitForQuantityChange(button: Locator): Promise<void> {
    const before = await this.quantityInput.inputValue();
    await expect(async () => {
      await button.click();
      await expect(this.quantityInput).not.toHaveValue(before, { timeout: 3_000 });
    }).toPass({ timeout: 10_000 });
  }

  @step()
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  @step()
  async buyNow(): Promise<void> {
    await this.buyNowButton.click();
  }
}
