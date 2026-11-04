# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kyc-financial\kyc-financial.spec.ts >> KYC, financial and compliance >> TC-KYC-004 | KYC-P01 | premium must be affordable against income (20%)
- Location: tests\kyc-financial\kyc-financial.spec.ts:88:7

# Error details

```
Error: affordability error on review page

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=e5]: IO
        - generic [ref=e6]:
          - generic [ref=e7]: Insurance Order Entry Demo Platform
          - generic [ref=e8]: QA Automation Training App
      - generic [ref=e9]:
        - list [ref=e10]:
          - listitem [ref=e11]:
            - link "Dashboard" [ref=e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=e13]:
            - link "Applications" [ref=e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=e15]:
            - link "Products" [ref=e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=e17]:
            - link "Support" [ref=e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=e19]:
          - link "Learner Agent 002" [ref=e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=e22] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e25]:
      - link "← Back to Documents" [ref=e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/129/documents
      - link "Application Summary" [ref=e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/129
    - generic [ref=e28]:
      - generic [ref=e30]:
        - generic [ref=e31]: "Application #129"
        - heading "Review Application" [level=1] [ref=e32]
        - paragraph [ref=e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=e34]:
        - generic [ref=e37]:
          - heading "Submission Validation" [level=2] [ref=e38]
          - generic [ref=e39]: No blocking validation errors found.
          - generic [ref=e40]:
            - link "Back to Documents" [ref=e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/129/documents
            - button "Run Validation" [ref=e42] [cursor=pointer]
          - button "Submit Application" [ref=e44] [cursor=pointer]
        - generic [ref=e47]:
          - heading "Application Snapshot" [level=2] [ref=e48]
          - generic [ref=e49]:
            - term [ref=e50]: Client
            - definition [ref=e51]: Qahpzads Swnnuch
            - term [ref=e52]: Calculated Age
            - definition [ref=e53]: "40"
            - term [ref=e54]: Product
            - definition [ref=e55]: SecureLife Whole Life
            - term [ref=e56]: Sum Assured
            - definition [ref=e57]: $250,000.00
            - term [ref=e58]: Premium Payment Frequency
            - definition [ref=e59]: MONTHLY
            - term [ref=e60]: Premium Payment Term
            - definition [ref=e61]: 20 years
            - term [ref=e62]: Coverage Term
            - definition [ref=e63]: WHOLE_LIFE
            - term [ref=e64]: Base Policy Premium
            - definition [ref=e65]: $98.96
            - term [ref=e66]: Rider Premium
            - definition [ref=e67]: $0.00
            - term [ref=e68]: Total Modal Premium
            - definition [ref=e69]: $98.96
            - term [ref=e70]: Status
            - definition [ref=e71]: DRAFT
  - contentinfo [ref=e72]:
    - generic [ref=e73]:
      - generic [ref=e74]: TalentFarm QA Automation Lab
      - generic [ref=e75]: Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { FAKE_SSN, kycData } from '../../fixtures/applicationData';
  4   | import { DocumentUploadPage } from '../../pages/DocumentUploadPage';
  5   | import { KycFinancialPage } from '../../pages/KycFinancialPage';
  6   | import { ReviewPage } from '../../pages/ReviewPage';
  7   | import { buildApplication } from '../../utils/applicationBuilder';
  8   | import { errorTexts, anyMatches } from '../../utils/assertions';
  9   | import { makeFile } from '../../utils/fileUploadHelper';
  10  | import { errorSurface } from '../../utils/flows';
  11  | import { MSG } from '../../utils/messages';
  12  | import { name, meta } from '../../utils/testMeta';
  13  | 
  14  | test.use(asRole('learner'));
  15  | const agent = (): string => emailOf('learner');
  16  | 
  17  | test.describe('KYC, financial and compliance', () => {
  18  |   test(name('TC-KYC-001', 'SSN is masked on every screen and response'), meta('TC-KYC-001'), async ({ page, api }) => {
  19  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
  20  |     const kyc = new KycFinancialPage(page);
  21  |     await kyc.goto(app.id);
  22  |     await kyc.fillAndSave(kycData({ idType: 'SSN', idNumber: FAKE_SSN }));
  23  | 
  24  |     const digitsOnly = FAKE_SSN.replace(/-/g, '');
  25  |     const expectMasked = async (label: string): Promise<void> => {
  26  |       const html = await page.content();
  27  |       expect(html, `${label}: full SSN must not appear`).not.toContain(FAKE_SSN);
  28  |       expect(html, `${label}: unformatted SSN must not appear`).not.toContain(digitsOnly);
  29  |     };
  30  | 
  31  |     await test.step('KYC page after reload', async () => {
  32  |       await kyc.goto(app.id);
  33  |       await expectMasked('kyc page');
  34  |       const shown = await kyc.idNumber.inputValue();
  35  |       if (shown) expect(shown, 'field shows only the last four digits').toMatch(/\*+.*6789$|^6789$/);
  36  |     });
  37  |     await test.step('review page', async () => {
  38  |       const review = new ReviewPage(page);
  39  |       await review.goto(app.id);
  40  |       await expectMasked('review page');
  41  |     });
  42  |     await test.step('API response for the application', async () => {
  43  |       const res = await api.getApplication(app.id, agent());
  44  |       expect(res.text).not.toContain(FAKE_SSN);
  45  |       expect(res.text).not.toContain(digitsOnly);
  46  |       expect(res.text, 'masked value is present').toContain('6789');
  47  |     });
  48  |   });
  49  | 
  50  |   test(name('TC-KYC-002', 'KYC upload rejects unsupported file types'), meta('TC-KYC-002'), async ({ page, api }) => {
  51  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
  52  |     const docs = new DocumentUploadPage(page);
  53  |     await docs.goto(app.id);
  54  |     for (const kind of ['exe', 'txt'] as const) {
  55  |       await test.step(`KYC_ID with .${kind}`, async () => {
  56  |         await docs.upload('KYC_ID', makeFile(kind));
  57  |         await docs.expectErrorMatching(MSG.docFormat);
  58  |         await expect(docs.rows(), 'nothing is stored').toHaveCount(0);
  59  |       });
  60  |     }
  61  |   });
  62  | 
  63  |   test(name('TC-KYC-003', 'PEP = Yes requires details'), meta('TC-KYC-003'), async ({ page, api }, testInfo) => {
  64  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
  65  |     const kyc = new KycFinancialPage(page);
  66  | 
  67  |     await test.step('PEP Yes without details is flagged', async () => {
  68  |       await kyc.goto(app.id);
  69  |       await kyc.fill(kycData({ isPep: true, pepDetails: '' }));
  70  |       await kyc.save({ ignoreBrowserValidation: true });
  71  |       const where = await errorSurface(page, app.id, MSG.pepDetails);
  72  |       testInfo.annotations.push({ type: 'observation', description: `PEP-details error shown on: ${where ?? 'NOWHERE'}` });
  73  |       expect(where, 'PEP Yes with blank details must raise an error').not.toBeNull();
  74  |     });
  75  |     await test.step('PEP Yes with details is accepted and no PEP error remains', async () => {
  76  |       await kyc.goto(app.id);
  77  |       await kyc.fillAndSave(kycData({ isPep: true, pepDetails: 'Former city council member (QA test data)' }));
  78  |       const review = new ReviewPage(page);
  79  |       await review.goto(app.id);
  80  |       expect(anyMatches(await review.errors(), MSG.pepDetails)).toBe(false);
  81  |     });
  82  |     await test.step('PEP No does not need details', async () => {
  83  |       await kyc.goto(app.id);
  84  |       await kyc.fillAndSave(kycData({ isPep: false }));
  85  |     });
  86  |   });
  87  | 
  88  |   test(name('TC-KYC-004', 'premium must be affordable against income (20%)'), meta('TC-KYC-004'), async ({ page, api }) => {
  89  |     // SecureLife, face 250,000, monthly => annual premium 1,187.50. 20% limit: income 5,000 -> 1,000 (fails), 50,000 -> 10,000 (passes).
  90  |     const app = await buildApplication(api, {
  91  |       agentEmail: agent(), upTo: 'product', kyc: { annualIncome: 5_000 },
  92  |     });
  93  |     const review = new ReviewPage(page);
  94  |     const kyc = new KycFinancialPage(page);
  95  | 
  96  |     await test.step('income 5,000 is flagged on the review page and by the validate API', async () => {
  97  |       await review.goto(app.id);
> 98  |       expect(anyMatches(await review.errors(), MSG.affordability), 'affordability error on review page').toBe(true);
      |                                                                                                          ^ Error: affordability error on review page
  99  |       const res = await api.validate(app.id, agent());
  100 |       expect(errorTexts(res).join(' | ')).toMatch(MSG.affordability);
  101 |     });
  102 |     await test.step('raising income to 50,000 clears the affordability error', async () => {
  103 |       await kyc.goto(app.id);
  104 |       await kyc.fillAndSave(kycData({ annualIncome: 50_000 }));
  105 |       await review.goto(app.id);
  106 |       expect(anyMatches(await review.errors(), MSG.affordability)).toBe(false);
  107 |     });
  108 |   });
  109 | 
  110 |   test(name('TC-KYC-005', 'ID number rules by ID type'), meta('TC-KYC-005'), async ({ page, api }, testInfo) => {
  111 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
  112 |     const kyc = new KycFinancialPage(page);
  113 |     const types = ['SSN', 'STATE_ID', 'PASSPORT', 'DRIVERS_LICENSE'] as const;
  114 | 
  115 |     await test.step('ID number is mandatory', async () => {
  116 |       await kyc.goto(app.id);
  117 |       await kyc.fill(kycData({ idNumber: '' }));
  118 |       await kyc.save({ ignoreBrowserValidation: true });
  119 |       await expect(page).toHaveURL(/kyc-financial/);
  120 |       expect((await kyc.errorMessages()).length).toBeGreaterThan(0);
  121 |     });
  122 |     await test.step('ID number longer than 100 characters is rejected', async () => {
  123 |       await kyc.goto(app.id);
  124 |       await kyc.fill(kycData({ idNumber: '9'.repeat(101) }));
  125 |       await kyc.save({ ignoreBrowserValidation: true });
  126 |       await expect(page).toHaveURL(/kyc-financial/);
  127 |       expect((await kyc.errorMessages()).length).toBeGreaterThan(0);
  128 |     });
  129 |     for (const type of types) {
  130 |       await test.step(`${type}: a clearly invalid number is rejected (documented rule: ID rules change by type)`, async () => {
  131 |         await kyc.goto(app.id);
  132 |         await kyc.fill(kycData({ idType: type, idNumber: '@@@' }));
  133 |         await kyc.save({ ignoreBrowserValidation: true });
  134 |         const accepted = /\/product/.test(page.url());
  135 |         testInfo.annotations.push({ type: 'observation', description: `${type}: "@@@" accepted = ${accepted}` });
  136 |         expect.soft(accepted, `${type}: "@@@" should be rejected as an ID number`).toBe(false);
  137 |       });
  138 |     }
  139 |   });
  140 | 
  141 |   test(name('TC-KYC-006', 'incomplete compliance declaration blocks progress'), meta('TC-KYC-006'), async ({ page, api }, testInfo) => {
  142 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
  143 |     const kyc = new KycFinancialPage(page);
  144 | 
  145 |     await test.step('UI: declaration not ticked', async () => {
  146 |       await kyc.goto(app.id);
  147 |       await kyc.fill(kycData({ declaration: false }));
  148 |       await kyc.save({ ignoreBrowserValidation: true });
  149 |       const where = await errorSurface(page, app.id, MSG.declaration);
  150 |       testInfo.annotations.push({ type: 'observation', description: `Declaration error shown on: ${where ?? 'NOWHERE'}` });
  151 |       expect(where, 'unticked declaration must raise an error').not.toBeNull();
  152 |     });
  153 |     await test.step('API validate reports the missing declaration', async () => {
  154 |       const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'product', kyc: { declaration: false } });
  155 |       const res = await api.validate(incomplete.id, agent());
  156 |       expect(errorTexts(res).join(' | ')).toMatch(MSG.declaration);
  157 |     });
  158 |   });
  159 | });
  160 | 
```