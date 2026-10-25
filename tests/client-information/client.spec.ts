import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { MANDATORY_CLIENT_FIELDS, clientData } from '../../fixtures/applicationData';
import { DashboardPage } from '../../pages/DashboardPage';
import { ClientInformationPage } from '../../pages/ClientInformationPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { ageErrorSurface } from '../../utils/flows';
import { MSG } from '../../utils/messages';
import { ageOn, dobForAge, futureDate, toIso } from '../../utils/dataGenerator';
import { anyMatches } from '../../utils/assertions';
import { isNativelyInvalid } from '../../utils/testHelpers';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));

/** Fast set-up: an empty draft created through the API; the UI is then used for the behaviour under test. */
async function emptyDraft(api: Parameters<typeof buildApplication>[0]): Promise<number> {
  return (await buildApplication(api, { agentEmail: emailOf('learner'), upTo: 'draft' })).id;
}

test.describe('Client / insured information', () => {
  test(name('TC-CLI-001', 'agent can enter valid insured information'), meta('TC-CLI-001'), async ({ page, api }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const id = await dashboard.startNewApplication(); // full UI flow: dashboard -> start -> create draft

    const client = new ClientInformationPage(page);
    const data = clientData();
    await client.fillAndSave(data);
    await client.expectNoErrors();

    await test.step('saved values equal the entered values (API read-back)', async () => {
      const res = await api.getClient(id, emailOf('learner'));
      expect(res.body?.data?.first_name).toBe(data.firstName);
      expect(res.body?.data?.last_name).toBe(data.lastName);
      expect(String(res.body?.data?.date_of_birth).slice(0, 10)).toBe(data.dob);
    });
  });

  test(name('TC-CLI-002', 'mandatory personal fields are validated'), meta('TC-CLI-002'), async ({ page, api }, testInfo) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    const skippedSelects: string[] = [];

    for (const key of MANDATORY_CLIENT_FIELDS) {
      await test.step(`blank ${key}`, async () => {
        await client.goto(id);
        await client.fill(clientData());
        const field = client.field(key);
        const tag = await field.evaluate((el) => el.tagName.toLowerCase());
        if (tag === 'select') {
          const hasBlank = await field.locator('option[value=""]').count();
          if (!hasBlank) {
            skippedSelects.push(key);
            return; // a select without a blank option cannot be left empty by the user
          }
          await field.selectOption('');
        } else {
          await field.fill('');
        }
        expect(await isNativelyInvalid(field), `browser blocks empty ${key}`).toBe(true);
        await client.save({ ignoreBrowserValidation: true }); // reach the server-side check too
        await expect(page).toHaveURL(/\/client/);
        expect((await client.errorMessages()).length, `server message for blank ${key}`).toBeGreaterThan(0);
      });
    }
    if (skippedSelects.length) testInfo.annotations.push({ type: 'observation', description: `Selects with no blank option: ${skippedSelects.join(', ')}` });
  });

  test(name('TC-CLI-003', 'DOB below 18 is rejected'), meta('TC-CLI-003'), async ({ page, api }, testInfo) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    await client.goto(id);
    await client.fill(clientData({ dob: dobForAge(18, 1) })); // 17 years 364 days
    await client.save();
    const where = await ageErrorSurface(page, id);
    testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
    expect(where, 'age 17y364d must produce the age-range error (form or review page)').not.toBeNull();
  });

  test(name('TC-CLI-004', 'DOB above 65 is rejected'), meta('TC-CLI-004'), async ({ page, api }, testInfo) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    await client.goto(id);
    await client.fill(clientData({ dob: dobForAge(66) }));
    await client.save();
    const where = await ageErrorSurface(page, id);
    testInfo.annotations.push({ type: 'observation', description: `Age error shown on: ${where ?? 'NOWHERE'}` });
    expect(where, 'age 66 must produce the age-range error (form or review page)').not.toBeNull();
  });

  test(name('TC-CLI-005', 'future DOB is rejected'), meta('TC-CLI-005'), async ({ page, api }) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    for (const dob of [futureDate(1), futureDate(3650)]) {
      await test.step(`DOB ${dob}`, async () => {
        await client.goto(id);
        await client.fill(clientData({ dob }));
        await client.save();
        await expect(page).toHaveURL(/\/client/);
        await client.expectErrorMatching(MSG.futureDob);
      });
    }
    await test.step('nothing in the future was stored', async () => {
      const res = await api.getClient(id, emailOf('learner'));
      const stored = res.body?.data?.date_of_birth;
      if (stored) expect(String(stored).slice(0, 10) <= toIso(new Date())).toBe(true);
    });
  });

  test(name('TC-CLI-006', 'age boundaries 18 and 65 are accepted'), meta('TC-CLI-006'), async ({ page, api }) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    const review = new ReviewPage(page);
    for (const age of [18, 65]) {
      await test.step(`age exactly ${age}`, async () => {
        await client.goto(id);
        await client.fill(clientData({ dob: dobForAge(age) }));
        await client.save();
        await expect(page, `age ${age} is accepted and the flow moves on`).toHaveURL(/address-contact/);
        await review.goto(id);
        expect(await review.calculatedAge(), 'calculated age on review page').toBe(age);
        expect(anyMatches(await review.errors(), MSG.ageRange), `no age error at ${age}`).toBe(false);
      });
    }
  });

  test(name('TC-CLI-007', 'age is calculated correctly from the date of birth'), meta('TC-CLI-007'), async ({ page, api }) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    const review = new ReviewPage(page);
    const cases = [
      { label: 'birthday today', dob: dobForAge(40) },
      { label: 'birthday tomorrow', dob: dobForAge(40, 1) },
      { label: 'leap-day birth date', dob: '1984-02-29' },
    ];
    for (const c of cases) {
      await test.step(c.label, async () => {
        await client.goto(id);
        await client.fill(clientData({ dob: c.dob }));
        await client.save();
        await review.goto(id);
        expect(await review.calculatedAge()).toBe(ageOn(c.dob));
      });
    }
  });

  test(name('TC-CLI-008', 'name format validation'), meta('TC-CLI-008'), async ({ page, api }) => {
    const id = await emptyDraft(api);
    const client = new ClientInformationPage(page);
    const invalid = ['12345', '@@@', 'a'.repeat(101), '   '];

    for (const value of invalid) {
      await test.step(`rejects first name "${value.slice(0, 12)}${value.length > 12 ? '...' : ''}"`, async () => {
        await client.goto(id);
        await client.fill(clientData({ firstName: value }));
        await client.save({ ignoreBrowserValidation: true });
        await expect(page).toHaveURL(/\/client/);
        expect((await client.errorMessages()).length, 'validation message').toBeGreaterThan(0);
      });
    }
    await test.step('format message for digits/symbols', async () => {
      await client.goto(id);
      await client.fill(clientData({ firstName: '12345' }));
      await client.save();
      await client.expectErrorMatching(MSG.nameFormat);
    });
    await test.step('accepts a hyphenated name with an apostrophe', async () => {
      await client.goto(id);
      await client.fill(clientData({ firstName: 'Anne-Marie', lastName: "O'Neil" }));
      await client.save();
      await expect(page).toHaveURL(/address-contact/);
    });
  });
});
