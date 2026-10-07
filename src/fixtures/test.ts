import { test as base, expect } from '@playwright/test';
import { CartPage, HomePage, LoginPage, ProductPage, SearchResultsPage } from '../pages';

type Pages = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  productPage: ProductPage;
  loginPage: LoginPage;
  cartPage: CartPage;
};

/** Extends Playwright's `test` so specs receive ready-made page objects as fixtures. */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  searchResultsPage: async ({ page }, use) => use(new SearchResultsPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
});

export { expect };
