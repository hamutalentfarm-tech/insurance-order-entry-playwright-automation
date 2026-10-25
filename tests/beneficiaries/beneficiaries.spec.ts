import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { GUARDIAN, beneficiary } from '../../fixtures/applicationData';
import { BeneficiaryPage } from '../../pages/BeneficiaryPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { anyMatches } from '../../utils/assertions';
import { MSG } from '../../utils/messages';
import { dobForAge, toIso } from '../../utils/dataGenerator';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');

/** Application positioned at the beneficiaries step (client..riders done through the API, no beneficiaries yet). */
async function atBeneficiaries(api: Parameters<typeof buildApplication>[0]): Promise<number> {
  return (await buildApplication(api, { agentEmail: agent(), upTo: 'riders' })).id;
}

/** Does the allocation error show on the beneficiaries page, or only on the review page? */
async function totalErrorSurface(page: import('@playwright/test').Page, ben: BeneficiaryPage, id: number, pattern: RegExp): Promise<'page' | 'review' | null> {
  if (pattern.test(await ben.errorsText())) return 'page';
  const review = new ReviewPage(page);
  await review.goto(id);
  return anyMatches(await review.errors(), pattern) ? 'review' : null;
}

test.describe('Beneficiary management', () => {
  test(name('TC-BEN-001', 'add a valid primary beneficiary (and irrevocable confirmation)'), meta('TC-BEN-001'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);

    const primary = beneficiary({ allocation: 100 });
    await ben.addAndExpectRow(primary, 1);
    await expect(page.getByText(primary.lastName as string).first()).toBeVisible();
    expect(await ben.primaryTotal()).toBe(100);
    await expect(ben.errorSummary).toHaveCount(0);

    await test.step('extension: irrevocable designation asks for confirmation (browser confirm dialog)', async () => {
      const secondary = beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD', irrevocable: true });
      const before = await ben.rowIds();

      const declined = await ben.add(secondary, 'dismiss');
      expect(declined.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
      await ben.goto(id);
      await expect(ben.rows(), 'declining the confirmation does not save').toHaveCount(1);

      const accepted = await ben.add(secondary, 'accept');
      expect(accepted.dialogs.join(' ')).toMatch(MSG.irrevocableDialog);
      await expect(ben.rows()).toHaveCount(2);
      const newId = (await ben.rowIds()).find((x) => !before.includes(x));
      await expect(page.getByTestId(`beneficiary-irrevocable-badge-${newId}`)).toBeVisible();
    });
  });

  test(name('TC-BEN-002', 'primary allocation below 100% is flagged and blocks submission'), meta('TC-BEN-002'), async ({ page, api }, testInfo) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);
    await ben.addAndExpectRow(beneficiary({ allocation: 30, relationship: 'CHILD' }), 2);
    expect(await ben.primaryTotal()).toBe(90);

    const where = await totalErrorSurface(page, ben, id, MSG.primaryTotal);
    testInfo.annotations.push({ type: 'observation', description: `Primary-total error shown on: ${where ?? 'NOWHERE'}` });
    expect(where, '90% must raise "must total exactly 100%"').not.toBeNull();

    await test.step('review page keeps Submit disabled', async () => {
      const review = new ReviewPage(page);
      await review.goto(id);
      await expect(review.submitButton).toBeDisabled();
    });
    await test.step('adding 10% fixes the total and clears the error', async () => {
      await ben.goto(id);
      await ben.addAndExpectRow(beneficiary({ allocation: 10, relationship: 'SIBLING' }), 3);
      expect(await ben.primaryTotal()).toBe(100);
      const review = new ReviewPage(page);
      await review.goto(id);
      expect(anyMatches(await review.errors(), MSG.primaryTotal)).toBe(false);
    });
  });

  test(name('TC-BEN-003', 'primary allocation above 100% is blocked'), meta('TC-BEN-003'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    await ben.addAndExpectRow(beneficiary({ allocation: 60 }), 1);

    // The page raises a browser alert() when the new total would exceed 100%.
    const result = await ben.add(beneficiary({ allocation: 50, relationship: 'CHILD' }));
    expect(result.dialogs.join(' '), 'over-allocation alert').toMatch(MSG.overAllocationDialog);
    await ben.goto(id);
    await expect(ben.rows(), 'second beneficiary was not saved').toHaveCount(1);
    expect(await ben.primaryTotal()).toBe(60);
  });

  test(name('TC-BEN-004', 'secondary allocation is validated separately'), meta('TC-BEN-004'), async ({ page, api }, testInfo) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    await ben.addAndExpectRow(beneficiary({ allocation: 100 }), 1);
    await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 50, relationship: 'CHILD' }), 2);
    await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 30, relationship: 'SIBLING' }), 3);

    expect(await ben.primaryTotal(), 'primary group is complete').toBe(100);
    expect(await ben.secondaryTotal(), 'secondary group has its own running total').toBe(80);

    const review = new ReviewPage(page);
    await review.goto(id);
    const errors = await review.errors();
    testInfo.annotations.push({
      type: 'observation',
      description: `Review errors with secondary at 80%: ${errors.filter((e) => /benef|alloc|secondary/i.test(e)).join(' | ') || 'none about beneficiaries'}`,
    });
    expect(anyMatches(errors, MSG.primaryTotal), 'primary error must not appear while primary is 100%').toBe(false);

    await test.step('completing the secondary group to 100%', async () => {
      await ben.goto(id);
      await ben.addAndExpectRow(beneficiary({ level: 'SECONDARY', allocation: 20, relationship: 'PARENT' }), 4);
      expect(await ben.secondaryTotal()).toBe(100);
    });
  });

  test(name('TC-BEN-005', 'minor beneficiary requires guardian details'), meta('TC-BEN-005'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    const minor = beneficiary({ dob: dobForAge(17), allocation: 50, relationship: 'CHILD' });

    await test.step('minor without guardian is rejected', async () => {
      await expect(ben.guardianSection).toBeVisible();
      await ben.add(minor);
      expect(await ben.errorsText()).toMatch(MSG.guardian);
      await expect(ben.rows()).toHaveCount(0);
    });
    await test.step('minor with guardian details and legal acknowledgement is saved', async () => {
      await ben.goto(id);
      await ben.add({ ...minor, guardian: GUARDIAN, legalAcknowledgement: true });
      await expect(ben.rows()).toHaveCount(1);
    });
    await test.step('an adult needs no guardian', async () => {
      await ben.goto(id);
      await ben.add(beneficiary({ dob: dobForAge(30), allocation: 50, relationship: 'SIBLING' }));
      await expect(ben.rows()).toHaveCount(2);
    });
  });

  test(name('TC-BEN-006', 'trust beneficiary shows trust-specific fields'), meta('TC-BEN-006'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    await ben.type.selectOption('TRUST');

    for (const f of ['beneficiary-trust-name-input', 'beneficiary-trustee-name-input', 'beneficiary-trust-date-input', 'beneficiary-trustee-contact-input']) {
      await expect(ben.field(f), f).toBeVisible();
    }
    await expect(ben.field('beneficiary-first-name-input'), 'individual-only field is hidden').toBeHidden();

    await test.step('trust name is mandatory', async () => {
      await ben.add(beneficiary({ type: 'TRUST', relationship: 'TRUST', trustName: '', trusteeName: 'Pat Trustee' }));
      expect(await ben.errorsText()).toMatch(MSG.trustName);
    });
    await test.step('a complete trust is saved', async () => {
      await ben.goto(id);
      await ben.add(beneficiary({ type: 'TRUST', relationship: 'TRUST', trustName: 'QA Family Trust', trusteeName: 'Pat Trustee', trustDate: toIso(new Date()) }));
      await expect(ben.rows()).toHaveCount(1);
    });
  });

  test(name('TC-BEN-007', 'organization beneficiary shows organization-specific fields'), meta('TC-BEN-007'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    await ben.type.selectOption('ORGANIZATION');

    for (const f of ['beneficiary-organization-name-input', 'beneficiary-organization-registration-input', 'beneficiary-organization-contact-input']) {
      await expect(ben.field(f), f).toBeVisible();
    }
    await expect(ben.field('beneficiary-trust-name-input'), 'trust field is hidden').toBeHidden();

    await test.step('organization name is mandatory', async () => {
      await ben.add(beneficiary({ type: 'ORGANIZATION', relationship: 'ORGANIZATION', organizationName: '' }));
      expect(await ben.errorsText()).toMatch(MSG.organizationName);
    });
    await test.step('a complete organization is saved', async () => {
      await ben.goto(id);
      await ben.add(beneficiary({
        type: 'ORGANIZATION', relationship: 'ORGANIZATION', organizationName: 'QA Charity Foundation',
        organizationRegistration: 'REG-123456', organizationContact: '(212) 555-0111',
      }));
      await expect(ben.rows()).toHaveCount(1);
    });
  });

  test(name('TC-BEN-008', 'duplicate beneficiary is blocked'), meta('TC-BEN-008'), async ({ page, api }) => {
    const id = await atBeneficiaries(api);
    const ben = new BeneficiaryPage(page);
    await ben.goto(id);
    const original = beneficiary({ allocation: 40 });
    await ben.addAndExpectRow(original, 1);

    await test.step('same name + date of birth + relationship is blocked', async () => {
      await ben.add({ ...original });
      expect(await ben.errorsText(), 'duplicate error').toMatch(MSG.duplicate);
      await ben.goto(id);
      await expect(ben.rows()).toHaveCount(1);
      const list = await api.listBeneficiaries(id, agent());
      expect(list.body?.data, 'API holds a single record').toHaveLength(1);
    });
    await test.step('a different relationship is a different beneficiary', async () => {
      await ben.addAndExpectRow({ ...original, relationship: 'CHILD' }, 2);
    });
  });

  test(name('TC-BEN-009', 'removing or editing a beneficiary updates the allocation total'), meta('TC-BEN-009'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, {
      agentEmail: agent(), upTo: 'beneficiaries',
      beneficiaries: [
        beneficiary({ allocation: 50 }), beneficiary({ allocation: 30, relationship: 'CHILD' }), beneficiary({ allocation: 20, relationship: 'SIBLING' }),
      ],
    });
    const list = (await api.listBeneficiaries(app.id, agent())).body?.data as { id: number; allocation_percentage: string | number }[];
    const idFor = (pct: number): number => {
      const row = list.find((b) => Number(b.allocation_percentage) === pct);
      if (!row) throw new Error(`No beneficiary with ${pct}%`);
      return row.id;
    };

    const ben = new BeneficiaryPage(page);
    await ben.goto(app.id);
    expect(await ben.primaryTotal()).toBe(100);

    await test.step('remove the 30% beneficiary: total becomes 70% and is flagged', async () => {
      await ben.remove(idFor(30));
      await expect(ben.rows()).toHaveCount(2);
      expect(await ben.primaryTotal()).toBe(70);
      const where = await totalErrorSurface(page, ben, app.id, MSG.primaryTotal);
      testInfo.annotations.push({ type: 'observation', description: `70% total flagged on: ${where ?? 'NOWHERE'}` });
      expect(where).not.toBeNull();
    });
    await test.step('edit the 20% beneficiary to 50%: total returns to 100%', async () => {
      await ben.goto(app.id);
      await ben.changeAllocation(idFor(20), 50);
      await ben.goto(app.id);
      expect(await ben.primaryTotal()).toBe(100);
      const review = new ReviewPage(page);
      await review.goto(app.id);
      expect(anyMatches(await review.errors(), MSG.primaryTotal)).toBe(false);
    });
  });
});
