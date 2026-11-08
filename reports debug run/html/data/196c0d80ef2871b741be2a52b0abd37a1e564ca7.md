# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-007 | PROD-V07 | suitability / eligibility warning for age and product mismatch
- Location: tests\product-selection\product-selection.spec.ts:199:7

# Error details

```
Error: age 19 with WealthBuilder (min 21): UI must flag the mismatch

expect(received).not.toBeNull()

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
        - /url: http://34.100.166.72:8081/applications/207/documents
      - link "Application Summary" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/207
    - generic [ref=f2e28]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: "Application #207"
        - heading "Review Application" [level=1] [ref=f2e32]
        - paragraph [ref=f2e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e34]:
        - generic [ref=f2e37]:
          - heading "Submission Validation" [level=2] [ref=f2e38]
          - generic [ref=f2e39]: No blocking validation errors found.
          - generic [ref=f2e40]:
            - link "Back to Documents" [ref=f2e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/207/documents
            - button "Run Validation" [ref=f2e42] [cursor=pointer]
          - button "Submit Application" [ref=f2e44] [cursor=pointer]
        - generic [ref=f2e47]:
          - heading "Application Snapshot" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - term [ref=f2e50]: Client
            - definition [ref=f2e51]: Qaqqvkow Yzztrkv
            - term [ref=f2e52]: Calculated Age
            - definition [ref=f2e53]: "19"
            - term [ref=f2e54]: Product
            - definition [ref=f2e55]: WealthBuilder Whole Life
            - term [ref=f2e56]: Sum Assured
            - definition [ref=f2e57]: $250,000.00
            - term [ref=f2e58]: Premium Payment Frequency
            - definition [ref=f2e59]: MONTHLY
            - term [ref=f2e60]: Premium Payment Term
            - definition [ref=f2e61]: 20 years
            - term [ref=f2e62]: Coverage Term
            - definition [ref=f2e63]: WHOLE_LIFE
            - term [ref=f2e64]: Base Policy Premium
            - definition [ref=f2e65]: $111.46
            - term [ref=f2e66]: Rider Premium
            - definition [ref=f2e67]: $0.00
            - term [ref=f2e68]: Total Modal Premium
            - definition [ref=f2e69]: $111.46
            - term [ref=f2e70]: Status
            - definition [ref=f2e71]: DRAFT
  - contentinfo [ref=f2e72]:
    - generic [ref=f2e73]:
      - generic [ref=f2e74]: TalentFarm QA Automation Lab
      - generic [ref=f2e75]: Insurance Order Entry Demo
```

# Test source

