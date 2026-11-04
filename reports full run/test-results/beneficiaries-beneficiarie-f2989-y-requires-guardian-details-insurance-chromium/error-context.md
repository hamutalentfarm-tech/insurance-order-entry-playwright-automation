# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.ts >> Beneficiary management >> TC-BEN-005 | BEN-V05 | minor beneficiary requires guardian details
- Location: tests\beneficiaries\beneficiaries.spec.ts:125:7

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /guardian details are required/i
Received string:  "Guardian name is required for a minor beneficiary. | Guardian relationship is required for a minor beneficiary. | Guardian contact is required for a minor beneficiary. | Guardian address is required for a minor beneficiary. | Legal acknowledgement is required for a minor beneficiary. Please correct the following: Guardian name is required for a minor beneficiary. Guardian relationship is required for a minor beneficiary. Guardian contact is required for a minor beneficiary. Guardian address is required for a minor beneficiary. Legal acknowledgement is required for a minor beneficiary."
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - navigation [ref=f1e2]:
    - generic [ref=f1e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f1e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f1e5]: IO
        - generic [ref=f1e6]:
          - generic [ref=f1e7]: Insurance Order Entry Demo Platform
          - generic [ref=f1e8]: QA Automation Training App
      - generic [ref=f1e9]:
        - list [ref=f1e10]:
          - listitem [ref=f1e11]:
            - link "Dashboard" [ref=f1e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f1e13]:
            - link "Applications" [ref=f1e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f1e15]:
            - link "Products" [ref=f1e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f1e17]:
            - link "Support" [ref=f1e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f1e19]:
          - link "Learner Agent 002" [ref=f1e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f1e22] [cursor=pointer]
  - main [ref=f1e23]:
    - alert [ref=f1e24]:
      - generic [ref=f1e25]: "Please review the following:"
      - list [ref=f1e26]:
        - listitem [ref=f1e27]: Guardian name is required for a minor beneficiary.
        - listitem [ref=f1e28]: Guardian relationship is required for a minor beneficiary.
        - listitem [ref=f1e29]: Guardian contact is required for a minor beneficiary.
        - listitem [ref=f1e30]: Guardian address is required for a minor beneficiary.
        - listitem [ref=f1e31]: Legal acknowledgement is required for a minor beneficiary.
    - generic [ref=f1e33]:
      - link "← Back to Riders" [ref=f1e34] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/104/riders
      - link "Application Summary" [ref=f1e35] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/104
    - generic [ref=f1e36]:
      - generic [ref=f1e37]:
        - generic [ref=f1e38]:
          - generic [ref=f1e39]: "Application #104"
          - heading "Beneficiaries" [level=1] [ref=f1e40]
          - paragraph [ref=f1e41]: Add or update primary and secondary beneficiaries for the policy.
        - link "Back to Application" [ref=f1e42] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/applications/104
      - generic [ref=f1e43]:
        - strong [ref=f1e44]: "Please correct the following:"
        - list [ref=f1e45]:
          - listitem [ref=f1e46]: Guardian name is required for a minor beneficiary.
          - listitem [ref=f1e47]: Guardian relationship is required for a minor beneficiary.
          - listitem [ref=f1e48]: Guardian contact is required for a minor beneficiary.
          - listitem [ref=f1e49]: Guardian address is required for a minor beneficiary.
          - listitem [ref=f1e50]: Legal acknowledgement is required for a minor beneficiary.
      - generic [ref=f1e51]: "Primary allocation: 0.00% | Secondary allocation: 0.00%"
      - generic [ref=f1e52]: No beneficiary has been added. Estate assignment will apply by default if no beneficiary is named.
      - generic [ref=f1e53]:
        - strong [ref=f1e55]: Existing Beneficiaries
        - table [ref=f1e58]:
          - rowgroup [ref=f1e59]:
            - row [ref=f1e60]:
              - columnheader "Level" [ref=f1e61]
              - columnheader "Type" [ref=f1e62]
              - columnheader "Name" [ref=f1e63]
              - columnheader "Designation" [ref=f1e64]
              - columnheader "Relationship" [ref=f1e65]
              - columnheader "Age" [ref=f1e66]
              - columnheader "Allocation" [ref=f1e67]
              - columnheader "Email" [ref=f1e68]
              - columnheader "Phone" [ref=f1e69]
              - columnheader "Action" [ref=f1e70]
          - rowgroup [ref=f1e71]:
            - row [ref=f1e72]:
              - cell "No beneficiaries added yet. Estate assignment will apply by default." [ref=f1e73]
      - generic [ref=f1e74]:
        - generic [ref=f1e75]:
          - strong [ref=f1e77]: Add Beneficiary
          - generic [ref=f1e79]:
            - generic [ref=f1e80]:
              - generic [ref=f1e81]: Beneficiary Level *
              - combobox [ref=f1e82]:
                - option "Select"
                - option "Primary" [selected]
                - option "Secondary"
            - generic [ref=f1e83]:
              - generic [ref=f1e84]: Beneficiary Type *
              - combobox [ref=f1e85]:
                - option "Individual" [selected]
                - option "Trust"
                - option "Organization"
            - generic [ref=f1e86]:
              - generic [ref=f1e87]: Relationship *
              - combobox [ref=f1e88]:
                - option "Select"
                - option "Spouse"
                - option "Child" [selected]
                - option "Parent"
                - option "Sibling"
                - option "Trust"
                - option "Organization"
                - option "Other"
            - generic [ref=f1e89]:
              - generic [ref=f1e90]: Allocation % *
              - spinbutton [ref=f1e91]: "50"
            - generic [ref=f1e92]:
              - generic [ref=f1e93]: Beneficiary Designation *
              - combobox [ref=f1e94]:
                - option "Revocable" [selected]
                - option "Irrevocable"
              - generic [ref=f1e95]: Irrevocable beneficiaries cannot be changed or removed in this demo without beneficiary consent.
            - generic [ref=f1e96]:
              - generic [ref=f1e97]: Phone
              - textbox "(212) 555-1212" [ref=f1e98]
            - generic [ref=f1e99]:
              - generic [ref=f1e100]: Email
              - textbox [ref=f1e101]
            - generic [ref=f1e102]:
              - generic [ref=f1e103]: Country
              - textbox [ref=f1e104]: US
        - generic [ref=f1e105]:
          - strong [ref=f1e107]: Individual Beneficiary Details
          - generic [ref=f1e109]:
            - generic [ref=f1e110]:
              - generic [ref=f1e111]: First Name *
              - textbox [ref=f1e112]: Jane
            - generic [ref=f1e113]:
              - generic [ref=f1e114]: Middle Name
              - textbox [ref=f1e115]
            - generic [ref=f1e116]:
              - generic [ref=f1e117]: Last Name *
              - textbox [ref=f1e118]: Fvlibt
            - generic [ref=f1e119]:
              - generic [ref=f1e120]: Date of Birth *
              - textbox [ref=f1e121]: 2009-11-04
            - generic [ref=f1e122]:
              - generic [ref=f1e123]: Gender
              - combobox [ref=f1e124]:
                - option "Select"
                - option "Male"
                - option "Female" [selected]
                - option "Non-binary"
        - generic [ref=f1e125]:
          - strong [ref=f1e127]: Address Details
          - generic [ref=f1e129]:
            - generic [ref=f1e130]:
              - generic [ref=f1e131]: Address Line 1
              - textbox [ref=f1e132]
            - generic [ref=f1e133]:
              - generic [ref=f1e134]: City
              - textbox [ref=f1e135]
            - generic [ref=f1e136]:
              - generic [ref=f1e137]: State
              - textbox [ref=f1e138]
            - generic [ref=f1e139]:
              - generic [ref=f1e140]: Postal Code
              - textbox [ref=f1e141]
        - generic [ref=f1e142]:
          - strong [ref=f1e144]: Minor Beneficiary Guardian Details
          - generic [ref=f1e146]:
            - generic [ref=f1e147]:
              - generic [ref=f1e148]: Guardian Name
              - textbox [ref=f1e149]
            - generic [ref=f1e150]:
              - generic [ref=f1e151]: Guardian Relationship
              - textbox [ref=f1e152]
            - generic [ref=f1e153]:
              - generic [ref=f1e154]: Guardian Contact
              - textbox [ref=f1e155]
            - generic [ref=f1e156]:
              - generic [ref=f1e157]: Guardian Address
              - textbox [ref=f1e158]
            - generic [ref=f1e160]:
              - checkbox "Legal acknowledgement completed for minor beneficiary" [ref=f1e161]
              - generic [ref=f1e162]: Legal acknowledgement completed for minor beneficiary
        - generic [ref=f1e163]:
          - link "Back" [ref=f1e164] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/applications/104/riders
          - generic [ref=f1e165]:
            - button "Save Beneficiary" [ref=f1e166] [cursor=pointer]
            - link "Continue" [ref=f1e167] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/104/documents
  - contentinfo [ref=f1e168]:
    - generic [ref=f1e169]:
      - generic [ref=f1e170]: TalentFarm QA Automation Lab
      - generic [ref=f1e171]: Insurance Order Entry Demo
