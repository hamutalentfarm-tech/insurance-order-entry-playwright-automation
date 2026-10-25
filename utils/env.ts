import * as dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in (see README).`);
  }
  return value;
}

/** Central, lazy environment access. Nothing secret is hard-coded anywhere in the repo. */
export const env = {
  get baseUrl(): string {
    return (process.env.INSURANCE_BASE_URL ?? 'http://35.244.49.205:8081/login').replace(/\/$/, '');
  },
  /**
   * API base URL. It ALWAYS ends with a trailing slash and API paths used with it have NO leading slash,
   * otherwise Playwright's URL resolution drops the "/api" segment (lesson from the earlier FinServe project).
   */
  get apiBase(): string {
    const raw = (process.env.INSURANCE_API_BASE_URL ?? `http://35.244.49.205:8081/api/`).replace(/\/+$/, '');
    return `${raw}/`;
  },
  get apiKey(): string {
    return required('INSURANCE_API_KEY');
  },
  get password(): string {
    return required('INSURANCE_PASSWORD');
  },
  get hasPassword(): boolean {
    return !!process.env.INSURANCE_PASSWORD;
  },
  get learnerEmail(): string {
    return process.env.LEARNER_USER || 'learner001@insurance.test';
  },
  /** Spare account for the destructive lockout test. Empty means that test is skipped. */
  get disposableEmail(): string {
    return process.env.DISPOSABLE_USER || '';
  },
};
