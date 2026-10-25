import { expect } from '@playwright/test';
import type { ApiClient, ApiResult } from './apiClient';
import {
  addressData, beneficiary, clientData, kycData, productData,
  type AddressData, type BeneficiaryData, type ClientData, type KycData, type ProductData,
} from '../fixtures/applicationData';
import { RIDERS } from '../fixtures/referenceData';
import { makeFile } from './fileUploadHelper';

export type Stage = 'draft' | 'client' | 'address' | 'kyc' | 'product' | 'riders' | 'beneficiaries' | 'documents';
const ORDER: Stage[] = ['draft', 'client', 'address', 'kyc', 'product', 'riders', 'beneficiaries', 'documents'];

export interface RiderChoice {
  key: keyof typeof RIDERS;
  coverage?: number;
}

export interface BuildOptions {
  agentEmail: string;
  /** Last stage to complete. Default: everything up to and including documents (submittable). */
  upTo?: Stage;
  client?: Partial<ClientData>;
  address?: Partial<AddressData>;
  kyc?: Partial<KycData>;
  product?: Partial<ProductData>;
  riders?: RiderChoice[];
  beneficiaries?: BeneficiaryData[];
  /** Upload a KYC_ID PDF when reaching the documents stage (default true). */
  withDocument?: boolean;
}

export interface BuiltApplication {
  id: number;
  client: ClientData;
  address: AddressData;
  kyc: KycData;
  product: ProductData;
  riders: RiderChoice[];
  beneficiaries: BeneficiaryData[];
}

function must(res: ApiResult, stage: string, ok: number[] = [200, 201]): ApiResult {
  if (!ok.includes(res.status)) {
    throw new Error(`Setup step "${stage}" failed: HTTP ${res.status} ${res.text.slice(0, 400)}`);
  }
  return res;
}

// ---- UI-shaped data -> API payloads -------------------------------------------------------------
export const toApiClient = (c: ClientData) => ({
  first_name: c.firstName, middle_name: c.middleName ?? null, last_name: c.lastName, date_of_birth: c.dob, gender: c.gender,
  marital_status: c.maritalStatus, nationality: c.nationality, occupation: c.occupation,
  employer_name: c.employerName, employer_address: c.employerAddress,
});

export const toApiAddress = (a: AddressData) => ({
  residential: { address_line_1: a.line1, address_line_2: a.line2 ?? null, city: a.city, state_province: a.state, postal_code: a.postalCode, country: 'US' },
  same_as_residential: a.sameAsResidential,
  mailing: a.sameAsResidential || !a.mailing ? null
    : { address_line_1: a.mailing.line1, address_line_2: a.mailing.line2 ?? null, city: a.mailing.city, state_province: a.mailing.state, postal_code: a.mailing.postalCode, country: 'US' },
  primary_email: a.email, mobile_number: a.mobile, alternate_phone_number: a.alternatePhone ?? null, preferred_communication_mode: a.preferredMode,
});

export const toApiKyc = (k: KycData) => ({
  id_type: k.idType, id_number: k.idNumber, issue_date: k.issueDate ?? null, expiry_date: k.expiryDate ?? null,
  annual_income: k.annualIncome, net_worth: k.netWorth, source_of_funds: k.sourceOfFunds, risk_profile: k.riskProfile,
  is_pep: k.isPep, pep_details: k.pepDetails ?? null, declaration_completed: k.declaration,
});

export const toApiBeneficiary = (b: BeneficiaryData) => ({
  beneficiary_level: b.level, beneficiary_type: b.type, relationship: b.relationship, allocation_percentage: b.allocation,
  first_name: b.firstName ?? null, last_name: b.lastName ?? null, date_of_birth: b.dob ?? null, gender: b.gender ?? null,
  trust_name: b.trustName ?? null, trustee_name: b.trusteeName ?? null, trust_date: b.trustDate ?? null,
  organization_name: b.organizationName ?? null, organization_registration_number: b.organizationRegistration ?? null,
  organization_contact: b.organizationContact ?? null,
  guardian_name: b.guardian?.name ?? null, guardian_relationship: b.guardian?.relationship ?? null,
  guardian_contact: b.guardian?.contact ?? null, guardian_address: b.guardian?.address ?? null,
  legal_acknowledgement: b.legalAcknowledgement ? 1 : null,
  is_irrevocable: b.irrevocable ? 1 : 0, irrevocable_confirmation: b.irrevocable ? 1 : 0,
});

/** Creates and fills an application through the API (fast set-up for UI tests). All steps must succeed. */
export async function buildApplication(api: ApiClient, opts: BuildOptions): Promise<BuiltApplication> {
  const upTo = ORDER.indexOf(opts.upTo ?? 'documents');
  const reached = (s: Stage): boolean => ORDER.indexOf(s) <= upTo;
  const agent = opts.agentEmail;

  const client = clientData(opts.client);
  const address = addressData(opts.address);
  const kyc = kycData(opts.kyc);
  const product = productData(opts.product);
  const riders: RiderChoice[] = opts.riders ?? [];
  const beneficiaries = opts.beneficiaries ?? [beneficiary()];

  const created = must(await api.createApplication(agent), 'create draft');
  const id = Number(created.body?.data?.id);
  expect(id, 'new application id').toBeGreaterThan(0);

  if (reached('client')) must(await api.saveClient(id, agent, toApiClient(client)), 'client');
  if (reached('address')) must(await api.saveAddress(id, agent, toApiAddress(address)), 'address and contact');
  if (reached('kyc')) must(await api.saveKyc(id, agent, toApiKyc(kyc)), 'kyc and financial');
  if (reached('product')) {
    must(
      await api.saveProduct(id, agent, {
        insurance_product_id: await api.productId(product.productCode),
        face_value: product.faceValue, premium_frequency: product.frequency,
        payment_term_years: product.paymentTerm, policy_term: product.policyTerm,
      }),
      'product',
    );
  }
  if (reached('riders')) {
    const payload = [];
    for (const r of riders) {
      payload.push({ rider_id: await api.riderId(RIDERS[r.key].code), coverage_amount: r.coverage ?? product.faceValue });
    }
    must(await api.saveRiders(id, agent, payload), 'riders');
  }
  if (reached('beneficiaries')) {
    for (const b of beneficiaries) must(await api.addBeneficiary(id, agent, toApiBeneficiary(b)), 'beneficiary');
  }
  if (reached('documents') && opts.withDocument !== false) {
    const f = makeFile('pdf', `kyc-${id}.pdf`);
    must(await api.uploadDocument(id, agent, { type: 'KYC_ID', name: f.name, mimeType: f.mimeType, buffer: f.buffer }), 'document');
  }
  return { id, client, address, kyc, product, riders, beneficiaries };
}
