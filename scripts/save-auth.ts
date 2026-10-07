/**
 * One-time manual login that saves the session to .auth/user.json.
 *
 * Daraz protects login with a slider CAPTCHA, which must not be automated.
 * This opens a real browser — log in by hand, then press "Resume" in the Playwright Inspector.
 *
 *   npm run auth:save
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { env } from '../src/config/env';

void (async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${env.memberUrl}/user/login`);
  console.log('Log in manually (solve the slider), then click "Resume" in the Inspector.');
  await page.pause();

  fs.mkdirSync(path.dirname(env.storageStatePath), { recursive: true });
  await context.storageState({ path: env.storageStatePath });
  console.log(`Session saved to ${env.storageStatePath}`);
  await browser.close();
})();
