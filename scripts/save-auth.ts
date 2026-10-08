/**
 * One-time manual login that saves the session to .auth/user.json.
 *
 * Daraz protects login with a slider CAPTCHA, which must not be automated.
 * This opens a real browser — log in by hand (including the slider). The script
 * detects the successful login itself and saves the session; no other step needed.
 *
 *   npm run auth:save
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { env } from '../src/config/env';

const LOGIN_TIMEOUT_MS = 5 * 60_000;

void (async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  try {
    await page.goto(`${env.memberUrl}/user/login`);
    console.log(`Log in manually in the opened browser (you have ${LOGIN_TIMEOUT_MS / 60_000} minutes)...`);

    // Any page outside /user/login means the login went through.
    await page.waitForURL((url) => !url.pathname.startsWith('/user/login'), { timeout: LOGIN_TIMEOUT_MS });
    await page.waitForLoadState('domcontentloaded');

    fs.mkdirSync(path.dirname(env.storageStatePath), { recursive: true });
    await context.storageState({ path: env.storageStatePath });
    console.log(`✔ Logged in. Session saved to ${env.storageStatePath}`);
    console.log('  Run the logged-in tests with: npm run test:auth');
  } catch {
    console.error('✘ Login was not completed in time — nothing was saved.');
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
