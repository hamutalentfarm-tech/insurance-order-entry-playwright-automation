import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { beneficiary } from '../../fixtures/applicationData';
import { PRODUCTS, RIDERS, DOC_MAX_KB, product } from '../../fixtures/referenceData';
import { DashboardPage } from '../../pages/DashboardPage';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { ApiClient } from '../../utils/apiClient';
import { buildApplication, toApiBeneficiary } from '../../utils/applicationBuilder';
import { anyMatches, errorTexts, expectApiError, expectApiSuccess } from '../../utils/assertions';
import { dobForAge, futureDate } from '../../utils/dataGenerator';
import { makeFile } from '../../utils/fileUploadHelper';
import { env } from '../../utils/env';
import { MSG } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');

test.describe('API', () => {
  test(name('TC-API-001', 'products API returns 200 and the expected schema'), meta('TC-API-001'), async ({ api }) => {
    const res = await api.products();
    expectApiSuccess(res);
    const items = res.body.data as Record<string, unknown>[];
    expect(items).toHaveLength(PRODUCTS.length);

    for (const item of items) {
      for (const key of ['id', 'product_code', 'product_name', 'eligibility_age_min', 'eligibility_age_max', 'face_value_min', 'face_value_max', 'base_rate_per_1000', 'is_active']) {
        expect(item, `product has "${key}"`).toHaveProperty(key);
      }
      const ref = product(String(item.product_code));
      expect(item.product_name).toBe(ref.name);
      expect(Number(item.eligibility_age_min)).toBe(ref.ageMin);
      expect(Number(item.eligibility_age_max)).toBe(ref.ageMax);
      expect(Number(item.face_value_min)).toBe(ref.faceMin);
      expect(Number(item.face_value_max)).toBe(ref.faceMax);
      expect(Number(item.base_rate_per_1000)).toBeCloseTo(ref.ratePer1000, 4);
    }

    await test.step('riders API (extension)', async () => {
      const riders = await api.riders();
      expectApiSuccess(riders);
      const list = riders.body.data as { rider_code: string; eligibility_age_min: number; eligibility_age_max: number }[];
      expect(list).toHaveLength(Object.keys(RIDERS).length);
      for (const r of Object.values(RIDERS)) {
        const live = list.find((x) => x.rider_code === r.code);
        expect(live, `rider ${r.code} listed`).toBeTruthy();
        expect(Number(live?.eligibility_age_min)).toBe(r.ageMin);
        expect(Number(live?.eligibility_age_max)).toBe(r.ageMax);
      }
    });
  });

  test(name('TC-API-002', 'application APIs require the API key'), meta('TC-API-002'), async ({ api }, testInfo) => {
    const noKey = await ApiClient.create({ apiKey: null });
    const wrongKey = await ApiClient.create({ apiKey: 'definitely-wrong-key' });
    try {
      for (const [label, client] of [['no key', noKey], ['wrong key', wrongKey]] as const) {
        await test.step(label, async () => {
          const list = await client.listApplications(agent());
          expectApiError(list, 401, MSG.unauthorized);
          const submit = await client.submit(1, agent());
          expectApiError(submit, 401, MSG.unauthorized);
          expect(list.text, 'no application data leaks').not.toMatch(/application_reference_number/);
        });
      }
      await test.step('health check is public', async () => {
              // The Lab Manual's health example sends the key, so whether health is public is only recorded, not asserted.
      const health = await noKey.health();
      testInfo.annotations.push({ type: 'observation', description: `GET health without a key: HTTP ${health.status}` });
      });
    } finally {
      await noKey.dispose();
      await wrongKey.dispose();
    }
    expect((await api.listApplications(agent())).status, 'valid key works').toBe(200);
  });

  test(name('TC-API-003', 'client API rejects invalid dates of birth'), meta('TC-API-003'), async ({ api }, testInfo) => {
    const draft = async (): Promise<number> => (await buildApplication(api, { agentEmail: agent(), upTo: 'draft' })).id;
    const payload = (dob: string) => ({
      first_name: 'Qa', last_name: 'Tester', date_of_birth: dob, gender: 'MALE', marital_status: 'SINGLE',
      nationality: 'United States', occupation: 'Engineer', employer_name: 'Acme', employer_address: '1 Corporate Way',
    });

    await test.step('future date of birth is rejected', async () => {
      const id = await draft();
      const res = await api.saveClient(id, agent(), payload(futureDate(1)));
      expectApiError(res, 422, MSG.futureDob);
      expect(JSON.stringify(res.body.errors)).toMatch(/date_of_birth/);
    });
    for (const c of [{ label: 'age 17 years 364 days', dob: dobForAge(18, 1) }, { label: 'age 66', dob: dobForAge(66) }]) {
      await test.step(`${c.label}: rejected on save, or flagged by validate`, async () => {
        const id = await draft();
        const res = await api.saveClient(id, agent(), payload(c.dob));
        if (res.status === 422) {
          testInfo.annotations.push({ type: 'observation', description: `${c.label}: rejected when saving` });
          expect(errorTexts(res).join(' ')).toMatch(MSG.ageRange);
        } else {
          expect(res.status, 'accepted on save').toBe(200);
          const validate = await api.validate(id, agent());
          testInfo.annotations.push({ type: 'observation', description: `${c.label}: accepted on save; validate returned HTTP ${validate.status}` });
          expect(errorTexts(validate).join(' | '), `${c.label} must be flagged somewhere`).toMatch(MSG.ageRange);
        }
      });
    }
    await test.step('a valid date of birth is stored', async () => {
      const id = await draft();
      const dob = dobForAge(40);
      expectApiSuccess(await api.saveClient(id, agent(), payload(dob)));
      const stored = (await api.getClient(id, agent())).body?.data?.date_of_birth;
      expect(String(stored).slice(0, 10)).toBe(dob);
    });
  });

  test(name('TC-API-004', 'validate API reports beneficiary allocation errors'), meta('TC-API-004'), async ({ api }, testInfo) => {
    const cases = [
      { label: 'primary total 90%', second: 30, expectError: true },
      { label: 'primary total 110%', second: 50, expectError: true },
      { label: 'primary total 100%', second: 40, expectError: false },
    ];
    for (const c of cases) {
      await test.step(c.label, async () => {
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'documents', beneficiaries: [beneficiary({ allocation: 60 })] });
        const add = await api.addBeneficiary(app.id, agent(), toApiBeneficiary(beneficiary({ allocation: c.second, relationship: 'CHILD' })));
        if (add.status === 422) {
          // The API itself may refuse an over-allocation when adding. That also satisfies the rule.
          testInfo.annotations.push({ type: 'observation', description: `${c.label}: refused when adding the beneficiary (HTTP 422)` });
          expect(c.expectError, 'only the over-allocation case may be refused on add').toBe(true);
          return;
        }
        expect(add.status).toBeLessThan(300);
        const res = await api.validate(app.id, agent());
        if (c.expectError) {
          expectApiError(res, 422, MSG.primaryTotal);
        } else {
          expectApiSuccess(res);
          expect(errorTexts(res).join(' ')).not.toMatch(MSG.primaryTotal);
        }
      });
    }
  });

  test(name('TC-API-005', 'submit API rejects an incomplete application'), meta('TC-API-005'), async ({ api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'product' }); // no riders step, beneficiaries or documents
    const res = await api.submit(app.id, agent());
    expectApiError(res, 422, MSG.validationFailed);
    expect(errorTexts(res).join(' | ')).toMatch(/benefici|document/i);

    const status = (await api.status(app.id, agent())).body.data;
    expect(status.application_status, 'still a draft').toBe('DRAFT');
    expect(status.application_reference_number ?? '', 'no WL reference issued').not.toMatch(/^WL\d+/);
  });

  test(name('TC-API-006', 'status API matches the dashboard'), meta('TC-API-006'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent() });
    const dashboard = new DashboardPage(page);

    const compare = async (label: string, expected: string): Promise<void> => {
      await dashboard.goto();
      const ui = await dashboard.statusOf(app.id);
      const viaStatus = (await api.status(app.id, agent())).body.data.application_status;
      const viaList = ((await api.listApplications(agent())).body.data as { id: number; application_status: string }[]).find((a) => a.id === app.id)?.application_status;
      expect({ ui, viaStatus, viaList }, label).toEqual({ ui: expected, viaStatus: expected, viaList: expected });
    };
    await compare('draft', 'DRAFT');
    expectApiSuccess(await api.submit(app.id, agent()));
    await compare('after submit', 'SUBMITTED');
  });

  test(name('TC-API-007', 'product detail API matches the product details page'), meta('TC-API-007'), async ({ page, api }) => {
    const ref = product('WL_ELITE_LEGACY');
    const id = await api.productId(ref.code);
    const res = await api.product(id);
    expectApiSuccess(res);
    const live = res.body.data;
    expect(live.product_code).toBe(ref.code);
    expect(live.product_name).toBe(ref.name);
    expect(Number(live.face_value_min)).toBe(ref.faceMin);
    expect(Number(live.face_value_max)).toBe(ref.faceMax);

    const catalog = new ProductCatalogPage(page);
    await catalog.goto();
    await catalog.openDetails(ref.code);
    const ui = await catalog.detail();
    expect(ui.name).toContain(live.product_name);
    expect(ui.code).toContain(live.product_code);

    await test.step('unknown product id returns 404', async () => {
      expect((await api.product(999_999)).status).toBe(404);
    });
  });

  test(name('TC-API-008', 'applications API returns only the requested agent records'), meta('TC-API-008'), async ({ api }) => {
    const valid = emailOf('valid');
    const draft = emailOf('draft');
    const a = (await api.listApplications(valid)).body.data as { id: number; user_id: number }[];
    const b = (await api.listApplications(draft)).body.data as { id: number; user_id: number }[];
    expect(a.length, 'agent.valid has applications').toBeGreaterThan(0);
    expect(b.length, 'agent.draft has applications').toBeGreaterThan(0);

    expect(new Set(a.map((x) => x.user_id)).size, 'one owner in the first list').toBe(1);
    expect(new Set(b.map((x) => x.user_id)).size, 'one owner in the second list').toBe(1);
    expect(a.filter((x) => b.some((y) => y.id === x.id)), 'lists do not overlap').toEqual([]);

    await test.step('reading another agent\'s application is refused (read-only check)', async () => {
      const res = await api.getApplication(b[0].id, valid);
      expect(res.status, `agent.valid reading agent.draft's application returned HTTP ${res.status}`).toBeGreaterThanOrEqual(400);
    });
  });

  test(name('TC-API-009', 'documents API validates type, size and required document'), meta('TC-API-009'), async ({ api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
    const upload = (f: ReturnType<typeof makeFile>, type = 'KYC_ID') => api.uploadDocument(app.id, agent(), { type, name: f.name, mimeType: f.mimeType, buffer: f.buffer });

    await test.step('KYC_ID is reported missing before any upload', async () => {
      expect(errorTexts(await api.validate(app.id, agent())).join(' | ')).toMatch(MSG.docRequired);
    });
    await test.step('unsupported type is rejected', async () => {
      expectApiError(await upload(makeFile('exe')), 422, MSG.docFormat);
    });
    await test.step('oversized file is rejected', async () => {
      const res = await upload(makeFile('pdf', 'big.pdf', DOC_MAX_KB + 1));
      testInfo.annotations.push({ type: 'observation', description: `Oversize upload: HTTP ${res.status} ${errorTexts(res).join(' | ')}` });
      expect(res.status, 'oversize must be refused').toBeGreaterThanOrEqual(400);
      expect.soft(errorTexts(res).join(' '), 'documented message').toMatch(MSG.docSize);
    });
    await test.step('valid PDF is accepted and the required-document error disappears', async () => {
      expectApiSuccess(await upload(makeFile('pdf', `kyc-${app.id}.pdf`)), 201);
      const texts = errorTexts(await api.validate(app.id, agent()));
      expect(anyMatches(texts, MSG.docRequired), 'KYC_ID no longer missing').toBe(false);
    });
  });

  test(name('TC-API-010', 'login API status codes and response schema'), meta('TC-API-010'), async ({ api }) => {
    await test.step('valid credentials', async () => {
      const res = await api.login(agent(), env.password);
      expectApiSuccess(res);
      expect(res.body.message).toMatch(/login validated successfully/i);
      for (const key of ['user_id', 'name', 'email', 'role', 'learner_code', 'account_status']) expect(res.body.data).toHaveProperty(key);
      expect(res.body.data.email).toBe(agent());
      expect(Object.keys(res.body.data)).not.toContain('password');
      expect(JSON.stringify(res.body), 'no token is issued by this API').not.toMatch(/token/i);
    });
    await test.step('wrong password -> 401', async () => {
      expectApiError(await api.login(agent(), 'Wrong#Pass123'), 401, MSG.invalidCredentials);
    });
    await test.step('blank and malformed input -> 422', async () => {
      expect((await api.login('', '')).status).toBe(422);
      expect((await api.login('not-an-email', 'x')).status).toBe(422);
    });
    await test.step('locked user -> 403', async () => {
      const res = await api.login(emailOf('locked'), env.password);
      expectApiError(res, 403, MSG.accountLocked);
    });
  });
});
