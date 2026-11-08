# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.ts >> Beneficiary management >> TC-BEN-002 | BEN-V02 | primary allocation below 100% is flagged and blocks submission
- Location: tests\beneficiaries\beneficiaries.spec.ts:57:7

# Error details

```
Error: 90% must raise "must total exactly 100%"

expect(received).not.toBeNull()

Received: null
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - navigation [ref=f3e2]:
    - generic [ref=f3e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f3e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f3e5]: IO
        - generic [ref=f3e6]:
          - generic [ref=f3e7]: Insurance Order Entry Demo Platform
          - generic [ref=f3e8]: QA Automation Training App
      - generic [ref=f3e9]:
        - list [ref=f3e10]:
          - listitem [ref=f3e11]:
            - link "Dashboard" [ref=f3e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f3e13]:
            - link "Applications" [ref=f3e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f3e15]:
            - link "Products" [ref=f3e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f3e17]:
            - link "Support" [ref=f3e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f3e19]:
          - link "Learner Agent 003" [ref=f3e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f3e22] [cursor=pointer]
  - main [ref=f3e23]:
    - generic [ref=f3e25]:
      - link "← Back to Documents" [ref=f3e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/170/documents
      - link "Application Summary" [ref=f3e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/170
    - generic [ref=f3e28]:
      - generic [ref=f3e30]:
        - generic [ref=f3e31]: "Application #170"
        - heading "Review Application" [level=1] [ref=f3e32]
        - paragraph [ref=f3e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f3e34]:
        - generic [ref=f3e37]:
          - heading "Submission Validation" [level=2] [ref=f3e38]
          - generic [ref=f3e39]: No blocking validation errors found.
          - generic [ref=f3e40]:
            - link "Back to Documents" [ref=f3e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/170/documents
            - button "Run Validation" [ref=f3e42] [cursor=pointer]
          - button "Submit Application" [ref=f3e44] [cursor=pointer]
        - generic [ref=f3e47]:
          - heading "Application Snapshot" [level=2] [ref=f3e48]
          - generic [ref=f3e49]:
            - term [ref=f3e50]: Client
            - definition [ref=f3e51]: Qakmjyxd Yyiwifb
            - term [ref=f3e52]: Calculated Age
            - definition [ref=f3e53]: "40"
            - term [ref=f3e54]: Product
            - definition [ref=f3e55]: SecureLife Whole Life
            - term [ref=f3e56]: Sum Assured
            - definition [ref=f3e57]: $250,000.00
            - term [ref=f3e58]: Premium Payment Frequency
            - definition [ref=f3e59]: MONTHLY
            - term [ref=f3e60]: Premium Payment Term
            - definition [ref=f3e61]: 20 years
            - term [ref=f3e62]: Coverage Term
            - definition [ref=f3e63]: WHOLE_LIFE
            - term [ref=f3e64]: Base Policy Premium
            - definition [ref=f3e65]: $98.96
            - term [ref=f3e66]: Rider Premium
            - definition [ref=f3e67]: $0.00
            - term [ref=f3e68]: Total Modal Premium
            - definition [ref=f3e69]: $98.96
            - term [ref=f3e70]: Status
            - definition [ref=f3e71]: DRAFT
  - contentinfo [ref=f3e72]:
    - generic [ref=f3e73]:
      - generic [ref=f3e74]: TalentFarm QA Automation Lab
      - generic [ref=f3e75]: Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { GUARDIAN, beneficiary } from '../../fixtures/applicationData';
  4   | import { BeneficiaryPage } from '../../pages/BeneficiaryPage';
  5   | import { ReviewPage } from '../../pages/ReviewPage';
  6   | import { buildApplication } from '../../utils/applicationBuilder';
  7   | import { anyMatches } from '../../utils/assertions';
  8   | import { MSG } from '../../utils/messages';
  9   | import { dobForAge, toIso } from '../../utils/dataGenerator';
  10  | import { name, meta } from '../../utils/testMeta';
  11  | 
  12  | test.use(asRole('learner'));
  13  | const agent = (): string => emailOf('learner');
  14  | 
  15  | /** Application positioned at the beneficiaries step (client..riders done through the API, no beneficiaries yet). */
  16  | async function atBeneficiaries(api: Parameters<typeof buildApplication>[0]): Promise<number> {
  17  |   return (await buildApplication(api, { agentEmail: agent(), upTo: 'riders' })).id;
  18  | }
  19  | 
  20  | /** Does the allocation error show on the beneficiaries page, or only on the review page? */
  21  | async function totalErrorSurface(page: import('@playwright/test').Page, ben: BeneficiaryPage, id: number, pattern: RegExp): Promise<'page' | 'review' | null> {
  22  |   if (pattern.test(await ben.errorsText())) return 'page';
  23  |   const review = new ReviewPage(page);
  24  |   await review.goto(id);
  25  |   return anyMatches(await review.errors(), pattern) ? 'review' : null;
  26  | }
  27  | 
  28  | test.describe('Beneficiary management', () => {
  29  |   test(name('TC-BEN-001', 'add a valid primary beneficiary (and irrevocable confirmation)'), meta('TC-BEN-001'), async ({ page, api }) => {
  30  |     const id = await atBeneficiaries(api);
  31  |     const ben = new BeneficiaryPage(page);
  32  |     await ben.goto(id);
  33  | 
  34  |     const primary = beneficiary({ allocation: 100 });
  35  |     await ben.addAndExpectRow(primary, 1);
  36  |     await expect(page.getByText(primary.lastName as string).first()).toBeVisible();
  37  |     expect(await ben.primaryTotal()).toBe(100);
  38  |     await expect(ben.errorSummary).toHaveCount(0);
  39  | 
  40  |     await test.step('extension: irrevocable designation asks for confirmation (browser confirm dialog)', async () => {
  41  |       const secondary = beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD', irrevocable: true });
  42  |       const before = await ben.rowIds();
  43  | 
  44  |       const declined = await ben.add(secondary, 'dismiss');
  45  |       expect(declined.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
  46  |       await ben.goto(id);
  47  |       await expect(ben.rows(), 'declining the confirmation does not save').toHaveCount(1);
  48  | 
  49  |       const accepted = await ben.add(secondary, 'accept');
  50  |       expect(accepted.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
  51  |       await expect(ben.rows()).toHaveCount(2);
  52  |       const newId = (await ben.rowIds()).find((x) => !before.includes(x));
  53  |       await expect(page.getByTestId(`beneficiary-irrevocable-badge-${newId}`)).toBeVisible();
  54  |     });
  55  |   });
  56  | 
  57  |   test(name('TC-BEN-002', 'primary allocation below 100% is flagged and blocks submission'), meta('TC-BEN-002'), async ({ page, api }, testInfo) => {
  58  |     const id = await atBeneficiaries(api);
  59  |     const ben = new BeneficiaryPage(page);
  60  |     await ben.goto(id);
  61  |     await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);
  62  |     await ben.addAndExpectRow(beneficiary({ allocation: 30, relationship: 'CHILD' }), 2);
  63  |     expect(await ben.primaryTotal()).toBe(90);
  64  | 
  65  |     const where = await totalErrorSurface(page, ben, id, MSG.primaryTotal);
  66  |     testInfo.annotations.push({ type: 'observation', description: `Primary-total error shown on: ${where ?? 'NOWHERE'}` });
> 67  |     expect(where, '90% must raise "must total exactly 100%"').not.toBeNull();
      |                                                                   ^ Error: 90% must raise "must total exactly 100%"
  68  | 
  69  |     await test.step('review page keeps Submit disabled', async () => {
  70  |       const review = new ReviewPage(page);
  71  |       await review.goto(id);
  72  |       await expect(review.submitButton).toBeDisabled();
  73  |     });
  74  |     await test.step('adding 10% fixes the total and clears the error', async () => {
  75  |       await ben.goto(id);
  76  |       await ben.addAndExpectRow(beneficiary({ allocation: 10, relationship: 'SIBLING' }), 3);
  77  |       expect(await ben.primaryTotal()).toBe(100);
  78  |       const review = new ReviewPage(page);
  79  |       await review.goto(id);
  80  |       expect(anyMatches(await review.errors(), MSG.primaryTotal)).toBe(false);
  81  |     });
  82  |   });
  83  | 
  84  |   test(name('TC-BEN-003', 'primary allocation above 100% is blocked'), meta('TC-BEN-003'), async ({ page, api }) => {
  85  |     const id = await atBeneficiaries(api);
  86  |     const ben = new BeneficiaryPage(page);
  87  |     await ben.goto(id);
  88  |     await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);
  89  | 
  90  |     // The page raises a browser alert() when the new total would exceed 100%.
  91  |     const result = await ben.add(beneficiary({ allocation: 50, relationship: 'CHILD' }));
  92  |     expect(result.dialogs.join(' '), 'over-allocation alert').toMatch(MSG.overAllocationDialog);
  93  |     await ben.goto(id);
  94  |     await expect(ben.rows(), 'second beneficiary was not saved').toHaveCount(1);
  95  |     expect(await ben.primaryTotal()).toBe(60);
  96  |   });
  97  | 
  98  |   test(name('TC-BEN-004', 'secondary allocation is validated separately'), meta('TC-BEN-004'), async ({ page, api }, testInfo) => {
  99  |     const id = await atBeneficiaries(api);
  100 |     const ben = new BeneficiaryPage(page);
  101 |     await ben.goto(id);
  102 |     await ben.addAndExpectRow(beneficiary({ allocation: 100 }), 1);
  103 |     await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD' }), 2);
  104 |     await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 30, relationship: 'SIBLING' }), 3);
  105 | 
  106 |     expect(await ben.primaryTotal(), 'primary group is complete').toBe(100);
  107 |     expect(await ben.secondaryTotal(), 'secondary group has its own running total').toBe(80);
  108 | 
  109 |     const review = new ReviewPage(page);
  110 |     await review.goto(id);
  111 |     const errors = await review.errors();
  112 |     testInfo.annotations.push({
  113 |       type: 'observation',
  114 |       description: `Review errors with secondary at 80%: ${errors.filter((e) => /benef|alloc|secondary/i.test(e)).join(' | ') || 'none about beneficiaries'}`,
  115 |     });
  116 |     expect(anyMatches(errors, MSG.primaryTotal), 'primary error must not appear while primary is 100%').toBe(false);
  117 | 
  118 |     await test.step('completing the secondary group to 100%', async () => {
  119 |       await ben.goto(id);
  120 |       await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 20, relationship: 'PARENT' }), 4);
  121 |       expect(await ben.secondaryTotal()).toBe(100);
  122 |     });
  123 |   });
  124 | 
  125 |   test(name('TC-BEN-005', 'minor beneficiary requires guardian details'), meta('TC-BEN-005'), async ({ page, api }) => {
  126 |     const id = await atBeneficiaries(api);
  127 |     const ben = new BeneficiaryPage(page);
  128 |     await ben.goto(id);
  129 |     const minor = beneficiary({ dob: dobForAge(17), allocation: 50, relationship: 'CHILD' });
  130 | 
  131 |     await test.step('minor without guardian is rejected', async () => {
  132 |       await expect(ben.guardianSection).toBeVisible();
  133 |       await ben.add(minor);
  134 |       expect(await ben.errorsText()).toMatch(MSG.guardian);
  135 |       await expect(ben.rows()).toHaveCount(0);
  136 |     });
  137 |     await test.step('minor with guardian details and legal acknowledgement is saved', async () => {
  138 |       await ben.goto(id);
  139 |       await ben.add({ ...minor, guardian: GUARDIAN, legalAcknowledgement: true });
  140 |       await expect(ben.rows()).toHaveCount(1);
  141 |     });
  142 |     await test.step('an adult needs no guardian', async () => {
  143 |       await ben.goto(id);
  144 |       await ben.add(beneficiary({ dob: dobForAge(30), allocation: 50, relationship: 'SIBLING' }));
  145 |       await expect(ben.rows()).toHaveCount(2);
  146 |     });
  147 |   });
  148 | 
  149 |   test(name('TC-BEN-006', 'trust beneficiary shows trust-specific fields'), meta('TC-BEN-006'), async ({ page, api }) => {
  150 |     const id = await atBeneficiaries(api);
  151 |     const ben = new BeneficiaryPage(page);
  152 |     await ben.goto(id);
  153 |     await ben.type.selectOption('TRUST');
  154 | 
  155 |     for (const f of ['beneficiary-trust-name-input', 'beneficiary-trustee-name-input', 'beneficiary-trust-date-input', 'beneficiary-trustee-contact-input']) {
  156 |       await expect(ben.field(f), f).toBeVisible();
  157 |     }
  158 |     await expect(ben.field('beneficiary-first-name-input'), 'individual-only field is hidden').toBeHidden();
  159 | 
  160 |     await test.step('trust name is mandatory', async () => {
  161 |       await ben.add(beneficiary({ type: 'TRUST', relationship: 'TRUST', trustName: '', trusteeName: 'Pat Trustee' }));
  162 |       expect(await ben.errorsText()).toMatch(MSG.trustName);
  163 |     });
  164 |     await test.step('a complete trust is saved', async () => {
  165 |       await ben.goto(id);
  166 |       await ben.add(beneficiary({ type: 'TRUST', relationship: 'TRUST', trustName: 'QA Family Trust', trusteeName: 'Pat Trustee', trustDate: toIso(new Date()) }));
  167 |       await expect(ben.rows()).toHaveCount(1);
```