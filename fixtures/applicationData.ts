import { alphaId, capitalised, dobForAge, uniqueEmail, uniqueFirstName } from '../utils/dataGenerator';
import { DEFAULT_PRODUCT, type Frequency, type PolicyTerm } from './referenceData';

export interface ClientData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  nationality: string;
  occupation: string;
  employerName: string;
  employerAddress: string;
}

export const MANDATORY_CLIENT_FIELDS = [
  'firstName', 'lastName', 'dob', 'gender', 'maritalStatus', 'nationality', 'occupation', 'employerName', 'employerAddress',
] as const;

export function clientData(overrides: Partial<ClientData> = {}): ClientData {
  return {
    firstName: uniqueFirstName(),
    lastName: capitalised(alphaId(7)),
    dob: dobForAge(40),
    gender: 'MALE',
    maritalStatus: 'SINGLE',
    nationality: 'United States',
    occupation: 'Software Engineer',
    employerName: 'Acme Corporation',
    employerAddress: '1 Corporate Way, New York, NY 10001',
    ...overrides,
  };
}

export interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  sameAsResidential: boolean;
  mailing?: { line1: string; line2?: string; city: string; state: string; postalCode: string };
  email: string;
  mobile: string;
  alternatePhone?: string;
  preferredMode: 'EMAIL' | 'PHONE' | 'MAIL';
}

export function addressData(overrides: Partial<AddressData> = {}): AddressData {
  return {
    line1: '10 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    sameAsResidential: true,
    email: uniqueEmail(),
    mobile: '(212) 555-0147',
    preferredMode: 'EMAIL',
    ...overrides,
  };
}

export interface KycData {
  idType: 'SSN' | 'STATE_ID' | 'PASSPORT' | 'DRIVERS_LICENSE';
  idNumber: string;
  issueDate?: string;
  expiryDate?: string;
  annualIncome: number;
  netWorth: number;
  sourceOfFunds: 'SALARY' | 'BUSINESS' | 'INVESTMENTS' | 'INHERITANCE';
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  isPep: boolean;
  pepDetails?: string;
  declaration: boolean;
}

/** Fake SSN (not a real person). Change it only if the application's format rules reject it. */
export const FAKE_SSN = '123-45-6789';

export function kycData(overrides: Partial<KycData> = {}): KycData {
  return {
    idType: 'SSN',
    idNumber: FAKE_SSN,
    annualIncome: 50_000,
    netWorth: 200_000,
    sourceOfFunds: 'SALARY',
    riskProfile: 'MODERATE',
    isPep: false,
    declaration: true,
    ...overrides,
  };
}

export interface ProductData {
  productCode: string;
  faceValue: number;
  frequency: Frequency;
  paymentTerm: number;
  policyTerm: PolicyTerm;
}

export function productData(overrides: Partial<ProductData> = {}): ProductData {
  return {
    productCode: DEFAULT_PRODUCT.code,
    faceValue: 250_000,
    frequency: 'MONTHLY',
    paymentTerm: 20,
    policyTerm: 'WHOLE_LIFE',
    ...overrides,
  };
}

export interface BeneficiaryData {
  level: 'PRIMARY' | 'SECONDARY';
  type: 'INDIVIDUAL' | 'TRUST' | 'ORGANIZATION';
  relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'TRUST' | 'ORGANIZATION' | 'OTHER';
  allocation: number;
  irrevocable?: boolean;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY';
  trustName?: string;
  trusteeName?: string;
  trustDate?: string;
  organizationName?: string;
  organizationRegistration?: string;
  organizationContact?: string;
  guardian?: { name: string; relationship: string; contact: string; address: string };
  legalAcknowledgement?: boolean;
}

export function beneficiary(overrides: Partial<BeneficiaryData> = {}): BeneficiaryData {
  const individual = (overrides.type ?? 'INDIVIDUAL') === 'INDIVIDUAL';
  return {
    level: 'PRIMARY',
    type: 'INDIVIDUAL',
    relationship: 'SPOUSE',
    allocation: 100,
    ...(individual ? { firstName: 'Jane', lastName: capitalised(alphaId(6)), dob: dobForAge(38), gender: 'FEMALE' as const } : {}),
    ...overrides,
  };
}

export const GUARDIAN = { name: 'Pat Guardian', relationship: 'Parent', contact: '(212) 555-0199', address: '5 Elm St, New York, NY 10001' };
