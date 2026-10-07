import { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';

/** Global site header (search bar, cart icon, login/sign-up links). Present on every page. */
export class Header {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartIcon: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('input#q');
    this.searchButton = page.locator('a[class*="search-box__button"]');
    this.cartIcon = page.locator('a[href*="cart.daraz.com.bd/cart"]').first();
    this.loginLink = page.locator('#anonLogin a');
    this.signupLink = page.locator('#anonSignup a');
  }

  @step()
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await Promise.all([this.page.waitForURL(/\/catalog\/\?.*q=/), this.searchInput.press('Enter')]);
  }

  @step()
  async searchByButton(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await Promise.all([this.page.waitForURL(/\/catalog\/\?.*q=/), this.searchButton.click()]);
  }
}
