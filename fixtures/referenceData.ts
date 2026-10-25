/**
 * Reference data (products and riders) taken from the application's seed data during reconciliation.
 * The API tests compare the live API with these values, so a drift in the app shows up as a failure.
 */
export type Frequency = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
export type PolicyTerm = 'WHOLE_LIFE' | 'TO_AGE_100';

export interface ProductRef {
  code: string;
  name: string;
  ageMin: number;
  ageMax: number;
  faceMin: number;
  faceMax: number;
  ratePer1000: number;
}

export const PRODUCTS: ProductRef[] = [
  { code: 'WL_SECURE_BASIC', name: 'SecureLife Whole Life', ageMin: 18, ageMax: 65, faceMin: 100_000, faceMax: 1_000_000, ratePer1000: 4.75 },
  { code: 'WL_WEALTH_BUILDER', name: 'WealthBuilder Whole Life', ageMin: 21, ageMax: 60, faceMin: 150_000, faceMax: 1_500_000, ratePer1000: 5.35 },
  { code: 'WL_ELITE_LEGACY', name: 'Elite Legacy Whole Life', ageMin: 30, ageMax: 65, faceMin: 500_000, faceMax: 5_000_000, ratePer1000: 6.1 },
  { code: 'WL_FLEXI_PAY', name: 'FlexiPay Whole Life', ageMin: 18, ageMax: 62, faceMin: 100_000, faceMax: 1_200_000, ratePer1000: 5.0 },
  { code: 'WL_GUARANTEED_RETURN', name: 'Guaranteed Return Whole Life', ageMin: 25, ageMax: 55, faceMin: 200_000, faceMax: 2_000_000, ratePer1000: 5.85 },
];

export const product = (code: string): ProductRef => {
  const p = PRODUCTS.find((x) => x.code === code);
  if (!p) throw new Error(`Unknown product ${code}`);
  return p;
};

export const DEFAULT_PRODUCT = product('WL_SECURE_BASIC');

export type RiderCoverageType = 'SAME_AS_BASE' | 'PERCENT_OF_BASE' | 'FIXED_AMOUNT';

export interface RiderRef {
  code: string;
  /** Case-sensitive pattern that matches only this rider's row text on the Riders page. */
  rowPattern: RegExp;
  ageMin: number;
  ageMax: number;
  coverageType: RiderCoverageType;
  maxCoverage: number | null;
  minBaseFace: number | null;
  exclusionGroup: string | null;
  ratePer1000: number;
}

export const RIDERS: Record<string, RiderRef> = {
  ADB: { code: 'RIDER_ADB', rowPattern: /Accidental Death/, ageMin: 18, ageMax: 65, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 0.85 },
  DISABILITY: { code: 'RIDER_DISABILITY', rowPattern: /Permanent Disability/, ageMin: 18, ageMax: 60, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.1 },
  TERM: { code: 'RIDER_TERM_ADDON', rowPattern: /Term Rider/, ageMin: 21, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.25 },
  CI: { code: 'RIDER_CRITICAL_ILLNESS', rowPattern: /Critical Illness Rider/, ageMin: 18, ageMax: 58, coverageType: 'PERCENT_OF_BASE', maxCoverage: 500_000, minBaseFace: null, exclusionGroup: null, ratePer1000: 1.6 },
  HOSPITAL: { code: 'RIDER_HOSPITAL_CASH', rowPattern: /Hospital Cash/, ageMin: 18, ageMax: 60, coverageType: 'FIXED_AMOUNT', maxCoverage: 100_000, minBaseFace: null, exclusionGroup: null, ratePer1000: 0.65 },
  WAIVER_DISABILITY: { code: 'RIDER_WAIVER_DISABILITY', rowPattern: /Waiver.*Disability/, ageMin: 18, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: 200_000, exclusionGroup: 'WAIVER_PREMIUM', ratePer1000: 0.7 },
  WAIVER_CI: { code: 'RIDER_WAIVER_CI', rowPattern: /Waiver.*Critical/, ageMin: 18, ageMax: 55, coverageType: 'SAME_AS_BASE', maxCoverage: null, minBaseFace: 200_000, exclusionGroup: 'WAIVER_PREMIUM', ratePer1000: 0.9 },
  FAMILY_INCOME: { code: 'RIDER_FAMILY_INCOME', rowPattern: /Family Income/, ageMin: 25, ageMax: 55, coverageType: 'PERCENT_OF_BASE', maxCoverage: 750_000, minBaseFace: 250_000, exclusionGroup: null, ratePer1000: 1.35 },
  GUARANTEED_INCOME: { code: 'RIDER_GUARANTEED_INCOME', rowPattern: /Guaranteed Income/, ageMin: 30, ageMax: 60, coverageType: 'PERCENT_OF_BASE', maxCoverage: 500_000, minBaseFace: 300_000, exclusionGroup: null, ratePer1000: 1.5 },
};

export const MAX_RIDERS = 4;
export const AFFORDABILITY_PERCENT = 20;
export const DOC_MAX_KB = 5 * 1024; // 5 MB
export const PAYMENT_TERMS = [10, 15, 20, 25, 30] as const;
export const POLICY_TERMS: PolicyTerm[] = ['WHOLE_LIFE', 'TO_AGE_100'];
export const FREQUENCIES: Frequency[] = ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'];
