import { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';
import { BasePage } from './BasePage';
import { env } from '../config/env';

export class LoginPage extends BasePage {
  protected readonly path = `${env.memberUrl}/user/login`;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly facebookButton: Locator;
  readonly googleButton: Locator;
  readonly fieldErrors: Locator;
  /** Anti-bot slider shown on submit. It is intentionally NOT automated. */
  readonly captchaSlider: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Please enter your Phone Number or Email');
    this.passwordInput = page.getByPlaceholder('Please enter your password');
    this.loginButton = page.getByRole('button', { name: 'LOGIN', exact: true });
    this.forgotPasswordLink = page.getByText('Forgot Password?');
    this.registerLink = page.getByRole('link', { name: /register here/i });
    this.facebookButton = page.getByRole('button', { name: 'Facebook' });
    this.googleButton = page.getByRole('button', { name: 'Google' });
    this.fieldErrors = page.getByText("You can't leave this empty.");
    this.captchaSlider = page.getByText(/slide to verify/i);
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
}
