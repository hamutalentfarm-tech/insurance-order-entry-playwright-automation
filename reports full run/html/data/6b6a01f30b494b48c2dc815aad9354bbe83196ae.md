# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\api.spec.ts >> API >> TC-API-009 | API-P01 | documents API validates type, size and required document
- Location: tests\api\api.spec.ts:212:7

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /KYC[_ ]ID.*(required|not been uploaded)|required document/i
Received string:  "Validation failed | Client information is required. | RESIDENTIAL address is required. | MAILING address is required. | Contact information is required. | KYC details are required. | Financial profile is required. | Compliance declaration is required. | Insurance product must be selected."
```

# Test source

```ts
  117 |     const cases = [
  118 |       { label: 'primary total 90%', second: 30, expectError: true },
  119 |       { label: 'primary total 110%', second: 50, expectError: true },
  120 |       { label: 'primary total 100%', second: 40, expectError: false },
  121 |     ];
  122 |     for (const c of cases) {
  123 |       await test.step(c.label, async () => {
  124 |         const app = await buildApplication(api, { agentEmail: agent(), upTo: 'documents', beneficiaries: [beneficiary({ allocation: 60 })] });
  125 |         const add = await api.addBeneficiary(app.id, agent(), toApiBeneficiary(beneficiary({ allocation: c.second, relationship: 'CHILD' })));
  126 |         if (add.status === 422) {
  127 |           // The API itself may refuse an over-allocation when adding. That also satisfies the rule.
  128 |           testInfo.annotations.push({ type: 'observation', description: `${c.label}: refused when adding the beneficiary (HTTP 422)` });
  129 |           expect(c.expectError, 'only the over-allocation case may be refused on add').toBe(true);
  130 |           return;
  131 |         }
  132 |         expect(add.status).toBeLessThan(300);
  133 |         const res = await api.validate(app.id, agent());
  134 |         if (c.expectError) {
  135 |           expectApiError(res, 422, MSG.primaryTotal);
  136 |         } else {
  137 |           expectApiSuccess(res);
  138 |           expect(errorTexts(res).join(' ')).not.toMatch(MSG.primaryTotal);
  139 |         }
  140 |       });
  141 |     }
  142 |   });
  143 | 
  144 |   test(name('TC-API-005', 'submit API rejects an incomplete application'), meta('TC-API-005'), async ({ api }) => {
  145 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'product' }); // no riders step, beneficiaries or documents
  146 |     const res = await api.submit(app.id, agent());
  147 |     expectApiError(res, 422, MSG.validationFailed);
  148 |     expect(errorTexts(res).join(' | ')).toMatch(/benefici|document/i);
  149 | 
  150 |     const status = (await api.status(app.id, agent())).body.data;
  151 |     expect(status.application_status, 'still a draft').toBe('DRAFT');
  152 |     expect(status.application_reference_number ?? '', 'no WL reference issued').not.toMatch(/^WL\d+/);
  153 |   });
  154 | 
  155 |   test(name('TC-API-006', 'status API matches the dashboard'), meta('TC-API-006'), async ({ page, api }) => {
  156 |     const app = await buildApplication(api, { agentEmail: agent() });
  157 |     const dashboard = new DashboardPage(page);
  158 | 
  159 |     const compare = async (label: string, expected: string): Promise<void> => {
  160 |       await dashboard.goto();
  161 |       const ui = await dashboard.statusOf(app.id);
  162 |       const viaStatus = (await api.status(app.id, agent())).body.data.application_status;
  163 |       const viaList = ((await api.listApplications(agent())).body.data as { id: number; application_status: string }[]).find((a) => a.id === app.id)?.application_status;
  164 |       expect({ ui, viaStatus, viaList }, label).toEqual({ ui: expected, viaStatus: expected, viaList: expected });
  165 |     };
  166 |     await compare('draft', 'DRAFT');
  167 |     expectApiSuccess(await api.submit(app.id, agent()));
  168 |     await compare('after submit', 'SUBMITTED');
  169 |   });
  170 | 
  171 |   test(name('TC-API-007', 'product detail API matches the product details page'), meta('TC-API-007'), async ({ page, api }) => {
  172 |     const ref = product('WL_ELITE_LEGACY');
  173 |     const id = await api.productId(ref.code);
  174 |     const res = await api.product(id);
  175 |     expectApiSuccess(res);
  176 |     const live = res.body.data;
  177 |     expect(live.product_code).toBe(ref.code);
  178 |     expect(live.product_name).toBe(ref.name);
  179 |     expect(Number(live.face_value_min)).toBe(ref.faceMin);
  180 |     expect(Number(live.face_value_max)).toBe(ref.faceMax);
  181 | 
  182 |     const catalog = new ProductCatalogPage(page);
  183 |     await catalog.goto();
  184 |     await catalog.openDetails(ref.code);
  185 |     const ui = await catalog.detail();
  186 |     expect(ui.name).toContain(live.product_name);
  187 |     expect(ui.code).toContain(live.product_code);
  188 | 
  189 |     await test.step('unknown product id returns 404', async () => {
  190 |       expect((await api.product(999_999)).status).toBe(404);
  191 |     });
  192 |   });
  193 | 
  194 |   test(name('TC-API-008', 'applications API returns only the requested agent records'), meta('TC-API-008'), async ({ api }) => {
  195 |     const valid = emailOf('valid');
  196 |     const draft = emailOf('draft');
  197 |     const a = (await api.listApplications(valid)).body.data as { id: number; user_id: number }[];
  198 |     const b = (await api.listApplications(draft)).body.data as { id: number; user_id: number }[];
  199 |     expect(a.length, 'agent.valid has applications').toBeGreaterThan(0);
  200 |     expect(b.length, 'agent.draft has applications').toBeGreaterThan(0);
  201 | 
  202 |     expect(new Set(a.map((x) => x.user_id)).size, 'one owner in the first list').toBe(1);
  203 |     expect(new Set(b.map((x) => x.user_id)).size, 'one owner in the second list').toBe(1);
  204 |     expect(a.filter((x) => b.some((y) => y.id === x.id)), 'lists do not overlap').toEqual([]);
  205 | 
  206 |     await test.step('reading another agent\'s application is refused (read-only check)', async () => {
  207 |       const res = await api.getApplication(b[0].id, valid);
  208 |       expect(res.status, `agent.valid reading agent.draft's application returned HTTP ${res.status}`).toBeGreaterThanOrEqual(400);
  209 |     });
  210 |   });
  211 | 
  212 |   test(name('TC-API-009', 'documents API validates type, size and required document'), meta('TC-API-009'), async ({ api }, testInfo) => {
  213 |     const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
  214 |     const upload = (f: ReturnType<typeof makeFile>, type = 'KYC_ID') => api.uploadDocument(app.id, agent(), { type, name: f.name, mimeType: f.mimeType, buffer: f.buffer });
  215 | 
  216 |     await test.step('KYC_ID is reported missing before any upload', async () => {
> 217 |       expect(errorTexts(await api.validate(app.id, agent())).join(' | ')).toMatch(MSG.docRequired);
      |                                                                           ^ Error: expect(received).toMatch(expected)
  218 |     });
  219 |     await test.step('unsupported type is rejected', async () => {
  220 |       expectApiError(await upload(makeFile('exe')), 422, MSG.docFormat);
  221 |     });
  222 |     await test.step('oversized file is rejected', async () => {
  223 |       const res = await upload(makeFile('pdf', 'big.pdf', DOC_MAX_KB + 1));
  224 |       testInfo.annotations.push({ type: 'observation', description: `Oversize upload: HTTP ${res.status} ${errorTexts(res).join(' | ')}` });
  225 |       expect(res.status, 'oversize must be refused').toBeGreaterThanOrEqual(400);
  226 |       expect.soft(errorTexts(res).join(' '), 'documented message').toMatch(MSG.docSize);
  227 |     });
  228 |     await test.step('valid PDF is accepted and the required-document error disappears', async () => {
  229 |       expectApiSuccess(await upload(makeFile('pdf', `kyc-${app.id}.pdf`)), 201);
  230 |       const texts = errorTexts(await api.validate(app.id, agent()));
  231 |       expect(anyMatches(texts, MSG.docRequired), 'KYC_ID no longer missing').toBe(false);
  232 |     });
  233 |   });
  234 | 
  235 |   test(name('TC-API-010', 'login API status codes and response schema'), meta('TC-API-010'), async ({ api }) => {
  236 |     await test.step('valid credentials', async () => {
  237 |       const res = await api.login(agent(), env.password);
  238 |       expectApiSuccess(res);
  239 |       expect(res.body.message).toMatch(/login validated successfully/i);
  240 |       for (const key of ['user_id', 'name', 'email', 'role', 'learner_code', 'account_status']) expect(res.body.data).toHaveProperty(key);
  241 |       expect(res.body.data.email).toBe(agent());
  242 |       expect(Object.keys(res.body.data)).not.toContain('password');
  243 |       expect(JSON.stringify(res.body), 'no token is issued by this API').not.toMatch(/token/i);
  244 |     });
  245 |     await test.step('wrong password -> 401', async () => {
  246 |       expectApiError(await api.login(agent(), 'Wrong#Pass123'), 401, MSG.invalidCredentials);
  247 |     });
  248 |     await test.step('blank and malformed input -> 422', async () => {
  249 |       expect((await api.login('', '')).status).toBe(422);
  250 |       expect((await api.login('not-an-email', 'x')).status).toBe(422);
  251 |     });
  252 |     await test.step('locked user -> 403', async () => {
  253 |       const res = await api.login(emailOf('locked'), env.password);
  254 |       expectApiError(res, 403, MSG.accountLocked);
  255 |     });
  256 |   });
  257 | });
  258 | 
```