```

# Test source

```ts
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
  67  |     expect(where, '90% must raise "must total exactly 100%"').not.toBeNull();
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
> 134 |       expect(await ben.errorsText()).toMatch(MSG.guardian);
      |                                      ^ Error: expect(received).toMatch(expected)
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
  168 |     });
  169 |   });
  170 | 
  171 |   test(name('TC-BEN-007', 'organization beneficiary shows organization-specific fields'), meta('TC-BEN-007'), async ({ page, api }) => {
  172 |     const id = await atBeneficiaries(api);
  173 |     const ben = new BeneficiaryPage(page);
  174 |     await ben.goto(id);
  175 |     await ben.type.selectOption('ORGANIZATION');
  176 | 
  177 |     for (const f of ['beneficiary-organization-name-input', 'beneficiary-organization-registration-input', 'beneficiary-organization-contact-input']) {
  178 |       await expect(ben.field(f), f).toBeVisible();
  179 |     }
  180 |     await expect(ben.field('beneficiary-trust-name-input'), 'trust field is hidden').toBeHidden();
  181 | 
  182 |     await test.step('organization name is mandatory', async () => {
  183 |       await ben.add(beneficiary({ type: 'ORGANIZATION', relationship: 'ORGANIZATION', organizationName: '' }));
  184 |       expect(await ben.errorsText()).toMatch(MSG.organizationName);
  185 |     });
  186 |     await test.step('a complete organization is saved', async () => {
  187 |       await ben.goto(id);
  188 |       await ben.add(beneficiary({
  189 |         type: 'ORGANIZATION', relationship: 'ORGANIZATION', organizationName: 'QA Charity Foundation',
  190 |         organizationRegistration: 'REG-123456', organizationContact: '(212) 555-0111',
  191 |       }));
  192 |       await expect(ben.rows()).toHaveCount(1);
  193 |     });
  194 |   });
  195 | 
  196 |   test(name('TC-BEN-008', 'duplicate beneficiary is blocked'), meta('TC-BEN-008'), async ({ page, api }) => {
  197 |     const id = await atBeneficiaries(api);
  198 |     const ben = new BeneficiaryPage(page);
  199 |     await ben.goto(id);
  200 |     const original = beneficiary({ allocation: 40 });
  201 |     await ben.addAndExpectRow(original, 1);
  202 | 
  203 |     await test.step('same name + date of birth + relationship is blocked', async () => {
  204 |       await ben.add({ ...original });
  205 |       expect(await ben.errorsText(), 'duplicate error').toMatch(MSG.duplicate);
  206 |       await ben.goto(id);
  207 |       await expect(ben.rows()).toHaveCount(1);
  208 |       const list = await api.listBeneficiaries(id, agent());
  209 |       expect(list.body?.data, 'API holds a single record').toHaveLength(1);
  210 |     });
  211 |     await test.step('a different relationship is a different beneficiary', async () => {
  212 |       await ben.addAndExpectRow({ ...original, relationship: 'CHILD' }, 2);
  213 |     });
  214 |   });
  215 | 
  216 |   test(name('TC-BEN-009', 'removing or editing a beneficiary updates the allocation total'), meta('TC-BEN-009'), async ({ page, api }, testInfo) => {
  217 |     const app = await buildApplication(api, {
  218 |       agentEmail: agent(), upTo: 'beneficiaries',
  219 |       beneficiaries: [
  220 |         beneficiary({ allocation: 50 }), beneficiary({ allocation: 30, relationship: 'CHILD' }), beneficiary({ allocation: 20, relationship: 'SIBLING' }),
  221 |       ],
  222 |     });
  223 |     const list = (await api.listBeneficiaries(app.id, agent())).body?.data as { id: number; allocation_percentage: string | number }[];
  224 |     const idFor = (pct: number): number => {
  225 |       const row = list.find((b) => Number(b.allocation_percentage) === pct);
  226 |       if (!row) throw new Error(`No beneficiary with ${pct}%`);
  227 |       return row.id;
  228 |     };
  229 | 
  230 |     const ben = new BeneficiaryPage(page);
  231 |     await ben.goto(app.id);
  232 |     expect(await ben.primaryTotal()).toBe(100);
  233 | 
  234 |     await test.step('remove the 30% beneficiary: total becomes 70% and is flagged', async () => {
```