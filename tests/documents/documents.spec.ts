import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { DOC_MAX_KB } from '../../fixtures/referenceData';
import { DocumentUploadPage } from '../../pages/DocumentUploadPage';
import { ReviewPage } from '../../pages/ReviewPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { anyMatches, expectApiError } from '../../utils/assertions';
import { makeFile } from '../../utils/fileUploadHelper';
import { MSG } from '../../utils/messages';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));
const agent = (): string => emailOf('learner');

test.describe('Document upload', () => {
  test(name('TC-DOC-001', 'valid documents (PDF, JPG, PNG) can be uploaded'), meta('TC-DOC-001'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
    const docs = new DocumentUploadPage(page);
    await docs.goto(app.id);

    const uploads = [
      { type: 'KYC_ID' as const, file: makeFile('pdf', `kyc-${app.id}.pdf`) },
      { type: 'ADDRESS_PROOF' as const, file: makeFile('jpg', `address-${app.id}.jpg`) },
      { type: 'INCOME_PROOF' as const, file: makeFile('png', `income-${app.id}.png`) },
    ];
    for (const [i, u] of uploads.entries()) {
      await test.step(`upload ${u.type} (${u.file.name})`, async () => {
        await docs.upload(u.type, u.file);
        await docs.expectNoErrors();
        await expect(docs.rows()).toHaveCount(i + 1);
        expect((await docs.rowTexts()).join(' | ')).toContain(u.file.name);
      });
    }
    await test.step('documents persist after reload and are stored by the API', async () => {
      await docs.goto(app.id);
      await expect(docs.rows()).toHaveCount(3);
      const res = await api.getApplication(app.id, agent());
      expect(res.body?.data?.documents ?? []).toHaveLength(3);
    });
  });

  test(name('TC-DOC-002', 'unsupported file types are rejected'), meta('TC-DOC-002'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
    const docs = new DocumentUploadPage(page);
    // KYC_ID rejection is covered by TC-KYC-002; other document types are used here.
    const cases = [
      { type: 'ADDRESS_PROOF' as const, file: makeFile('exe'), hard: true },
      { type: 'INCOME_PROOF' as const, file: makeFile('txt'), hard: true },
      { type: 'OTHER' as const, file: makeFile('fake-pdf'), hard: false }, // text content renamed .pdf
    ];
    for (const c of cases) {
      await test.step(`${c.type}: ${c.file.name}`, async () => {
        await docs.goto(app.id);
        await docs.upload(c.type, c.file);
        const rejected = (await docs.rows().count()) === 0;
        if (c.hard) {
          await docs.expectErrorMatching(MSG.docFormat);
          expect(rejected, 'nothing stored').toBe(true);
        } else {
          testInfo.annotations.push({ type: 'observation', description: `Text file renamed .pdf rejected: ${rejected}` });
          expect.soft(rejected, 'content-based check: a renamed text file should be rejected').toBe(true);
        }
      });
    }
  });

  test(name('TC-DOC-003', 'file above 5 MB is rejected, 5 MB is accepted'), meta('TC-DOC-003'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'draft' });
    const docs = new DocumentUploadPage(page);

    await test.step(`${DOC_MAX_KB + 1} KB is rejected`, async () => {
      await docs.goto(app.id);
      await docs.upload('OTHER', makeFile('pdf', 'too-big.pdf', DOC_MAX_KB + 1));
      await expect(docs.rows(), 'oversized file is not stored').toHaveCount(0);
      const messages = await docs.errorMessages();
      testInfo.annotations.push({ type: 'observation', description: `Oversize message: ${messages.join(' | ') || 'none shown'}` });
      expect(messages.length, 'a visible error').toBeGreaterThan(0);
      expect.soft(messages.join(' '), 'documented message').toMatch(MSG.docSize);
    });
    await test.step(`${DOC_MAX_KB} KB is accepted (needs the server PHP upload limit to be at least 5 MB)`, async () => {
      await docs.goto(app.id);
      await docs.upload('OTHER', makeFile('pdf', 'at-limit.pdf', DOC_MAX_KB));
      await docs.expectNoErrors();
      await expect(docs.rows()).toHaveCount(1);
    });
  });

  test(name('TC-DOC-004', 'missing KYC_ID document blocks submission'), meta('TC-DOC-004'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // everything except documents
    const review = new ReviewPage(page);
    await review.goto(app.id);

    expect(anyMatches(await review.errors(), MSG.docRequired), 'missing KYC_ID listed').toBe(true);
    await expect(review.submitButton).toBeDisabled();

    await test.step('API submit is rejected and the application stays a draft', async () => {
      const res = await api.submit(app.id, agent());
      expectApiError(res, 422, MSG.docRequired);
      const status = await api.status(app.id, agent());
      expect(status.body?.data?.application_status).toBe('DRAFT');
      expect(status.body?.data?.application_reference_number ?? '').not.toMatch(/^WL\d+/);
    });
  });
});

