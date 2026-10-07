import fs from 'fs';
import { test, expect } from '../src/fixtures/test';
import { env } from '../src/config/env';

// Runs only in the "chromium-auth" project, using a session saved by `npm run auth:save`.
test.skip(!fs.existsSync(env.storageStatePath), 'No saved session — run `npm run auth:save` first.');

test.describe('Cart (logged-in user)', { tag: '@cart' }, () => {
  test('logged-in user can open the cart', async ({ cartPage }) => {
    await cartPage.open();
    expect(cartPage.isRedirectedToLogin()).toBe(false);
  });

  test('add a product to cart from the product page', async ({ searchResultsPage, productPage, page }) => {
    await searchResultsPage.openFor('mouse');
    await searchResultsPage.openProduct(0);
    await productPage.waitForLoaded();

    await productPage.addToCart();

    await expect(productPage.loginModal.root).toBeHidden();
    await expect(page.getByText(/added to cart/i).first()).toBeVisible();
  });
});
