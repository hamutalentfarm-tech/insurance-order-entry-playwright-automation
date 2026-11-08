# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\password-policy.spec.ts >> Authentication: password policy (dedicated account) >> TC-AUTH-008 | AUTH-V08 | weak passwords are rejected on /change-password
- Location: tests\auth\password-policy.spec.ts:13:7

# Error details

```
Error: weak password accepted: common word (welcome)

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: weak password accepted: sequential pattern (abcd)

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=f31e1]:
  - navigation [ref=f31e2]:
    - generic [ref=f31e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f31e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f31e5]: IO
        - generic [ref=f31e6]:
          - generic [ref=f31e7]: Insurance Order Entry Demo Platform
          - generic [ref=f31e8]: QA Automation Training App
      - generic [ref=f31e9]:
        - list [ref=f31e10]:
          - listitem [ref=f31e11]:
            - link "Dashboard" [ref=f31e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f31e13]:
            - link "Applications" [ref=f31e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f31e15]:
            - link "Products" [ref=f31e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f31e17]:
            - link "Support" [ref=f31e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f31e19]:
          - link "Learner Agent 004" [ref=f31e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f31e22] [cursor=pointer]
  - main [ref=f31e23]:
    - alert [ref=f31e24]: Password changed successfully.
    - generic [ref=f31e25]:
      - generic [ref=f31e26]:
        - heading "Agent Dashboard" [level=1] [ref=f31e27]
        - paragraph [ref=f31e28]: Track drafts, submitted applications, and policy order entry work.
      - link "Start New Application" [ref=f31e29] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/new
    - generic [ref=f31e30]:
      - generic [ref=f31e33]:
        - generic [ref=f31e34]: Draft
        - generic [ref=f31e35]: "1"
      - generic [ref=f31e38]:
        - generic [ref=f31e39]: Submitted
        - generic [ref=f31e40]: "0"
      - generic [ref=f31e43]:
        - generic [ref=f31e44]: Under Review
        - generic [ref=f31e45]: "0"
      - generic [ref=f31e48]:
        - generic [ref=f31e49]: Approved
        - generic [ref=f31e50]: "0"
      - generic [ref=f31e53]:
        - generic [ref=f31e54]: Requires Info
        - generic [ref=f31e55]: "0"
    - generic [ref=f31e56]:
      - generic [ref=f31e57]:
        - heading "Recent Applications" [level=2] [ref=f31e58]
        - link "View all" [ref=f31e59] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/applications
      - table [ref=f31e61]:
        - rowgroup [ref=f31e62]:
          - row [ref=f31e63]:
            - columnheader "Reference" [ref=f31e64]
            - columnheader "Client" [ref=f31e65]
            - columnheader "Product" [ref=f31e66]
            - columnheader "Status" [ref=f31e67]
            - columnheader "Updated" [ref=f31e68]
            - columnheader [ref=f31e69]
        - rowgroup [ref=f31e70]:
          - row [ref=f31e71]:
            - cell "WL-LNR-004-DRAFT" [ref=f31e72]
            - cell "Learner Client 004" [ref=f31e73]
            - cell "SecureLife Whole Life" [ref=f31e74]
            - cell "DRAFT" [ref=f31e75]
            - cell "17 May 2026" [ref=f31e77]
            - cell [ref=f31e78]:
              - link "Open" [ref=f31e79] [cursor=pointer]:
                - /url: http://34.100.166.72:8081/applications/10
  - contentinfo [ref=f31e80]:
    - generic [ref=f31e81]:
      - generic [ref=f31e82]: TalentFarm QA Automation Lab
      - generic [ref=f31e83]: Insurance Order Entry Demo
```

# Test source

