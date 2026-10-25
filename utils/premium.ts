import type { Frequency } from '../fixtures/referenceData';

/**
 * Premium rules (application service): annual = amount / 1000 x rate per 1,000;
 * period premium = annual / 12, 4, 2 or 1 and rounded to 2 decimals. Total = rounded base + rounded rider premiums.
 */
const DIVISOR: Record<Frequency, number> = { MONTHLY: 12, QUARTERLY: 4, SEMI_ANNUAL: 2, ANNUAL: 1 };

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export function periodPremium(amount: number, ratePer1000: number, frequency: Frequency): number {
  return round2(((amount / 1000) * ratePer1000) / DIVISOR[frequency]);
}

export function annualPremium(amount: number, ratePer1000: number): number {
  return round2((amount / 1000) * ratePer1000);
}

export function totalPremium(base: { face: number; rate: number }, riders: { coverage: number; rate: number }[], frequency: Frequency): number {
  const b = periodPremium(base.face, base.rate, frequency);
  const r = riders.reduce((sum, x) => sum + periodPremium(x.coverage, x.rate, frequency), 0);
  return round2(b + r);
}
