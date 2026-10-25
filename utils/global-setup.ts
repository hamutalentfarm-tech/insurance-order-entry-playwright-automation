import { chromium, type FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { env } from './env';
import { LOGIN_ROLES, authFile, emailOf, type Role } from '../fixtures/users';
import { LoginPage } from '../pages/LoginPage';

/** Logs in once per role and saves the session. Also called again after tests that log in or out. */
export async function saveLogins(roles: Role[] = LOGIN_ROLES): Promise<void> {
  fs.mkdirSync(path.resolve(__dirname, '..', '.auth'), { recursive: true });
  const browser = await chromium.launch();
  const failures: string[] = [];
  try {
    for (const role of roles) {
      const context = await browser.newContext({ baseURL: env.baseUrl });
      const page = await context.newPage();
      try {
        await new LoginPage(page).loginAndWait(emailOf(role), env.password);
        await context.storageState({ path: authFile(role) });
        console.log(`[setup] saved login for ${role} (${emailOf(role)})`);
      } catch (e) {
        failures.push(`${role} (${emailOf(role)}): ${(e as Error).message.split('\n')[0]}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (failures.length) {
    throw new Error(
      `[setup] Could not log in, so no saved session was created.\n  - ${failures.join('\n  - ')}\n` +
        'Check .env: INSURANCE_BASE_URL, INSURANCE_PASSWORD and LEARNER_USER (your own assigned account).',
    );
  }
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const base = env.baseUrl;

  const attempts: { url: string; headers: Record<string, string> }[] = [
    { url: `${base}/login`, headers: {} },
    { url: `${base}/api/health`, headers: process.env.INSURANCE_API_KEY ? { 'X-API-Key': process.env.INSURANCE_API_KEY } : {} },
  ];
  const seen: string[] = [];
  let healthy = false;
  for (const a of attempts) {
    try {
      const res = await fetch(a.url, { headers: a.headers, redirect: 'manual', signal: AbortSignal.timeout(15_000) });
      seen.push(`${a.url} -> HTTP ${res.status}`);
      if (res.status < 500) { healthy = true; break; }
    } catch (e) {
      const err = e as Error & { cause?: { code?: string } };
      seen.push(`${a.url} -> ${err.message}${err.cause?.code ? ` (${err.cause.code})` : ''}`);
    }
  }
  if (!healthy) {
    throw new Error(`ENVIRONMENT: the Insurance app did not answer from Node at ${base}.\n  ${seen.join('\n  ')}`);
  }
  console.log(`[setup] application reachable: ${seen[seen.length - 1]}`);

  if (process.env.SKIP_AUTH_SETUP === '1') {
    console.warn('[setup] SKIP_AUTH_SETUP=1: skipping saved logins.');
    return;
  }
  if (!env.hasPassword) throw new Error('[setup] INSURANCE_PASSWORD is not set in .env');

  await saveLogins();
}