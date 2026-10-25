import { expect,test, type Page } from '@playwright/test';
import type { ApiResult } from './apiClient';


/** Flattens an API envelope ({message, errors:{field:[...]}}) into a list of strings. */
export function errorTexts(result: ApiResult): string[] {
  const out: string[] = [];
  const body = result.body;
  if (body && typeof body.message === 'string') out.push(body.message);
  const errors = body?.errors;
  if (Array.isArray(errors)) out.push(...errors.map(String));
  else if (errors && typeof errors === 'object') {
    for (const v of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(v)) out.push(...v.map(String));
      else if (typeof v === 'string') out.push(v);
    }
  }
  return out;
}
/** Prints the real response and attaches it to the HTML report for this test. */
function showResponse(result: ApiResult): void {
  console.log(`[api] HTTP ${result.status} ${result.text.slice(0, 500)}`);
  try {
    void test.info().attach('api-response', { body: `HTTP ${result.status}\n${result.text}`, contentType: 'text/plain' });
  } catch {
    /* not inside a running test */
  }
}

export function expectApiSuccess(result: ApiResult, status = 200): void {
  showResponse(result);
  expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
  expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('success');
}

export function expectApiError(result: ApiResult, status: number, pattern?: RegExp): void {
  showResponse(result);
  expect(result.status, `HTTP status. Actual response body: ${result.text.slice(0, 800)}`).toBe(status);
  expect(result.body?.status, `The response has no "status" field. Actual response body: ${result.text.slice(0, 800)}`).toBe('error');
  if (pattern) {
    const texts = errorTexts(result).join(' | ');
    expect(texts, `error messages. Actual response body: ${result.text.slice(0, 800)}`).toMatch(pattern);
  }
}

/** Texts currently shown in the red validation alert (server-side validation on a form page). */
export async function alertTexts(page: Page): Promise<string[]> {
  const alert = page.getByTestId('validation-error-alert');
  if ((await alert.count()) === 0) return [];
  return (await alert.locator('li').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
}

export async function expectAlertMatches(page: Page, pattern: RegExp): Promise<void> {
  const alert = page.getByTestId('validation-error-alert');
  await expect(alert, 'validation alert should be visible').toBeVisible();
  await expect(alert).toContainText(pattern);
}

export async function expectNoAlert(page: Page): Promise<void> {
  await expect(page.getByTestId('validation-error-alert')).toHaveCount(0);
}

/** True if some message in the list matches. Used where the app may report an error in more than one place. */
export function anyMatches(texts: string[], pattern: RegExp): boolean {
  return texts.some((t) => pattern.test(t));
}
