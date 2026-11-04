# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: riders\riders.spec.ts >> Rider selection >> TC-RID-006 | RIDER-V06 | critical illness rider triggers a health questionnaire
- Location: tests\riders\riders.spec.ts:159:7

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
          - link "Learner Agent 002" [ref=f2e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=f2e22] [cursor=pointer]
  - main [ref=f2e23]:
    - generic [ref=f2e25]:
      - link "← Back to Documents" [ref=f2e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/144/documents
      - link "Application Summary" [ref=f2e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/144
    - generic [ref=f2e28]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: "Application #144"
        - heading "Review Application" [level=1] [ref=f2e32]
        - paragraph [ref=f2e33]: Review the application details and resolve any blocking validation errors before submission.
      - generic [ref=f2e34]:
        - generic [ref=f2e37]:
          - heading "Submission Validation" [level=2] [ref=f2e38]
          - generic [ref=f2e39]: No blocking validation errors found.
          - generic [ref=f2e40]:
            - link "Back to Documents" [ref=f2e41] [cursor=pointer]:
              - /url: http://34.100.166.72:8081/applications/144/documents
            - button "Run Validation" [ref=f2e42] [cursor=pointer]
          - button "Submit Application" [ref=f2e44] [cursor=pointer]
        - generic [ref=f2e47]:
          - heading "Application Snapshot" [level=2] [ref=f2e48]
          - generic [ref=f2e49]:
            - term [ref=f2e50]: Client
            - definition [ref=f2e51]: Qadjjwui Hcmzkjd
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
  89  |     await expect(page).toHaveURL(/\/riders/);
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
> 175 |     expect(where, 'selecting Critical Illness must lead to a health questionnaire (page text or message)').not.toBeNull();
      |                                                                                                                ^ Error: selecting Critical Illness must lead to a health questionnaire (page text or message)
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
  190 |       const text = await riders.summaryText();
  191 |       for (const p of picks) expect(text, `${p.key} premium itemised`).toContain(periodPremium(p.coverage, rate(p.key), 'MONTHLY').toFixed(2));
  192 |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, picks.map((p) => ({ coverage: p.coverage, rate: rate(p.key) })), 'MONTHLY');
  193 |       expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total').toBe(total);
  194 |     });
  195 |     await test.step('removing a rider lowers the total', async () => {
  196 |       await riders.deselect('HOSPITAL');
  197 |       await riders.saveAndExpectNext();
  198 |       const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: rate('ADB') }], 'MONTHLY');
  199 |       expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total after removal').toBe(total);
  200 |     });
  201 |   });
  202 | });
  203 | 
```