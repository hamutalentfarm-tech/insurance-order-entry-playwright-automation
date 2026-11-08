# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\api.spec.ts >> API >> TC-API-008 | API-V08 | applications API returns only the requested agent records
- Location: tests\api\api.spec.ts:197:7

# Error details

```
Error: agent.valid reading agent.draft's application returned HTTP 200

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 400
Received:    200
```

# Test source

```ts
  111 |       const id = await draft();
  112 |       const dob = dobForAge(40);
  113 |       expectApiSuccess(await api.saveClient(id, agent(), payload(dob)));
  114 |       const stored = (await api.getClient(id, agent())).body?.data?.date_of_birth;
  115 |       expect(String(stored).slice(0, 10)).toBe(dob);
  116 |     });
  117 |   });
  118 | 
  119 |   test(name('TC-API-004', 'validate API reports beneficiary allocation errors'), meta('TC-API-004'), async ({ api }, testInfo) => {
  120 |     const cases = [
  121 |       { label: 'primary total 90%', second: 30, expectError: true },
  122 |       { label: 'primary total 110%', second: 50, expectError: true },
  123 |       { label: 'primary total 100%', second: 40, expectError: false },
  124 |     ];
  125 |     for (const c of cases) {
  126 |       await test.step(c.label, async () => {
  127 |         const app = await buildApplication(api, { agentEmail: agent(), upTo: 'documents', beneficiaries: [beneficiary({ allocation: 60 })] });
  128 |         const add = await api.addBeneficiary(app.id, agent(), toApiBeneficiary(beneficiary({ allocation: c.second, relationship: 'CHILD' })));
  129 |         if (add.status === 422) {
  130 |           // The API itself may refuse an over-allocation when adding. That also satisfies the rule.
  131 |           testInfo.annotations.push({ type: 'observation', description: `${c.label}: refused when adding the beneficiary (HTTP 422)` });
  132 |           expect(c.expectError, 'only the over-allocation case may be refused on add').toBe(true);
  133 |           return;
  134 |         }
  135 |         expect(add.status).toBeLessThan(300);
  136 |         const res = await api.validate(app.id, agent());
  137 |         if (c.expectError) {
  138 |           expectApiError(res, 422, MSG.primaryTotal);
  139 |         } else {
  140 |           expectApiSuccess(res);
  141 |           expect(errorTexts(res).join(' ')).not.toMatch(MSG.primaryTotal);
  142 |         }
  143 |       });
  144 |     }
  145 |   });
  146 | 
  147 |   test(name('TC-API-005', 'submit API rejects an incomplete application'), meta('TC-API-005'), async ({ api }) => {
  148 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'product' }); // no riders step, beneficiaries or documents
  149 |     const res = await api.submit(app.id, agent());
  150 |     expectApiError(res, 422, MSG.validationFailed);
  151 |     expect(errorTexts(res).join(' | ')).toMatch(/benefici|document/i);
  152 | 
  153 |     const status = (await api.status(app.id, agent())).body.data;
  154 |     expect(status.application_status, 'still a draft').toBe('DRAFT');
  155 |     expect(status.application_reference_number ?? '', 'no WL reference issued').not.toMatch(/^WL\d+/);
  156 |   });
  157 | 
  158 |   test(name('TC-API-006', 'status API matches the dashboard'), meta('TC-API-006'), async ({ page, api }) => {
  159 |     const app = await buildApplication(api, { agentEmail: agent() });
  160 |     const dashboard = new DashboardPage(page);
  161 | 
  162 |     const compare = async (label: string, expected: string): Promise<void> => {
  163 |       await dashboard.goto();
  164 |       const ui = await dashboard.statusOf(app.id);
  165 |       const viaStatus = (await api.status(app.id, agent())).body.data.application_status;
  166 |       const viaList = ((await api.listApplications(agent())).body.data as { id: number; application_status: string }[]).find((a) => a.id === app.id)?.application_status;
  167 |       expect({ ui, viaStatus, viaList }, label).toEqual({ ui: expected, viaStatus: expected, viaList: expected });
  168 |     };
  169 |     await compare('draft', 'DRAFT');
  170 |     expectApiSuccess(await api.submit(app.id, agent()));
  171 |     await compare('after submit', 'SUBMITTED');
  172 |   });
  173 | 
  174 |   test(name('TC-API-007', 'product detail API matches the product details page'), meta('TC-API-007'), async ({ page, api }) => {
  175 |     const ref = product('WL_ELITE_LEGACY');
  176 |     const id = await api.productId(ref.code);
  177 |     const res = await api.product(id);
  178 |     expectApiSuccess(res);
  179 |     const live = res.body.data;
  180 |     expect(live.product_code).toBe(ref.code);
  181 |     expect(live.product_name).toBe(ref.name);
  182 |     expect(Number(live.face_value_min)).toBe(ref.faceMin);
  183 |     expect(Number(live.face_value_max)).toBe(ref.faceMax);
  184 | 
  185 |     const catalog = new ProductCatalogPage(page);
  186 |     await catalog.goto();
  187 |     await catalog.openDetails(ref.code);
  188 |     const ui = await catalog.detail();
  189 |     expect(ui.name).toContain(live.product_name);
  190 |     expect(ui.code).toContain(live.product_code);
  191 | 
  192 |     await test.step('unknown product id returns 404', async () => {
  193 |       expect((await api.product(999_999)).status).toBe(404);
  194 |     });
  195 |   });
  196 | 
  197 |   test(name('TC-API-008', 'applications API returns only the requested agent records'), meta('TC-API-008'), async ({ api }) => {
  198 |     const valid = emailOf('valid');
  199 |     const draft = emailOf('draft');
  200 |     const a = (await api.listApplications(valid)).body.data as { id: number; user_id: number }[];
  201 |     const b = (await api.listApplications(draft)).body.data as { id: number; user_id: number }[];
  202 |     expect(a.length, 'agent.valid has applications').toBeGreaterThan(0);
  203 |     expect(b.length, 'agent.draft has applications').toBeGreaterThan(0);
  204 | 
  205 |     expect(new Set(a.map((x) => x.user_id)).size, 'one owner in the first list').toBe(1);
  206 |     expect(new Set(b.map((x) => x.user_id)).size, 'one owner in the second list').toBe(1);
  207 |     expect(a.filter((x) => b.some((y) => y.id === x.id)), 'lists do not overlap').toEqual([]);
  208 | 
  209 |     await test.step('reading another agent\'s application is refused (read-only check)', async () => {
  210 |       const res = await api.getApplication(b[0].id, valid);
> 211 |       expect(res.status, `agent.valid reading agent.draft's application returned HTTP ${res.status}`).toBeGreaterThanOrEqual(400);
      |                                                                                                       ^ Error: agent.valid reading agent.draft's application returned HTTP 200
  212 |     });
  213 |   });
  214 | 
  215 |   test(name('TC-API-009', 'documents API validates type, size and required document'), meta('TC-API-009'), async ({ api }, testInfo) => {
  216 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
  217 |     const upload = (f: ReturnType<typeof makeFile>, type = 'KYC_ID') => api.uploadDocument(app.id, agent(), { type, name: f.name, mimeType: f.mimeType, buffer: f.buffer });
  218 | 
  219 |     await test.step('KYC_ID is reported missing before any upload', async () => {
  220 |       expect(errorTexts(await api.validate(app.id, agent())).join(' | ')).toMatch(MSG.docRequired);
  221 |     });
  222 |     await test.step('unsupported type is rejected', async () => {
  223 |       expectApiError(await upload(makeFile('exe')), 422, MSG.docFormat);
  224 |     });
  225 |     await test.step('oversized file is rejected', async () => {
  226 |       const res = await upload(makeFile('pdf', 'big.pdf', DOC_MAX_KB + 1));
  227 |       testInfo.annotations.push({ type: 'observation', description: `Oversize upload: HTTP ${res.status} ${errorTexts(res).join(' | ')}` });
  228 |       expect(res.status, 'oversize must be refused').toBeGreaterThanOrEqual(400);
  229 |       expect.soft(errorTexts(res).join(' '), 'documented message').toMatch(MSG.docSize);
  230 |     });
  231 |     await test.step('valid PDF is accepted and the required-document error disappears', async () => {
  232 |       expectApiSuccess(await upload(makeFile('pdf', `kyc-${app.id}.pdf`)), 201);
  233 |       const texts = errorTexts(await api.validate(app.id, agent()));
  234 |       expect(anyMatches(texts, MSG.docRequired), 'KYC_ID no longer missing').toBe(false);
  235 |     });
  236 |   });
  237 | 
  238 |   test(name('TC-API-010', 'login API status codes and response schema'), meta('TC-API-010'), async ({ api }) => {
  239 |     await test.step('valid credentials', async () => {
  240 |       const res = await api.login(agent(), env.password);
  241 |       expectApiSuccess(res);
  242 |       expect(res.body.message).toMatch(/login validated successfully/i);
  243 |       for (const key of ['user_id', 'name', 'email', 'role', 'learner_code', 'account_status']) expect(res.body.data).toHaveProperty(key);
  244 |       expect(res.body.data.email).toBe(agent());
  245 |       expect(Object.keys(res.body.data)).not.toContain('password');
  246 |       expect(JSON.stringify(res.body), 'no token is issued by this API').not.toMatch(/token/i);
  247 |     });
  248 |     await test.step('wrong password -> 401', async () => {
  249 |       expectApiError(await api.login(agent(), 'Wrong#Pass123'), 401, MSG.invalidCredentials);
  250 |     });
  251 |     await test.step('blank and malformed input -> 422', async () => {
  252 |       expect((await api.login('', '')).status).toBe(422);
  253 |       expect((await api.login('not-an-email', 'x')).status).toBe(422);
  254 |     });
  255 |     await test.step('locked user -> 403', async () => {
  256 |       const res = await api.login(emailOf('locked'), env.password);
  257 |       expectApiError(res, 403, MSG.accountLocked);
  258 |     });
  259 |   });
  260 | });
  261 | 
```