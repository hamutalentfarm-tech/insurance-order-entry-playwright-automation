# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-003 | RIDER-V03 | age-ineligible rider cannot be added
- Location: tests\riders\riders.spec.ts:82:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/riders/
Received string:  "http://34.100.166.72:8081/applications/141/beneficiaries"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://34.100.166.72:8081/applications/141/beneficiaries"

```

```yaml
- navigation:
  - link "Insurance Order Entry Demo Platform QA Automation Training App":
    - /url: http://34.100.166.72:8081/dashboard
  - list:
    - listitem:
      - link "Dashboard":
        - /url: http://34.100.166.72:8081/dashboard
    - listitem:
      - link "Applications":
        - /url: http://34.100.166.72:8081/applications
    - listitem:
      - link "Products":
        - /url: http://34.100.166.72:8081/products
    - listitem:
      - link "Support":
        - /url: http://34.100.166.72:8081/support
  - link "Learner Agent 002":
    - /url: http://34.100.166.72:8081/profile
  - button "Logout"
- main:
  - alert: Rider selection saved.
  - link "← Back to Riders":
    - /url: http://34.100.166.72:8081/applications/141/riders
  - link "Application Summary":
    - /url: http://34.100.166.72:8081/applications/141
  - text: "Application #141"
  - heading "Beneficiaries" [level=1]
  - paragraph: Add or update primary and secondary beneficiaries for the policy.
  - link "Back to Application":
    - /url: http://34.100.166.72:8081/applications/141
  - text: "Primary allocation: 0.00% | Secondary allocation: 0.00% No beneficiary has been added. Estate assignment will apply by default if no beneficiary is named."
  - strong: Existing Beneficiaries
  - table:
    - rowgroup:
      - row "Level Type Name Designation Relationship Age Allocation Email Phone Action":
        - columnheader "Level"
        - columnheader "Type"
        - columnheader "Name"
        - columnheader "Designation"
        - columnheader "Relationship"
        - columnheader "Age"
        - columnheader "Allocation"
        - columnheader "Email"
        - columnheader "Phone"
        - columnheader "Action"
    - rowgroup:
      - row "No beneficiaries added yet. Estate assignment will apply by default.":
        - cell "No beneficiaries added yet. Estate assignment will apply by default."
  - strong: Add Beneficiary
  - text: Beneficiary Level *
  - combobox:
    - option "Select" [selected]
    - option "Primary"
    - option "Secondary"
  - text: Beneficiary Type *
  - combobox:
    - option "Individual" [selected]
    - option "Trust"
    - option "Organization"
  - text: Relationship *
  - combobox:
    - option "Select" [selected]
    - option "Spouse"
    - option "Child"
    - option "Parent"
    - option "Sibling"
    - option "Trust"
    - option "Organization"
    - option "Other"
  - text: Allocation % *
  - spinbutton: "100"
  - text: Beneficiary Designation *
  - combobox:
    - option "Revocable" [selected]
    - option "Irrevocable"
  - text: Irrevocable beneficiaries cannot be changed or removed in this demo without beneficiary consent. Phone
  - textbox "(212) 555-1212"
  - text: Email
  - textbox
  - text: Country
  - textbox: US
  - strong: Individual Beneficiary Details
  - text: First Name *
  - textbox
  - text: Middle Name
  - textbox
  - text: Last Name *
  - textbox
  - text: Date of Birth *
  - textbox
  - text: Gender
  - combobox:
    - option "Select" [selected]
    - option "Male"
    - option "Female"
    - option "Non-binary"
  - strong: Address Details
  - text: Address Line 1
  - textbox
  - text: City
  - textbox
  - text: State
  - textbox
  - text: Postal Code
  - textbox
  - strong: Minor Beneficiary Guardian Details
  - text: Guardian Name
  - textbox
  - text: Guardian Relationship
  - textbox
  - text: Guardian Contact
  - textbox
  - text: Guardian Address
  - textbox
  - checkbox "Legal acknowledgement completed for minor beneficiary"
  - text: Legal acknowledgement completed for minor beneficiary
  - link "Back":
    - /url: http://34.100.166.72:8081/applications/141/riders
  - button "Save Beneficiary"
  - link "Continue":
    - /url: http://34.100.166.72:8081/applications/141/documents
