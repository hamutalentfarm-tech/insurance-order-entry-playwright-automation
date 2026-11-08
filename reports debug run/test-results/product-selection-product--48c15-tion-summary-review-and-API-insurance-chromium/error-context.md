# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-006 | PROD-V06 | premium matches on configuration, summary, review and API
- Location: tests\product-selection\product-selection.spec.ts:158:9

# Error details

```
Error: all four places show the same premium

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "apiPremium": 116.67,
-   "configPremium": 116.67,
+   "configPremium": 98.96,
    "reviewPremium": 116.67,
    "summary": 116.67,
  }
```

# Page snapshot

```yaml
- generic [active] [ref=f4e1]:
  - navigation [ref=f4e2]:
    - generic [ref=f4e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f4e4] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/dashboard
        - generic [aria-hidden] [ref=f4e5]: IO
        - generic [ref=f4e6]:
          - generic [ref=f4e7]: Insurance Order Entry Demo Platform
          - generic [ref=f4e8]: QA Automation Training App
      - generic [ref=f4e9]:
        - list [ref=f4e10]:
          - listitem [ref=f4e11]:
            - link "Dashboard" [ref=f4e12] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/dashboard
          - listitem [ref=f4e13]:
            - link "Applications" [ref=f4e14] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications
          - listitem [ref=f4e15]:
            - link "Products" [ref=f4e16] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/products
          - listitem [ref=f4e17]:
            - link "Support" [ref=f4e18] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/support
        - generic [ref=f4e19]:
          - link "Learner Agent 003" [ref=f4e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f4e22] [cursor=pointer]
  - main [ref=f4e23]:
    - generic [ref=f4e25]:
      - link "← Back to Documents" [ref=f4e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/206/documents
      - link "Application Summary" [ref=f4e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/206
    - generic [ref=f4e28]:
      - generic [ref=f4e30]:
        - generic [ref=f4e31]: "Application #206"
        - heading "Review Application" [level=1] [ref=f4e32]
        - paragraph [ref=f4e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f4e34]:
        - generic [ref=f4e37]:
          - heading "Submission Validation" [level=2] [ref=f4e38]
          - generic [ref=f4e39]: No blocking validation errors found.
          - generic [ref=f4e40]:
            - link "Back to Documents" [ref=f4e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/206/documents
            - button "Run Validation" [ref=f4e42] [cursor=pointer]
          - button "Submit Application" [ref=f4e44] [cursor=pointer]
        - generic [ref=f4e47]:
          - heading "Application Snapshot" [level=2] [ref=f4e48]
          - generic [ref=f4e49]:
            - term [ref=f4e50]: Client
            - definition [ref=f4e51]: Qaazdtwa Emrfgpc
            - term [ref=f4e52]: Calculated Age
            - definition [ref=f4e53]: "40"
            - term [ref=f4e54]: Product
            - definition [ref=f4e55]: SecureLife Whole Life
            - term [ref=f4e56]: Sum Assured
            - definition [ref=f4e57]: $250,000.00
            - term [ref=f4e58]: Premium Payment Frequency
            - definition [ref=f4e59]: MONTHLY
            - term [ref=f4e60]: Premium Payment Term
            - definition [ref=f4e61]: 20 years
            - term [ref=f4e62]: Coverage Term
            - definition [ref=f4e63]: WHOLE_LIFE
            - term [ref=f4e64]: Base Policy Premium
            - definition [ref=f4e65]: $98.96
            - term [ref=f4e66]: Rider Premium
            - definition [ref=f4e67]: $17.71
            - term [ref=f4e68]: Total Modal Premium
            - definition [ref=f4e69]: $116.67
            - term [ref=f4e70]: Status
            - definition [ref=f4e71]: DRAFT
  - contentinfo [ref=f4e72]:
    - generic [ref=f4e73]:
      - generic [ref=f4e74]: TalentFarm QA Automation Lab
      - generic [ref=f4e75]: Insurance Order Entry Demo
```

# Test source

```ts
  87  |     });
  88  |   });
  89  | 
  90  |   test(name('TC-PROD-004', 'face value above the maximum is rejected'), meta('TC-PROD-004'), async ({ page, api }) => {
  91  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
  92  |     const config = new ProductConfigurationPage(page);
  93  |     const products = await liveProducts(api);
  94  | 
  95  |     for (const p of products) {
  96  |       await test.step(`${p.name}: ${p.faceMax + 1} rejected, ${p.faceMax} accepted`, async () => {
  97  |         await config.goto(app.id);
  98  |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMax + 1 }));
  99  |         await config.save();
  100 |         await expect(page).toHaveURL(/\/product/);
  101 |         await config.expectErrorMatching(MSG.faceAboveMax);
  102 | 
  103 |         await config.goto(app.id);
  104 |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMax }));
  105 |         await config.save();
  106 |         await expect(page, 'maximum is accepted').toHaveURL(/\/riders/);
  107 |       });
  108 |     }
  109 |     await test.step('API rejects above-maximum too', async () => {
  110 |       const p = products.find((x) => x.code === 'WL_SECURE_BASIC') ?? products[0];
  111 |       const res = await api.saveProduct(app.id, agent(), {
  112 |         insurance_product_id: await api.productId(p.code), face_value: p.faceMax + 1,
  113 |         premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
  114 |       });
  115 |       expectApiError(res, 422, MSG.faceAboveMax);
  116 |     });
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
> 187 |       expect(v, 'all four places show the same premium').toEqual({ configPremium: expected, summary: expected, reviewPremium: expected, apiPremium: expected });
      |                                                          ^ Error: all four places show the same premium
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
  217 |         expect(where, `${c.label}: UI must flag the mismatch`).not.toBeNull();
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