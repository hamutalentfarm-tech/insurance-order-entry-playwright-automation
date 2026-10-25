import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { FAKE_SSN, kycData } from '../../fixtures/applicationData';
import { DocumentUploadPage } from '../../pages/DocumentUploadPage';
import { KycFinancialPage } from '../../pages/KycFinancialPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { errorTexts, anyMatches } from '../../utils/assertions';
import { makeFile } from '../../utils/fileUploadHelper';
import { errorSurface } from '../../utils/flows';
import { MSG } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');

test.describe('KYC, financial and compliance', () => {
  test(name('TC-KYC-001', 'SSN is masked on every screen and response'), meta('TC-KYC-001'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
    const kyc = new KycFinancialPage(page);
    await kyc.goto(app.id);
    await kyc.fillAndSave(kycData({ idType: 'SSN', idNumber: FAKE_SSN }));

    const digitsOnly = FAKE_SSN.replace(/-/g, '');
    const expectMasked = async (label: string): Promise<void> => {
      const html = await page.content();
      expect(html, `${label}: full SSN must not appear`).not.toContain(FAKE_SSN);
      expect(html, `${label}: unformatted SSN must not appear`).not.toContain(digitsOnly);
    };

    await test.step('KYC page after reload', async () => {
      await kyc.goto(app.id);
      await expectMasked('kyc page');
      const shown = await kyc.idNumber.inputValue();
      if (shown) expect(shown, 'field shows only the last four digits').toMatch(/\*+.*6789$|^6789$/);
    });
    await test.step('review page', async () => {
      const review = new ReviewPage(page);
      await review.goto(app.id);
      await expectMasked('review page');
    });
    await test.step('API response for the application', async () => {
      const res = await api.getApplication(app.id, agent());
      expect(res.text).not.toContain(FAKE_SSN);
      expect(res.text).not.toContain(digitsOnly);
      expect(res.text, 'masked value is present').toContain('6789');
    });
  });

  test(name('TC-KYC-002', 'KYC upload rejects unsupported file types'), meta('TC-KYC-002'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
    const docs = new DocumentUploadPage(page);
    await docs.goto(app.id);
    for (const kind of ['exe', 'txt'] as const) {
      await test.step(`KYC_ID with .${kind}`, async () => {
        await docs.upload('KYC_ID', makeFile(kind));
        await docs.expectErrorMatching(MSG.docFormat);
        await expect(docs.rows(), 'nothing is stored').toHaveCount(0);
      });
    }
  });

  test(name('TC-KYC-003', 'PEP = Yes requires details'), meta('TC-KYC-003'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
    const kyc = new KycFinancialPage(page);

    await test.step('PEP Yes without details is flagged', async () => {
      await kyc.goto(app.id);
      await kyc.fill(kycData({ isPep: true, pepDetails: '' }));
      await kyc.save({ ignoreBrowserValidation: true });
      const where = await errorSurface(page, app.id, MSG.pepDetails);
      testInfo.annotations.push({ type: 'observation', description: `PEP-details error shown on: ${where ?? 'NOWHERE'}` });
      expect(where, 'PEP Yes with blank details must raise an error').not.toBeNull();
    });
    await test.step('PEP Yes with details is accepted and no PEP error remains', async () => {
      await kyc.goto(app.id);
      await kyc.fillAndSave(kycData({ isPep: true, pepDetails: 'Former city council member (QA test data)' }));
      const review = new ReviewPage(page);
      await review.goto(app.id);
      expect(anyMatches(await review.errors(), MSG.pepDetails)).toBe(false);
    });
    await test.step('PEP No does not need details', async () => {
      await kyc.goto(app.id);
      await kyc.fillAndSave(kycData({ isPep: false }));
    });
  });

  test(name('TC-KYC-004', 'premium must be affordable against income (20%)'), meta('TC-KYC-004'), async ({ page, api }) => {
    // SecureLife, face 250,000, monthly => annual premium 1,187.50. 20% limit: income 5,000 -> 1,000 (fails), 50,000 -> 10,000 (passes).
    const app = await buildApplication(api, {
      agentEmail: agent(), upTo: 'product', kyc: { annualIncome: 5_000 },
    });
    const review = new ReviewPage(page);
    const kyc = new KycFinancialPage(page);

    await test.step('income 5,000 is flagged on the review page and by the validate API', async () => {
      await review.goto(app.id);
      expect(anyMatches(await review.errors(), MSG.affordability), 'affordability error on review page').toBe(true);
      const res = await api.validate(app.id, agent());
      expect(errorTexts(res).join(' | ')).toMatch(MSG.affordability);
    });
    await test.step('raising income to 50,000 clears the affordability error', async () => {
      await kyc.goto(app.id);
      await kyc.fillAndSave(kycData({ annualIncome: 50_000 }));
      await review.goto(app.id);
      expect(anyMatches(await review.errors(), MSG.affordability)).toBe(false);
    });
  });

  test(name('TC-KYC-005', 'ID number rules by ID type'), meta('TC-KYC-005'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
    const kyc = new KycFinancialPage(page);
    const types = ['SSN', 'STATE_ID', 'PASSPORT', 'DRIVERS_LICENSE'] as const;

    await test.step('ID number is mandatory', async () => {
      await kyc.goto(app.id);
      await kyc.fill(kycData({ idNumber: '' }));
      await kyc.save({ ignoreBrowserValidation: true });
      await expect(page).toHaveURL(/kyc-financial/);
      expect((await kyc.errorMessages()).length).toBeGreaterThan(0);
    });
    await test.step('ID number longer than 100 characters is rejected', async () => {
      await kyc.goto(app.id);
      await kyc.fill(kycData({ idNumber: '9'.repeat(101) }));
      await kyc.save({ ignoreBrowserValidation: true });
      await expect(page).toHaveURL(/kyc-financial/);
      expect((await kyc.errorMessages()).length).toBeGreaterThan(0);
    });
    for (const type of types) {
      await test.step(`${type}: a clearly invalid number is rejected (documented rule: ID rules change by type)`, async () => {
        await kyc.goto(app.id);
        await kyc.fill(kycData({ idType: type, idNumber: '@@@' }));
        await kyc.save({ ignoreBrowserValidation: true });
        const accepted = /\/product/.test(page.url());
        testInfo.annotations.push({ type: 'observation', description: `${type}: "@@@" accepted = ${accepted}` });
        expect.soft(accepted, `${type}: "@@@" should be rejected as an ID number`).toBe(false);
      });
    }
  });

  test(name('TC-KYC-006', 'incomplete compliance declaration blocks progress'), meta('TC-KYC-006'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });
    const kyc = new KycFinancialPage(page);

    await test.step('UI: declaration not ticked', async () => {
      await kyc.goto(app.id);
      await kyc.fill(kycData({ declaration: false }));
      await kyc.save({ ignoreBrowserValidation: true });
      const where = await errorSurface(page, app.id, MSG.declaration);
      testInfo.annotations.push({ type: 'observation', description: `Declaration error shown on: ${where ?? 'NOWHERE'}` });
      expect(where, 'unticked declaration must raise an error').not.toBeNull();
    });
    await test.step('API validate reports the missing declaration', async () => {
      const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'product', kyc: { declaration: false } });
      const res = await api.validate(incomplete.id, agent());
      expect(errorTexts(res).join(' | ')).toMatch(MSG.declaration);
    });
  });
});