- contentinfo: TalentFarm QA Automation Lab Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { MAX_RIDERS, RIDERS, product } from '../../fixtures/referenceData';
  4   | import { RiderSelectionPage, type RiderKey } from '../../pages/RiderSelectionPage';
  5   | import { buildApplication } from '../../utils/applicationBuilder';
  6   | import { expectApiError } from '../../utils/assertions';
  7   | import { errorSurface } from '../../utils/flows';
  8   | import { MSG } from '../../utils/messages';
  9   | import { periodPremium, totalPremium } from '../../utils/premium';
  10  | import { dobForAge } from '../../utils/dataGenerator';
  11  | import { name, meta } from '../../utils/testMeta';
  12  | 
  13  | test.use(asRole('learner'));
  14  | const agent = (): string => emailOf('learner');
  15  | const BASE = product('WL_SECURE_BASIC');
  16  | const FACE = 250_000;
  17  | 
  18  | /** Application with client age 40, SecureLife 250,000 monthly saved, positioned at the riders step. */
  19  | async function atRiders(api: Parameters<typeof buildApplication>[0], opts: { age?: number; face?: number } = {}) {
  20  |   return buildApplication(api, {
  21  |     agentEmail: agent(), upTo: 'product',
  22  |     client: opts.age ? { dob: dobForAge(opts.age) } : undefined,
  23  |     product: { productCode: BASE.code, faceValue: opts.face ?? FACE, frequency: 'MONTHLY' },
  24  |   });
  25  | }
  26  | 
  27  | async function riderPayload(api: Parameters<typeof buildApplication>[0], picks: { key: RiderKey; coverage: number }[]) {
  28  |   const out = [];
  29  |   for (const p of picks) out.push({ rider_id: await api.riderId(RIDERS[p.key].code), coverage_amount: p.coverage });
  30  |   return out;
  31  | }
  32  | 
  33  | test.describe('Rider selection', () => {
  34  |   test(name('TC-RID-001', 'agent can add an eligible protection rider (ADB)'), meta('TC-RID-001'), async ({ page, api }) => {
  35  |     const app = await atRiders(api);
  36  |     const riders = new RiderSelectionPage(page);
  37  |     await riders.goto(app.id);
  38  |     await riders.select('ADB', FACE);
  39  |     await riders.saveAndExpectNext();
  40  | 
  41  |     await test.step('rider is stored and itemised in the premium', async () => {
  42  |       await riders.goto(app.id);
  43  |       expect(await riders.isSelected('ADB')).toBe(true);
  44  |       const adb = periodPremium(FACE, RIDERS.ADB.ratePer1000, 'MONTHLY'); // 17.71
  45  |       expect(await riders.summaryText()).toContain(adb.toFixed(2));
  46  |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY'); // 116.67
  47  |       const stored = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
  48  |       expect(stored, 'API total premium includes the rider').toBe(total);
  49  |     });
  50  |   });
  51  | 
  52  |   test(name('TC-RID-002', 'rider coverage cannot exceed the base face value'), meta('TC-RID-002'), async ({ page, api }) => {
  53  |     const riders = new RiderSelectionPage(page);
  54  | 
  55  |     await test.step('ADB at face value + 1 is rejected, at face value accepted', async () => {
  56  |       const app = await atRiders(api);
  57  |       await riders.goto(app.id);
  58  |       await riders.select('ADB', FACE + 1);
  59  |       await riders.save();
  60  |       await expect(page).toHaveURL(/\/riders/);
  61  |       await riders.expectErrorMatching(MSG.riderAboveBase);
  62  | 
  63  |       await riders.goto(app.id);
  64  |       await riders.select('ADB', FACE);
  65  |       await riders.saveAndExpectNext();
  66  |     });
  67  |     await test.step('API rejects the same request', async () => {
  68  |       const app = await atRiders(api);
  69  |       const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'ADB', coverage: FACE + 1 }]));
  70  |       expectApiError(res, 422, MSG.riderAboveBase);
  71  |     });
  72  |     await test.step('Critical Illness is capped at 500,000 even when the base is larger', async () => {
  73  |       const app = await atRiders(api, { face: 1_000_000 });
  74  |       await riders.goto(app.id);
  75  |       await riders.select('CI', 500_001);
  76  |       await riders.save();
  77  |       await expect(page).toHaveURL(/\/riders/);
  78  |       await riders.expectErrorMatching(MSG.riderAboveMax);
  79  |     });
  80  |   });
  81  | 
  82  |   test(name('TC-RID-003', 'age-ineligible rider cannot be added'), meta('TC-RID-003'), async ({ page, api }) => {
  83  |     // Waiver of Premium - Disability is for ages 18-55; the client below is 56.
  84  |     const app = await atRiders(api, { age: 56 });
  85  |     const riders = new RiderSelectionPage(page);
  86  |     await riders.goto(app.id);
  87  |     await riders.select('WAIVER_DISABILITY', FACE);
  88  |     await riders.save();
> 89  |     await expect(page).toHaveURL(/\/riders/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  90  |     await riders.expectErrorMatching(MSG.riderAge);
  91  | 
  92  |     await test.step('API rejects it as well', async () => {
  93  |       const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'WAIVER_DISABILITY', coverage: FACE }]));
  94  |       expectApiError(res, 422, MSG.riderAge);
  95  |     });
  96  |     await test.step('an eligible age (50) is accepted', async () => {
  97  |       const eligible = await atRiders(api, { age: 50 });
  98  |       await riders.goto(eligible.id);
  99  |       await riders.select('WAIVER_DISABILITY', FACE);
  100 |       await riders.saveAndExpectNext();
  101 |     });
  102 |   });
  103 | 
  104 |   test(name('TC-RID-004', 'maximum of four riders is enforced'), meta('TC-RID-004'), async ({ page, api }) => {
  105 |     const five: { key: RiderKey; coverage: number }[] = [
  106 |       { key: 'ADB', coverage: FACE }, { key: 'DISABILITY', coverage: FACE }, { key: 'TERM', coverage: FACE },
  107 |       { key: 'HOSPITAL', coverage: 100_000 }, { key: 'CI', coverage: FACE },
  108 |     ];
  109 |     expect(five.length).toBe(MAX_RIDERS + 1);
  110 |     const app = await atRiders(api);
  111 |     const riders = new RiderSelectionPage(page);
  112 | 
  113 |     await test.step('five riders are rejected', async () => {
  114 |       await riders.goto(app.id);
  115 |       for (const r of five) await riders.select(r.key, r.coverage);
  116 |       expect(await riders.selectedCount()).toBe(5);
  117 |       await riders.save();
  118 |       await expect(page).toHaveURL(/\/riders/);
  119 |       await riders.expectErrorMatching(MSG.riderMaxCount);
  120 |     });
  121 |     await test.step('API rejects five riders too', async () => {
  122 |       const res = await api.saveRiders(app.id, agent(), await riderPayload(api, five));
  123 |       expectApiError(res, 422, MSG.riderMaxCount);
  124 |     });
  125 |     await test.step('four riders are accepted', async () => {
  126 |       const ok = await atRiders(api);
  127 |       await riders.goto(ok.id);
  128 |       for (const r of five.slice(0, MAX_RIDERS)) await riders.select(r.key, r.coverage);
  129 |       await riders.saveAndExpectNext();
  130 |     });
  131 |   });
  132 | 
  133 |   test(name('TC-RID-005', 'mutually exclusive waiver riders cannot both be selected'), meta('TC-RID-005'), async ({ page, api }) => {
  134 |     const app = await atRiders(api);
  135 |     const riders = new RiderSelectionPage(page);
  136 | 
  137 |     await test.step('both waivers together are rejected', async () => {
  138 |       await riders.goto(app.id);
  139 |       await riders.select('WAIVER_DISABILITY', FACE);
  140 |       await riders.select('WAIVER_CI', FACE);
  141 |       await riders.save();
  142 |       await expect(page).toHaveURL(/\/riders/);
  143 |       await riders.expectErrorMatching(MSG.riderExclusive);
  144 |     });
  145 |     await test.step('API rejects both together', async () => {
  146 |       const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [
  147 |         { key: 'WAIVER_DISABILITY', coverage: FACE }, { key: 'WAIVER_CI', coverage: FACE },
  148 |       ]));
  149 |       expectApiError(res, 422, MSG.riderExclusive);
  150 |     });
  151 |     await test.step('one waiver on its own is accepted', async () => {
  152 |       const one = await atRiders(api);
  153 |       await riders.goto(one.id);
  154 |       await riders.select('WAIVER_DISABILITY', FACE);
  155 |       await riders.saveAndExpectNext();
  156 |     });
  157 |   });
  158 | 
  159 |   test(name('TC-RID-006', 'critical illness rider triggers a health questionnaire'), meta('TC-RID-006'), async ({ page, api }, testInfo) => {
  160 |     // The markup has no questionnaire test id, so this looks for any questionnaire text on the page after selecting the
  161 |     // rider, then for a questionnaire message after saving. Record the real selector on first run and tighten this test.
  162 |     const app = await atRiders(api);
  163 |     const riders = new RiderSelectionPage(page);
  164 |     await riders.goto(app.id);
  165 |     await riders.select('CI', FACE);
  166 | 
  167 |     const onPage = await page.getByText(/health questionnaire|medical questionnaire|health declaration/i).count();
  168 |     if (onPage > 0) {
  169 |       testInfo.annotations.push({ type: 'observation', description: 'Questionnaire text appears on the riders page after selecting the rider.' });
  170 |       return;
  171 |     }
  172 |     await riders.save();
  173 |     const where = await errorSurface(page, app.id, /questionnaire|health/i);
  174 |     testInfo.annotations.push({ type: 'observation', description: `Questionnaire message shown on: ${where ?? 'NOWHERE'}` });
  175 |     expect(where, 'selecting Critical Illness must lead to a health questionnaire (page text or message)').not.toBeNull();
  176 |   });
  177 | 
  178 |   test(name('TC-RID-007', 'rider premiums are itemised in the total premium'), meta('TC-RID-007'), async ({ page, api }) => {
  179 |     const app = await atRiders(api);
  180 |     const riders = new RiderSelectionPage(page);
  181 |     const picks = [{ key: 'ADB' as const, coverage: FACE }, { key: 'HOSPITAL' as const, coverage: 100_000 }];
  182 |     const rate = (k: RiderKey): number => RIDERS[k].ratePer1000;
  183 | 
  184 |     await riders.goto(app.id);
  185 |     for (const p of picks) await riders.select(p.key, p.coverage);
  186 |     await riders.saveAndExpectNext();
  187 | 
  188 |     await test.step('itemised premiums and total with both riders', async () => {
  189 |       await riders.goto(app.id);
```