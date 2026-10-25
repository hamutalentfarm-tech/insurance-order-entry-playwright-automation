import { request, type APIRequestContext, type APIResponse } from '@playwright/test';
import { env } from './env';

export interface ApiResult {
  status: number;
  ok: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  text: string;
}

type Json = Record<string, unknown>;

/**
 * Thin client for the Insurance Order Entry API.
 *  - Auth is a STATIC header (X-API-Key), there is no per-user token.
 *  - The acting agent is chosen with `agent_email`. If you forget it the API silently uses learner001,
 *    so every call below takes the agent explicitly. UI and API comparisons must use the SAME agent.
 *  - Paths have no leading slash (see env.apiBase).
 *  - Redirects are never followed so a 302 to /login can't masquerade as 200.
 */
export class ApiClient {
  private productCache: Json[] | null = null;
  private riderCache: Json[] | null = null;

  private constructor(private readonly ctx: APIRequestContext) {}

  /** apiKey: undefined = use .env key, null = send no key, string = send that key. */
  static async create(options: { apiKey?: string | null } = {}): Promise<ApiClient> {
    const key = options.apiKey === undefined ? env.apiKey : options.apiKey;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (key) headers['X-API-Key'] = key;
    const ctx = await request.newContext({ baseURL: env.apiBase, extraHTTPHeaders: headers });
    return new ApiClient(ctx);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }

  private async toResult(res: APIResponse): Promise<ApiResult> {
    const text = await res.text();
    let body: unknown = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
    return { status: res.status(), ok: res.ok(), body, text };
  }

  private async get(path: string, params?: Record<string, string | number | boolean>): Promise<ApiResult> {
    return this.toResult(await this.ctx.get(path, { params, maxRedirects: 0 }));
  }

  private async post(path: string, data: Json = {}): Promise<ApiResult> {
    return this.toResult(await this.ctx.post(path, { data, maxRedirects: 0 }));
  }

  // ---- public / reference endpoints ------------------------------------------------------------
  health(): Promise<ApiResult> {
    return this.get('health');
  }
  products(): Promise<ApiResult> {
    return this.get('products');
  }
  product(id: number | string): Promise<ApiResult> {
    return this.get(`products/${id}`);
  }
  riders(): Promise<ApiResult> {
    return this.get('riders');
  }
  login(email: string, password: string): Promise<ApiResult> {
    return this.post('login', { email, password });
  }

  // ---- applications ----------------------------------------------------------------------------
  listApplications(agentEmail: string, status?: string): Promise<ApiResult> {
    const params: Record<string, string> = { agent_email: agentEmail };
    if (status) params.status = status;
    return this.get('applications', params);
  }
  createApplication(agentEmail: string): Promise<ApiResult> {
    return this.post('applications', { agent_email: agentEmail });
  }
  getApplication(id: number, agentEmail: string): Promise<ApiResult> {
    return this.get(`applications/${id}`, { agent_email: agentEmail });
  }
  getClient(id: number, agentEmail: string): Promise<ApiResult> {
    return this.get(`applications/${id}/client`, { agent_email: agentEmail });
  }
  saveClient(id: number, agentEmail: string, data: Json): Promise<ApiResult> {
    return this.post(`applications/${id}/client`, { agent_email: agentEmail, ...data });
  }
  saveAddress(id: number, agentEmail: string, data: Json): Promise<ApiResult> {
    return this.post(`applications/${id}/address-contact`, { agent_email: agentEmail, ...data });
  }
  saveKyc(id: number, agentEmail: string, data: Json): Promise<ApiResult> {
    return this.post(`applications/${id}/kyc-financial`, { agent_email: agentEmail, ...data });
  }
  saveProduct(id: number, agentEmail: string, data: Json): Promise<ApiResult> {
    return this.post(`applications/${id}/product`, { agent_email: agentEmail, ...data });
  }
  saveRiders(id: number, agentEmail: string, riders: { rider_id: number; coverage_amount: number }[]): Promise<ApiResult> {
    return this.post(`applications/${id}/riders`, { agent_email: agentEmail, riders });
  }
  listBeneficiaries(id: number, agentEmail: string): Promise<ApiResult> {
    return this.get(`applications/${id}/beneficiaries`, { agent_email: agentEmail });
  }
  addBeneficiary(id: number, agentEmail: string, data: Json): Promise<ApiResult> {
    return this.post(`applications/${id}/beneficiaries`, { agent_email: agentEmail, ...data });
  }
  async uploadDocument(
    id: number,
    agentEmail: string,
    doc: { type: string; name: string; mimeType: string; buffer: Buffer },
  ): Promise<ApiResult> {
    const res = await this.ctx.post(`applications/${id}/documents`, {
      multipart: { agent_email: agentEmail, document_type: doc.type, document: { name: doc.name, mimeType: doc.mimeType, buffer: doc.buffer } },
      maxRedirects: 0,
    });
    return this.toResult(res);
  }
  validate(id: number, agentEmail: string): Promise<ApiResult> {
    return this.post(`applications/${id}/validate`, { agent_email: agentEmail });
  }
  submit(id: number, agentEmail: string): Promise<ApiResult> {
    return this.post(`applications/${id}/submit`, { agent_email: agentEmail });
  }
  status(id: number, agentEmail: string): Promise<ApiResult> {
    return this.get(`applications/${id}/status`, { agent_email: agentEmail });
  }

  // ---- id lookups (cached) ---------------------------------------------------------------------
  async productId(code: string): Promise<number> {
    const list: Json[] = this.productCache ?? (this.productCache = (await this.products()).body?.data ?? []);
    const p = list.find((x) => x.product_code === code);
    if (!p) throw new Error(`Product ${code} not found in /api/products`);
    return Number(p.id);
  }
  async riderId(code: string): Promise<number> {
    const list: Json[] = this.riderCache ?? (this.riderCache = (await this.riders()).body?.data ?? []);
    const r = list.find((x) => x.rider_code === code);
    if (!r) throw new Error(`Rider ${code} not found in /api/riders`);
    return Number(r.id);
  }
}
