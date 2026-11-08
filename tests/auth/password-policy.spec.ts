import { test, expect, NO_SESSION } from '../../fixtures/auth.fixture';
import { ChangePasswordPage } from '../../pages/ChangePasswordPage';
import { LoginPage } from '../../pages/LoginPage';
import { env } from '../../utils/env';
import { MSG } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use({ storageState: NO_SESSION });

test.describe('Authentication: password policy (dedicated account)', () => {
  test.skip(!env.passwordTestEmail, 'Set PASSWORD_TEST_USER in .env to a spare learner account (NOT your own learner account).');

  test(name('TC-AUTH-008', 'weak passwords are rejected on /change-password'), meta('TC-AUTH-008'), async ({ page, api }, testInfo) => {
    const user = env.passwordTestEmail;
    const username = user.split('@')[0];
    const weak: { label: string; value: string; expected: RegExp }[] = [
      { label: 'under 12 characters', value: 'Ab1!xyz', expected: MSG.pwdLength },
      { label: 'no uppercase', value: 'alllowercase1!xyz', expected: MSG.pwdUpper },
      { label: 'no lowercase', value: 'ALLUPPERCASE1!XYZ', expected: MSG.pwdLower },
      { label: 'no digit', value: 'NoDigitsHere!!Xy', expected: MSG.pwdDigit },
      { label: 'no special character', value: 'NoSpecialChar12Ab', expected: MSG.pwdSpecial },
      { label: 'contains the email username', value: `${username}#Zq9Wpx`, expected: MSG.pwdUsername },
      { label: 'common word (welcome)', value: 'Welcome#Pass12Zq', expected: MSG.pwdCommon },
      { label: 'sequential pattern (abcd)', value: 'Abcd#Strong91Zq', expected: MSG.pwdCommon },
      { label: 'three repeated characters', value: 'Strong#Aaa91ZqWx', expected: MSG.pwdRepeat },
    ];

    let current = env.password; // the password the spare account has right now
    const login = new LoginPage(page);
    const change = new ChangePasswordPage(page);
    const ensureSession = async (): Promise<void> => {
      await page.goto('/dashboard');
      if (/\/login/.test(page.url())) await login.loginAndWait(user, current);
    };

    await login.loginAndWait(user, current);
    try {
      for (const w of weak) {
        await test.step(`rejects: ${w.label}`, async () => {
          await ensureSession();
          await change.goto();
          await change.submit(current, w.value);
          if ((await change.validationAlert.count()) === 0) {
            // No error shown: the app took the weak password. Remember it so the next step and the restore use it.
            current = w.value;
            testInfo.annotations.push({ type: 'defect-candidate', description: `The app ACCEPTED a weak password: ${w.label}` });
            expect.soft(false, `weak password accepted: ${w.label}`).toBe(true);
            return;
          }
          await change.expectErrorMatching(w.expected);
        });
      }
    } finally {
      if (current !== env.password) {
        try {
          await ensureSession();
          await change.goto();
          await change.submit(current, env.password);
          const res = await api.login(user, env.password);
          testInfo.annotations.push({ type: 'restore', description: `Password restored; API login now returns HTTP ${res.status}` });
        } catch {
          testInfo.annotations.push({ type: 'RESTORE-FAILED', description: `${user} still has a test password. Ask your mentor to reset it.` });
        }
      }
    }
  });
});