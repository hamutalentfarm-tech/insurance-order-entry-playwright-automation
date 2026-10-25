import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { productData } from '../../fixtures/applicationData';
import { FREQUENCIES, PAYMENT_TERMS, POLICY_TERMS, PRODUCTS, RIDERS, product } from '../../fixtures/referenceData';
import { ProductCatalogPage } from '../../pages/ProductCatalogPage';
import { ProductConfigurationPage } from '../../pages/ProductConfigurationPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { errorTexts, expectApiError, expectApiSuccess } from '../../utils/assertions';
import { errorSurface } from '../../utils/flows';
import { MSG } from '../../utils/messages';
import { periodPremium, totalPremium } from '../../utils/premium';
import { dobForAge } from '../../utils/dataGenerator';
import { parseMoney } from '../../utils/testHelpers';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');
const sorted = (a: string[]): string[] => [...a].sort();

test.describe('Product selection and policy configuration', () => {
  test(name('TC-PROD-001', 'catalog shows the expected Whole Life products'), meta('TC-PROD-001'), async ({ page, api }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.goto();
    const uiCodes = await catalog.productCodes();

    const res = await api.products();
    expectApiSuccess(res);
    const activeApi = (res.body.data as { product_code: string; is_active: boolean | number }[]).filter((p) => !!p.is_active).map((p) => p.product_code);

    expect(sorted(uiCodes), 'UI cards equal active products in the API').toEqual(sorted(activeApi));
    expect(sorted(uiCodes), 'seeded products are all listed').toEqual(sorted(PRODUCTS.map((p) => p.code)));
    for (const code of uiCodes) await expect(catalog.card(code)).toBeVisible();
  });

  test(name('TC-PROD-002', 'product details page opens with features and terms'), meta('TC-PROD-002'), async ({ page, api }) => {
    const catalog = new ProductCatalogPage(page);
    await catalog.goto();
    const target = product('WL_ELITE_LEGACY');
    await catalog.openDetails(target.code);
    const detail = await catalog.detail();
    expect(detail.code).toContain(target.code);
    expect(detail.name).toContain(target.name);
    expect(detail.features.length).toBeGreaterThan(10);

    await test.step('term options on the configuration page', async () => {
      const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
      const config = new ProductConfigurationPage(page);
      await config.goto(app.id);
      expect((await config.paymentTermOptions()).map(Number)).toEqual([...PAYMENT_TERMS]);
      expect(await config.policyTermOptions()).toEqual(expect.arrayContaining([...POLICY_TERMS]));
    });
  });

  test(name('TC-PROD-003', 'face value below the minimum is rejected'), meta('TC-PROD-003'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' }); // client age 40 is eligible for every product
    const config = new ProductConfigurationPage(page);

    for (const p of PRODUCTS) {
      await test.step(`${p.name}: ${p.faceMin - 1} rejected, ${p.faceMin} accepted`, async () => {
        await config.goto(app.id);
        await config.fill(productData({ productCode: p.code, faceValue: p.faceMin - 1 }));
        await config.save();
        await expect(page).toHaveURL(/\/product/);
        await config.expectErrorMatching(MSG.faceBelowMin);

        await config.goto(app.id);
        await config.fill(productData({ productCode: p.code, faceValue: p.faceMin }));
        await config.save();
        await expect(page, 'minimum is accepted').toHaveURL(/\/riders/);
      });
    }
    await test.step('API rejects below-minimum too', async () => {
      const p = product('WL_SECURE_BASIC');
      const res = await api.saveProduct(app.id, agent(), {
        insurance_product_id: await api.productId(p.code), face_value: p.faceMin - 1,
        premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
      });
      expectApiError(res, 422, MSG.faceBelowMin);
    });
  });

  test(name('TC-PROD-004', 'face value above the maximum is rejected'), meta('TC-PROD-004'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
    const config = new ProductConfigurationPage(page);

    for (const p of PRODUCTS) {
      await test.step(`${p.name}: ${p.faceMax + 1} rejected, ${p.faceMax} accepted`, async () => {
        await config.goto(app.id);
        await config.fill(productData({ productCode: p.code, faceValue: p.faceMax + 1 }));
        await config.save();
        await expect(page).toHaveURL(/\/product/);
        await config.expectErrorMatching(MSG.faceAboveMax);

        await config.goto(app.id);
        await config.fill(productData({ productCode: p.code, faceValue: p.faceMax }));
        await config.save();
        await expect(page, 'maximum is accepted').toHaveURL(/\/riders/);
      });
    }
    await test.step('API rejects above-maximum too', async () => {
      const p = product('WL_SECURE_BASIC');
      const res = await api.saveProduct(app.id, agent(), {
        insurance_product_id: await api.productId(p.code), face_value: p.faceMax + 1,
        premium_frequency: 'MONTHLY', payment_term_years: 20, policy_term: 'WHOLE_LIFE',
      });
      expectApiError(res, 422, MSG.faceAboveMax);
    });
  });

  test(name('TC-PROD-005', 'premium recalculates when frequency or face value changes'), meta('TC-PROD-005'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc' });
    const p = product('WL_SECURE_BASIC');
    const config = new ProductConfigurationPage(page);
    await config.goto(app.id);
    await config.selectProduct(p.code);
    await config.setFaceValue(250_000);
    await config.paymentTerm.selectOption('20');
    await config.setPolicyTerm('WHOLE_LIFE');

    const seen: number[] = [];
    for (const f of FREQUENCIES) {
      await test.step(`frequency ${f}`, async () => {
        await config.setFrequency(f);
        const expected = periodPremium(250_000, p.ratePer1000, f);
        await expect.poll(() => config.premiumShown(), { message: `live premium for ${f}` }).toBe(expected);
        seen.push(expected);
      });
    }
    expect(new Set(seen).size, 'each frequency gives a different premium').toBe(FREQUENCIES.length);

    await test.step('changing the face value changes the premium', async () => {
      await config.setFrequency('MONTHLY');
      await config.setFaceValue(300_000);
      await expect.poll(() => config.premiumShown()).toBe(periodPremium(300_000, p.ratePer1000, 'MONTHLY'));
    });

    await test.step('saved premium equals the preview and the API', async () => {
      await config.setFrequency('QUARTERLY');
      await config.save();
      await expect(page).toHaveURL(/\/riders/);
      const expected = periodPremium(300_000, p.ratePer1000, 'QUARTERLY');
      await config.goto(app.id);
      expect(await config.premiumShown(), 'stored premium after reload').toBe(expected);
      const res = await api.getApplication(app.id, agent());
      expect(Number(res.body?.data?.total_premium), 'API total premium').toBe(expected);
    });
  });

  test(name('TC-PROD-006', 'premium matches on configuration, summary, review and API'), meta('TC-PROD-006'), async ({ page, api }) => {
    const face = 250_000;
    const app = await buildApplication(api, {
      agentEmail: agent(), upTo: 'riders', product: { faceValue: face, frequency: 'MONTHLY' }, riders: [{ key: 'ADB', coverage: face }],
    });
    const p = product('WL_SECURE_BASIC');
    const config = new ProductConfigurationPage(page);
    const review = new ReviewPage(page);

    const readAll = async (): Promise<Record<string, number>> => {
      await config.goto(app.id);
      const configPremium = await config.premiumShown();
      await page.goto(`/applications/${app.id}`);
      const summary = parseMoney(await page.getByTestId('application-total-premium').innerText());
      await review.goto(app.id);
      const reviewPremium = await review.totalPremium();
      const apiPremium = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
      return { configPremium, summary, reviewPremium, apiPremium };
    };

    await test.step('as configured (250,000 + ADB, monthly)', async () => {
      const expected = totalPremium({ face, rate: p.ratePer1000 }, [{ coverage: face, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY');
      const v = await readAll();
      expect(v, 'all four places show the same premium').toEqual({ configPremium: expected, summary: expected, reviewPremium: expected, apiPremium: expected });
    });
    await test.step('after changing the face value to 300,000', async () => {
      await config.goto(app.id);
      await config.setFaceValue(300_000);
      await config.save();
      const v = await readAll();
      const values = Object.values(v);
      expect(new Set(values).size, `premium differs between screens/API: ${JSON.stringify(v)}`).toBe(1);
    });
  });

  test(name('TC-PROD-007', 'suitability / eligibility warning for age and product mismatch'), meta('TC-PROD-007'), async ({ page, api }, testInfo) => {
    const cases = [
      { label: 'age 19 with WealthBuilder (min 21)', age: 19, code: 'WL_WEALTH_BUILDER' },
      { label: 'age 63 with Guaranteed Return (max 55)', age: 63, code: 'WL_GUARANTEED_RETURN' },
      { label: 'age 63 with FlexiPay (max 62)', age: 63, code: 'WL_FLEXI_PAY' },
    ];
    for (const c of cases) {
      await test.step(c.label, async () => {
        const p = product(c.code);
        const app = await buildApplication(api, { agentEmail: agent(), upTo: 'kyc', client: { dob: dobForAge(c.age) } });

        // UI: choose the product and save; the eligibility message may appear on the form or on the review page
        const config = new ProductConfigurationPage(page);
        await config.goto(app.id);
        await config.fill(productData({ productCode: c.code, faceValue: Math.max(p.faceMin, 250_000) }));
        await config.save();
        const where = await errorSurface(page, app.id, MSG.eligibility);
        testInfo.annotations.push({ type: 'observation', description: `${c.label}: eligibility message shown on ${where ?? 'NOWHERE'}` });
        expect(where, `${c.label}: UI must flag the mismatch`).not.toBeNull();

        // API: validate must report it as well
        const res = await api.validate(app.id, agent());
        expect(errorTexts(res).join(' | '), `${c.label}: validate API`).toMatch(MSG.eligibility);
      });
    }
  });
});