```ts
  117 |   });
  118 | 
  119 |   test(name('TC-PROD-005', 'premium recalculates when frequency or face value changes'), meta('TC-PROD-005'), async ({ page, api }) => {
  120 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
  121 |     const p = product('WL_SECURE_BASIC');
  122 |     const config = new ProductConfigurationPage(page);
  123 |     await config.goto(app.id);
  124 |     await config.selectProduct(p.code);
  125 |     await config.setFaceValue(250_000);
  126 |     await config.paymentTerm.selectOption('20');
  127 |     await config.setPolicyTerm('WHOLE_LIFE');
  128 | 
  129 |     const seen: number[] = [];
  130 |     for (const f of FREQUENCIES) {
  131 |       await test.step(`frequency ${f}`, async () => {
  132 |         await config.setFrequency(f);
  133 |         const expected = periodPremium(250_000, p.ratePer1000, f);
  134 |         await expect.poll(() => config.premiumShown(), { message: `live premium for ${f}` }).toBe(expected);
  135 |         seen.push(expected);
  136 |       });
  137 |     }
  138 |     expect(new Set(seen).size, 'each frequency gives a different premium').toBe(FREQUENCIES.length);
  139 | 
  140 |     await test.step('changing the face value changes the premium', async () => {
  141 |       await config.setFrequency('MONTHLY');
  142 |       await config.setFaceValue(300_000);
  143 |       await expect.poll(() => config.premiumShown()).toBe(periodPremium(300_000, p.ratePer1000, 'MONTHLY'));
  144 |     });
  145 | 
  146 |     await test.step('saved premium equals the preview and the API', async () => {
  147 |       await config.setFrequency('QUARTERLY');
  148 |       await config.save();
  149 |       await expect(page).toHaveURL(/\/riders/);
  150 |       const expected = periodPremium(300_000, p.ratePer1000, 'QUARTERLY');
  151 |       await config.goto(app.id);
  152 |       expect(await config.premiumShown(), 'stored premium after reload').toBe(expected);
  153 |       const res = await api.getApplication(app.id, agent());
  154 |       expect(Number(res.body?.data?.total_premium), 'API total premium').toBe(expected);
  155 |     });
  156 |   });
  157 | 
  158 |     test(name('TC-PROD-006', 'premium matches on configuration, summary, review and API'), meta('TC-PROD-006'), async ({ page, api }) => {
  159 |     const face = 250_000;
  160 |     const app = await buildApplication(api, {
  161 |       agentEmail: agent(), upTo: 'riders', product: { faceValue: face, frequency: 'MONTHLY' },
  162 |     });
  163 |     // The API stores no riders, so the rider is added through the UI, as a real agent would.
  164 |     const riders = new RiderSelectionPage(page);
  165 |     await riders.goto(app.id);
  166 |     await riders.select('ADB', face);
  167 |     await riders.saveAndExpectNext();
  168 | 
  169 |     const p = product('WL_SECURE_BASIC');
  170 |     const config = new ProductConfigurationPage(page);
  171 |     const review = new ReviewPage(page);
  172 | 
  173 |     const readAll = async (): Promise<Record<string, number>> => {
  174 |       await config.goto(app.id);
  175 |       const configPremium = await config.premiumShown();
  176 |       await page.goto(`/applications/${app.id}`);
  177 |       const summary = parseMoney(await page.getByTestId('application-total-premium').innerText());
  178 |       await review.goto(app.id);
  179 |       const reviewPremium = await review.totalPremium();
  180 |       const apiPremium = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
  181 |       return { configPremium, summary, reviewPremium, apiPremium };
  182 |     };
  183 | 
  184 |     await test.step('as configured (250,000 + ADB, monthly)', async () => {
  185 |       const expected = totalPremium({ face, rate: p.ratePer1000 }, [{ coverage: face, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY');
  186 |       const v = await readAll();
  187 |       expect(v, 'all four places show the same premium').toEqual({ configPremium: expected, summary: expected, reviewPremium: expected, apiPremium: expected });
  188 |     });
  189 |     await test.step('after changing the face value to 300,000', async () => {
  190 |       await config.goto(app.id);
  191 |       await config.setFaceValue(300_000);
  192 |       await config.save();
  193 |       const v = await readAll();
  194 |       const values = Object.values(v);
  195 |       expect(new Set(values).size, `premium differs between screens/API: ${JSON.stringify(v)}`).toBe(1);
  196 |     });
  197 |   });
  198 | 
  199 |   test(name('TC-PROD-007', 'suitability / eligibility warning for age and product mismatch'), meta('TC-PROD-007'), async ({ page, api }, testInfo) => {
  200 |     const cases = [
  201 |       { label: 'age 19 with WealthBuilder (min 21)', age: 19, code: 'WL_WEALTH_BUILDER' },
  202 |       { label: 'age 63 with Guaranteed Return (max 55)', age: 63, code: 'WL_GUARANTEED_RETURN' },
  203 |       { label: 'age 63 with FlexiPay (max 62)', age: 63, code: 'WL_FLEXI_PAY' },
  204 |     ];
  205 |     for (const c of cases) {
  206 |       await test.step(c.label, async () => {
  207 |         const p = product(c.code);
  208 |         const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc', client: { dob: dobForAge(c.age) } });
  209 | 
  210 |         // UI: choose the product and save; the eligibility message may appear on the form or on the review page
  211 |         const config = new ProductConfigurationPage(page);
  212 |         await config.goto(app.id);
  213 |         await config.fill(productData({ productCode: c.code, faceValue: Math.max(p.faceMin, 250_000) }));
  214 |         await config.save();
  215 |         const where = await errorSurface(page, app.id, MSG.eligibility);
  216 |         testInfo.annotations.push({ type: 'observation', description: `${c.label}: eligibility message shown on ${where ?? 'NOWHERE'}` });
> 217 |         expect(where, `${c.label}: UI must flag the mismatch`).not.toBeNull();
      |                                                                    ^ Error: age 19 with WealthBuilder (min 21): UI must flag the mismatch
  218 | 
  219 |         // API: validate must report it as well
  220 |         const res = await api.validate(app.id, agent());
  221 |         expect(errorTexts(res).join(' | '), `${c.label}: validate API`).toMatch(MSG.eligibility);
  222 |       });
  223 |     }
  224 |   });
  225 | });
  226 | 
```