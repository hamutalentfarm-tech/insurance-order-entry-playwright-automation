import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { MAX_RIDERS, RIDERS, product } from '../../fixtures/referenceData';
import { RiderSelectionPage, type RiderKey } from '../../pages/RiderSelectionPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { expectApiError } from '../../utils/assertions';
import { errorSurface } from '../../utils/flows';
import { MSG } from '../../utils/messages';
import { periodPremium, totalPremium } from '../../utils/premium';
import { dobForAge } from '../../utils/dataGenerator';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');
const BASE = product('WL_SECURE_BASIC');
const FACE = 250_000;

/** Application with client age 40, SecureLife 250,000 monthly saved, positioned at the riders step. */
async function atRiders(api: Parameters<typeof buildApplication>[0], opts: { age?: number; face?: number } = {}) {
  return buildApplication(api, {
    agentEmail: agent(), upTo: 'product',
    client: opts.age ? { dob: dobForAge(opts.age) } : undefined,
    product: { productCode: BASE.code, faceValue: opts.face ?? FACE, frequency: 'MONTHLY' },
  });
}

async function riderPayload(api: Parameters<typeof buildApplication>[0], picks: { key: RiderKey; coverage: number }[]) {
  const out = [];
  for (const p of picks) out.push({ rider_id: await api.riderId(RIDERS[p.key].code), coverage_amount: p.coverage });
  return out;
}

