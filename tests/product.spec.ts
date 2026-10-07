import { test, expect } from '../src/fixtures/test';

test.describe('Product detail page', { tag: '@product' }, () => {
  let cardTitle: string;

  test.beforeEach(async ({ searchResultsPage, productPage }) => {
    await searchResultsPage.openFor('mouse');
    cardTitle = await searchResultsPage.openProduct(0);
    await productPage.waitForLoaded();
  });

  test('opens the same product that was selected', { tag: '@smoke' }, async ({ productPage }) => {
    await expect(productPage.title).toHaveText(cardTitle.trim());
  });

  test('shows price and purchase buttons', { tag: '@smoke' }, async ({ productPage }) => {
    expect(await productPage.price()).toBeGreaterThan(0);
    await expect(productPage.buyNowButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test('quantity can be increased and decreased', { tag: '@regression' }, async ({ productPage }) => {
    await expect(productPage.quantityInput).toHaveValue('1');

    // Only go 1 → 2 → 1: the first search result may have a low stock limit.
    await test.step('increase quantity', async () => {
      await productPage.increaseQuantity();
      await expect(productPage.quantityInput).toHaveValue('2');
    });

    await test.step('decrease quantity', async () => {
      await productPage.decreaseQuantity();
      await expect(productPage.quantityInput).toHaveValue('1');
    });
  });

  test('guest "Add to Cart" prompts the user to log in', { tag: '@regression' }, async ({ productPage }) => {
    await productPage.addToCart();

    const modal = productPage.loginModal;
    await expect(modal.root).toBeVisible();
    await expect(modal.usernameInput).toBeVisible();
    await expect(modal.passwordInput).toBeVisible();
  });
});
