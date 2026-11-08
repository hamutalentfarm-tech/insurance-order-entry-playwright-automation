import type { ApiClient } from './apiClient';
import type { ProductRef } from '../fixtures/referenceData';

/** Products and limits exactly as THIS lab VM offers them (from the API), not from the reference list. */
export async function liveProducts(api: ApiClient): Promise<ProductRef[]> {
  const list = ((await api.products()).body?.data ?? []) as Record<string, unknown>[];
  return list
    .filter((p) => !!p.is_active)
    .map((p) => ({
      code: String(p.product_code),
      name: String(p.product_name),
      ageMin: Number(p.eligibility_age_min),
      ageMax: Number(p.eligibility_age_max),
      faceMin: Number(p.face_value_min),
      faceMax: Number(p.face_value_max),
      ratePer1000: Number(p.base_rate_per_1000),
    }));
}