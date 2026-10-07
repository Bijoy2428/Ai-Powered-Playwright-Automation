import { test, expect } from '../src/fixtures/test';
import { loginData } from '../src/data/testData';

test.describe('Login page', { tag: '@auth' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('renders the login form', { tag: '@smoke' }, async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.facebookButton).toBeVisible();
    await expect(loginPage.googleButton).toBeVisible();
  });

  test('empty submit shows required-field errors', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.submit();
    await expect(loginPage.fieldErrors).toHaveCount(2);
  });

  test('invalid credentials are not accepted', { tag: '@regression' }, async ({ loginPage, page }) => {
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    // Daraz shows an anti-bot slider or an error; either way the user must stay on the login page.
    await expect(page).toHaveURL(/user\/login/);
  });

  test(
    'guest opening the cart is redirected to login',
    { tag: '@regression' },
    async ({ cartPage, page }) => {
      await page.goto(cartPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/member\.daraz\.com\.bd\/user\/login/);
    },
  );
});
