import { test, expect, NO_SESSION } from '../../fixtures/auth.fixture';
import { emailOf, type Role } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { env } from '../../utils/env';
import { MSG } from '../../utils/messages';
import { errorTexts, expectApiError } from '../../utils/assertions';
import { isNativelyInvalid } from '../../utils/testHelpers';
import { name, meta } from '../../utils/testMeta';
import { saveLogins } from '../../utils/global-setup';

// Login tests start with NO saved session.
test.use({ storageState: NO_SESSION });
test.afterAll(async () => {
  await saveLogins(); // login/logout tests may have invalidated the saved sessions
});
test.describe('Authentication: login, logout and access control', () => {
  test(name('TC-AUTH-001', 'valid agent can log in'), meta('TC-AUTH-001'), async ({ page }) => {
    const login = new LoginPage(page);
    for (const role of ['valid', 'draft', 'new', 'submitted'] as Role[]) {
      await test.step(`log in as ${role}`, async () => {
        await page.context().clearCookies();
        await login.loginAndWait(emailOf(role), env.password);
        await login.expectNoErrors();
      });
    }
  });

  test(name('TC-AUTH-002', 'invalid password shows the invalid-credentials message'), meta('TC-AUTH-002'), async ({ page }) => {
    // Uses the learner account (not a seeded user): a wrong password counts towards the 5-attempt lock.
    const login = new LoginPage(page);
    await login.goto();
    await login.login(emailOf('learner'), 'Wrong#Pass123');
    await login.expectOnLogin();
    await login.expectErrorMatching(MSG.invalidCredentials);
    await login.expectSessionBlocked('/dashboard');
  });

  test(name('TC-AUTH-003', 'blank username and password are rejected'), meta('TC-AUTH-003'), async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await test.step('browser-level required validation blocks the empty form', async () => {
      expect(await isNativelyInvalid(login.email), 'email field invalid when empty').toBe(true);
      expect(await isNativelyInvalid(login.password), 'password field invalid when empty').toBe(true);
      await login.submit();
      await login.expectOnLogin();
    });

    await test.step('server-side: empty form is still rejected when browser validation is bypassed', async () => {
      await login.submitIgnoringBrowserValidation();
      await login.expectOnLogin();
      const messages = await login.errorMessages();
      expect(messages.length, 'server returned at least one validation message').toBeGreaterThan(0);
    });

    await test.step('only the email filled / only the password filled', async () => {
      await login.goto();
      await login.email.fill(emailOf('learner'));
      await login.submitIgnoringBrowserValidation();
      await login.expectOnLogin();
      expect((await login.errorMessages()).length).toBeGreaterThan(0);

      await login.goto();
      await login.password.fill('Something#Else123');
      await login.submitIgnoringBrowserValidation();
      await login.expectOnLogin();
      expect((await login.errorMessages()).length).toBeGreaterThan(0);
    });
  });

  test(name('TC-AUTH-004', 'logout clears the session'), meta('TC-AUTH-004'), async ({ page, browser, baseURL }) => {
    const login = new LoginPage(page);
    await login.loginAndWait(emailOf('learner'), env.password);
    const cookiesBeforeLogout = await page.context().cookies();

    await login.logout();
    await login.expectOnLogin();
    await login.expectSessionBlocked('/dashboard');

    await test.step('the pre-logout session cookie no longer works in a new browser context', async () => {
      const replay = await browser.newContext({ baseURL });
      try {
        await replay.addCookies(cookiesBeforeLogout);
        const p = await replay.newPage();
        await p.goto('/dashboard');
        await expect(p).toHaveURL(/\/login/);
      } finally {
        await replay.close();
      }
    });
  });

  test(name('TC-AUTH-005', 'protected pages redirect to login without a session'), meta('TC-AUTH-005'), async ({ page, api }) => {
    const login = new LoginPage(page);
    const routes = ['/dashboard', '/applications', '/applications/new', '/profile', '/support', '/change-password'];

    const existing = await api.listApplications(emailOf('valid'));
    const firstId = existing.body?.data?.[0]?.id;
    if (firstId) routes.push(`/applications/${firstId}/client`, `/applications/${firstId}/review`);

    for (const route of routes) {
      await test.step(`GET ${route} without a session`, async () => {
        await page.context().clearCookies();
        await login.expectSessionBlocked(route);
      });
    }
  });

  test(name('TC-AUTH-006', 'locked user cannot access the dashboard (UI and API)'), meta('TC-AUTH-006'), async ({ page, api }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(emailOf('locked'), env.password);

    await test.step('UI shows the account-locked message, not the generic invalid-password message', async () => {
      await login.expectOnLogin();
      await login.expectErrorMatching(MSG.accountLocked);
      await login.expectSessionBlocked('/dashboard');
    });

    await test.step('API refuses the same credentials with 403 "Account locked"', async () => {
      const res = await api.login(emailOf('locked'), env.password);
      expectApiError(res, 403, MSG.accountLocked);
      expect(JSON.stringify(res.body?.errors ?? {})).toMatch(/account_status/);
      expect(errorTexts(res).join(' ')).not.toMatch(MSG.invalidCredentials);
    });
  });
});
