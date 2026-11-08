# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: documents\documents.spec.ts >> Validation summary and submit control >> TC-DOC-007 | VAL-V03 | submit stays disabled until critical errors are resolved
- Location: tests\documents\documents.spec.ts:137:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
          - link "Learner Agent 003" [ref=e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=e22] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e25]:
      - link "← Back to Documents" [ref=e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/194/documents
      - link "Application Summary" [ref=e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/194
    - generic [ref=e28]:
      - generic [ref=e30]:
        - generic [ref=e31]: "Application #194"
        - heading "Review Application" [level=1] [ref=e32]
        - paragraph [ref=e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=e34]:
        - generic [ref=e37]:
          - heading "Submission Validation" [level=2] [ref=e38]
          - generic [ref=e39]: No blocking validation errors found.
          - generic [ref=e40]:
            - link "Back to Documents" [ref=e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/194/documents
            - button "Run Validation" [ref=e42] [cursor=pointer]
          - button "Submit Application" [ref=e44] [cursor=pointer]
        - generic [ref=e47]:
          - heading "Application Snapshot" [level=2] [ref=e48]
          - generic [ref=e49]:
            - term [ref=e50]: Client
            - definition [ref=e51]: Qalhelgj Tzyuahz
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
  44  |     const docs = new DocumentUploadPage(page);
  45  |     // KYC_ID rejection is covered by TC-KYC-002; other document types are used here.
  46  |     const cases = [
  47  |       { type: 'ADDRESS_PROOF' as const, file: makeFile('exe'), hard: true },
  48  |       { type: 'INCOME_PROOF' as const, file: makeFile('txt'), hard: true },
  49  |       { type: 'OTHER' as const, file: makeFile('fake-pdf'), hard: false }, // text content renamed .pdf
  50  |     ];
  51  |     for (const c of cases) {
  52  |       await test.step(`${c.type}: ${c.file.name}`, async () => {
  53  |         await docs.goto(app.id);
  54  |         await docs.upload(c.type, c.file);
  55  |         const rejected = (await docs.rows().count()) === 0;
  56  |         if (c.hard) {
  57  |           await docs.expectErrorMatching(MSG.docFormat);
  58  |           expect(rejected, 'nothing stored').toBe(true);
  59  |         } else {
  60  |           testInfo.annotations.push({ type: 'observation', description: `Text file renamed .pdf rejected: ${rejected}` });
  61  |           expect.soft(rejected, 'content-based check: a renamed text file should be rejected').toBe(true);
  62  |         }
  63  |       });
  64  |     }
  65  |   });
  66  | 
  67  |   test(name('TC-DOC-003', 'file above 5 MB is rejected, 5 MB is accepted'), meta('TC-DOC-003'), async ({ page, api }, testInfo) => {
  68  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
  69  |     const docs = new DocumentUploadPage(page);
  70  | 
  71  |     await test.step(`${DOC_MAX_KB + 1} KB is rejected`, async () => {
  72  |       await docs.goto(app.id);
  73  |       await docs.upload('OTHER', makeFile('pdf', 'too-big.pdf', DOC_MAX_KB + 1));
  74  |       await expect(docs.rows(), 'oversized file is not stored').toHaveCount(0);
  75  |       const messages = await docs.errorMessages();
  76  |       testInfo.annotations.push({ type: 'observation', description: `Oversize message: ${messages.join(' | ') || 'none shown'}` });
  77  |       expect(messages.length, 'a visible error').toBeGreaterThan(0);
  78  |       expect.soft(messages.join(' '), 'documented message').toMatch(MSG.docSize);
  79  |     });
  80  |     await test.step(`${DOC_MAX_KB} KB is accepted (needs the server PHP upload limit to be at least 5 MB)`, async () => {
  81  |       await docs.goto(app.id);
  82  |       await docs.upload('OTHER', makeFile('pdf', 'at-limit.pdf', DOC_MAX_KB));
  83  |       await docs.expectNoErrors();
  84  |       await expect(docs.rows()).toHaveCount(1);
  85  |     });
  86  |   });
  87  | 
  88  |   test(name('TC-DOC-004', 'missing KYC_ID document blocks submission'), meta('TC-DOC-004'), async ({ page, api }) => {
  89  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // everything except documents
  90  |     const review = new ReviewPage(page);
  91  |     await review.goto(app.id);
  92  | 
  93  |     expect(anyMatches(await review.errors(), MSG.docRequired), 'missing KYC_ID listed').toBe(true);
  94  |     await expect(review.submitButton).toBeDisabled();
  95  | 
  96  |     await test.step('API submit is rejected and the application stays a draft', async () => {
  97  |       const res = await api.submit(app.id, agent());
  98  |       expectApiError(res, 422, MSG.docRequired);
  99  |       const status = await api.status(app.id, agent());
  100 |       expect(status.body?.data?.application_status).toBe('DRAFT');
  101 |       expect(status.body?.data?.application_reference_number ?? '').not.toMatch(/^WL\d+/);
  102 |     });
  103 |   });
  104 | });
  105 | 
  106 | test.describe('Validation summary and submit control', () => {
  107 |   test(name('TC-DOC-005', 'validation summary lists the unresolved errors'), meta('TC-DOC-005'), async ({ page, api }, testInfo) => {
  108 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'client' }); // only client data present
  109 |     const review = new ReviewPage(page);
  110 |     await review.goto(app.id);
  111 |     await review.runValidation();
  112 | 
  113 |     const errors = await review.errors();
  114 |     testInfo.annotations.push({ type: 'observation', description: `${errors.length} errors, rendered as a flat list (no grouping markup)` });
  115 |     const expectations: [string, RegExp][] = [
  116 |       ['address / contact', /address|contact/i], ['KYC', /kyc/i], ['financial', /financial/i], ['product', /product/i],
  117 |       ['beneficiary', /benefici/i], ['documents', /document/i],
  118 |     ];
  119 |     for (const [label, pattern] of expectations) {
  120 |       expect(anyMatches(errors, pattern), `summary mentions ${label}`).toBe(true);
  121 |     }
  122 |     await expect(review.submitButton).toBeDisabled();
  123 |   });
  124 | 
  125 |   test(name('TC-DOC-006', 'clicking a validation error navigates to the field'), meta('TC-DOC-006'), async ({ page, api }, testInfo) => {
  126 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'client' });
  127 |     const review = new ReviewPage(page);
  128 |     await review.goto(app.id);
  129 | 
  130 |     const links = await review.errorLinkCount();
  131 |     test.skip(links === 0, 'OBSERVATION: the review page renders errors as plain list items without links, so click-to-navigate is not implemented. Raise with the mentor: requirement gap or design choice.');
  132 |     testInfo.annotations.push({ type: 'observation', description: `${links} navigable error links` });
  133 |     await review.errorBox.locator('a').first().click();
  134 |     await expect(page).not.toHaveURL(/\/review$/);
  135 |   });
  136 | 
  137 |   test(name('TC-DOC-007', 'submit stays disabled until critical errors are resolved'), meta('TC-DOC-007'), async ({ page, api }) => {
  138 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // only the KYC_ID document is missing
  139 |     const review = new ReviewPage(page);
  140 |     const docs = new DocumentUploadPage(page);
  141 | 
  142 |     await test.step('one blocking error: Submit is disabled', async () => {
  143 |       await review.goto(app.id);
> 144 |       expect((await review.errors()).length).toBeGreaterThan(0);
      |                                              ^ Error: expect(received).toBeGreaterThan(expected)
  145 |       await expect(review.submitButton).toBeDisabled();
  146 |     });
  147 |     await test.step('resolving it enables Submit', async () => {
  148 |       await docs.goto(app.id);
  149 |       await docs.upload('KYC_ID', makeFile('pdf', `kyc-${app.id}.pdf`));
  150 |       await docs.expectNoErrors();
  151 |       await review.goto(app.id);
  152 |       await review.runValidation();
  153 |       await expect(review.passedBox).toBeVisible();
  154 |       await expect(review.submitButton).toBeEnabled();
  155 |     });
  156 |     await test.step('API refuses to submit an application that still has errors', async () => {
  157 |       const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'client' });
  158 |       expectApiError(await api.submit(incomplete.id, agent()), 422, MSG.validationFailed);
  159 |       expect((await api.status(incomplete.id, agent())).body?.data?.application_status).toBe('DRAFT');
  160 |     });
  161 |   });
  162 | });
  163 | 
```