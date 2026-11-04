# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow\workflow.spec.ts >> Submission and status tracking >> TC-WF-004 | WF-V04 | submitted application is read-only
- Location: tests\workflow\workflow.spec.ts:156:7

# Error details

```
Error: client page offers no way to edit a submitted application

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 11
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
          - link "Submitted Agent" [ref=e20] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/profile
          - button "Logout" [ref=e22] [cursor=pointer]
  - main [ref=e23]:
    - generic [ref=e25]:
      - link "← Back" [ref=e26] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications
      - link "Application Summary" [ref=e27] [cursor=pointer]:
        - /url: http://34.100.166.72:8081/applications/3
    - generic [ref=e29]:
      - heading "Client / Insured Information" [level=1] [ref=e30]
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]:
            - generic [ref=e34]: First Name
            - textbox [ref=e35]: Vikram
          - generic [ref=e36]:
            - generic [ref=e37]: Middle Name
            - textbox [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: Last Name
            - textbox [ref=e41]: Rao
          - generic [ref=e42]:
            - generic [ref=e43]: Date of Birth
            - textbox [ref=e44]: 1979-04-02
          - generic [ref=e45]:
            - generic [ref=e46]: Gender
            - combobox [ref=e47]:
              - option "MALE" [selected]
              - option "FEMALE"
              - option "NON_BINARY"
          - generic [ref=e48]:
            - generic [ref=e49]: Marital Status
            - combobox [ref=e50]:
              - option "SINGLE"
              - option "MARRIED" [selected]
              - option "DIVORCED"
              - option "WIDOWED"
          - generic [ref=e51]:
            - generic [ref=e52]: Nationality
            - textbox [ref=e53]: United States
          - generic [ref=e54]:
            - generic [ref=e55]: Occupation
            - textbox [ref=e56]: Product Manager
          - generic [ref=e57]:
            - generic [ref=e58]: Employer Name
            - textbox [ref=e59]: Acme Financial Group
          - generic [ref=e60]:
            - generic [ref=e61]: Employer Address
            - textbox [ref=e62]: 200 Market Street, San Francisco, CA
        - generic [ref=e63]:
          - button "Save and Continue" [ref=e64] [cursor=pointer]
          - link "Back" [ref=e65] [cursor=pointer]:
            - /url: http://34.100.166.72:8081/applications/3
  - contentinfo [ref=e66]:
    - generic [ref=e67]:
      - generic [ref=e68]: TalentFarm QA Automation Lab
      - generic [ref=e69]: Insurance Order Entry Demo
```

# Test source

