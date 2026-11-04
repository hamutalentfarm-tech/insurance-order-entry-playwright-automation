# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: product-selection\product-selection.spec.ts >> Product selection and policy configuration >> TC-PROD-001 | PROD-V01 | catalog shows the expected Whole Life products
- Location: tests\product-selection\product-selection.spec.ts:22:7

# Error details

```
Error: seeded products are all listed

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Array [
    "WL_ELITE_LEGACY",
    "WL_FLEXI_PAY",
-   "WL_GUARANTEED_RETURN",
    "WL_SECURE_BASIC",
    "WL_WEALTH_BUILDER",
  ]
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
    - generic [ref=e24]:
      - heading "Whole Life Product Catalog" [level=1] [ref=e25]
      - paragraph [ref=e26]: Use these products while configuring an insurance application.
    - generic [ref=e27]:
      - generic [ref=e30]:
        - generic [ref=e31]: WL_ELITE_LEGACY
        - heading "Elite Legacy Whole Life" [level=2] [ref=e32]
        - paragraph [ref=e33]: High-net-worth offering for estate planning and tax efficiency.
        - generic [ref=e34]:
          - term [ref=e35]: Age
          - definition [ref=e36]: 30 - 65
          - term [ref=e37]: Sum Assured
          - definition [ref=e38]: 500,000 - 5,000,000
          - term [ref=e39]: Rate / 1000
          - definition [ref=e40]: "6.1000"
        - link "View Details" [ref=e41] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/products/3
      - generic [ref=e44]:
        - generic [ref=e45]: WL_FLEXI_PAY
        - heading "FlexiPay Whole Life" [level=2] [ref=e46]
        - paragraph [ref=e47]: Flexible premium payment options with adjustable premiums.
        - generic [ref=e48]:
          - term [ref=e49]: Age
          - definition [ref=e50]: 19 - 62
          - term [ref=e51]: Sum Assured
          - definition [ref=e52]: 100,000 - 1,200,000
          - term [ref=e53]: Rate / 1000
          - definition [ref=e54]: "5.1500"
        - link "View Details" [ref=e55] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/products/4
      - generic [ref=e58]:
        - generic [ref=e59]: WL_SECURE_BASIC
        - heading "SecureLife Whole Life" [level=2] [ref=e60]
        - paragraph [ref=e61]: Basic lifelong coverage with fixed premium and guaranteed death benefit.
        - generic [ref=e62]:
          - term [ref=e63]: Age
          - definition [ref=e64]: 18 - 65
          - term [ref=e65]: Sum Assured
          - definition [ref=e66]: 100,000 - 1,000,000
          - term [ref=e67]: Rate / 1000
          - definition [ref=e68]: "4.7500"
        - link "View Details" [ref=e69] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/products/1
      - generic [ref=e72]:
        - generic [ref=e73]: WL_WEALTH_BUILDER
        - heading "WealthBuilder Whole Life" [level=2] [ref=e74]
        - paragraph [ref=e75]: Growth and protection product with cash value accumulation.
        - generic [ref=e76]:
          - term [ref=e77]: Age
          - definition [ref=e78]: 21 - 60
          - term [ref=e79]: Sum Assured
          - definition [ref=e80]: 150,000 - 1,500,000
          - term [ref=e81]: Rate / 1000
          - definition [ref=e82]: "5.3500"
        - link "View Details" [ref=e83] [cursor=pointer]:
          - /url: http://34.100.166.72:8081/products/2
  - contentinfo [ref=e84]:
    - generic [ref=e85]:
      - generic [ref=e86]: TalentFarm QA Automation Lab
      - generic [ref=e87]: Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { productData } from '../../fixtures/applicationData';
  4   | import { FREQUENCIES, PAYMENT_TERMS, POLICY_TERMS, PRODUCTS, RIDERS, product } from '../../fixtures/referenceData';
  5   | import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
  6   | import { ProductConfigurationPage } from '../../pages/ProductConfigurationPage';
  7   | import { ReviewPage } from '../../pages/ReviewPage';
  8   | import { buildApplication } from '../../utils/applicationBuilder';
  9   | import { errorTexts, expectApiError, expectApiSuccess } from '../../utils/assertions';
  10  | import { errorSurface } from '../../utils/flows';
  11  | import { MSG } from '../../utils/messages';
  12  | import { periodPremium, totalPremium } from '../../utils/premium';
  13  | import { dobForAge } from '../../utils/dataGenerator';
  14  | import { parseMoney } from '../../utils/testHelpers';
  15  | import { name, meta } from '../../utils/testMeta';
  16  | 
  17  | test.use(asRole('learner'));
  18  | const agent = (): string => emailOf('learner');
  19  | const sorted = (a: string[]): string[] => [...a].sort();
  20  | 
  21  | test.describe('Product selection and policy configuration', () => {
  22  |   test(name('TC-PROD-001', 'catalog shows the expected Whole Life products'), meta('TC-PROD-001'), async ({ page, api }) => {
  23  |     const catalog = new ProductCatalogPage(page);
  24  |     await catalog.goto();
  25  |     const uiCodes = await catalog.productCodes();
  26  | 
  27  |     const res = await api.products();
  28  |     expectApiSuccess(res);
  29  |     const activeApi = (res.body.data as { product_code: string; is_active: boolean | number }[]).filter((p) => !!p.is_active).map((p) => p.product_code);
  30  | 
  31  |     expect(sorted(uiCodes), 'UI cards equal active products in the API').toEqual(sorted(activeApi));
> 32  |     expect(sorted(uiCodes), 'seeded products are all listed').toEqual(sorted(PRODUCTS.map((p) => p.code)));
      |                                                               ^ Error: seeded products are all listed
  33  |     for (const code of uiCodes) await expect(catalog.card(code)).toBeVisible();
  34  |   });
  35  | 
  36  |   test(name('TC-PROD-002', 'product details page opens with features and terms'), meta('TC-PROD-002'), async ({ page, api }) => {
  37  |     const catalog = new ProductCatalogPage(page);
  38  |     await catalog.goto();
  39  |     const target = product('WL_ELITE_LEGACY');
  40  |     await catalog.openDetails(target.code);
  41  |     const detail = await catalog.detail();
  42  |     expect(detail.code).toContain(target.code);
  43  |     expect(detail.name).toContain(target.name);
  44  |     expect(detail.features.length).toBeGreaterThan(10);
  45  | 
  46  |     await test.step('term options on the configuration page', async () => {
  47  |       const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
  48  |       const config = new ProductConfigurationPage(page);
  49  |       await config.goto(app.id);
  50  |       expect((await config.paymentTermOptions()).map(Number)).toEqual([...PAYMENT_TERMS]);
  51  |       expect(await config.policyTermOptions()).toEqual(expect.arrayContaining([...POLICY_TERMS]));
  52  |     });
  53  |   });
  54  | 
  55  |   test(name('TC-PROD-003', 'face value below the minimum is rejected'), meta('TC-PROD-003'), async ({ page, api }) => {
  56  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' }); // client age 40 is eligible for every product
  57  |     const config = new ProductConfigurationPage(page);
  58  | 
  59  |     for (const p of PRODUCTS) {
  60  |       await test.step(`${p.name}: ${p.faceMin - 1} rejected, ${p.faceMin} accepted`, async () => {
  61  |         await config.goto(app.id);
  62  |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMin - 1 }));
  63  |         await config.save();
  64  |         await expect(page).toHaveURL(/\/product/);
  65  |         await config.expectErrorMatching(MSG.faceBelowMin);
  66  | 
  67  |         await config.goto(app.id);
  68  |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMin }));
  69  |         await config.save();
  70  |         await expect(page, 'minimum is accepted').toHaveURL(/\/riders/);
  71  |       });
  72  |     }
  73  |     await test.step('API rejects below-minimum too', async () => {
  74  |       const p = product('WL_SECURE_BASIC');
  75  |       const res = await api.saveProduct(app.id, agent(), {
  76  |         insurance_product_id: await api.productId(p.code), face_value: p.faceMin - 1,
  77  |         premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
  78  |       });
  79  |       expectApiError(res, 422, MSG.faceBelowMin);
  80  |     });
  81  |   });
  82  | 
  83  |   test(name('TC-PROD-004', 'face value above the maximum is rejected'), meta('TC-PROD-004'), async ({ page, api }) => {
  84  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
  85  |     const config = new ProductConfigurationPage(page);
  86  | 
  87  |     for (const p of PRODUCTS) {
  88  |       await test.step(`${p.name}: ${p.faceMax + 1} rejected, ${p.faceMax} accepted`, async () => {
  89  |         await config.goto(app.id);
  90  |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMax + 1 }));
  91  |         await config.save();
  92  |         await expect(page).toHaveURL(/\/product/);
  93  |         await config.expectErrorMatching(MSG.faceAboveMax);
  94  | 
  95  |         await config.goto(app.id);
  96  |         await config.fill(productData({ productCode: p.code, faceValue: p.faceMax }));
  97  |         await config.save();
  98  |         await expect(page, 'maximum is accepted').toHaveURL(/\/riders/);
  99  |       });
  100 |     }
  101 |     await test.step('API rejects above-maximum too', async () => {
  102 |       const p = product('WL_SECURE_BASIC');
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
```