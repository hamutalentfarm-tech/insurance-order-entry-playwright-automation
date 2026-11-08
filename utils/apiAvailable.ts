import type { ApiClient } from './apiClient';

let cached: boolean | undefined;

/** True when the documented API answers with something other than "not found" or a web page. */
export async function apiAvailable(api: ApiClient): Promise<boolean> {
  if (cached === undefined) {
    const res = await api.health();
    const isWebPage = /^\s*<!doctype|^\s*<html/i.test(res.text);
    cached = ![404, 405].includes(res.status) && !isWebPage;
  }
  return cached;
}