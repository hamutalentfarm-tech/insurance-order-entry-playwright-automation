# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: client-information\client.spec.ts >> Client / insured information >> TC-CLI-008 | CLI-P03 | name format validation
- Location: tests\client-information\client.spec.ts:149:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/client/
Received string:  "http://34.100.166.72:8081/applications/185/address-contact"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://34.100.166.72:8081/applications/185/address-contact"

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
  - alert: Client information saved.
  - link "← Back to Client Information":
    - /url: http://34.100.166.72:8081/applications/185/client
  - link "Application Summary":
    - /url: http://34.100.166.72:8081/applications/185
  - heading "Address and Contact Information" [level=1]
  - paragraph: US address, ZIP, phone, and email details.
  - strong: Residential Address
  - text: Street Address *
  - textbox "123 Main Street"
  - text: Apt / Suite
  - textbox "Apt 4B"
  - text: City *
  - textbox "Austin"
  - text: State *
  - combobox:
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
  - text: ZIP Code *
  - textbox "73301"
  - text: Use 12345 or 12345-6789.
  - strong: Mailing Address
  - checkbox "Same as residential"
  - text: Same as residential Street Address
  - textbox "PO Box or street address"
  - text: Apt / Suite
  - textbox "Suite 200"
  - text: City
  - textbox "Dallas"
  - text: State
  - combobox:
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
  - text: ZIP Code
  - textbox "75201"
  - strong: Contact Information
  - text: Primary Email *
  - textbox "name@example.com"
  - text: Mobile Phone *
  - textbox "(212) 555-1212"
  - text: Alternate Phone
  - textbox "312-555-1212"
  - text: Preferred Contact Mode *
  - combobox:
    - option "Select mode" [selected]
    - option "Email"
    - option "Phone"
    - option "Postal Mail"
  - link "Back":
    - /url: http://34.100.166.72:8081/applications/185/client
  - button "Save and Continue"
- contentinfo: TalentFarm QA Automation Lab Insurance Order Entry Demo
```

# Test source

```ts
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
  136 |       { label: 'leap-day birth date', dob: '1984-02-29' },
  137 |     ];
  138 |     for (const c of cases) {
  139 |       await test.step(c.label, async () => {
  140 |         await client.goto(id);
  141 |         await client.fill(clientData({ dob: c.dob }));
  142 |         await client.save();
  143 |         await review.goto(id);
  144 |         expect(await review.calculatedAge()).toBe(ageOn(c.dob));
  145 |       });
  146 |     }
  147 |   });
  148 | 
  149 |   test(name('TC-CLI-008', 'name format validation'), meta('TC-CLI-008'), async ({ page, api }) => {
  150 |     const id = await emptyDraft(api);
  151 |     const client = new ClientInformationPage(page);
  152 |     const invalid = ['12345', '@@@', 'a'.repeat(101), '   '];
  153 | 
  154 |     for (const value of invalid) {
  155 |       await test.step(`rejects first name "${value.slice(0, 12)}${value.length > 12 ? '...' : ''}"`, async () => {
  156 |         await client.goto(id);
  157 |         await client.fill(clientData({ firstName: value }));
  158 |         await client.save({ ignoreBrowserValidation: true });
> 159 |         await expect(page).toHaveURL(/\/client/);
      |                            ^ Error: expect(page).toHaveURL(expected) failed
  160 |         expect((await client.errorMessages()).length, 'validation message').toBeGreaterThan(0);
  161 |       });
  162 |     }
  163 |     await test.step('format message for digits/symbols', async () => {
  164 |       await client.goto(id);
  165 |       await client.fill(clientData({ firstName: '12345' }));
  166 |       await client.save();
  167 |       await client.expectErrorMatching(MSG.nameFormat);
  168 |     });
  169 |     await test.step('accepts a hyphenated name with an apostrophe', async () => {
  170 |       await client.goto(id);
  171 |       await client.fill(clientData({ firstName: 'Anne-Marie', lastName: "O'Neil" }));
  172 |       await client.save();
  173 |       await expect(page).toHaveURL(/address-contact/);
  174 |     });
  175 |   });
  176 | });
  177 | 
```