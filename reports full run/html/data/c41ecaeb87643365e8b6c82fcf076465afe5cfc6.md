# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-007 | PROD-V07 | suitability / eligibility warning for age and product mismatch
- Location: tests\product-selection\product-selection.spec.ts:185:7

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
          - link "Learner Agent 002" [ref=f2e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f2e22] [cursor=pointer]
  - main [ref=f2e23]:
    - generic [ref=f2e25]:
      - link "← Back to Documents" [ref=f2e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/138/documents
      - link "Application Summary" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/138
    - generic [ref=f2e28]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: "Application #138"
        - heading "Review Application" [level=1] [ref=f2e32]
        - paragraph [ref=f2e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e34]:
        - generic [ref=f2e37]:
          - heading "Submission Validation" [level=2] [ref=f2e38]
          - generic [ref=f2e39]: No blocking validation errors found.
          - generic [ref=f2e40]:
            - link "Back to Documents" [ref=f2e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/138/documents
            - button "Run Validation" [ref=f2e42] [cursor=pointer]
          - button "Submit Application" [ref=f2e44] [cursor=pointer]
        - generic [ref=f2e47]:
          - heading "Application Snapshot" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - term [ref=f2e50]: Client
            - definition [ref=f2e51]: Qaomgnqw Fmltcnb
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
  103 |       const res = await api.saveProduct(app.id, agent(), {
  104 |         insurance_product_id: await api.productId(p.code), face_value: p.faceMax + 1,
  105 |         premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
  106 |       });
  107 |       expectApiError(res, 422, MSG.faceAboveMax);
  108 |     });
  109 |   });
  110 | 
  111 |   test(name('TC-PROD-005', 'premium recalculates when frequency or face value changes'), meta('TC-PROD-005'), async ({ page, api }) => {
  112 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
  113 |     const p = product('WL_SECURE_BASIC');
  114 |     const config = new ProductConfigurationPage(page);
  115 |     await config.goto(app.id);
  116 |     await config.selectProduct(p.code);
  117 |     await config.setFaceValue(250_000);
  118 |     await config.paymentTerm.selectOption('20');
  119 |     await config.setPolicyTerm('WHOLE_LIFE');
  120 | 
  121 |     const seen: number[] = [];
  122 |     for (const f of FREQUENCIES) {
  123 |       await test.step(`frequency ${f}`, async () => {
  124 |         await config.setFrequency(f);
  125 |         const expected = periodPremium(250_000, p.ratePer1000, f);
  126 |         await expect.poll(() => config.premiumShown(), { message: `live premium for ${f}` }).toBe(expected);
  127 |         seen.push(expected);
  128 |       });
  129 |     }
  130 |     expect(new Set(seen).size, 'each frequency gives a different premium').toBe(FREQUENCIES.length);
  131 | 
  132 |     await test.step('changing the face value changes the premium', async () => {
  133 |       await config.setFrequency('MONTHLY');
  134 |       await config.setFaceValue(300_000);
  135 |       await expect.poll(() => config.premiumShown()).toBe(periodPremium(300_000, p.ratePer1000, 'MONTHLY'));
  136 |     });
  137 | 
  138 |     await test.step('saved premium equals the preview and the API', async () => {
  139 |       await config.setFrequency('QUARTERLY');
  140 |       await config.save();
  141 |       await expect(page).toHaveURL(/\/riders/);
  142 |       const expected = periodPremium(300_000, p.ratePer1000, 'QUARTERLY');
  143 |       await config.goto(app.id);
  144 |       expect(await config.premiumShown(), 'stored premium after reload').toBe(expected);
  145 |       const res = await api.getApplication(app.id, agent());
  146 |       expect(Number(res.body?.data?.total_premium), 'API total premium').toBe(expected);
  147 |     });
  148 |   });
  149 | 
  150 |   test(name('TC-PROD-006', 'premium matches on configuration, summary, review and API'), meta('TC-PROD-006'), async ({ page, api }) => {
  151 |     const face = 250_000;
  152 |     const app = await buildApplication(api, {
  153 |       agentEmail: agent(), upTo: 'riders', product: { faceValue: face, frequency: 'MONTHLY' }, riders: [{ key: 'ADB', coverage: face }],
  154 |     });
  155 |     const p = product('WL_SECURE_BASIC');
  156 |     const config = new ProductConfigurationPage(page);
  157 |     const review = new ReviewPage(page);
  158 | 
  159 |     const readAll = async (): Promise<Record<string, number>> => {
  160 |       await config.goto(app.id);
  161 |       const configPremium = await config.premiumShown();
  162 |       await page.goto(`/applications/${app.id}`);
  163 |       const summary = parseMoney(await page.getByTestId('application-total-premium').innerText());
  164 |       await review.goto(app.id);
  165 |       const reviewPremium = await review.totalPremium();
  166 |       const apiPremium = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
  167 |       return { configPremium, summary, reviewPremium, apiPremium };
  168 |     };
  169 | 
  170 |     await test.step('as configured (250,000 + ADB, monthly)', async () => {
  171 |       const expected = totalPremium({ face, rate: p.ratePer1000 }, [{ coverage: face, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY');
  172 |       const v = await readAll();
  173 |       expect(v, 'all four places show the same premium').toEqual({ configPremium: expected, summary: expected, reviewPremium: expected, apiPremium: expected });
  174 |     });
  175 |     await test.step('after changing the face value to 300,000', async () => {
  176 |       await config.goto(app.id);
  177 |       await config.setFaceValue(300_000);
  178 |       await config.save();
  179 |       const v = await readAll();
  180 |       const values = Object.values(v);
  181 |       expect(new Set(values).size, `premium differs between screens/API: ${JSON.stringify(v)}`).toBe(1);
  182 |     });
  183 |   });
  184 | 
  185 |   test(name('TC-PROD-007', 'suitability / eligibility warning for age and product mismatch'), meta('TC-PROD-007'), async ({ page, api }, testInfo) => {
  186 |     const cases = [
  187 |       { label: 'age 19 with WealthBuilder (min 21)', age: 19, code: 'WL_WEALTH_BUILDER' },
  188 |       { label: 'age 63 with Guaranteed Return (max 55)', age: 63, code: 'WL_GUARANTEED_RETURN' },
  189 |       { label: 'age 63 with FlexiPay (max 62)', age: 63, code: 'WL_FLEXI_PAY' },
  190 |     ];
  191 |     for (const c of cases) {
  192 |       await test.step(c.label, async () => {
  193 |         const p = product(c.code);
  194 |         const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc', client: { dob: dobForAge(c.age) } });
  195 | 
  196 |         // UI: choose the product and save; the eligibility message may appear on the form or on the review page
  197 |         const config = new ProductConfigurationPage(page);
  198 |         await config.goto(app.id);
  199 |         await config.fill(productData({ productCode: c.code, faceValue: Math.max(p.faceMin, 250_000) }));
  200 |         await config.save();
  201 |         const where = await errorSurface(page, app.id, MSG.eligibility);
  202 |         testInfo.annotations.push({ type: 'observation', description: `${c.label}: eligibility message shown on ${where ?? 'NOWHERE'}` });
> 203 |         expect(where, `${c.label}: UI must flag the mismatch`).not.toBeNull();
      |                                                                    ^ Error: age 19 with WealthBuilder (min 21): UI must flag the mismatch
  204 | 
  205 |         // API: validate must report it as well
  206 |         const res = await api.validate(app.id, agent());
  207 |         expect(errorTexts(res).join(' | '), `${c.label}: validate API`).toMatch(MSG.eligibility);
  208 |       });
  209 |     }
  210 |   });
  211 | });
  212 | 
```