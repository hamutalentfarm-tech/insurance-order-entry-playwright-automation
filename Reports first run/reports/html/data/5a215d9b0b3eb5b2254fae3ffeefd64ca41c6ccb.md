# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beneficiaries\beneficiaries.spec.ts >> Beneficiary management >> TC-BEN-001 | BEN-V01 | add a valid primary beneficiary (and irrevocable confirmation)
- Location: tests\beneficiaries\beneficiaries.spec.ts:29:7

# Error details

```
Error: Setup step "create draft" failed: HTTP 419 {
    "message": "CSRF token mismatch.",
    "exception": "Symfony\\Component\\HttpKernel\\Exception\\HttpException",
    "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Exceptions\\Handler.php",
    "line": 673,
    "trace": [
        {
            "file": "C:\\qa-lab\\apps\\insurance-order-entry-demo\\vendor\\laravel\\framework\\src
```

# Test source

```ts
  1   | import { expect } from '@playwright/test';
  2   | import type { ApiClient, ApiResult } from './apiClient';
  3   | import {
  4   |   addressData, beneficiary, clientData, kycData, productData,
  5   |   type AddressData, type BeneficiaryData, type ClientData, type KycData, type ProductData,
  6   | } from '../fixtures/applicationData';
  7   | import { RIDERS } from '../fixtures/referenceData';
  8   | import { makeFile } from './fileUploadHelper';
  9   | 
  10  | export type Stage = 'draft' | 'client' | 'address' | 'kyc' | 'product' | 'riders' | 'beneficiaries' | 'documents';
  11  | const ORDER: Stage[] = ['draft', 'client', 'address', 'kyc', 'product', 'riders', 'beneficiaries', 'documents'];
  12  | 
  13  | export interface RiderChoice {
  14  |   key: keyof typeof RIDERS;
  15  |   coverage?: number;
  16  | }
  17  | 
  18  | export interface BuildOptions {
  19  |   agentEmail: string;
  20  |   /** Last stage to complete. Default: everything up to and including documents (submittable). */
  21  |   upTo?: Stage;
  22  |   client?: Partial<ClientData>;
  23  |   address?: Partial<AddressData>;
  24  |   kyc?: Partial<KycData>;
  25  |   product?: Partial<ProductData>;
  26  |   riders?: RiderChoice[];
  27  |   beneficiaries?: BeneficiaryData[];
  28  |   /** Upload a KYC_ID PDF when reaching the documents stage (default true). */
  29  |   withDocument?: boolean;
  30  | }
  31  | 
  32  | export interface BuiltApplication {
  33  |   id: number;
  34  |   client: ClientData;
  35  |   address: AddressData;
  36  |   kyc: KycData;
  37  |   product: ProductData;
  38  |   riders: RiderChoice[];
  39  |   beneficiaries: BeneficiaryData[];
  40  | }
  41  | 
  42  | function must(res: ApiResult, stage: string, ok: number[] = [200, 201]): ApiResult {
  43  |   if (!ok.includes(res.status)) {
> 44  |     throw new Error(`Setup step "${stage}" failed: HTTP ${res.status} ${res.text.slice(0, 400)}`);
      |           ^ Error: Setup step "create draft" failed: HTTP 419 {
  45  |   }
  46  |   return res;
  47  | }
  48  | 
  49  | // ---- UI-shaped data -> API payloads -------------------------------------------------------------
  50  | export const toApiClient = (c: ClientData) => ({
  51  |   first_name: c.firstName, middle_name: c.middleName ?? null, last_name: c.lastName, date_of_birth: c.dob, gender: c.gender,
  52  |   marital_status: c.maritalStatus, nationality: c.nationality, occupation: c.occupation,
  53  |   employer_name: c.employerName, employer_address: c.employerAddress,
  54  | });
  55  | 
  56  | export const toApiAddress = (a: AddressData) => ({
  57  |   residential: { address_line_1: a.line1, address_line_2: a.line2 ?? null, city: a.city, state_province: a.state, postal_code: a.postalCode, country: 'US' },
  58  |   same_as_residential: a.sameAsResidential,
  59  |   mailing: a.sameAsResidential || !a.mailing ? null
  60  |     : { address_line_1: a.mailing.line1, address_line_2: a.mailing.line2 ?? null, city: a.mailing.city, state_province: a.mailing.state, postal_code: a.mailing.postalCode, country: 'US' },
  61  |   primary_email: a.email, mobile_number: a.mobile, alternate_phone_number: a.alternatePhone ?? null, preferred_communication_mode: a.preferredMode,
  62  | });
  63  | 
  64  | export const toApiKyc = (k: KycData) => ({
  65  |   id_type: k.idType, id_number: k.idNumber, issue_date: k.issueDate ?? null, expiry_date: k.expiryDate ?? null,
  66  |   annual_income: k.annualIncome, net_worth: k.netWorth, source_of_funds: k.sourceOfFunds, risk_profile: k.riskProfile,
  67  |   is_pep: k.isPep, pep_details: k.pepDetails ?? null, declaration_completed: k.declaration,
  68  | });
  69  | 
  70  | export const toApiBeneficiary = (b: BeneficiaryData) => ({
  71  |   beneficiary_level: b.level, beneficiary_type: b.type, relationship: b.relationship, allocation_percentage: b.allocation,
  72  |   first_name: b.firstName ?? null, last_name: b.lastName ?? null, date_of_birth: b.dob ?? null, gender: b.gender ?? null,
  73  |   trust_name: b.trustName ?? null, trustee_name: b.trusteeName ?? null, trust_date: b.trustDate ?? null,
  74  |   organization_name: b.organizationName ?? null, organization_registration_number: b.organizationRegistration ?? null,
  75  |   organization_contact: b.organizationContact ?? null,
  76  |   guardian_name: b.guardian?.name ?? null, guardian_relationship: b.guardian?.relationship ?? null,
  77  |   guardian_contact: b.guardian?.contact ?? null, guardian_address: b.guardian?.address ?? null,
  78  |   legal_acknowledgement: b.legalAcknowledgement ? 1 : null,
  79  |   is_irrevocable: b.irrevocable ? 1 : 0, irrevocable_confirmation: b.irrevocable ? 1 : 0,
  80  | });
  81  | 
  82  | /** Creates and fills an application through the API (fast set-up for UI tests). All steps must succeed. */
  83  | export async function buildApplication(api: ApiClient, opts: BuildOptions): Promise<BuiltApplication> {
  84  |   const upTo = ORDER.indexOf(opts.upTo ?? 'documents');
  85  |   const reached = (s: Stage): boolean => ORDER.indexOf(s) <= upTo;
  86  |   const agent = opts.agentEmail;
  87  | 
  88  |   const client = clientData(opts.client);
  89  |   const address = addressData(opts.address);
  90  |   const kyc = kycData(opts.kyc);
  91  |   const product = productData(opts.product);
  92  |   const riders: RiderChoice[] = opts.riders ?? [];
  93  |   const beneficiaries = opts.beneficiaries ?? [beneficiary()];
  94  | 
  95  |   const created = must(await api.createApplication(agent), 'create draft');
  96  |   const id = Number(created.body?.data?.id);
  97  |   expect(id, 'new application id').toBeGreaterThan(0);
  98  | 
  99  |   if (reached('client')) must(await api.saveClient(id, agent, toApiClient(client)), 'client');
  100 |   if (reached('address')) must(await api.saveAddress(id, agent, toApiAddress(address)), 'address and contact');
  101 |   if (reached('kyc')) must(await api.saveKyc(id, agent, toApiKyc(kyc)), 'kyc and financial');
  102 |   if (reached('product')) {
  103 |     must(
  104 |       await api.saveProduct(id, agent, {
  105 |         insurance_product_id: await api.productId(product.productCode),
  106 |         face_value: product.faceValue, premium_frequency: product.frequency,
  107 |         payment_term_years: product.paymentTerm, policy_term: product.policyTerm,
  108 |       }),
  109 |       'product',
  110 |     );
  111 |   }
  112 |   if (reached('riders')) {
  113 |     const payload = [];
  114 |     for (const r of riders) {
  115 |       payload.push({ rider_id: await api.riderId(RIDERS[r.key].code), coverage_amount: r.coverage ?? product.faceValue });
  116 |     }
  117 |     must(await api.saveRiders(id, agent, payload), 'riders');
  118 |   }
  119 |   if (reached('beneficiaries')) {
  120 |     for (const b of beneficiaries) must(await api.addBeneficiary(id, agent, toApiBeneficiary(b)), 'beneficiary');
  121 |   }
  122 |   if (reached('documents') && opts.withDocument !== false) {
  123 |     const f = makeFile('pdf', `kyc-${id}.pdf`);
  124 |     must(await api.uploadDocument(id, agent, { type: 'KYC_ID', name: f.name, mimeType: f.mimeType, buffer: f.buffer }), 'document');
  125 |   }
  126 |   return { id, client, address, kyc, product, riders, beneficiaries };
  127 | }
  128 | 
```