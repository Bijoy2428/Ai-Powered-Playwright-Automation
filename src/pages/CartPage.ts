import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../config/env';

/**
 * Shopping cart. Only reachable as a logged-in user (guests are redirected to login).
 * NOTE: selectors below are role/text based because the cart could not be inspected
 * without an account — verify them once a saved session exists (npm run auth:save).
 */
export class CartPage extends BasePage {
  readonly path = `${env.cartUrl}/cart`;

  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly selectAllCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByRole('button', { name: /proceed to checkout/i });
    this.emptyCartMessage = page.getByText(/there are no items in this cart/i);
    this.selectAllCheckbox = page.getByText(/select all/i).first();
  }

  override async waitForLoaded(): Promise<void> {
    await this.page.waitForURL(/cart\.daraz\.com\.bd\/cart/);
  }

  isRedirectedToLogin(): boolean {
    return /member\.daraz\.com\.bd\/user\/login/.test(this.page.url());
  }
}