```ts
  1  | import { test, expect, NO_SESSION } from '../../fixtures/auth.fixture';
  2  | import { ChangePasswordPage } from '../../pages/ChangePasswordPage';
  3  | import { LoginPage } from '../../pages/LoginPage';
  4  | import { env } from '../../utils/env';
  5  | import { MSG } from '../../utils/messages';
  6  | import { name, meta } from '../../utils/testMeta';
  7  | 
  8  | test.use({ storageState: NO_SESSION });
  9  | 
  10 | test.describe('Authentication: password policy (dedicated account)', () => {
  11 |   test.skip(!env.passwordTestEmail, 'Set PASSWORD_TEST_USER in .env to a spare learner account (NOT your own learner account).');
  12 | 
  13 |   test(name('TC-AUTH-008', 'weak passwords are rejected on /change-password'), meta('TC-AUTH-008'), async ({ page, api }, testInfo) => {
  14 |     const user = env.passwordTestEmail;
  15 |     const username = user.split('@')[0];
  16 |     const weak: { label: string; value: string; expected: RegExp }[] = [
  17 |       { label: 'under 12 characters', value: 'Ab1!xyz', expected: MSG.pwdLength },
  18 |       { label: 'no uppercase', value: 'alllowercase1!xyz', expected: MSG.pwdUpper },
  19 |       { label: 'no lowercase', value: 'ALLUPPERCASE1!XYZ', expected: MSG.pwdLower },
  20 |       { label: 'no digit', value: 'NoDigitsHere!!Xy', expected: MSG.pwdDigit },
  21 |       { label: 'no special character', value: 'NoSpecialChar12Ab', expected: MSG.pwdSpecial },
  22 |       { label: 'contains the email username', value: `${username}#Zq9Wpx`, expected: MSG.pwdUsername },
  23 |       { label: 'common word (welcome)', value: 'Welcome#Pass12Zq', expected: MSG.pwdCommon },
  24 |       { label: 'sequential pattern (abcd)', value: 'Abcd#Strong91Zq', expected: MSG.pwdCommon },
  25 |       { label: 'three repeated characters', value: 'Strong#Aaa91ZqWx', expected: MSG.pwdRepeat },
  26 |     ];
  27 | 
  28 |     let current = env.password; // the password the spare account has right now
  29 |     const login = new LoginPage(page);
  30 |     const change = new ChangePasswordPage(page);
  31 |     const ensureSession = async (): Promise<void> => {
  32 |       await page.goto('/dashboard');
  33 |       if (/\/login/.test(page.url())) await login.loginAndWait(user, current);
  34 |     };
  35 | 
  36 |     await login.loginAndWait(user, current);
  37 |     try {
  38 |       for (const w of weak) {
  39 |         await test.step(`rejects: ${w.label}`, async () => {
  40 |           await ensureSession();
  41 |           await change.goto();
  42 |           await change.submit(current, w.value);
  43 |           if ((await change.validationAlert.count()) === 0) {
  44 |             // No error shown: the app took the weak password. Remember it so the next step and the restore use it.
  45 |             current = w.value;
  46 |             testInfo.annotations.push({ type: 'defect-candidate', description: `The app ACCEPTED a weak password: ${w.label}` });
> 47 |             expect.soft(false, `weak password accepted: ${w.label}`).toBe(true);
     |                                                                      ^ Error: weak password accepted: sequential pattern (abcd)
  48 |             return;
  49 |           }
  50 |           await change.expectErrorMatching(w.expected);
  51 |         });
  52 |       }
  53 |     } finally {
  54 |       if (current !== env.password) {
  55 |         try {
  56 |           await ensureSession();
  57 |           await change.goto();
  58 |           await change.submit(current, env.password);
  59 |           const res = await api.login(user, env.password);
  60 |           testInfo.annotations.push({ type: 'restore', description: `Password restored; API login now returns HTTP ${res.status}` });
  61 |         } catch {
  62 |           testInfo.annotations.push({ type: 'RESTORE-FAILED', description: `${user} still has a test password. Ask your mentor to reset it.` });
  63 |         }
  64 |       }
  65 |     }
  66 |   });
  67 | });
```