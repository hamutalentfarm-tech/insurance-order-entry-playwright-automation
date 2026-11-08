# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: client-information\client.spec.ts >> Client / insured information >> TC-CLI-007 | CLI-P02 | age is calculated correctly from the date of birth
- Location: tests\client-information\client.spec.ts:129:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 40
Received: 41
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - navigation [ref=f2e2]:
    - generic [ref=f2e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f2e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f2e5]: IO
        - generic [ref=f2e6]:
          - generic [ref=f2e7]: Insurance Order Entry Demo Platform
          - generic [ref=f2e8]: QA Automation Training App
      - generic [ref=f2e9]:
        - list [ref=f2e10]:
          - listitem [ref=f2e11]:
            - link "Dashboard" [ref=f2e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f2e13]:
            - link "Applications" [ref=f2e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f2e15]:
            - link "Products" [ref=f2e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f2e17]:
            - link "Support" [ref=f2e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f2e19]:
          - link "Learner Agent 003" [ref=f2e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f2e22] [cursor=pointer]
  - main [ref=f2e23]:
    - alert [ref=f2e24]:
      - generic [ref=f2e25]: "Please review the following:"
      - list [ref=f2e26]:
        - listitem [ref=f2e27]: RESIDENTIAL address is required.
        - listitem [ref=f2e28]: MAILING address is required.
        - listitem [ref=f2e29]: Contact information is required.
        - listitem [ref=f2e30]: KYC details are required.
        - listitem [ref=f2e31]: Financial profile is required.
        - listitem [ref=f2e32]: Compliance declaration is required.
        - listitem [ref=f2e33]: Insurance product must be selected.
    - generic [ref=f2e35]:
      - link "← Back to Documents" [ref=f2e36] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/184/documents
      - link "Application Summary" [ref=f2e37] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/184
    - generic [ref=f2e38]:
      - generic [ref=f2e40]:
        - generic [ref=f2e41]: "Application #184"
        - heading "Review Application" [level=1] [ref=f2e42]
        - paragraph [ref=f2e43]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e44]:
        - generic [ref=f2e47]:
          - heading "Submission Validation" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - generic [ref=f2e50]: "Blocking validation errors found:"
            - list [ref=f2e51]:
              - listitem [ref=f2e52]: RESIDENTIAL address is required.
              - listitem [ref=f2e53]: MAILING address is required.
              - listitem [ref=f2e54]: Contact information is required.
              - listitem [ref=f2e55]: KYC details are required.
              - listitem [ref=f2e56]: Financial profile is required.
              - listitem [ref=f2e57]: Compliance declaration is required.
              - listitem [ref=f2e58]: Insurance product must be selected.
          - generic [ref=f2e59]:
            - link "Back to Documents" [ref=f2e60] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/184/documents
            - button "Run Validation" [ref=f2e61] [cursor=pointer]
          - generic [ref=f2e62]:
            - button "Submit Application" [disabled]
        - generic [ref=f2e65]:
          - heading "Application Snapshot" [level=2] [ref=f2e66]
          - generic [ref=f2e67]:
            - term [ref=f2e68]: Client
            - definition [ref=f2e69]: Qatewwvu Saukrcv
            - term [ref=f2e70]: Calculated Age
            - definition [ref=f2e71]: "41"
            - term [ref=f2e72]: Product
            - definition [ref=f2e73]: Not selected
            - term [ref=f2e74]: Sum Assured
            - definition [ref=f2e75]: Pending
            - term [ref=f2e76]: Premium Payment Frequency
            - definition [ref=f2e77]: MONTHLY
            - term [ref=f2e78]: Premium Payment Term
            - definition [ref=f2e79]: Pending
            - term [ref=f2e80]: Coverage Term
            - definition [ref=f2e81]: WHOLE_LIFE
            - term [ref=f2e82]: Base Policy Premium
            - definition [ref=f2e83]: $0.00
            - term [ref=f2e84]: Rider Premium
            - definition [ref=f2e85]: $0.00
            - term [ref=f2e86]: Total Modal Premium
            - definition [ref=f2e87]: $0.00
            - term [ref=f2e88]: Status
            - definition [ref=f2e89]: DRAFT
  - contentinfo [ref=f2e90]:
    - generic [ref=f2e91]:
      - generic [ref=f2e92]: TalentFarm QA Automation Lab
      - generic [ref=f2e93]: Insurance Order Entry Demo
