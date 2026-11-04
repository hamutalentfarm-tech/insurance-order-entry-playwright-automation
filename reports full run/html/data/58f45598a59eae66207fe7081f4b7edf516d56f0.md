# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\api.spec.ts >> API >> TC-API-001 | API-V01 | products API returns 200 and the expected schema
- Location: tests\api\api.spec.ts:21:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 5
Received length: 4
Received array:  [{"base_rate_per_1000": "6.1000", "created_at": "2026-05-17T16:06:33.000000Z", "eligibility_age_max": 65, "eligibility_age_min": 30, "face_value_max": "5000000.00", "face_value_min": "500000.00", "features": "High coverage, estate planning orientation, enhanced suitability, larger face-value limits.", "id": 3, "is_active": true, "product_code": "WL_ELITE_LEGACY", "product_name": "Elite Legacy Whole Life", "product_type": "WHOLE_LIFE", "short_description": "High-net-worth offering for estate planning and tax efficiency.", "updated_at": "2026-05-17T16:06:33.000000Z"}, {"base_rate_per_1000": "5.1500", "created_at": "2026-05-17T16:06:33.000000Z", "eligibility_age_max": 62, "eligibility_age_min": 19, "face_value_max": "1200000.00", "face_value_min": "100000.00", "features": "Multiple payment terms, flexible premium frequencies, suitable for payment option validation.", "id": 4, "is_active": true, "product_code": "WL_FLEXI_PAY", "product_name": "FlexiPay Whole Life", "product_type": "WHOLE_LIFE", "short_description": "Flexible premium payment options with adjustable premiums.", "updated_at": "2026-06-02T13:55:29.000000Z"}, {"base_rate_per_1000": "4.7500", "created_at": "2026-05-17T16:06:33.000000Z", "eligibility_age_max": 65, "eligibility_age_min": 18, "face_value_max": "1000000.00", "face_value_min": "100000.00", "features": "Fixed premium, guaranteed death benefit, simple underwriting, suitable for conservative clients.", "id": 1, "is_active": true, "product_code": "WL_SECURE_BASIC", "product_name": "SecureLife Whole Life", "product_type": "WHOLE_LIFE", "short_description": "Basic lifelong coverage with fixed premium and guaranteed death benefit.", "updated_at": "2026-05-17T16:06:33.000000Z"}, {"base_rate_per_1000": "5.3500", "created_at": "2026-05-17T16:06:33.000000Z", "eligibility_age_max": 60, "eligibility_age_min": 21, "face_value_max": "1500000.00", "face_value_min": "150000.00", "features": "Cash value growth, lifelong cover, medium-to-high suitability review, rider-friendly configuration.", "id": 2, "is_active": true, "product_code": "WL_WEALTH_BUILDER", "product_name": "WealthBuilder Whole Life", "product_type": "WHOLE_LIFE", "short_description": "Growth and protection product with cash value accumulation.", "updated_at": "2026-05-17T16:06:33.000000Z"}]
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { beneficiary } from '../../fixtures/applicationData';
  4   | import { PRODUCTS, RIDERS, DOC_MAX_KB, product } from '../../fixtures/referenceData';
  5   | import { DashboardPage } from '../../pages/DashboardPage';
  6   | import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
  7   | import { ApiClient } from '../../utils/apiClient';
  8   | import { buildApplication, toApiBeneficiary } from '../../utils/applicationBuilder';
  9   | import { anyMatches, errorTexts, expectApiError, expectApiSuccess } from '../../utils/assertions';
  10  | import { dobForAge, futureDate } from '../../utils/dataGenerator';
  11  | import { makeFile } from '../../utils/fileUploadHelper';
  12  | import { env } from '../../utils/env';
  13  | import { MSG } from '../../utils/messages';
  14  | import { name, meta } from '../../utils/testMeta';
  15  | import { apiAvailable } from '../../utils/apiAvailable';
  16  | 
  17  | test.use(asRole('learner'));
  18  | const agent = (): string => emailOf('learner');
  19  | 
  20  | test.describe('API', () => {
  21  |   test(name('TC-API-001', 'products API returns 200 and the expected schema'), meta('TC-API-001'), async ({ api }) => {
  22  |     const res = await api.products();
  23  |     expectApiSuccess(res);
  24  |     const items = res.body.data as Record<string, unknown>[];
> 25  |     expect(items).toHaveLength(PRODUCTS.length);
      |                   ^ Error: expect(received).toHaveLength(expected)
  26  | 
  27  |     for (const item of items) {
  28  |       for (const key of ['id', 'product_code', 'product_name', 'eligibility_age_min', 'eligibility_age_max', 'face_value_min', 'face_value_max', 'base_rate_per_1000', 'is_active']) {
  29  |         expect(item, `product has "${key}"`).toHaveProperty(key);
  30  |       }
  31  |       const ref = product(String(item.product_code));
  32  |       expect(item.product_name).toBe(ref.name);
  33  |       expect(Number(item.eligibility_age_min)).toBe(ref.ageMin);
  34  |       expect(Number(item.eligibility_age_max)).toBe(ref.ageMax);
  35  |       expect(Number(item.face_value_min)).toBe(ref.faceMin);
  36  |       expect(Number(item.face_value_max)).toBe(ref.faceMax);
  37  |       expect(Number(item.base_rate_per_1000)).toBeCloseTo(ref.ratePer1000, 4);
  38  |     }
  39  | 
  40  |     await test.step('riders API (extension)', async () => {
  41  |       const riders = await api.riders();
  42  |       expectApiSuccess(riders);
  43  |       const list = riders.body.data as { rider_code: string; eligibility_age_min: number; eligibility_age_max: number }[];
  44  |       expect(list).toHaveLength(Object.keys(RIDERS).length);
  45  |       for (const r of Object.values(RIDERS)) {
  46  |         const live = list.find((x) => x.rider_code === r.code);
  47  |         expect(live, `rider ${r.code} listed`).toBeTruthy();
  48  |         expect(Number(live?.eligibility_age_min)).toBe(r.ageMin);
  49  |         expect(Number(live?.eligibility_age_max)).toBe(r.ageMax);
  50  |       }
  51  |     });
  52  |   });
  53  | 
  54  |   test(name('TC-API-002', 'application APIs require the API key'), meta('TC-API-002'), async ({ api }, testInfo) => {
  55  |     const noKey = await ApiClient.create({ apiKey: null });
  56  |     const wrongKey = await ApiClient.create({ apiKey: 'definitely-wrong-key' });
  57  |     try {
  58  |       for (const [label, client] of [['no key', noKey], ['wrong key', wrongKey]] as const) {
  59  |         await test.step(label, async () => {
  60  |           const list = await client.listApplications(agent());
  61  |           expectApiError(list, 401, MSG.unauthorized);
  62  |           const submit = await client.submit(1, agent());
  63  |           expectApiError(submit, 401, MSG.unauthorized);
  64  |           expect(list.text, 'no application data leaks').not.toMatch(/application_reference_number/);
  65  |         });
  66  |       }
  67  |       await test.step('health check is public', async () => {
  68  |               // The Lab Manual's health example sends the key, so whether health is public is only recorded, not asserted.
  69  |       const health = await noKey.health();
  70  |       testInfo.annotations.push({ type: 'observation', description: `GET health without a key: HTTP ${health.status}` });
  71  |       });
  72  |     } finally {
  73  |       await noKey.dispose();
  74  |       await wrongKey.dispose();
  75  |     }
  76  |     expect((await api.listApplications(agent())).status, 'valid key works').toBe(200);
  77  |   });
  78  | 
  79  |   test(name('TC-API-003', 'client API rejects invalid dates of birth'), meta('TC-API-003'), async ({ api }, testInfo) => {
  80  |     const draft = async (): Promise<number> => (await buildApplication(api, { agentEmail: agent(), upTo: 'draft' })).id;
  81  |     const payload = (dob: string) => ({
  82  |       first_name: 'Qa', last_name: 'Tester', date_of_birth: dob, gender: 'MALE', marital_status: 'SINGLE',
  83  |       nationality: 'United States', occupation: 'Engineer', employer_name: 'Acme', employer_address: '1 Corporate Way',
  84  |     });
  85  | 
  86  |     await test.step('future date of birth is rejected', async () => {
  87  |       const id = await draft();
  88  |       const res = await api.saveClient(id, agent(), payload(futureDate(1)));
  89  |       expectApiError(res, 422, MSG.futureDob);
  90  |       expect(JSON.stringify(res.body.errors)).toMatch(/date_of_birth/);
  91  |     });
  92  |     for (const c of [{ label: 'age 17 years 364 days', dob: dobForAge(18, 1) }, { label: 'age 66', dob: dobForAge(66) }]) {
  93  |       await test.step(`${c.label}: rejected on save, or flagged by validate`, async () => {
  94  |         const id = await draft();
  95  |         const res = await api.saveClient(id, agent(), payload(c.dob));
  96  |         if (res.status === 422) {
  97  |           testInfo.annotations.push({ type: 'observation', description: `${c.label}: rejected when saving` });
  98  |           expect(errorTexts(res).join(' ')).toMatch(MSG.ageRange);
  99  |         } else {
  100 |           expect(res.status, 'accepted on save').toBe(200);
  101 |           const validate = await api.validate(id, agent());
  102 |           testInfo.annotations.push({ type: 'observation', description: `${c.label}: accepted on save; validate returned HTTP ${validate.status}` });
  103 |           expect(errorTexts(validate).join(' | '), `${c.label} must be flagged somewhere`).toMatch(MSG.ageRange);
  104 |         }
  105 |       });
  106 |     }
  107 |     await test.step('a valid date of birth is stored', async () => {
  108 |       const id = await draft();
  109 |       const dob = dobForAge(40);
  110 |       expectApiSuccess(await api.saveClient(id, agent(), payload(dob)));
  111 |       const stored = (await api.getClient(id, agent())).body?.data?.date_of_birth;
  112 |       expect(String(stored).slice(0, 10)).toBe(dob);
  113 |     });
  114 |   });
  115 | 
  116 |   test(name('TC-API-004', 'validate API reports beneficiary allocation errors'), meta('TC-API-004'), async ({ api }, testInfo) => {
  117 |     const cases = [
  118 |       { label: 'primary total 90%', second: 30, expectError: true },
  119 |       { label: 'primary total 110%', second: 50, expectError: true },
  120 |       { label: 'primary total 100%', second: 40, expectError: false },
  121 |     ];
  122 |     for (const c of cases) {
  123 |       await test.step(c.label, async () => {
  124 |         const app = await buildApplication(api, { agentEmail: agent(), upTo: 'documents', beneficiaries: [beneficiary({ allocation: 60 })] });
  125 |         const add = await api.addBeneficiary(app.id, agent(), toApiBeneficiary(beneficiary({ allocation: c.second, relationship: 'CHILD' })));
```