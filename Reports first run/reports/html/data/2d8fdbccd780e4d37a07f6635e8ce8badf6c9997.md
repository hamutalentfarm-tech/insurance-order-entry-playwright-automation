# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: client-information\client.spec.ts >> Client / insured information >> TC-CLI-001 | CLI-V01 | agent can enter valid insured information
- Location: tests\client-information\client.spec.ts:23:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Qaxduiqx"
Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - navigation [ref=f3e2]:
    - generic [ref=f3e3]:
      - link "Insurance Order Entry Demo Platform QA Automation Training App" [ref=f3e4] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/dashboard
        - generic [aria-hidden] [ref=f3e5]: IO
        - generic [ref=f3e6]:
          - generic [ref=f3e7]: Insurance Order Entry Demo Platform
          - generic [ref=f3e8]: QA Automation Training App
      - generic [ref=f3e9]:
        - list [ref=f3e10]:
          - listitem [ref=f3e11]:
            - link "Dashboard" [ref=f3e12] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/dashboard
          - listitem [ref=f3e13]:
            - link "Applications" [ref=f3e14] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/applications
          - listitem [ref=f3e15]:
            - link "Products" [ref=f3e16] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/products
          - listitem [ref=f3e17]:
            - link "Support" [ref=f3e18] [cursor=pointer]:
              - /url: http://35.244.49.205:8081/support
        - generic [ref=f3e19]:
          - link "Learner Agent 001" [ref=f3e20] [cursor=pointer]:
            - /url: http://35.244.49.205:8081/profile
          - button "Logout" [ref=f3e22] [cursor=pointer]
  - main [ref=f3e23]:
    - alert [ref=f3e24]: Client information saved.
    - generic [ref=f3e26]:
      - link "← Back to Client Information" [ref=f3e27] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/applications/54/client
      - link "Application Summary" [ref=f3e28] [cursor=pointer]:
        - /url: http://35.244.49.205:8081/applications/54
    - generic [ref=f3e29]:
      - generic [ref=f3e30]:
        - heading "Address and Contact Information" [level=1] [ref=f3e31]
        - paragraph [ref=f3e32]: US address, ZIP, phone, and email details.
      - generic [ref=f3e33]:
        - generic [ref=f3e34]:
          - strong [ref=f3e36]: Residential Address
          - generic [ref=f3e38]:
            - generic [ref=f3e39]:
              - generic [ref=f3e40]: Street Address *
              - textbox "123 Main Street" [ref=f3e41]
            - generic [ref=f3e42]:
              - generic [ref=f3e43]: Apt / Suite
              - textbox "Apt 4B" [ref=f3e44]
            - generic [ref=f3e45]:
              - generic [ref=f3e46]: City *
              - textbox "Austin" [ref=f3e47]
            - generic [ref=f3e48]:
              - generic [ref=f3e49]: State *
              - combobox [ref=f3e50]:
                - option "Select state" [selected]
                - option "Alabama (AL)"
                - option "Alaska (AK)"
                - option "Arizona (AZ)"
                - option "Arkansas (AR)"
                - option "California (CA)"
                - option "Colorado (CO)"
                - option "Connecticut (CT)"
                - option "Delaware (DE)"
                - option "District of Columbia (DC)"
                - option "Florida (FL)"
                - option "Georgia (GA)"
                - option "Hawaii (HI)"
                - option "Idaho (ID)"
                - option "Illinois (IL)"
                - option "Indiana (IN)"
                - option "Iowa (IA)"
                - option "Kansas (KS)"
                - option "Kentucky (KY)"
                - option "Louisiana (LA)"
                - option "Maine (ME)"
                - option "Maryland (MD)"
                - option "Massachusetts (MA)"
                - option "Michigan (MI)"
                - option "Minnesota (MN)"
                - option "Mississippi (MS)"
                - option "Missouri (MO)"
                - option "Montana (MT)"
                - option "Nebraska (NE)"
                - option "Nevada (NV)"
                - option "New Hampshire (NH)"
                - option "New Jersey (NJ)"
                - option "New Mexico (NM)"
                - option "New York (NY)"
                - option "North Carolina (NC)"
                - option "North Dakota (ND)"
                - option "Ohio (OH)"
                - option "Oklahoma (OK)"
                - option "Oregon (OR)"
                - option "Pennsylvania (PA)"
                - option "Rhode Island (RI)"
                - option "South Carolina (SC)"
                - option "South Dakota (SD)"
                - option "Tennessee (TN)"
                - option "Texas (TX)"
                - option "Utah (UT)"
                - option "Vermont (VT)"
                - option "Virginia (VA)"
                - option "Washington (WA)"
                - option "West Virginia (WV)"
                - option "Wisconsin (WI)"
                - option "Wyoming (WY)"
            - generic [ref=f3e51]:
              - generic [ref=f3e52]: ZIP Code *
              - textbox "73301" [ref=f3e53]
              - generic [ref=f3e54]: Use 12345 or 12345-6789.
        - generic [ref=f3e55]:
          - generic [ref=f3e56]:
            - strong [ref=f3e57]: Mailing Address
            - generic [ref=f3e58]:
              - checkbox "Same as residential" [ref=f3e59]
              - generic [ref=f3e60]: Same as residential
          - generic [ref=f3e63]:
            - generic [ref=f3e64]:
              - generic [ref=f3e65]: Street Address
              - textbox "PO Box or street address" [ref=f3e66]
            - generic [ref=f3e67]:
              - generic [ref=f3e68]: Apt / Suite
              - textbox "Suite 200" [ref=f3e69]
            - generic [ref=f3e70]:
              - generic [ref=f3e71]: City
              - textbox "Dallas" [ref=f3e72]
            - generic [ref=f3e73]:
              - generic [ref=f3e74]: State
              - combobox [ref=f3e75]:
                - option "Select state" [selected]
                - option "Alabama (AL)"
                - option "Alaska (AK)"
                - option "Arizona (AZ)"
                - option "Arkansas (AR)"
                - option "California (CA)"
                - option "Colorado (CO)"
                - option "Connecticut (CT)"
                - option "Delaware (DE)"
                - option "District of Columbia (DC)"
                - option "Florida (FL)"
                - option "Georgia (GA)"
                - option "Hawaii (HI)"
                - option "Idaho (ID)"
                - option "Illinois (IL)"
                - option "Indiana (IN)"
                - option "Iowa (IA)"
                - option "Kansas (KS)"
                - option "Kentucky (KY)"
                - option "Louisiana (LA)"
                - option "Maine (ME)"
                - option "Maryland (MD)"
                - option "Massachusetts (MA)"
                - option "Michigan (MI)"
                - option "Minnesota (MN)"
                - option "Mississippi (MS)"
                - option "Missouri (MO)"
                - option "Montana (MT)"
                - option "Nebraska (NE)"
                - option "Nevada (NV)"
                - option "New Hampshire (NH)"
                - option "New Jersey (NJ)"
                - option "New Mexico (NM)"
                - option "New York (NY)"
                - option "North Carolina (NC)"
                - option "North Dakota (ND)"
                - option "Ohio (OH)"
                - option "Oklahoma (OK)"
                - option "Oregon (OR)"
                - option "Pennsylvania (PA)"
                - option "Rhode Island (RI)"
                - option "South Carolina (SC)"
                - option "South Dakota (SD)"
                - option "Tennessee (TN)"
                - option "Texas (TX)"
                - option "Utah (UT)"
                - option "Vermont (VT)"
                - option "Virginia (VA)"
                - option "Washington (WA)"
                - option "West Virginia (WV)"
                - option "Wisconsin (WI)"
                - option "Wyoming (WY)"
            - generic [ref=f3e76]:
              - generic [ref=f3e77]: ZIP Code
              - textbox "75201" [ref=f3e78]
        - generic [ref=f3e79]:
          - strong [ref=f3e81]: Contact Information
          - generic [ref=f3e83]:
            - generic [ref=f3e84]:
              - generic [ref=f3e85]: Primary Email *
              - textbox "name@example.com" [ref=f3e86]
            - generic [ref=f3e87]:
              - generic [ref=f3e88]: Mobile Phone *
              - textbox "(212) 555-1212" [ref=f3e89]
            - generic [ref=f3e90]:
              - generic [ref=f3e91]: Alternate Phone
              - textbox "312-555-1212" [ref=f3e92]
            - generic [ref=f3e93]:
              - generic [ref=f3e94]: Preferred Contact Mode *
              - combobox [ref=f3e95]:
                - option "Select mode" [selected]
                - option "Email"
                - option "Phone"
                - option "Postal Mail"
        - generic [ref=f3e96]:
          - link "Back" [ref=f3e97] [cursor=pointer]:
            - /url: http://35.244.49.205:8081/applications/54/client
          - button "Save and Continue" [ref=f3e98] [cursor=pointer]
  - contentinfo [ref=f3e99]:
    - generic [ref=f3e100]:
      - generic [ref=f3e101]: TalentFarm QA Automation Lab
      - generic [ref=f3e102]: Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { MANDATORY_CLIENT_FIELDS, clientData } from '../../fixtures/applicationData';
  4   | import { DashboardPage } from '../../pages/DashboardPage';
  5   | import { ClientInformationPage } from '../../pages/ClientInformationPage';
  6   | import { ReviewPage } from '../../pages/ReviewPage';
  7   | import { buildApplication } from '../../utils/applicationBuilder';
  8   | import { ageErrorSurface } from '../../utils/flows';
  9   | import { MSG } from '../../utils/messages';
  10  | import { ageOn, dobForAge, futureDate, toIso } from '../../utils/dataGenerator';
  11  | import { anyMatches } from '../../utils/assertions';
  12  | import { isNativelyInvalid } from '../../utils/testHelpers';
  13  | import { name, meta } from '../../utils/testMeta';
  14  | 
  15  | test.use(asRole('learner'));
  16  | 
  17  | /** Fast set-up: an empty draft created through the API; the UI is then used for the behaviour under test. */
  18  | async function emptyDraft(api: Parameters<typeof buildApplication>[0]): Promise<number> {
  19  |   return (await buildApplication(api, { agentEmail: emailOf('learner'), upTo: 'draft' })).id;
  20  | }
  21  | 
  22  | test.describe('Client / insured information', () => {
  23  |   test(name('TC-CLI-001', 'agent can enter valid insured information'), meta('TC-CLI-001'), async ({ page, api }) => {
  24  |     const dashboard = new DashboardPage(page);
  25  |     await dashboard.goto();
  26  |     const id = await dashboard.startNewApplication(); // full UI flow: dashboard -> start -> create draft
  27  | 
  28  |     const client = new ClientInformationPage(page);
  29  |     const data = clientData();
  30  |     await client.fillAndSave(data);
  31  |     await client.expectNoErrors();
  32  | 
  33  |     await test.step('saved values equal the entered values (API read-back)', async () => {
  34  |       const res = await api.getClient(id, emailOf('learner'));
> 35  |       expect(res.body?.data?.first_name).toBe(data.firstName);
      |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  36  |       expect(res.body?.data?.last_name).toBe(data.lastName);
  37  |       expect(String(res.body?.data?.date_of_birth).slice(0, 10)).toBe(data.dob);
  38  |     });
  39  |   });
  40  | 
  41  |   test(name('TC-CLI-002', 'mandatory personal fields are validated'), meta('TC-CLI-002'), async ({ page, api }, testInfo) => {
  42  |     const id = await emptyDraft(api);
  43  |     const client = new ClientInformationPage(page);
  44  |     const skippedSelects: string[] = [];
  45  | 
  46  |     for (const key of MANDATORY_CLIENT_FIELDS) {
  47  |       await test.step(`blank ${key}`, async () => {
  48  |         await client.goto(id);
  49  |         await client.fill(clientData());
  50  |         const field = client.field(key);
  51  |         const tag = await field.evaluate((el) => el.tagName.toLowerCase());
  52  |         if (tag === 'select') {
  53  |           const hasBlank = await field.locator('option[value=""]').count();
  54  |           if (!hasBlank) {
  55  |             skippedSelects.push(key);
  56  |             return; // a select without a blank option cannot be left empty by the user
  57  |           }
  58  |           await field.selectOption('');
  59  |         } else {
  60  |           await field.fill('');
  61  |         }
  62  |         expect(await isNativelyInvalid(field), `browser blocks empty ${key}`).toBe(true);
  63  |         await client.save({ ignoreBrowserValidation: true }); // reach the server-side check too
  64  |         await expect(page).toHaveURL(/\/client/);
  65  |         expect((await client.errorMessages()).length, `server message for blank ${key}`).toBeGreaterThan(0);
  66  |       });
  67  |     }
  68  |     if (skippedSelects.length) testInfo.annotations.push({ type: 'observation', description: `Selects with no blank option: ${skippedSelects.join(', ')}` });
  69  |   });
  70  | 
  71  |   test(name('TC-CLI-003', 'DOB below 18 is rejected'), meta('TC-CLI-003'), async ({ page, api }, testInfo) => {
  72  |     const id = await emptyDraft(api);
  73  |     const client = new ClientInformationPage(page);
  74  |     await client.goto(id);
  75  |     await client.fill(clientData({ dob: dobForAge(18, 1) })); // 17 years 364 days
  76  |     await client.save();
  77  |     const where = await ageErrorSurface(page, id);
  78  |     testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  79  |     expect(where, 'age 17y364d must produce the age-range error (form or review page)').not.toBeNull();
  80  |   });
  81  | 
  82  |   test(name('TC-CLI-004', 'DOB above 65 is rejected'), meta('TC-CLI-004'), async ({ page, api }, testInfo) => {
  83  |     const id = await emptyDraft(api);
  84  |     const client = new ClientInformationPage(page);
  85  |     await client.goto(id);
  86  |     await client.fill(clientData({ dob: dobForAge(66) }));
  87  |     await client.save();
  88  |     const where = await ageErrorSurface(page, id);
  89  |     testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
  90  |     expect(where, 'age 66 must produce the age-range error (form or review page)').not.toBeNull();
  91  |   });
  92  | 
  93  |   test(name('TC-CLI-005', 'future DOB is rejected'), meta('TC-CLI-005'), async ({ page, api }) => {
  94  |     const id = await emptyDraft(api);
  95  |     const client = new ClientInformationPage(page);
  96  |     for (const dob of [futureDate(1), futureDate(3650)]) {
  97  |       await test.step(`DOB ${dob}`, async () => {
  98  |         await client.goto(id);
  99  |         await client.fill(clientData({ dob }));
  100 |         await client.save();
  101 |         await expect(page).toHaveURL(/\/client/);
  102 |         await client.expectErrorMatching(MSG.futureDob);
  103 |       });
  104 |     }
  105 |     await test.step('nothing in the future was stored', async () => {
  106 |       const res = await api.getClient(id, emailOf('learner'));
  107 |       const stored = res.body?.data?.date_of_birth;
  108 |       if (stored) expect(String(stored).slice(0, 10) <= toIso(new Date())).toBe(true);
  109 |     });
  110 |   });
  111 | 
  112 |   test(name('TC-CLI-006', 'age boundaries 18 and 65 are accepted'), meta('TC-CLI-006'), async ({ page, api }) => {
  113 |     const id = await emptyDraft(api);
  114 |     const client = new ClientInformationPage(page);
  115 |     const review = new ReviewPage(page);
  116 |     for (const age of [18, 65]) {
  117 |       await test.step(`age exactly ${age}`, async () => {
  118 |         await client.goto(id);
  119 |         await client.fill(clientData({ dob: dobForAge(age) }));
  120 |         await client.save();
  121 |         await expect(page, `age ${age} is accepted and the flow moves on`).toHaveURL(/address-contact/);
  122 |         await review.goto(id);
  123 |         expect(await review.calculatedAge(), 'calculated age on review page').toBe(age);
  124 |         expect(anyMatches(await review.errors(), MSG.ageRange), `no age error at ${age}`).toBe(false);
  125 |       });
  126 |     }
  127 |   });
  128 | 
  129 |   test(name('TC-CLI-007', 'age is calculated correctly from the date of birth'), meta('TC-CLI-007'), async ({ page, api }) => {
  130 |     const id = await emptyDraft(api);
  131 |     const client = new ClientInformationPage(page);
  132 |     const review = new ReviewPage(page);
  133 |     const cases = [
  134 |       { label: 'birthday today', dob: dobForAge(40) },
  135 |       { label: 'birthday tomorrow', dob: dobForAge(40, 1) },
```