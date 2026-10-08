import { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';
import { BasePage } from './BasePage';
import { env } from '../config/env';

export type LoginField = 'username' | 'password';

export class LoginPage extends BasePage {
  protected readonly path = `${env.memberUrl}/user/login`;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly loginButton: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly facebookButton: Locator;
  readonly googleButton: Locator;
  /**
   * Anti-bot "drag the slider" dialog that Daraz shows on login attempts.
   * It is only DETECTED — solving or bypassing it is intentionally out of scope.
   */
  readonly botChallenge: Locator;

  constructor(page: Page) {
    super(page);
    const usernameField = page.locator('.mod-input-loginName');
    const passwordField = page.locator('.mod-input-password');

    this.usernameInput = usernameField.locator('input');
    this.passwordInput = passwordField.locator('input');
    this.passwordVisibilityToggle = passwordField.locator('.mod-input-password-icon');
    this.loginButton = page.getByRole('button', { name: 'LOGIN', exact: true });
    // Each field gets an `error` class plus a message span when validation fails.
    this.usernameError = page.locator('.mod-input-loginName.error > span');
    this.passwordError = page.locator('.mod-input-password.error > span');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.registerLink = page.locator('a[href="/user/register"]');
    this.facebookButton = page.getByRole('button', { name: 'Facebook' });
    this.googleButton = page.getByRole('button', { name: 'Google' });
    this.botChallenge = page.locator('iframe#baxia-dialog-content');
  }

  errorFor(field: LoginField): Locator {
    return field === 'username' ? this.usernameError : this.passwordError;
  }

  override async waitForLoaded(): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  @step()
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  @step()
  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  @step()
  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  @step()
  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  @step()
  async goToForgotPassword(): Promise<void> {
    await Promise.all([this.page.waitForURL(/\/user\/forget-password/), this.forgotPasswordLink.click()]);
  }

  @step()
  async goToRegister(): Promise<void> {
    await Promise.all([this.page.waitForURL(/\/user\/register/), this.registerLink.click()]);
  }
}
