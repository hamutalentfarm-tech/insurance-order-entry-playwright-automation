# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-003 | RIDER-V03 | age-ineligible rider cannot be added
- Location: tests\riders\riders.spec.ts:79:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/riders/
Received string:  "http://34.100.166.72:8081/applications/211/beneficiaries"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://34.100.166.72:8081/applications/211/beneficiaries"

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
  - link "Learner Agent 003":
    - /url: http://34.100.166.72:8081/profile
  - button "Logout"
- main:
  - alert: Rider selection saved.
  - link "← Back to Riders":
    - /url: http://34.100.166.72:8081/applications/211/riders
  - link "Application Summary":
    - /url: http://34.100.166.72:8081/applications/211
  - text: "Application #211"
  - heading "Beneficiaries" [level=1]
  - paragraph: Add or update primary and secondary beneficiaries for the policy.
  - link "Back to Application":
    - /url: http://34.100.166.72:8081/applications/211
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
    - /url: http://34.100.166.72:8081/applications/211/riders
  - button "Save Beneficiary"
  - link "Continue":
    - /url: http://34.100.166.72:8081/applications/211/documents
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
  13  | 
  14  | test.use(asRole('learner'));
  15  | const agent = (): string => emailOf('learner');
  16  | const BASE = product('WL_SECURE_BASIC');
  17  | const FACE = 250_000;
  18  | 
  19  | /** Application with client age 40, SecureLife 250,000 monthly saved, positioned at the riders step. */
  20  | async function atRiders(api: Parameters<typeof buildApplication>[0], opts: { age?: number; face?: number } = {}) {
  21  |   return buildApplication(api, {
  22  |     agentEmail: agent(), upTo: 'product',
  23  |     client: opts.age ? { dob: dobForAge(opts.age) } : undefined,
  24  |     product: { productCode: BASE.code, faceValue: opts.face ?? FACE, frequency: 'MONTHLY' },
  25  |   });
  26  | }
  27  | 
  28  | async function riderPayload(api: Parameters<typeof buildApplication>[0], picks: { key: RiderKey; coverage: number }[]) {
  29  |   const out = [];
  30  |   for (const p of picks) out.push({ rider_id: await api.riderId(RIDERS[p.key].code), coverage_amount: p.coverage });
  31  |   return out;
  32  | }
  33  | 
  34  | test.describe('Rider selection', () => {
  35  |   test(name('TC-RID-001', 'agent can add an eligible protection rider (ADB)'), meta('TC-RID-001'), async ({ page, api }) => {
  36  |     const app = await atRiders(api);
  37  |     const riders = new RiderSelectionPage(page);
  38  |     await riders.goto(app.id);
  39  |     await riders.select('ADB', FACE);
  40  |     await riders.saveAndExpectNext();
  41  | 
  42  |     await test.step('rider is stored and itemised in the premium', async () => {
  43  |       await riders.goto(app.id);
  44  |       expect(await riders.isSelected('ADB')).toBe(true);
  45  |       const adb = periodPremium(FACE, RIDERS.ADB.ratePer1000, 'MONTHLY'); // 17.71
  46  |       expect(await riders.summaryText()).toContain(adb.toFixed(2));
  47  |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY'); // 116.67
  48  |       const stored = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
  49  |       expect(stored, 'API total premium includes the rider').toBe(total);
  50  |     });
  51  |   });
  52  | 
  53  |   test(name('TC-RID-002', 'rider coverage cannot exceed the base face value'), meta('TC-RID-002'), async ({ page, api }) => {
  54  |     const riders = new RiderSelectionPage(page);
  55  | 
  56  |     await test.step('ADB at face value + 1 is rejected, at face value accepted', async () => {
  57  |       const app = await atRiders(api);
  58  |       await riders.goto(app.id);
  59  |       await riders.select('ADB', FACE + 1);
  60  |       await riders.save({ ignoreBrowserValidation: true });
  61  |       await expect(page).toHaveURL(/\/riders/);
  62  |       await riders.expectErrorMatching(MSG.riderAboveBase);
  63  | 
  64  |       await riders.goto(app.id);
  65  |       await riders.select('ADB', FACE);
  66  |       await riders.saveAndExpectNext();
  67  |     });
  68  |     
  69  |     await test.step('Critical Illness is capped at 500,000 even when the base is larger', async () => {
  70  |       const app = await atRiders(api, { face: 1_000_000 });
  71  |       await riders.goto(app.id);
  72  |       await riders.select('CI', 500_001);
  73  |       await riders.save({ ignoreBrowserValidation: true });
  74  |       await expect(page).toHaveURL(/\/riders/);
  75  |       await riders.expectErrorMatching(MSG.riderAboveMax);
  76  |     });
  77  |   });
  78  | 
  79  |     test(name('TC-RID-003', 'age-ineligible rider cannot be added'), meta('TC-RID-003'), async ({ page, api }) => {
  80  |     // Waiver of Premium - Disability is for ages 18-55; the client below is 56.
  81  |     const app = await atRiders(api, { age: 56 });
  82  |     const riders = new RiderSelectionPage(page);
  83  |     await riders.goto(app.id);
  84  |     await riders.select('WAIVER_DISABILITY', FACE);
  85  |     await riders.save();
> 86  |     await expect(page).toHaveURL(/\/riders/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  87  |     await riders.expectErrorMatching(MSG.riderAge);
  88  | 
  89  |     await test.step('an eligible age (50) is accepted', async () => {
  90  |       const eligible = await atRiders(api, { age: 50 });
  91  |       await riders.goto(eligible.id);
  92  |       await riders.select('WAIVER_DISABILITY', FACE);
  93  |       await riders.saveAndExpectNext();
  94  |     });
  95  |   });
  96  | 
  97  |     test(name('TC-RID-004', 'maximum of four riders is enforced'), meta('TC-RID-004'), async ({ page, api }) => {
  98  |     const five: { key: RiderKey; coverage: number }[] = [
  99  |       { key: 'ADB', coverage: FACE }, { key: 'DISABILITY', coverage: FACE }, { key: 'TERM', coverage: FACE },
  100 |       { key: 'HOSPITAL', coverage: 100_000 }, { key: 'CI', coverage: FACE },
  101 |     ];
  102 |     expect(five.length).toBe(MAX_RIDERS + 1);
  103 |     const app = await atRiders(api);
  104 |     const riders = new RiderSelectionPage(page);
  105 | 
  106 |     await test.step('five riders are rejected', async () => {
  107 |       await riders.goto(app.id);
  108 |       for (const r of five) await riders.select(r.key, r.coverage);
  109 |       expect(await riders.selectedCount()).toBe(5);
  110 |       await riders.save();
  111 |       await expect(page).toHaveURL(/\/riders/);
  112 |       await riders.expectErrorMatching(MSG.riderMaxCount);
  113 |     });
  114 |     await test.step('four riders are accepted', async () => {
  115 |       const ok = await atRiders(api);
  116 |       await riders.goto(ok.id);
  117 |       for (const r of five.slice(0, MAX_RIDERS)) await riders.select(r.key, r.coverage);
  118 |       await riders.saveAndExpectNext();
  119 |     });
  120 |   });
  121 | 
  122 |     test(name('TC-RID-005', 'mutually exclusive waiver riders cannot both be selected'), meta('TC-RID-005'), async ({ page, api }) => {
  123 |     const app = await atRiders(api);
  124 |     const riders = new RiderSelectionPage(page);
  125 | 
  126 |     await test.step('both waivers together are rejected', async () => {
  127 |       await riders.goto(app.id);
  128 |       await riders.select('WAIVER_DISABILITY', FACE);
  129 |       await riders.select('WAIVER_CI', FACE);
  130 |       await riders.save();
  131 |       await expect(page).toHaveURL(/\/riders/);
  132 |       await riders.expectErrorMatching(MSG.riderExclusive);
  133 |     });
  134 |     await test.step('one waiver on its own is accepted', async () => {
  135 |       const one = await atRiders(api);
  136 |       await riders.goto(one.id);
  137 |       await riders.select('WAIVER_DISABILITY', FACE);
  138 |       await riders.saveAndExpectNext();
  139 |     });
  140 |   });
  141 |   
  142 |   test(name('TC-RID-006', 'critical illness rider triggers a health questionnaire'), meta('TC-RID-006'), async ({ page, api }, testInfo) => {
  143 |     // The markup has no questionnaire test id, so this looks for any questionnaire text on the page after selecting the
  144 |     // rider, then for a questionnaire message after saving. Record the real selector on first run and tighten this test.
  145 |     const app = await atRiders(api);
  146 |     const riders = new RiderSelectionPage(page);
  147 |     await riders.goto(app.id);
  148 |     await riders.select('CI', FACE);
  149 | 
  150 |     const onPage = await page.getByText(/health questionnaire|medical questionnaire|health declaration/i).count();
  151 |     if (onPage > 0) {
  152 |       testInfo.annotations.push({ type: 'observation', description: 'Questionnaire text appears on the riders page after selecting the rider.' });
  153 |       return;
  154 |     }
  155 |     await riders.save();
  156 |     const where = await errorSurface(page, app.id, /questionnaire|health/i);
  157 |     testInfo.annotations.push({ type: 'observation', description: `Questionnaire message shown on: ${where ?? 'NOWHERE'}` });
  158 |     expect(where, 'selecting Critical Illness must lead to a health questionnaire (page text or message)').not.toBeNull();
  159 |   });
  160 | 
  161 |     test(name('TC-RID-007', 'rider premiums are itemised in the total premium'), meta('TC-RID-007'), async ({ page, api }) => {
  162 |     const app = await atRiders(api);
  163 |     const riders = new RiderSelectionPage(page);
  164 |     const picks = [{ key: 'ADB' as const, coverage: FACE }, { key: 'HOSPITAL' as const, coverage: 100_000 }];
  165 |     const rate = (k: RiderKey): number => RIDERS[k].ratePer1000;
  166 | 
  167 |     await riders.goto(app.id);
  168 |     for (const p of picks) await riders.select(p.key, p.coverage);
  169 |     await riders.saveAndExpectNext();
  170 | 
  171 |     await test.step('combined rider premium and total with both riders', async () => {
  172 |       await riders.goto(app.id);
  173 |       const text = await riders.summaryText();
  174 |       const combined = picks.reduce((sum, p) => sum + periodPremium(p.coverage, rate(p.key), 'MONTHLY'), 0).toFixed(2);
  175 |       expect(text, 'combined rider premium is shown').toContain(combined);
  176 |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, picks.map((p) => ({ coverage: p.coverage, rate: rate(p.key) })), 'MONTHLY');
  177 |       expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total').toBe(total);
  178 |     });
  179 |     await test.step('removing a rider lowers the total', async () => {
  180 |       await riders.deselect('HOSPITAL');
  181 |       await riders.saveAndExpectNext();
  182 |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: rate('ADB') }], 'MONTHLY');
  183 |       expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total after removal').toBe(total);
  184 |     });
  185 |   });
  186 | });
```