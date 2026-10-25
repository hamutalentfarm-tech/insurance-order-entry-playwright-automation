import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf, SEEDED } from '../../fixtures/users';
import {
  GUARDIAN, addressData, beneficiary, clientData, kycData, productData,
  type BeneficiaryData, type ProductData,
} from '../../fixtures/applicationData';
import { AddressContactPage } from '../../pages/AddressContactPage';
import { ApplicationStatusPage } from '../../pages/ApplicationStatusPage';
import { BeneficiaryPage } from '../../pages/BeneficiaryPage';
import { ClientInformationPage } from '../../pages/ClientInformationPage';
import { ConfirmationPage } from '../../pages/ConfirmationPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { DocumentUploadPage } from '../../pages/DocumentUploadPage';
import { KycFinancialPage } from '../../pages/KycFinancialPage';
import { ProductConfigurationPage } from '../../pages/ProductConfigurationPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { RiderSelectionPage, type RiderKey } from '../../pages/RiderSelectionPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { expectApiSuccess } from '../../utils/assertions';
import { dobForAge } from '../../utils/dataGenerator';
import { makeFile } from '../../utils/fileUploadHelper';
import { REFERENCE_NUMBER } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');

interface Flow {
  label: string;
  clientAge: number;
  product: Partial<ProductData>;
  riders: { key: RiderKey; coverage: number }[];
  beneficiaries: BeneficiaryData[];
}

/** The two data sets of the end-to-end test (TD-E2E-01 and TD-E2E-02). */
const FLOWS: Flow[] = [
  {
    label: 'E2E-01: SecureLife, ADB rider, one individual beneficiary',
    clientAge: 40,
    product: { productCode: 'WL_SECURE_BASIC', faceValue: 250_000, frequency: 'MONTHLY', paymentTerm: 20, policyTerm: 'WHOLE_LIFE' },
    riders: [{ key: 'ADB', coverage: 250_000 }],
    beneficiaries: [beneficiary({ allocation: 100 })],
  },
  {
    label: 'E2E-02: FlexiPay quarterly, Hospital Cash rider, trust primary and minor secondary with guardian',
    clientAge: 55,
    product: { productCode: 'WL_FLEXI_PAY', faceValue: 300_000, frequency: 'QUARTERLY', paymentTerm: 15, policyTerm: 'TO_AGE_100' },
    riders: [{ key: 'HOSPITAL', coverage: 100_000 }],
    beneficiaries: [
      beneficiary({ type: 'TRUST', relationship: 'TRUST', allocation: 100, trustName: 'QA Family Trust', trusteeName: 'Pat Trustee', trustDate: dobForAge(1) }),
      beneficiary({ level: 'SECONDARY', relationship: 'CHILD', allocation: 100, dob: dobForAge(10), guardian: GUARDIAN, legalAcknowledgement: true }),
    ],
  },
];

async function submitViaReview(page: import('@playwright/test').Page, id: number): Promise<string> {
  const review = new ReviewPage(page);
  await review.goto(id);
  await expect(review.passedBox, 'no blocking errors before submit').toBeVisible();
  await review.submit();
  const confirmation = new ConfirmationPage(page);
  await confirmation.expectShown();
  return confirmation.referenceNumber();
}

