import { test, expect } from '../src/fixtures/test';
import { loginData } from '../src/data/testData';

const REQUIRED = "You can't leave this empty.";

test.describe('Login page', { tag: '@auth' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('renders the login form', { tag: '@smoke' }, async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.facebookButton).toBeVisible();
    await expect(loginPage.googleButton).toBeVisible();
  });

  test.describe('form validation', () => {
    test('empty submit flags both fields as required', { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.submit();

      await expect(loginPage.usernameError).toHaveText(REQUIRED);
      await expect(loginPage.passwordError).toHaveText(REQUIRED);
    });

    for (const data of loginData.missingField) {
      test(
        `only the empty field is flagged when ${data.case}`,
        { tag: '@regression' },
        async ({ loginPage }) => {
          await loginPage.login(data.username, data.password);

          await expect(loginPage.errorFor(data.errorOn)).toHaveText(REQUIRED);
          await expect(loginPage.errorFor(data.okOn)).toBeHidden();
        },
      );
    }

    test('error clears once the field is filled', { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.submit();
      await expect(loginPage.usernameError).toBeVisible();

      await loginPage.usernameInput.fill(loginData.invalidUser.username);
      await expect(loginPage.usernameError).toBeHidden();
    });
  });

  test('password visibility can be toggled', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.passwordInput.fill(loginData.invalidUser.password);

    await test.step('show password', async () => {
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    });

    await test.step('hide password again', async () => {
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    await expect(loginPage.passwordInput).toHaveValue(loginData.invalidUser.password);
  });

  test(
    'invalid credentials are blocked and the user stays logged out',
    { tag: '@regression' },
    async ({ loginPage, page }) => {
      await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);

      // Daraz answers an unknown login with its anti-bot slider. We only assert it appears — never solve it.
      await expect(loginPage.botChallenge).toBeVisible();
      await expect(page).toHaveURL(/\/user\/login/);
    },
  );

  test.describe('navigation', () => {
    test('"Forgot Password?" opens password recovery', { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.goToForgotPassword();
      await expect(loginPage.usernameInput).toBeVisible();
    });

    test('"Register" opens the sign-up page', { tag: '@regression' }, async ({ loginPage, page }) => {
      await loginPage.goToRegister();
      await expect(page).toHaveURL(/\/user\/register/);
    });
  });
});

test.describe('Login entry points', { tag: '@auth' }, () => {
  test('header LOGIN opens the login popup', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.open();
    await homePage.header.openLogin();

    await expect(homePage.loginModal.root).toBeVisible();
    await expect(homePage.loginModal.usernameInput).toBeVisible();
    await expect(homePage.loginModal.passwordInput).toBeVisible();
  });

  test('login popup can be closed', { tag: '@regression' }, async ({ homePage }) => {
    await homePage.open();
    await homePage.header.openLogin();
    await expect(homePage.loginModal.root).toBeVisible();

    await homePage.loginModal.close();
    await expect(homePage.loginModal.root).toBeHidden();
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
