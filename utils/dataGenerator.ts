/** Test-data helpers. Dates are always relative to "today" so age boundaries stay correct over time. */

const pad = (n: number): string => String(n).padStart(2, '0');

export function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Shifts a date by whole years (Feb 29 rolls to Feb 28 / Mar 1 like the JS Date does). */
export function addYears(base: Date, years: number): Date {
  const d = new Date(base.getTime());
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * DOB for a person whose age is exactly `years` today (birthday today), shifted by `extraDays`.
 *   dobForAge(18)      -> today - 18y        (age 18, boundary accepted)
 *   dobForAge(18, 1)   -> today - 18y + 1d   (age 17y 364d, rejected)
 *   dobForAge(66)      -> today - 66y        (age 66, rejected)
 */
export function dobForAge(years: number, extraDays = 0, today = new Date()): string {
  return toIso(addDays(addYears(today, -years), extraDays));
}

export function futureDate(days: number, today = new Date()): string {
  return toIso(addDays(today, days));
}

/** Age in whole years on `today` (what a calculator should show). */
export function ageOn(dobIso: string, today = new Date()): number {
  const [y, m, d] = dobIso.split('-').map(Number);
  let age = today.getFullYear() - y;
  const hadBirthday = today.getMonth() + 1 > m || (today.getMonth() + 1 === m && today.getDate() >= d);
  if (!hadBirthday) age -= 1;
  return age;
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

/** Letters only: client/beneficiary names may not contain digits or underscores. */
export function alphaId(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i += 1) out += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return out;
}

export function capitalised(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Unique, name-safe first name such as "Qaxkrtpl" (regex ^[A-Za-z][A-Za-z' .-]*$). */
export function uniqueFirstName(prefix = 'Qa'): string {
  return `${prefix}${alphaId(6)}`;
}

export function uniqueEmail(): string {
  return `qa.${alphaId(8)}@example.com`;
}

export function runStamp(): string {
  return new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}
