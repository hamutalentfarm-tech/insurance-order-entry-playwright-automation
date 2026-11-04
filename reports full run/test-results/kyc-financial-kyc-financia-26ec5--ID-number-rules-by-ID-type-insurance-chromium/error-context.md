# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kyc-financial\kyc-financial.spec.ts >> KYC, financial and compliance >> TC-KYC-005 | KYC-P02 | ID number rules by ID type
- Location: tests\kyc-financial\kyc-financial.spec.ts:110:7

# Error details

```
Error: SSN: "@@@" should be rejected as an ID number

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: STATE_ID: "@@@" should be rejected as an ID number

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: PASSPORT: "@@@" should be rejected as an ID number

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

```
Error: DRIVERS_LICENSE: "@@@" should be rejected as an ID number

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=f11e1]:
  - navigation [ref=f11e2]:
    - generic [ref=f11e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f11e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f11e5]: IO
        - generic [ref=f11e6]:
          - generic [ref=f11e7]: Insurance Order Entry Demo Platform
          - generic [ref=f11e8]: QA Automation Training App
      - generic [ref=f11e9]:
        - list [ref=f11e10]:
          - listitem [ref=f11e11]:
            - link "Dashboard" [ref=f11e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f11e13]:
            - link "Applications" [ref=f11e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f11e15]:
            - link "Products" [ref=f11e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f11e17]:
            - link "Support" [ref=f11e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f11e19]:
          - link "Learner Agent 002" [ref=f11e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f11e22] [cursor=pointer]
  - main [ref=f11e23]:
    - alert [ref=f11e24]: KYC, financial, and compliance information saved.
    - generic [ref=f11e26]:
      - link "← Back to KYC & Financial" [ref=f11e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/130/kyc-financial
      - link "Application Summary" [ref=f11e28] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/130
    - generic [ref=f11e29]:
      - generic [ref=f11e31]:
        - generic [ref=f11e32]: "Application #130"
        - heading "Product & Policy Configuration" [level=1] [ref=f11e33]
        - paragraph [ref=f11e34]: Select the product, sum assured, premium payment frequency, premium payment term, and coverage term.
      - generic [ref=f11e37]:
        - generic [ref=f11e38]:
          - generic [ref=f11e39]:
            - generic [ref=f11e40]: Product
            - combobox "Product" [ref=f11e41]:
              - option "Select product" [selected]
              - option "Elite Legacy Whole Life"
              - option "FlexiPay Whole Life"
              - option "SecureLife Whole Life"
              - option "WealthBuilder Whole Life"
          - generic [ref=f11e42]:
            - generic [ref=f11e43]: Sum Assured
            - spinbutton "Sum Assured" [ref=f11e44]
          - generic [ref=f11e45]:
            - generic [ref=f11e46]: Premium Payment Frequency
            - combobox "Premium Payment Frequency" [ref=f11e47]:
              - option "Monthly" [selected]
              - option "Quarterly"
              - option "Semi-Annual"
              - option "Annual"
          - generic [ref=f11e48]:
            - generic [ref=f11e49]: Premium Payment Term
            - combobox "Premium Payment Term" [ref=f11e50]:
              - option "Select term" [selected]
              - option "10 years"
              - option "15 years"
              - option "20 years"
              - option "25 years"
              - option "30 years"
          - generic [ref=f11e51]:
            - generic [ref=f11e52]: Coverage Term
            - combobox "Coverage Term" [ref=f11e53]:
              - option "Whole Life" [selected]
              - option "To Age 100"
        - generic [ref=f11e55]:
          - generic [ref=f11e56]: Estimated Total Modal Premium
          - generic [ref=f11e57]: Pending
          - generic [ref=f11e58]: Select a product to estimate premium.
        - button "Save and Continue" [ref=f11e60] [cursor=pointer]
  - contentinfo [ref=f11e61]:
    - generic [ref=f11e62]:
      - generic [ref=f11e63]: TalentFarm QA Automation Lab
      - generic [ref=f11e64]: Insurance Order Entry Demo
```

# Test source

```ts
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
  98  |       expect(anyMatches(await review.errors(), MSG.affordability), 'affordability error on review page').toBe(true);
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
> 136 |         expect.soft(accepted, `${type}: "@@@" should be rejected as an ID number`).toBe(false);
      |                                                                                    ^ Error: DRIVERS_LICENSE: "@@@" should be rejected as an ID number
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