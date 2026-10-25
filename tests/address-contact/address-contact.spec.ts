import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { addressData } from '../../fixtures/applicationData';
import { AddressContactPage } from '../../pages/AddressContactPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { MSG } from '../../utils/messages';
import { isNativelyInvalid, optionValues } from '../../utils/testHelpers';
import { name, meta } from '../../utils/testMeta';

test.use(asRole('learner'));

/** Set-up through the API: a draft that already has client data, so the UI starts at the address step. */
async function draftWithClient(api: Parameters<typeof buildApplication>[0]): Promise<number> {
  return (await buildApplication(api, { agentEmail: emailOf('learner'), upTo: 'client' })).id;
}

test.describe('Address and contact information', () => {
  test(name('TC-ADR-001', 'same-as-residential copies the address to mailing'), meta('TC-ADR-001'), async ({ page, api }, testInfo) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);
    await address.goto(id);
    await address.fillResidential({ line1: '10 Main St', city: 'New York', state: 'NY', postalCode: '10001' });

    await test.step('ticking the box copies residential data into mailing', async () => {
      await address.setSameAsResidential(true);
      expect(await address.mailingValues()).toEqual(await address.residentialValues());
    });

    await test.step('editing residential afterwards (observation: does mailing follow?)', async () => {
      await address.resLine1.fill('99 Changed Ave');
      const mailing = await address.mailingValues();
      testInfo.annotations.push({
        type: 'observation',
        description: `After editing residential with the box ticked, mailing line 1 = "${mailing.line1}"`,
      });
    });

    await test.step('unticking makes the mailing address editable again', async () => {
      await address.setSameAsResidential(false);
      await expect(address.mailLine1).toBeEnabled();
      await address.setSameAsResidential(true);
    });

    await test.step('saved result: mailing equals residential after reload', async () => {
      await address.resLine1.fill('10 Main St');
      await address.fillContact(addressData());
      await address.save();
      await expect(page).toHaveURL(/kyc-financial/);
      await address.goto(id);
      expect(await address.mailingValues()).toEqual(await address.residentialValues());
    });
  });

  test(name('TC-ADR-002', 'invalid email formats are rejected'), meta('TC-ADR-002'), async ({ page, api }, testInfo) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);
    const invalid = ['abc', 'a@@b.com', 'a b@c.com', '@example.com', 'user@'];

    for (const email of invalid) {
      await test.step(`rejects "${email}"`, async () => {
        await address.goto(id);
        await address.fill(addressData({ email }));
        await address.save({ ignoreBrowserValidation: true });
        await expect(page).toHaveURL(/address-contact/);
        expect((await address.errorMessages()).join(' ')).toMatch(MSG.email);
      });
    }

    await test.step('observation: "a@b" (no domain dot) is valid under RFC rules', async () => {
      await address.goto(id);
      await address.fill(addressData({ email: 'a@b' }));
      await address.save({ ignoreBrowserValidation: true });
      const accepted = /kyc-financial/.test(page.url());
      testInfo.annotations.push({ type: 'observation', description: `Email "a@b" accepted by the server: ${accepted}` });
    });

    await test.step('a valid email is accepted', async () => {
      await address.goto(id);
      await address.fill(addressData({ email: 'qa.user@example.com' }));
      await address.save();
      await expect(page).toHaveURL(/kyc-financial/);
    });
  });

  test(name('TC-ADR-003', 'invalid US phone formats are rejected'), meta('TC-ADR-003'), async ({ page, api }) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);
    const invalid = ['123', '(055) 123-4567', '+44 20 7946 0958', '555-0100'];

    for (const phone of invalid) {
      await test.step(`mobile "${phone}" is rejected`, async () => {
        await address.goto(id);
        await address.fill(addressData({ mobile: phone }));
        await address.save({ ignoreBrowserValidation: true });
        await expect(page).toHaveURL(/address-contact/);
        await address.expectErrorMatching(MSG.phone);
      });
    }
    await test.step('alternate phone is validated the same way', async () => {
      await address.goto(id);
      await address.fill(addressData({ alternatePhone: '123' }));
      await address.save({ ignoreBrowserValidation: true });
      await expect(page).toHaveURL(/address-contact/);
      await address.expectErrorMatching(MSG.phone);
    });
    for (const phone of ['(212) 555-0147', '+1 212-555-0147', '2125550147']) {
      await test.step(`mobile "${phone}" is accepted`, async () => {
        await address.goto(id);
        await address.fill(addressData({ mobile: phone }));
        await address.save();
        await expect(page).toHaveURL(/kyc-financial/);
      });
    }
  });

  test(name('TC-ADR-004', 'ZIP code and state are validated'), meta('TC-ADR-004'), async ({ page, api }) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);

    for (const postalCode of ['1234', '123456', 'ABCDE', '12345-12']) {
      await test.step(`rejects ZIP ${postalCode}`, async () => {
        await address.goto(id);
        await address.fill(addressData({ postalCode }));
        await address.save({ ignoreBrowserValidation: true });
        await expect(page).toHaveURL(/address-contact/);
        await address.expectErrorMatching(MSG.zip);
      });
    }
    for (const postalCode of ['10001', '10001-1234']) {
      await test.step(`accepts ZIP ${postalCode}`, async () => {
        await address.goto(id);
        await address.fill(addressData({ postalCode }));
        await address.save();
        await expect(page).toHaveURL(/kyc-financial/);
      });
    }
    await test.step('state list is the 50 states plus DC only', async () => {
      await address.goto(id);
      const states = (await optionValues(address.resState)).filter(Boolean);
      expect(states).toContain('NY');
      expect(states).toContain('DC');
      expect(states).not.toContain('ZZ');
      expect(states.length).toBe(51);
    });
  });

  test(name('TC-ADR-005', 'mailing address is required when not same as residential'), meta('TC-ADR-005'), async ({ page, api }) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);
    await address.goto(id);
    await address.fill(addressData({ sameAsResidential: false, mailing: undefined }));
    await address.setSameAsResidential(false);
    await address.save({ ignoreBrowserValidation: true });
    await expect(page).toHaveURL(/address-contact/);
    expect((await address.errorMessages()).length, 'validation message for the blank mailing address').toBeGreaterThan(0);
  });

  test(name('TC-ADR-006', 'preferred communication mode is required'), meta('TC-ADR-006'), async ({ page, api }, testInfo) => {
    const id = await draftWithClient(api);
    const address = new AddressContactPage(page);

    await test.step('blank mode is rejected (when the dropdown allows a blank choice)', async () => {
      await address.goto(id);
      await address.fill(addressData());
      const hasBlank = await address.preferredMode.locator('option[value=""]').count();
      if (!hasBlank) {
        testInfo.annotations.push({ type: 'observation', description: 'Preferred mode dropdown has no blank option; "not selected" cannot occur in the UI.' });
        return;
      }
      await address.preferredMode.selectOption('');
      expect(await isNativelyInvalid(address.preferredMode)).toBe(true);
      await address.save({ ignoreBrowserValidation: true });
      await expect(page).toHaveURL(/address-contact/);
      expect((await address.errorMessages()).length).toBeGreaterThan(0);
    });

    for (const mode of ['EMAIL', 'PHONE', 'MAIL'] as const) {
      await test.step(`${mode} is accepted`, async () => {
        await address.goto(id);
        await address.fill(addressData({ preferredMode: mode }));
        await address.save();
        await expect(page).toHaveURL(/kyc-financial/);
      });
    }
  });
});
