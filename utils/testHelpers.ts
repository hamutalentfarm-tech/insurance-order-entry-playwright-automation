import type { Dialog, Locator, Page } from '@playwright/test';

/** "$1,234.56" -> 1234.56 */
export function parseMoney(text: string | null | undefined): number {
  const cleaned = (text ?? '').replace(/[^0-9.\-]/g, '');
  const n = Number(cleaned);
  if (Number.isNaN(n)) throw new Error(`Cannot parse money from "${text}"`);
  return n;
}

/** First integer in a text such as "Draft 3" -> 3 */
export function firstInt(text: string | null | undefined): number {
  const m = (text ?? '').match(/\d+/);
  if (!m) throw new Error(`No number in "${text}"`);
  return Number(m[0]);
}

export function applicationIdFromUrl(url: string): number {
  const m = url.match(/\/applications\/(\d+)/);
  if (!m) throw new Error(`No application id in URL ${url}`);
  return Number(m[1]);
}

/**
 * The forms use HTML "required" attributes, so the browser blocks blank submissions before the server sees them.
 * This switches browser validation off so server-side validation messages can be tested.
 */
export async function disableBrowserValidation(page: Page, formTestId: string): Promise<void> {
  await page.getByTestId(formTestId).evaluate((form) => {
    (form as HTMLFormElement).noValidate = true;
  });
}

/** True if the browser itself reports the field as invalid (e.g. required but empty). */
export async function isNativelyInvalid(field: Locator): Promise<boolean> {
  return field.evaluate((el) => !(el as HTMLInputElement).checkValidity());
}

/** Selects the first <option> whose text matches (the Product dropdown shows names, values are ids). */
export async function selectByText(select: Locator, pattern: RegExp | string): Promise<string> {
  const options = await select.locator('option').evaluateAll((els) =>
    els.map((e) => ({ value: (e as HTMLOptionElement).value, text: (e.textContent ?? '').trim() })),
  );
  const match = options.find((o) => (typeof pattern === 'string' ? o.text.includes(pattern) : pattern.test(o.text)));
  if (!match) throw new Error(`No option matching ${pattern}. Options: ${options.map((o) => o.text).join(' | ')}`);
  await select.selectOption(match.value);
  return match.text;
}

export async function optionValues(select: Locator): Promise<string[]> {
  return select.locator('option').evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value));
}

/** Runs `action` while answering any browser alert()/confirm() dialogs; returns the dialog messages. */
export async function withDialogs(page: Page, action: () => Promise<void>, decision: 'accept' | 'dismiss' = 'accept'): Promise<string[]> {
  const messages: string[] = [];
  const handler = async (d: Dialog): Promise<void> => {
    messages.push(d.message());
    if (decision === 'accept') await d.accept();
    else await d.dismiss();
  };
  page.on('dialog', handler);
  try {
    await action();
  } finally {
    page.off('dialog', handler);
  }
  return messages;
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