```ts
  72  |     const id = await dashboard.startNewApplication();
  73  | 
  74  |     await new ClientInformationPage(page).fillAndSave(clientData());
  75  |     await new AddressContactPage(page).fillAndSave(addressData());
  76  | 
  77  |     await dashboard.goto();
  78  |     expect(await dashboard.statusOf(id)).toBe('DRAFT');
  79  |     await expect(page.getByTestId(`application-open-${id}`)).toBeVisible();
  80  |   });
  81  | 
  82  |   test(name('TC-WF-002', 'draft can be resumed with the saved data'), meta('TC-WF-002'), async ({ otherAgent, api }) => {
  83  |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
  84  | 
  85  |     // A fresh browser context with the same login stands in for "log out, log in again".
  86  |     const page = await otherAgent('learner');
  87  |     const dashboard = new DashboardPage(page);
  88  |     await dashboard.goto();
  89  |     await dashboard.openApplication(app.id);
  90  | 
  91  |     await test.step('client data is restored', async () => {
  92  |       const client = new ClientInformationPage(page);
  93  |       await client.goto(app.id);
  94  |       expect(await client.values()).toMatchObject({
  95  |         firstName: app.client.firstName, lastName: app.client.lastName, dob: app.client.dob,
  96  |         gender: app.client.gender, nationality: app.client.nationality, occupation: app.client.occupation,
  97  |       });
  98  |       const res = await api.getClient(app.id, agent());
  99  |       expect(res.body?.data?.first_name).toBe(app.client.firstName);
  100 |     });
  101 |     await test.step('address and contact data are restored', async () => {
  102 |       const address = new AddressContactPage(page);
  103 |       await address.goto(app.id);
  104 |       await expect(address.resLine1).toHaveValue(app.address.line1);
  105 |       await expect(address.email).toHaveValue(app.address.email);
  106 |       await expect(address.preferredMode).toHaveValue(app.address.preferredMode);
  107 |     });
  108 |   });
  109 | 
  110 |   test(name('TC-WF-003', 'a valid application can be submitted end to end'), meta('TC-WF-003'), async ({ page, api }) => {
  111 |     test.setTimeout(240_000);
  112 |     for (const flow of FLOWS) {
  113 |       await test.step(flow.label, async () => {
  114 |         const dashboard = new DashboardPage(page);
  115 |         await dashboard.goto();
  116 |         const id = await dashboard.startNewApplication();
  117 | 
  118 |         await new ClientInformationPage(page).fillAndSave(clientData({ dob: dobForAge(flow.clientAge) }));
  119 |         await new AddressContactPage(page).fillAndSave(addressData());
  120 |         await new KycFinancialPage(page).fillAndSave(kycData());
  121 |         await new ProductConfigurationPage(page).fillAndSave(productData(flow.product));
  122 | 
  123 |         const riders = new RiderSelectionPage(page);
  124 |         for (const r of flow.riders) await riders.select(r.key, r.coverage);
  125 |         await riders.saveAndExpectNext();
  126 | 
  127 |         const ben = new BeneficiaryPage(page);
  128 |         for (const [i, b] of flow.beneficiaries.entries()) await ben.addAndExpectRow(b, i + 1);
  129 |         await ben.continueLink.click();
  130 |         await expect(page).toHaveURL(/\/documents/);
  131 | 
  132 |         const docs = new DocumentUploadPage(page);
  133 |         await docs.upload('KYC_ID', makeFile('pdf', `kyc-${id}.pdf`));
  134 |         await docs.expectNoErrors();
  135 |         await docs.continueToReview();
  136 | 
  137 |         const reference = await submitViaReview(page, id);
  138 |         expect(reference, 'generated reference number').toMatch(REFERENCE_NUMBER);
  139 | 
  140 |         const status = new ApplicationStatusPage(page);
  141 |         await status.goto(id);
  142 |         expect(await status.currentStatus()).toBe('SUBMITTED');
  143 |         expect(await status.referenceNumber()).toBe(reference);
  144 | 
  145 |         await dashboard.goto();
  146 |         expect(await dashboard.statusOf(id)).toBe('SUBMITTED');
  147 | 
  148 |         const apiStatus = await api.status(id, agent());
  149 |         expectApiSuccess(apiStatus);
  150 |         expect(apiStatus.body.data.application_status).toBe('SUBMITTED');
  151 |         expect(apiStatus.body.data.application_reference_number).toBe(reference);
  152 |       });
  153 |     }
  154 |   });
  155 | 
  156 |   test(name('TC-WF-004', 'submitted application is read-only'), meta('TC-WF-004'), async ({ otherAgent, api }, testInfo) => {
  157 |     const list = (await api.listApplications(emailOf('submitted'), 'SUBMITTED')).body?.data ?? [];
  158 |     const seeded = list.find((a: { application_reference_number: string }) => a.application_reference_number === SEEDED.submittedReference);
  159 |     test.skip(!seeded, `Seeded submitted application ${SEEDED.submittedReference} not found for agent.submitted`);
  160 |     const id: number = seeded.id;
  161 | 
  162 |     const page = await otherAgent('submitted');
  163 |     for (const step of ['client', 'address-contact', 'product']) {
  164 |       await test.step(`/${step} cannot be edited`, async () => {
  165 |         await page.goto(`/applications/${id}/${step}`);
  166 |         if (!new RegExp(`/${step}`).test(page.url())) {
  167 |           testInfo.annotations.push({ type: 'observation', description: `/${step} redirected to ${new URL(page.url()).pathname}` });
  168 |           return; // redirected away = not editable
  169 |         }
  170 |         const editableInputs = await page.locator('form input:not([type=hidden]):not([disabled]):not([readonly]), form select:not([disabled]), form textarea:not([disabled]):not([readonly])').count();
  171 |         const saveVisible = await page.locator('form button[data-testid$="save-continue-button"]:not([disabled])').count();
> 172 |         expect(editableInputs + saveVisible, `${step} page offers no way to edit a submitted application`).toBe(0);
      |                                                                                                            ^ Error: client page offers no way to edit a submitted application
  173 |       });
  174 |     }
  175 |     await test.step('API refuses to change a submitted application (re-sends the identical, current data)', async () => {
  176 |       const current = (await api.getClient(id, emailOf('submitted'))).body?.data;
  177 |       const res = await api.saveClient(id, emailOf('submitted'), {
  178 |         first_name: current.first_name, middle_name: current.middle_name, last_name: current.last_name,
  179 |         date_of_birth: String(current.date_of_birth).slice(0, 10), gender: current.gender, marital_status: current.marital_status,
  180 |         nationality: current.nationality, occupation: current.occupation, employer_name: current.employer_name, employer_address: current.employer_address,
  181 |       });
  182 |       expect(res.status, `editing a SUBMITTED application must not succeed (got ${res.status})`).toBeGreaterThanOrEqual(400);
  183 |     });
  184 |   });
  185 | 
  186 |   test(name('TC-WF-005', 'confirmation page appears after submission'), meta('TC-WF-005'), async ({ page, api }, testInfo) => {
  187 |     const app = await buildApplication(api, { agentEmail: agent() });
  188 |     const reference = await submitViaReview(page, app.id);
  189 |     const confirmation = new ConfirmationPage(page);
  190 |     await expect(confirmation.dashboardLink).toBeVisible();
  191 |     await expect(confirmation.viewStatusLink).toBeVisible();
  192 |     expect(reference).toMatch(REFERENCE_NUMBER);
  193 |     const text = await page.getByTestId('submission-confirmation-page').innerText();
  194 |     testInfo.annotations.push({
  195 |       type: 'observation',
  196 |       description: /e-?mail|sent/i.test(text) ? 'Confirmation mentions an email/sent message.' : 'No confirmation-email simulation text on the page.',
  197 |     });
  198 |   });
  199 | 
  200 |   test(name('TC-WF-006', 'dashboard status updates after submission'), meta('TC-WF-006'), async ({ page, api }) => {
  201 |     const app = await buildApplication(api, { agentEmail: agent() });
  202 |     const dashboard = new DashboardPage(page);
  203 |     await dashboard.goto();
  204 |     expect(await dashboard.statusOf(app.id)).toBe('DRAFT');
  205 |     const draftBefore = await dashboard.summaryCount('draft');
  206 |     const submittedBefore = await dashboard.summaryCount('submitted');
  207 | 
  208 |     await submitViaReview(page, app.id);
  209 |     await dashboard.goto();
  210 |     expect(await dashboard.statusOf(app.id)).toBe('SUBMITTED');
  211 |     expect(await dashboard.summaryCount('draft'), 'draft counter decreases by one').toBe(draftBefore - 1);
  212 |     expect(await dashboard.summaryCount('submitted'), 'submitted counter increases by one').toBe(submittedBefore + 1);
  213 |   });
  214 | 
  215 |   test(name('TC-WF-007', 'status page matches the status API'), meta('TC-WF-007'), async ({ page, api }) => {
  216 |     const app = await buildApplication(api, { agentEmail: agent() });
  217 |     expectApiSuccess(await api.submit(app.id, agent()));
  218 |     const apiStatus = (await api.status(app.id, agent())).body.data;
  219 | 
  220 |     const status = new ApplicationStatusPage(page);
  221 |     await status.goto(app.id);
  222 |     expect(await status.currentStatus(), 'current status').toBe(apiStatus.application_status);
  223 |     expect(await status.referenceNumber(), 'reference number').toBe(apiStatus.application_reference_number);
  224 |     await expect(status.historyRows(), 'history rows equal API history entries').toHaveCount(apiStatus.status_history.length);
  225 |   });
  226 | });
  227 | 
  228 | 
```