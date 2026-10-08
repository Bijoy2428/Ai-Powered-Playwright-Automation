import { Page } from '@playwright/test';
import { step } from '../utils/step';
import { Header } from '../components/Header';
import { LoginModal } from '../components/LoginModal';

/**
 * Common behaviour shared by every page object.
 * Page objects expose intent-level actions and locators; assertions live in specs.
 */
export abstract class BasePage {
  readonly header: Header;
  /** Login popup — can be opened from any page (header LOGIN, Add to Cart as guest, …). */
  readonly loginModal: LoginModal;

  protected constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.loginModal = new LoginModal(page);
  }

  /** Relative (to baseURL) or absolute URL of the page. */
  protected abstract readonly path: string;

  @step()
  async open(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitForLoaded();
  }

  /** Override to wait for a page-specific "ready" signal. */
  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async pageTitle(): Promise<string> {
    return this.page.title();
  }

  url(): string {
    return this.page.url();
  }
}