test.describe('Submission and status tracking', () => {
  test(name('TC-WF-001', 'incomplete application is saved as a draft'), meta('TC-WF-001'), async ({ page }) => {
    // The app has no separate "Save draft" button: the draft is created at the start page and saved by each Save and Continue.
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const id = await dashboard.startNewApplication();

    await new ClientInformationPage(page).fillAndSave(clientData());
    await new AddressContactPage(page).fillAndSave(addressData());

    await dashboard.goto();
    expect(await dashboard.statusOf(id)).toBe('DRAFT');
    await expect(page.getByTestId(`application-open-${id}`)).toBeVisible();
  });

  test(name('TC-WF-002', 'draft can be resumed with the saved data'), meta('TC-WF-002'), async ({ otherAgent, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'address' });

    // A fresh browser context with the same login stands in for "log out, log in again".
    const page = await otherAgent('learner');
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.openApplication(app.id);

    await test.step('client data is restored', async () => {
      const client = new ClientInformationPage(page);
      await client.goto(app.id);
      expect(await client.values()).toMatchObject({
        firstName: app.client.firstName, lastName: app.client.lastName, dob: app.client.dob,
        gender: app.client.gender, nationality: app.client.nationality, occupation: app.client.occupation,
      });
      const res = await api.getClient(app.id, agent());
      expect(res.body?.data?.first_name).toBe(app.client.firstName);
    });
    await test.step('address and contact data are restored', async () => {
      const address = new AddressContactPage(page);
      await address.goto(app.id);
      await expect(address.resLine1).toHaveValue(app.address.line1);
      await expect(address.email).toHaveValue(app.address.email);
      await expect(address.preferredMode).toHaveValue(app.address.preferredMode);
    });
  });

  test(name('TC-WF-003', 'a valid application can be submitted end to end'), meta('TC-WF-003'), async ({ page, api }) => {
    test.setTimeout(240_000);
    for (const flow of FLOWS) {
      await test.step(flow.label, async () => {
        const dashboard = new DashboardPage(page);
        await dashboard.goto();
        const id = await dashboard.startNewApplication();

        await new ClientInformationPage(page).fillAndSave(clientData({ dob: dobForAge(flow.clientAge) }));
        await new AddressContactPage(page).fillAndSave(addressData());
        await new KycFinancialPage(page).fillAndSave(kycData());
        await new ProductConfigurationPage(page).fillAndSave(productData(flow.product));

        const riders = new RiderSelectionPage(page);
        for (const r of flow.riders) await riders.select(r.key, r.coverage);
        await riders.saveAndExpectNext();

        const ben = new BeneficiaryPage(page);
        for (const [i, b] of flow.beneficiaries.entries()) await ben.addAndExpectRow(b, i + 1);
        await ben.continueLink.click();
        await expect(page).toHaveURL(/\/documents/);

        const docs = new DocumentUploadPage(page);
        await docs.upload('KYC_ID', makeFile('pdf', `kyc-${id}.pdf`));
        await docs.expectNoErrors();
        await docs.continueToReview();

        const reference = await submitViaReview(page, id);
        expect(reference, 'generated reference number').toMatch(REFERENCE_NUMBER);

        const status = new ApplicationStatusPage(page);
        await status.goto(id);
        expect(await status.currentStatus()).toBe('SUBMITTED');
        expect(await status.referenceNumber()).toBe(reference);

        await dashboard.goto();
        expect(await dashboard.statusOf(id)).toBe('SUBMITTED');

        const apiStatus = await api.status(id, agent());
        expectApiSuccess(apiStatus);
        expect(apiStatus.body.data.application_status).toBe('SUBMITTED');
        expect(apiStatus.body.data.application_reference_number).toBe(reference);
      });
    }
  });

  test(name('TC-WF-004', 'submitted application is read-only'), meta('TC-WF-004'), async ({ otherAgent, api }, testInfo) => {
    const list = (await api.listApplications(emailOf('submitted'), 'SUBMITTED')).body?.data ?? [];
    const seeded = list.find((a: { application_reference_number: string }) => a.application_reference_number === SEEDED.submittedReference);
    test.skip(!seeded, `Seeded submitted application ${SEEDED.submittedReference} not found for agent.submitted`);
    const id: number = seeded.id;

    const page = await otherAgent('submitted');
    for (const step of ['client', 'address-contact', 'product']) {
      await test.step(`/${step} cannot be edited`, async () => {
        await page.goto(`/applications/${id}/${step}`);
        if (!new RegExp(`/${step}`).test(page.url())) {
          testInfo.annotations.push({ type: 'observation', description: `/${step} redirected to ${new URL(page.url()).pathname}` });
          return; // redirected away = not editable
        }
        const editableInputs = await page.locator('form input:not([type=hidden]):not([disabled]):not([readonly]), form select:not([disabled]), form textarea:not([disabled]):not([readonly])').count();
        const saveVisible = await page.locator('form button[data-testid$="save-continue-button"]:not([disabled])').count();
        expect(editableInputs + saveVisible, `${step} page offers no way to edit a submitted application`).toBe(0);
      });
    }
    await test.step('API refuses to change a submitted application (re-sends the identical, current data)', async () => {
      const current = (await api.getClient(id, emailOf('submitted'))).body?.data;
      const res = await api.saveClient(id, emailOf('submitted'), {
        first_name: current.first_name, middle_name: current.middle_name, last_name: current.last_name,
        date_of_birth: String(current.date_of_birth).slice(0, 10), gender: current.gender, marital_status: current.marital_status,
        nationality: current.nationality, occupation: current.occupation, employer_name: current.employer_name, employer_address: current.employer_address,
      });
      expect(res.status, `editing a SUBMITTED application must not succeed (got ${res.status})`).toBeGreaterThanOrEqual(400);
    });
  });

  test(name('TC-WF-005', 'confirmation page appears after submission'), meta('TC-WF-005'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent() });
    const reference = await submitViaReview(page, app.id);
    const confirmation = new ConfirmationPage(page);
    await expect(confirmation.dashboardLink).toBeVisible();
    await expect(confirmation.viewStatusLink).toBeVisible();
    expect(reference).toMatch(REFERENCE_NUMBER);
    const text = await page.getByTestId('submission-confirmation-page').innerText();
    testInfo.annotations.push({
      type: 'observation',
      description: /e-?mail|sent/i.test(text) ? 'Confirmation mentions an email/sent message.' : 'No confirmation-email simulation text on the page.',
    });
  });

  test(name('TC-WF-006', 'dashboard status updates after submission'), meta('TC-WF-006'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent() });
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    expect(await dashboard.statusOf(app.id)).toBe('DRAFT');
    const draftBefore = await dashboard.summaryCount('draft');
    const submittedBefore = await dashboard.summaryCount('submitted');

    await submitViaReview(page, app.id);
    await dashboard.goto();
    expect(await dashboard.statusOf(app.id)).toBe('SUBMITTED');
    expect(await dashboard.summaryCount('draft'), 'draft counter decreases by one').toBe(draftBefore - 1);
    expect(await dashboard.summaryCount('submitted'), 'submitted counter increases by one').toBe(submittedBefore + 1);
  });

  test(name('TC-WF-007', 'status page matches the status API'), meta('TC-WF-007'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent() });
    expectApiSuccess(await api.submit(app.id, agent()));
    const apiStatus = (await api.status(app.id, agent())).body.data;

    const status = new ApplicationStatusPage(page);
    await status.goto(app.id);
    expect(await status.currentStatus(), 'current status').toBe(apiStatus.application_status);
    expect(await status.referenceNumber(), 'reference number').toBe(apiStatus.application_reference_number);
    await expect(status.historyRows(), 'history rows equal API history entries').toHaveCount(apiStatus.status_history.length);
  });
});