```

# Test source

```ts
  44  |     const skippedSelects: string[] = [];
  45  | 
  46  |     for (const key of MANDATORY_CLIENT_FIELDS) {
  47  |       await test.step(`blank ${key}`, async () => {
  48  |         await client.goto(id);
  49  |         await client.fill(clientData());
  50  |         const field = client.field(key);
  51  |         const tag = await field.evaluate((el) => el.tagName.toLowerCase());
  52  |         if (tag === 'select') {
  53  |           const hasBlank = await field.locator('option[value=""]').count();
  54  |           if (!hasBlank) {
  55  |             skippedSelects.push(key);
  56  |             return; // a select without a blank option cannot be left empty by the user
  57  |           }
  58  |           await field.selectOption('');
  59  |         } else {
  60  |           await field.fill('');
  61  |         }
  62  |         expect(await isNativelyInvalid(field), `browser blocks empty ${key}`).toBe(true);
  63  |         await client.save({ ignoreBrowserValidation: true }); // reach the server-side check too
  64  |         await expect(page).toHaveURL(/\/client/);
  65  |         expect((await client.errorMessages()).length, `server message for blank ${key}`).toBeGreaterThan(0);
  66  |       });
  67  |     }
  68  |     if (skippedSelects.length) testInfo.annotations.push({ type: 'observation', description: `Selects with no blank option: ${skippedSelects.join(', ')}` });
  69  |   });
  70  | 
  71  |   test(name('TC-CLI-003', 'DOB below 18 is rejected'), meta('TC-CLI-003'), async ({ page, api }, testInfo) => {
  72  |     const id = await emptyDraft(api);
  73  |     const client = new ClientInformationPage(page);
  74  |     await client.goto(id);
  75  |     await client.fill(clientData({ dob: dobForAge(18, 1) })); // 17 years 364 days
  76  |     await client.save();
  77  |     const where = await ageErrorSurface(page, id);
  78  |     testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  79  |     expect(where, 'age 17y364d must produce the age-range error (form or review page)').not.toBeNull();
  80  |   });
  81  | 
  82  |   test(name('TC-CLI-004', 'DOB above 65 is rejected'), meta('TC-CLI-004'), async ({ page, api }, testInfo) => {
  83  |     const id = await emptyDraft(api);
  84  |     const client = new ClientInformationPage(page);
  85  |     await client.goto(id);
  86  |     await client.fill(clientData({ dob: dobForAge(66) }));
  87  |     await client.save();
  88  |     const where = await ageErrorSurface(page, id);
  89  |     testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  90  |     expect(where, 'age 66 must produce the age-range error (form or review page)').not.toBeNull();
  91  |   });
  92  | 
  93  |   test(name('TC-CLI-005', 'future DOB is rejected'), meta('TC-CLI-005'), async ({ page, api }) => {
  94  |     const id = await emptyDraft(api);
  95  |     const client = new ClientInformationPage(page);
  96  |     for (const dob of [futureDate(1), futureDate(3650)]) {
  97  |       await test.step(`DOB ${dob}`, async () => {
  98  |         await client.goto(id);
  99  |         await client.fill(clientData({ dob }));
  100 |         await client.save();
  101 |         await expect(page).toHaveURL(/\/client/);
  102 |         await client.expectErrorMatching(MSG.futureDob);
  103 |       });
  104 |     }
  105 |     await test.step('nothing in the future was stored', async () => {
  106 |       const res = await api.getClient(id, emailOf('learner'));
  107 |       const stored = res.body?.data?.date_of_birth;
  108 |       if (stored) expect(String(stored).slice(0, 10) <= toIso(new Date())).toBe(true);
  109 |     });
  110 |   });
  111 | 
  112 |   test(name('TC-CLI-006', 'age boundaries 18 and 65 are accepted'), meta('TC-CLI-006'), async ({ page, api }) => {
  113 |     const id = await emptyDraft(api);
  114 |     const client = new ClientInformationPage(page);
  115 |     const review = new ReviewPage(page);
  116 |     for (const age of [18, 65]) {
  117 |       await test.step(`age exactly ${age}`, async () => {
  118 |         await client.goto(id);
  119 |         await client.fill(clientData({ dob: dobForAge(age) }));
  120 |         await client.save();
  121 |         await expect(page, `age ${age} is accepted and the flow moves on`).toHaveURL(/address-contact/);
  122 |         await review.goto(id);
  123 |         expect(await review.calculatedAge(), 'calculated age on review page').toBe(age);
  124 |         expect(anyMatches(await review.errors(), MSG.ageRange), `no age error at ${age}`).toBe(false);
  125 |       });
  126 |     }
  127 |   });
  128 | 
  129 |   test(name('TC-CLI-007', 'age is calculated correctly from the date of birth'), meta('TC-CLI-007'), async ({ page, api }) => {
  130 |     const id = await emptyDraft(api);
  131 |     const client = new ClientInformationPage(page);
  132 |     const review = new ReviewPage(page);
  133 |     const cases = [
  134 |       { label: 'birthday today', dob: dobForAge(40) },
  135 |       { label: 'birthday tomorrow', dob: dobForAge(40, 1) },
  136 |       { label: 'leap-day birth date', dob: '1984-02-29' },
  137 |     ];
  138 |     for (const c of cases) {
  139 |       await test.step(c.label, async () => {
  140 |         await client.goto(id);
  141 |         await client.fill(clientData({ dob: c.dob }));
  142 |         await client.save();
  143 |         await review.goto(id);
> 144 |         expect(await review.calculatedAge()).toBe(ageOn(c.dob));
      |                                              ^ Error: expect(received).toBe(expected) // Object.is equality
  145 |       });
  146 |     }
  147 |   });
  148 | 
  149 |   test(name('TC-CLI-008', 'name format validation'), meta('TC-CLI-008'), async ({ page, api }) => {
  150 |     const id = await emptyDraft(api);
  151 |     const client = new ClientInformationPage(page);
  152 |     const invalid = ['12345', '@@@', 'a'.repeat(101), '   '];
  153 | 
  154 |     for (const value of invalid) {
  155 |       await test.step(`rejects first name "${value.slice(0, 12)}${value.length > 12 ? '...' : ''}"`, async () => {
  156 |         await client.goto(id);
  157 |         await client.fill(clientData({ firstName: value }));
  158 |         await client.save({ ignoreBrowserValidation: true });
  159 |         await expect(page).toHaveURL(/\/client/);
  160 |         expect((await client.errorMessages()).length, 'validation message').toBeGreaterThan(0);
  161 |       });
  162 |     }
  163 |     await test.step('format message for digits/symbols', async () => {
  164 |       await client.goto(id);
  165 |       await client.fill(clientData({ firstName: '12345' }));
  166 |       await client.save();
  167 |       await client.expectErrorMatching(MSG.nameFormat);
  168 |     });
  169 |     await test.step('accepts a hyphenated name with an apostrophe', async () => {
  170 |       await client.goto(id);
  171 |       await client.fill(clientData({ firstName: 'Anne-Marie', lastName: "O'Neil" }));
  172 |       await client.save();
  173 |       await expect(page).toHaveURL(/address-contact/);
  174 |     });
  175 |   });
  176 | });
  177 | 
```