import { test, expect } from '../src/fixtures/test';

test.describe('Home page', { tag: '@home' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('loads with the correct page title', { tag: '@smoke' }, async ({ page }) => {
    await expect(page).toHaveTitle(/Daraz/i);
  });

  test('header shows search bar, cart and account links', { tag: '@smoke' }, async ({ homePage }) => {
    const { header } = homePage;

    await test.step('search bar is visible with placeholder', async () => {
      await expect(header.searchInput).toBeVisible();
      await expect(header.searchInput).toHaveAttribute('placeholder', 'Search in Daraz');
    });

    await test.step('cart, login and sign-up links are present', async () => {
      await expect(header.cartIcon).toBeAttached();
      await expect(header.loginLink).toBeVisible();
      await expect(header.signupLink).toBeVisible();
    });
  });
});