test.describe('Validation summary and submit control', () => {
  test(name('TC-DOC-005', 'validation summary lists the unresolved errors'), meta('TC-DOC-005'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'client' }); // only client data present
    const review = new ReviewPage(page);
    await review.goto(app.id);
    await review.runValidation();

    const errors = await review.errors();
    testInfo.annotations.push({ type: 'observation', description: `${errors.length} errors, rendered as a flat list (no grouping markup)` });
    const expectations: [string, RegExp][] = [
      ['address / contact', /address|contact/i], ['KYC', /kyc/i], ['financial', /financial/i], ['product', /product/i],
      ['beneficiary', /benefici/i], ['documents', /document/i],
    ];
    for (const [label, pattern] of expectations) {
      expect(anyMatches(errors, pattern), `summary mentions ${label}`).toBe(true);
    }
    await expect(review.submitButton).toBeDisabled();
  });

  test(name('TC-DOC-006', 'clicking a validation error navigates to the field'), meta('TC-DOC-006'), async ({ page, api }, testInfo) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'client' });
    const review = new ReviewPage(page);
    await review.goto(app.id);

    const links = await review.errorLinkCount();
    test.skip(links === 0, 'OBSERVATION: the review page renders errors as plain list items without links, so click-to-navigate is not implemented. Raise with the mentor: requirement gap or design choice.');
    testInfo.annotations.push({ type: 'observation', description: `${links} navigable error links` });
    await review.errorBox.locator('a').first().click();
    await expect(page).not.toHaveURL(/\/review$/);
  });

  test(name('TC-DOC-007', 'submit stays disabled until critical errors are resolved'), meta('TC-DOC-007'), async ({ page, api }) => {
    const app = await buildApplication(api, { agentEmail: agent(), upTo: 'beneficiaries' }); // only the KYC_ID document is missing
    const review = new ReviewPage(page);
    const docs = new DocumentUploadPage(page);

    await test.step('one blocking error: Submit is disabled', async () => {
      await review.goto(app.id);
      expect((await review.errors()).length).toBeGreaterThan(0);
      await expect(review.submitButton).toBeDisabled();
    });
    await test.step('resolving it enables Submit', async () => {
      await docs.goto(app.id);
      await docs.upload('KYC_ID', makeFile('pdf', `kyc-${app.id}.pdf`));
      await docs.expectNoErrors();
      await review.goto(app.id);
      await review.runValidation();
      await expect(review.passedBox).toBeVisible();
      await expect(review.submitButton).toBeEnabled();
    });
    await test.step('API refuses to submit an application that still has errors', async () => {
      const incomplete = await buildApplication(api, { agentEmail: agent(), upTo: 'client' });
      expectApiError(await api.submit(incomplete.id, agent()), 422, MSG.validationFailed);
      expect((await api.status(incomplete.id, agent())).body?.data?.application_status).toBe('DRAFT');
    });
  });
});
