# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.ts >> Beneficiary management >> TC-BEN-009 | BEN-V09 | removing or editing a beneficiary updates the allocation total
- Location: tests\beneficiaries\beneficiaries.spec.ts:216:7

# Error details

```
Error: expect(received).not.toBeNull()

Received: null
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
    - generic [ref=f2e25]:
      - link "← Back to Documents" [ref=f2e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/177/documents
      - link "Application Summary" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/177
    - generic [ref=f2e28]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: "Application #177"
        - heading "Review Application" [level=1] [ref=f2e32]
        - paragraph [ref=f2e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e34]:
        - generic [ref=f2e37]:
          - heading "Submission Validation" [level=2] [ref=f2e38]
          - generic [ref=f2e39]: No blocking validation errors found.
          - generic [ref=f2e40]:
            - link "Back to Documents" [ref=f2e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/177/documents
            - button "Run Validation" [ref=f2e42] [cursor=pointer]
          - button "Submit Application" [ref=f2e44] [cursor=pointer]
        - generic [ref=f2e47]:
          - heading "Application Snapshot" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - term [ref=f2e50]: Client
            - definition [ref=f2e51]: Qawvqbhy Otplmli
            - term [ref=f2e52]: Calculated Age
            - definition [ref=f2e53]: "40"
            - term [ref=f2e54]: Product
            - definition [ref=f2e55]: SecureLife Whole Life
            - term [ref=f2e56]: Sum Assured
            - definition [ref=f2e57]: $250,000.00
            - term [ref=f2e58]: Premium Payment Frequency
            - definition [ref=f2e59]: MONTHLY
            - term [ref=f2e60]: Premium Payment Term
            - definition [ref=f2e61]: 20 years
            - term [ref=f2e62]: Coverage Term
            - definition [ref=f2e63]: WHOLE_LIFE
            - term [ref=f2e64]: Base Policy Premium
            - definition [ref=f2e65]: $98.96
            - term [ref=f2e66]: Rider Premium
            - definition [ref=f2e67]: $0.00
            - term [ref=f2e68]: Total Modal Premium
            - definition [ref=f2e69]: $98.96
            - term [ref=f2e70]: Status
            - definition [ref=f2e71]: DRAFT
  - contentinfo [ref=f2e72]:
    - generic [ref=f2e73]:
      - generic [ref=f2e74]: TalentFarm QA Automation Lab
      - generic [ref=f2e75]: Insurance Order Entry Demo
```

# Test source

```ts
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
  235 |       await ben.remove(idFor(30));
  236 |       await expect(ben.rows()).toHaveCount(2);
  237 |       expect(await ben.primaryTotal()).toBe(70);
  238 |       const where = await totalErrorSurface(page, ben, app.id, MSG.primaryTotal);
  239 |       testInfo.annotations.push({ type: 'observation', description: `70% total flagged on: ${where ?? 'NOWHERE'}` });
> 240 |       expect(where).not.toBeNull();
      |                         ^ Error: expect(received).not.toBeNull()
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