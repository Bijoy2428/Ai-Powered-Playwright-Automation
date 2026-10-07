import { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';

/** Login / sign-up popup shown when a guest performs a member-only action (e.g. Add to Cart). */
export class LoginModal {
  readonly root: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('.lzd-login-signup-popup-wrapper');
    this.usernameInput = this.root.getByPlaceholder('Please enter your Phone or Email');
    this.passwordInput = this.root.getByPlaceholder('Please enter your password');
    this.loginButton = this.root.getByRole('button', { name: /login/i });
    this.closeButton = this.root.locator('[class*="close"]').first();
  }

  @step()
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
