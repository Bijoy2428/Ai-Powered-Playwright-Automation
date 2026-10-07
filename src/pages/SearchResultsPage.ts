import { Locator, Page } from '@playwright/test';
import { step } from '../utils/step';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export type SortOption = 'Best Match' | 'Price low to high' | 'Price high to low';

export class SearchResultsPage extends BasePage {
  protected path = '/catalog/';

  readonly productCards: Locator;
  readonly resultSummary: Locator;
  readonly sortDropdown: Locator;
  readonly pagination: Locator;
  readonly activePage: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('[data-qa-locator="product-item"]');
    // The keyword is rendered in a sibling element, so target the parent of the "N items found for" span.
    this.resultSummary = page
      .getByText(/items? found for/i)
      .first()
      .locator('..');
    this.sortDropdown = page.locator('.ant-select').first();
    this.pagination = page.locator('.ant-pagination');
    this.activePage = this.pagination.locator('.ant-pagination-item-active');
  }

  @step()
  async openFor(keyword: string): Promise<void> {
    this.path = `/catalog/?q=${encodeURIComponent(keyword)}`;
    await this.open();
  }

  override async waitForLoaded(): Promise<void> {
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  card(index: number) {
    const root = this.productCards.nth(index);
    return {
      root,
      title: root.locator('a[title]').first(),
      price: root.locator('.ooOxS').first(),
      link: root.locator('a[href*="/products/"]').first(),
    };
  }

  async productTitles(limit = 10): Promise<string[]> {
    await this.waitForLoaded();
    const titles = await this.productCards
      .locator('a[title]')
      .evaluateAll((els, max) => els.slice(0, max).map((e) => e.getAttribute('title') ?? ''), limit);
    return titles;
  }

  async productPrices(limit = 10): Promise<number[]> {
    await this.waitForLoaded();
    const raw = await this.productCards.locator('.ooOxS').allInnerTexts();
    return raw.slice(0, limit).map(parsePrice);
  }

  @step()
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.click();
    await Promise.all([
      this.page.waitForURL(option === 'Best Match' ? /catalog/ : /sort=/),
      this.page.locator('.ant-select-item-option', { hasText: option }).click(),
    ]);
    await this.waitForLoaded();
  }

  @step()
  async goToPage(pageNumber: number): Promise<void> {
    await Promise.all([
      this.page.waitForURL(new RegExp(`page=${pageNumber}`)),
      this.pagination.locator(`.ant-pagination-item-${pageNumber}`).click(),
    ]);
    await this.waitForLoaded();
  }

  /** Opens the product at `index` in the current tab and returns its title as shown on the card. */
  @step()
  async openProduct(index = 0): Promise<string> {
    const { title, link } = this.card(index);
    const productTitle = (await title.getAttribute('title')) ?? '';
    const href = await link.getAttribute('href');
    if (!href) throw new Error(`Product card ${index} has no link`);
    // Cards can open in a new tab depending on A/B variants; navigating directly keeps tests deterministic.
    await this.page.goto(href.startsWith('//') ? `https:${href}` : href, { waitUntil: 'domcontentloaded' });
    return productTitle;
  }
}
