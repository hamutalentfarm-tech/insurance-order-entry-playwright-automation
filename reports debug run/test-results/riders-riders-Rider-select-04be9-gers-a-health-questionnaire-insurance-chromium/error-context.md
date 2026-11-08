# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-006 | RIDER-V06 | critical illness rider triggers a health questionnaire
- Location: tests\riders\riders.spec.ts:142:7

# Error details

```
Error: selecting Critical Illness must lead to a health questionnaire (page text or message)

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
        - /url: http://34.100.166.72:8081/applications/216/documents
      - link "Application Summary" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/216
    - generic [ref=f2e28]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: "Application #216"
        - heading "Review Application" [level=1] [ref=f2e32]
        - paragraph [ref=f2e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e34]:
        - generic [ref=f2e37]:
          - heading "Submission Validation" [level=2] [ref=f2e38]
          - generic [ref=f2e39]: No blocking validation errors found.
          - generic [ref=f2e40]:
            - link "Back to Documents" [ref=f2e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/216/documents
            - button "Run Validation" [ref=f2e42] [cursor=pointer]
          - button "Submit Application" [ref=f2e44] [cursor=pointer]
        - generic [ref=f2e47]:
          - heading "Application Snapshot" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - term [ref=f2e50]: Client
            - definition [ref=f2e51]: Qauonvcp Tjkrsca
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
            - definition [ref=f2e67]: $33.33
            - term [ref=f2e68]: Total Modal Premium
            - definition [ref=f2e69]: $132.29
            - term [ref=f2e70]: Status
            - definition [ref=f2e71]: DRAFT
  - contentinfo [ref=f2e72]:
    - generic [ref=f2e73]:
      - generic [ref=f2e74]: TalentFarm QA Automation Lab
      - generic [ref=f2e75]: Insurance Order Entry Demo
```

# Test source

```ts
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
  86  |     await expect(page).toHaveURL(/\/riders/);
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
> 158 |     expect(where, 'selecting Critical Illness must lead to a health questionnaire (page text or message)').not.toBeNull();
      |                                                                                                                ^ Error: selecting Critical Illness must lead to a health questionnaire (page text or message)
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
  187 | 
```