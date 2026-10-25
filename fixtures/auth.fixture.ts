import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';
import { authFile, type Role } from './users';
import { alphaId } from '../utils/dataGenerator';

export const NO_SESSION = { cookies: [], origins: [] };

/** Use at file/describe level: `test.use(asRole('learner'))` starts every test already logged in as that role. */
export function asRole(role: Role): { storageState: string } {
  return { storageState: authFile(role) };
}

interface Fixtures {
  /** API client with the static key from .env (new instance per test). */
  api: ApiClient;
  /** Short letters-only id, unique per test (safe inside names). */
  uid: string;
  /** Opens a page for ANOTHER seeded role in its own browser context (for data-isolation tests). */
  otherAgent: (role: Role) => Promise<Page>;
  /** Auto fixture: attaches console errors and failed network calls to the report when a test fails. */
  evidence: void;
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.dispose();
  },

  uid: async ({}, use) => {
    await use(alphaId(6));
  },

  otherAgent: async ({ browser, baseURL }, use, testInfo) => {
    const contexts: BrowserContext[] = [];
    await use(async (role: Role) => {
      const context = await browser.newContext({ baseURL, storageState: authFile(role) });
      contexts.push(context);
      return context.newPage();
    });
    for (const context of contexts) {
      if (testInfo.status !== testInfo.expectedStatus) {
        for (const [i, p] of context.pages().entries()) {
          const body = await p.screenshot().catch(() => null);
          if (body) await testInfo.attach(`other-agent-page-${i}.png`, { body, contentType: 'image/png' });
        }
      }
      await context.close();
    }
  },

  evidence: [
    async ({ page }, use, testInfo) => {
      const log: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') log.push(`[console.${m.type()}] ${m.text()}`);
      });
      page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));
      page.on('response', (r) => {
        if (r.status() >= 400) log.push(`[http ${r.status()}] ${r.request().method()} ${r.url()}`);
      });
      await use();
      if (testInfo.status !== testInfo.expectedStatus && log.length > 0) {
        await testInfo.attach('console-and-network.log', { body: log.join('\n'), contentType: 'text/plain' });
      }
    },
    { auto: true },
  ],
});

export { expect };
