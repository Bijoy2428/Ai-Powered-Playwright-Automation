import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.daraz.com.bd',
  memberUrl: process.env.MEMBER_URL ?? 'https://member.daraz.com.bd',
  cartUrl: process.env.CART_URL ?? 'https://cart.daraz.com.bd',
  headless: (process.env.HEADLESS ?? 'true') !== 'false',
  storageStatePath: path.resolve(__dirname, '../../.auth/user.json'),
} as const;
