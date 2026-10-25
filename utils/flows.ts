import type { Page } from '@playwright/test';
import { ClientInformationPage } from '../pages/ClientInformationPage';
import { ReviewPage } from '../pages/ReviewPage';
import { anyMatches } from './assertions';
import { MSG } from './messages';

/**
 * Where a business-rule error shows up is not specified in the documents: it can be on the form that was just saved
 * or only in the review page's blocking-errors list. These helpers look in both places and say where they found it,
 * so the test result (and the report annotation) records the observed behaviour.
 */
export type Surface = 'form' | 'review' | null;

export async function ageErrorSurface(page: Page, applicationId: number, pattern: RegExp = MSG.ageRange): Promise<Surface> {
  const client = new ClientInformationPage(page);
  if (anyMatches(await client.errorMessages(), pattern)) return 'form';
  const review = new ReviewPage(page);
  await review.goto(applicationId);
  if (anyMatches(await review.errors(), pattern)) return 'review';
  return null;
}

/** Looks for a message on the current page's alert first, then on the review page. */
export async function errorSurface(page: Page, applicationId: number, pattern: RegExp): Promise<Surface> {
  const alert = await page
    .getByTestId('validation-error-alert')
    .locator('li')
    .allInnerTexts()
    .catch(() => [] as string[]);
  if (anyMatches(alert, pattern)) return 'form';
  const review = new ReviewPage(page);
  await review.goto(applicationId);
  if (anyMatches(await review.errors(), pattern)) return 'review';
  return null;
}
