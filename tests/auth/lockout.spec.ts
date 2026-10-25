import { test, expect, NO_SESSION } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { env } from '../../utils/env';
import { MSG } from '../../utils/messages';
import { expectApiError } from '../../utils/assertions';
import { name, meta } from '../../utils/testMeta';

test.use({ storageState: NO_SESSION });
// DESTRUCTIVE: this locks the disposable account (about 30 minutes, DEMO_LOCKOUT_MINUTES). Runs in its own file, last.
test.describe.configure({ mode: 'serial' });

test.describe('Authentication: lockout (destructive)', () => {
  test.skip(!env.disposableEmail, 'Set DISPOSABLE_USER in .env to a spare learner account to run the lockout test (it will be locked).');

  test(name('TC-AUTH-007', 'account locks after five failed attempts'), meta('TC-AUTH-007'), async ({ page, api }, testInfo) => {
    const login = new LoginPage(page);
    const user = env.disposableEmail;
    const messages: string[] = [];

    await login.goto();
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await test.step(`failed attempt ${attempt}`, async () => {
        await login.login(user, `Wrong#Pass${attempt}x`);
        await login.expectOnLogin();
        const text = (await login.errorMessages()).join(' | ');
        messages.push(`attempt ${attempt}: ${text}`);
        if (attempt < 5) expect(text, `attempt ${attempt} must not report a lock yet`).not.toMatch(MSG.accountLocked);
        await login.goto();
      });
    }
    testInfo.annotations.push({ type: 'observed-messages', description: messages.join(' || ') });

    await test.step('attempt 6 with the CORRECT password is still denied', async () => {
      await login.login(user, env.password);
      await login.expectOnLogin();
      await login.expectErrorMatching(MSG.accountLocked);
      await login.expectSessionBlocked('/dashboard');
    });

    await test.step('API also reports the account as locked', async () => {
      expectApiError(await api.login(user, env.password), 403, MSG.accountLocked);
    });
  });
});
