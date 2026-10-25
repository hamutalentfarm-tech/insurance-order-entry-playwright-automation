import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { ChangePasswordPage } from '../../pages/ChangePasswordPage';
import { env } from '../../utils/env';
import { MSG } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));

test.describe('Authentication: password policy', () => {
  test(name('TC-AUTH-008', 'weak passwords are rejected on /change-password'), meta('TC-AUTH-008'), async ({ page, api }) => {
    // Only REJECTED values are ever submitted, so the real password is never changed.
    // (Password reset via /forgot-password needs an OTP, so /change-password is used. There is no password API.)
    const username = emailOf('learner').split('@')[0];
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

    const change = new ChangePasswordPage(page);
    for (const w of weak) {
      await test.step(`rejects: ${w.label}`, async () => {
        await change.goto();
        await change.submit(env.password, w.value);
        await change.expectErrorMatching(w.expected);
        await expect(page, 'stays on the change-password page').toHaveURL(/change-password/);
      });
    }

    await test.step('strength indicator reacts to a compliant sample (not submitted)', async () => {
      await change.goto();
      await change.newPassword.fill('Tr7!kQz#Lm29Wp');
      await expect(change.strength).toBeVisible();
    });

    await test.step('the original password still works (nothing was changed)', async () => {
      const res = await api.login(emailOf('learner'), env.password);
      expect(res.status).toBe(200);
    });
  });
});
