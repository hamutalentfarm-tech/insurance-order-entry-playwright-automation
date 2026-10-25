import * as path from 'path';
import { env } from '../utils/env';

/** Seeded accounts from the Lab Manual (usernames only; the shared password comes from .env). */
export type Role = 'valid' | 'draft' | 'new' | 'submitted' | 'locked' | 'learner';

const FIXED: Record<Exclude<Role, 'learner'>, string> = {
  valid: 'agent.valid@insurance.test',
  draft: 'agent.draft@insurance.test',
  new: 'agent.new@insurance.test',
  submitted: 'agent.submitted@insurance.test',
  locked: 'agent.locked@insurance.test',
};

export function emailOf(role: Role): string {
  return role === 'learner' ? env.learnerEmail : FIXED[role];
}

/** Roles that get a saved login (storage state) in global setup. The locked user can never log in. */
export const LOGIN_ROLES: Role[] = ['valid', 'draft', 'new', 'submitted', 'learner'];

export function authFile(role: Role): string {
  return path.resolve(__dirname, '..', '.auth', `${role}.json`);
}

export const SEEDED = {
  /** Seeded SUBMITTED application owned by agent.submitted (Lab seed data). */
  submittedReference: 'WL202605170003',
  validDraftReference: 'WL202605170001',
} as const;