test.describe('Rider selection', () => {
  test(name('TC-RID-001', 'agent can add an eligible protection rider (ADB)'), meta('TC-RID-001'), async ({ page, api }) => {
    const app = await atRiders(api);
    const riders = new RiderSelectionPage(page);
    await riders.goto(app.id);
    await riders.select('ADB', FACE);
    await riders.saveAndExpectNext();

    await test.step('rider is stored and itemised in the premium', async () => {
      await riders.goto(app.id);
      expect(await riders.isSelected('ADB')).toBe(true);
      const adb = periodPremium(FACE, RIDERS.ADB.ratePer1000, 'MONTHLY'); // 17.71
      expect(await riders.summaryText()).toContain(adb.toFixed(2));
      const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: RIDERS.ADB.ratePer1000 }], 'MONTHLY'); // 116.67
      const stored = Number((await api.getApplication(app.id, agent())).body?.data?.total_premium);
      expect(stored, 'API total premium includes the rider').toBe(total);
    });
  });

  test(name('TC-RID-002', 'rider coverage cannot exceed the base face value'), meta('TC-RID-002'), async ({ page, api }) => {
    const riders = new RiderSelectionPage(page);

    await test.step('ADB at face value + 1 is rejected, at face value accepted', async () => {
      const app = await atRiders(api);
      await riders.goto(app.id);
      await riders.select('ADB', FACE + 1);
      await riders.save();
      await expect(page).toHaveURL(/\/riders/);
      await riders.expectErrorMatching(MSG.riderAboveBase);

      await riders.goto(app.id);
      await riders.select('ADB', FACE);
      await riders.saveAndExpectNext();
    });
    await test.step('API rejects the same request', async () => {
      const app = await atRiders(api);
      const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'ADB', coverage: FACE + 1 }]));
      expectApiError(res, 422, MSG.riderAboveBase);
    });
    await test.step('Critical Illness is capped at 500,000 even when the base is larger', async () => {
      const app = await atRiders(api, { face: 1_000_000 });
      await riders.goto(app.id);
      await riders.select('CI', 500_001);
      await riders.save();
      await expect(page).toHaveURL(/\/riders/);
      await riders.expectErrorMatching(MSG.riderAboveMax);
    });
  });

  test(name('TC-RID-003', 'age-ineligible rider cannot be added'), meta('TC-RID-003'), async ({ page, api }) => {
    // Waiver of Premium - Disability is for ages 18-55; the client below is 56.
    const app = await atRiders(api, { age: 56 });
    const riders = new RiderSelectionPage(page);
    await riders.goto(app.id);
    await riders.select('WAIVER_DISABILITY', FACE);
    await riders.save();
    await expect(page).toHaveURL(/\/riders/);
    await riders.expectErrorMatching(MSG.riderAge);

    await test.step('API rejects it as well', async () => {
      const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [{ key: 'WAIVER_DISABILITY', coverage: FACE }]));
      expectApiError(res, 422, MSG.riderAge);
    });
    await test.step('an eligible age (50) is accepted', async () => {
      const eligible = await atRiders(api, { age: 50 });
      await riders.goto(eligible.id);
      await riders.select('WAIVER_DISABILITY', FACE);
      await riders.saveAndExpectNext();
    });
  });

  test(name('TC-RID-004', 'maximum of four riders is enforced'), meta('TC-RID-004'), async ({ page, api }) => {
    const five: { key: RiderKey; coverage: number }[] = [
      { key: 'ADB', coverage: FACE }, { key: 'DISABILITY', coverage: FACE }, { key: 'TERM', coverage: FACE },
      { key: 'HOSPITAL', coverage: 100_000 }, { key: 'CI', coverage: FACE },
    ];
    expect(five.length).toBe(MAX_RIDERS + 1);
    const app = await atRiders(api);
    const riders = new RiderSelectionPage(page);

    await test.step('five riders are rejected', async () => {
      await riders.goto(app.id);
      for (const r of five) await riders.select(r.key, r.coverage);
      expect(await riders.selectedCount()).toBe(5);
      await riders.save();
      await expect(page).toHaveURL(/\/riders/);
      await riders.expectErrorMatching(MSG.riderMaxCount);
    });
    await test.step('API rejects five riders too', async () => {
      const res = await api.saveRiders(app.id, agent(), await riderPayload(api, five));
      expectApiError(res, 422, MSG.riderMaxCount);
    });
    await test.step('four riders are accepted', async () => {
      const ok = await atRiders(api);
      await riders.goto(ok.id);
      for (const r of five.slice(0, MAX_RIDERS)) await riders.select(r.key, r.coverage);
      await riders.saveAndExpectNext();
    });
  });

  test(name('TC-RID-005', 'mutually exclusive waiver riders cannot both be selected'), meta('TC-RID-005'), async ({ page, api }) => {
    const app = await atRiders(api);
    const riders = new RiderSelectionPage(page);

    await test.step('both waivers together are rejected', async () => {
      await riders.goto(app.id);
      await riders.select('WAIVER_DISABILITY', FACE);
      await riders.select('WAIVER_CI', FACE);
      await riders.save();
      await expect(page).toHaveURL(/\/riders/);
      await riders.expectErrorMatching(MSG.riderExclusive);
    });
    await test.step('API rejects both together', async () => {
      const res = await api.saveRiders(app.id, agent(), await riderPayload(api, [
        { key: 'WAIVER_DISABILITY', coverage: FACE }, { key: 'WAIVER_CI', coverage: FACE },
      ]));
      expectApiError(res, 422, MSG.riderExclusive);
    });
    await test.step('one waiver on its own is accepted', async () => {
      const one = await atRiders(api);
      await riders.goto(one.id);
      await riders.select('WAIVER_DISABILITY', FACE);
      await riders.saveAndExpectNext();
    });
  });

  test(name('TC-RID-006', 'critical illness rider triggers a health questionnaire'), meta('TC-RID-006'), async ({ page, api }, testInfo) => {
    // The markup has no questionnaire test id, so this looks for any questionnaire text on the page after selecting the
    // rider, then for a questionnaire message after saving. Record the real selector on first run and tighten this test.
    const app = await atRiders(api);
    const riders = new RiderSelectionPage(page);
    await riders.goto(app.id);
    await riders.select('CI', FACE);

    const onPage = await page.getByText(/health questionnaire|medical questionnaire|health declaration/i).count();
    if (onPage > 0) {
      testInfo.annotations.push({ type: 'observation', description: 'Questionnaire text appears on the riders page after selecting the rider.' });
      return;
    }
    await riders.save();
    const where = await errorSurface(page, app.id, /questionnaire|health/i);
    testInfo.annotations.push({ type: 'observation', description: `Questionnaire message shown on: ${where ?? 'NOWHERE'}` });
    expect(where, 'selecting Critical Illness must lead to a health questionnaire (page text or message)').not.toBeNull();
  });

  test(name('TC-RID-007', 'rider premiums are itemised in the total premium'), meta('TC-RID-007'), async ({ page, api }) => {
    const app = await atRiders(api);
    const riders = new RiderSelectionPage(page);
    const picks = [{ key: 'ADB' as const, coverage: FACE }, { key: 'HOSPITAL' as const, coverage: 100_000 }];
    const rate = (k: RiderKey): number => RIDERS[k].ratePer1000;

    await riders.goto(app.id);
    for (const p of picks) await riders.select(p.key, p.coverage);
    await riders.saveAndExpectNext();

    await test.step('itemised premiums and total with both riders', async () => {
      await riders.goto(app.id);
      const text = await riders.summaryText();
      for (const p of picks) expect(text, `${p.key} premium itemised`).toContain(periodPremium(p.coverage, rate(p.key), 'MONTHLY').toFixed(2));
      const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, picks.map((p) => ({ coverage: p.coverage, rate: rate(p.key) })), 'MONTHLY');
      expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total').toBe(total);
    });
    await test.step('removing a rider lowers the total', async () => {
      await riders.deselect('HOSPITAL');
      await riders.saveAndExpectNext();
      const total = totalPremium({ face: FACE, rate: BASE.ratePer1000 }, [{ coverage: FACE, rate: rate('ADB') }], 'MONTHLY');
      expect(Number((await api.getApplication(app.id, agent())).body?.data?.total_premium), 'API total after removal').toBe(total);
    });
  });
});
