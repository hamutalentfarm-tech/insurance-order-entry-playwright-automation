# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.ts >> Beneficiary management >> TC-BEN-008 | BEN-V08 | duplicate beneficiary is blocked
- Location: tests\beneficiaries\beneficiaries.spec.ts:196:7

# Error details

```
Error: duplicate error

expect(received).toMatch(expected)

Expected pattern: /duplicate|already exists|already added/i
Received string:  ""
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
          - link "Learner Agent 002" [ref=f2e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f2e22] [cursor=pointer]
  - main [ref=f2e23]:
    - alert [ref=f2e24]: Beneficiary saved.
    - generic [ref=f2e26]:
      - link "← Back to Riders" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/107/riders
      - link "Application Summary" [ref=f2e28] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/107
    - generic [ref=f2e29]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]:
          - generic [ref=f2e32]: "Application #107"
          - heading "Beneficiaries" [level=1] [ref=f2e33]
          - paragraph [ref=f2e34]: Add or update primary and secondary beneficiaries for the policy.
        - link "Back to Application" [ref=f2e35] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/applications/107
      - generic [ref=f2e36]: "Primary allocation: 80.00% | Secondary allocation: 0.00%"
      - generic [ref=f2e37]:
        - strong [ref=f2e39]: Existing Beneficiaries
        - table [ref=f2e42]:
          - rowgroup [ref=f2e43]:
            - row [ref=f2e44]:
              - columnheader "Level" [ref=f2e45]
              - columnheader "Type" [ref=f2e46]
              - columnheader "Name" [ref=f2e47]
              - columnheader "Designation" [ref=f2e48]
              - columnheader "Relationship" [ref=f2e49]
              - columnheader "Age" [ref=f2e50]
              - columnheader "Allocation" [ref=f2e51]
              - columnheader "Email" [ref=f2e52]
              - columnheader "Phone" [ref=f2e53]
              - columnheader "Action" [ref=f2e54]
          - rowgroup [ref=f2e55]:
            - row [ref=f2e56]:
              - cell "PRIMARY" [ref=f2e57]
              - cell "INDIVIDUAL" [ref=f2e58]
              - cell "Jane Apxoae" [ref=f2e59]
              - cell "Revocable" [ref=f2e60]
              - cell "SPOUSE" [ref=f2e62]
              - cell "38" [ref=f2e63]
              - cell "40.00%" [ref=f2e64]
              - cell "-" [ref=f2e65]
              - cell "-" [ref=f2e66]
              - cell [ref=f2e67]:
                - link "Edit" [ref=f2e68] [cursor=pointer]:
                  - /url: http://34.100.166.72:8081/applications/107/beneficiaries?edit=88
                - button "Remove" [ref=f2e70] [cursor=pointer]
            - row [ref=f2e71]:
              - cell "PRIMARY" [ref=f2e72]
              - cell "INDIVIDUAL" [ref=f2e73]
              - cell "Jane Apxoae" [ref=f2e74]
              - cell "Revocable" [ref=f2e75]
              - cell "SPOUSE" [ref=f2e77]
              - cell "38" [ref=f2e78]
              - cell "40.00%" [ref=f2e79]
              - cell "-" [ref=f2e80]
              - cell "-" [ref=f2e81]
              - cell [ref=f2e82]:
                - link "Edit" [ref=f2e83] [cursor=pointer]:
                  - /url: http://34.100.166.72:8081/applications/107/beneficiaries?edit=89
                - button "Remove" [ref=f2e85] [cursor=pointer]
      - generic [ref=f2e86]:
        - generic [ref=f2e87]:
          - strong [ref=f2e89]: Add Beneficiary
          - generic [ref=f2e91]:
            - generic [ref=f2e92]:
              - generic [ref=f2e93]: Beneficiary Level *
              - combobox [ref=f2e94]:
                - option "Select" [selected]
                - option "Primary"
                - option "Secondary"
            - generic [ref=f2e95]:
              - generic [ref=f2e96]: Beneficiary Type *
              - combobox [ref=f2e97]:
                - option "Individual" [selected]
                - option "Trust"
                - option "Organization"
            - generic [ref=f2e98]:
              - generic [ref=f2e99]: Relationship *
              - combobox [ref=f2e100]:
                - option "Select" [selected]
                - option "Spouse"
                - option "Child"
                - option "Parent"
                - option "Sibling"
                - option "Trust"
                - option "Organization"
                - option "Other"
            - generic [ref=f2e101]:
              - generic [ref=f2e102]: Allocation % *
              - spinbutton [ref=f2e103]: "100"
            - generic [ref=f2e104]:
              - generic [ref=f2e105]: Beneficiary Designation *
              - combobox [ref=f2e106]:
                - option "Revocable" [selected]
                - option "Irrevocable"
              - generic [ref=f2e107]: Irrevocable beneficiaries cannot be changed or removed in this demo without beneficiary consent.
            - generic [ref=f2e108]:
              - generic [ref=f2e109]: Phone
              - textbox "(212) 555-1212" [ref=f2e110]
            - generic [ref=f2e111]:
              - generic [ref=f2e112]: Email
              - textbox [ref=f2e113]
            - generic [ref=f2e114]:
              - generic [ref=f2e115]: Country
              - textbox [ref=f2e116]: US
        - generic [ref=f2e117]:
          - strong [ref=f2e119]: Individual Beneficiary Details
          - generic [ref=f2e121]:
            - generic [ref=f2e122]:
              - generic [ref=f2e123]: First Name *
              - textbox [ref=f2e124]
            - generic [ref=f2e125]:
              - generic [ref=f2e126]: Middle Name
              - textbox [ref=f2e127]
            - generic [ref=f2e128]:
              - generic [ref=f2e129]: Last Name *
              - textbox [ref=f2e130]
            - generic [ref=f2e131]:
              - generic [ref=f2e132]: Date of Birth *
              - textbox [ref=f2e133]
            - generic [ref=f2e134]:
              - generic [ref=f2e135]: Gender
              - combobox [ref=f2e136]:
                - option "Select" [selected]
                - option "Male"
                - option "Female"
                - option "Non-binary"
        - generic [ref=f2e137]:
          - strong [ref=f2e139]: Address Details
          - generic [ref=f2e141]:
            - generic [ref=f2e142]:
              - generic [ref=f2e143]: Address Line 1
              - textbox [ref=f2e144]
            - generic [ref=f2e145]:
              - generic [ref=f2e146]: City
              - textbox [ref=f2e147]
            - generic [ref=f2e148]:
              - generic [ref=f2e149]: State
              - textbox [ref=f2e150]
            - generic [ref=f2e151]:
              - generic [ref=f2e152]: Postal Code
              - textbox [ref=f2e153]
        - generic [ref=f2e154]:
          - strong [ref=f2e156]: Minor Beneficiary Guardian Details
          - generic [ref=f2e158]:
            - generic [ref=f2e159]:
              - generic [ref=f2e160]: Guardian Name
              - textbox [ref=f2e161]
            - generic [ref=f2e162]:
              - generic [ref=f2e163]: Guardian Relationship
              - textbox [ref=f2e164]
            - generic [ref=f2e165]:
              - generic [ref=f2e166]: Guardian Contact
              - textbox [ref=f2e167]
            - generic [ref=f2e168]:
              - generic [ref=f2e169]: Guardian Address
              - textbox [ref=f2e170]
            - generic [ref=f2e172]:
              - checkbox "Legal acknowledgement completed for minor beneficiary" [ref=f2e173]
              - generic [ref=f2e174]: Legal acknowledgement completed for minor beneficiary
        - generic [ref=f2e175]:
          - link "Back" [ref=f2e176] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/applications/107/riders
          - generic [ref=f2e177]:
            - button "Save Beneficiary" [ref=f2e178] [cursor=pointer]
            - link "Continue" [ref=f2e179] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/107/documents
  - contentinfo [ref=f2e180]:
    - generic [ref=f2e181]:
      - generic [ref=f2e182]: TalentFarm QA Automation Lab
      - generic [ref=f2e183]: Insurance Order Entry Demo
```

# Test source

```ts
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
> 205 |       expect(await ben.errorsText(), 'duplicate error').toMatch(MSG.duplicate);
      |                                                         ^ Error: duplicate error
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
  235 |       await ben.remove(idFor(30));
  236 |       await expect(ben.rows()).toHaveCount(2);
  237 |       expect(await ben.primaryTotal()).toBe(70);
  238 |       const where = await totalErrorSurface(page, ben, app.id, MSG.primaryTotal);
  239 |       testInfo.annotations.push({ type: 'observation', description: `70% total flagged on: ${where ?? 'NOWHERE'}` });
  240 |       expect(where).not.toBeNull();
  241 |     });
  242 |     await test.step('edit the 20% beneficiary to 50%: total returns to 100%', async () => {
  243 |       await ben.goto(app.id);
  244 |       await ben.changeAllocation(idFor(20), 50);
  245 |       await ben.goto(app.id);
  246 |       expect(await ben.primaryTotal()).toBe(100);
  247 |       const review = new ReviewPage(page);
  248 |       await review.goto(app.id);
  249 |       expect(anyMatches(await review.errors(), MSG.primaryTotal)).toBe(false);
  250 |     });
  251 |   });
  252 | });
  253 | 
```