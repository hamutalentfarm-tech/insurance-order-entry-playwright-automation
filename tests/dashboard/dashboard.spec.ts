import { test, expect, asRole } from '../../fixtures/auth.fixture';
import { emailOf } from '../../fixtures/users';
import { DashboardPage, type SummaryKey } from '../../pages/DashboardPage';
import { ClientInformationPage } from '../../pages/ClientInformationPage';
import { buildApplication } from '../../utils/applicationBuilder';
import { expectApiSuccess } from '../../utils/assertions';
import { name, meta } from '../../utils/testMeta';

const STATUS_BY_KEY: Record<SummaryKey, string> = {
  draft: 'DRAFT',
  submitted: 'SUBMITTED',
  'under-review': 'UNDER_REVIEW',
  approved: 'APPROVED',
  'requires-info': 'REQUIRES_INFO',
};

test.describe('Dashboard (agent.valid)', () => {
  test.use(asRole('valid'));

  test(name('TC-DASH-001', 'dashboard loads after login'), meta('TC-DASH-001'), async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
      await expect(dashboard.summaryCard(key), `summary card ${key}`).toBeVisible();
    }
    await expect(dashboard.newApplicationButton).toBeVisible();
    await expect(dashboard.newApplicationButton).toBeEnabled();
    // agent.valid owns a seeded draft, so the table (not the empty state) is expected
    await expect(dashboard.table).toBeVisible();
  });

  test(name('TC-DASH-002', 'agent sees only their own applications'), meta('TC-DASH-002'), async ({ page, otherAgent, api }) => {
    const mine = emailOf('valid');
    const theirs = emailOf('draft');

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const myUiIds = await dashboard.applicationIds();

    const otherPage = await otherAgent('draft');
    const other = new DashboardPage(otherPage);
    await other.goto();
    const otherUiIds = await other.applicationIds();

    const myApi = ((await api.listApplications(mine)).body?.data ?? []).map((a: { id: number }) => a.id);
    const otherApi = ((await api.listApplications(theirs)).body?.data ?? []).map((a: { id: number }) => a.id);

    expect(myUiIds.length, 'agent.valid has applications').toBeGreaterThan(0);
    expect(otherUiIds.length, 'agent.draft has applications').toBeGreaterThan(0);
    expect(myUiIds.filter((id) => otherUiIds.includes(id)), 'no application shown to both agents').toEqual([]);
    expect(myUiIds.every((id) => myApi.includes(id)), 'every UI row for agent.valid is in that agent\'s API list').toBe(true);
    expect(otherUiIds.every((id) => otherApi.includes(id)), 'every UI row for agent.draft is in that agent\'s API list').toBe(true);
    expect(myApi.filter((id: number) => otherApi.includes(id)), 'API lists do not overlap').toEqual([]);
  });

  test(name('TC-DASH-005', 'summary counts equal the API counts per status'), meta('TC-DASH-005'), async ({ page, api }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const email = emailOf('valid');
    for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
      await test.step(`status ${STATUS_BY_KEY[key]}`, async () => {
        const res = await api.listApplications(email, STATUS_BY_KEY[key]);
        expectApiSuccess(res);
        const apiCount = (res.body?.data ?? []).length;
        expect(await dashboard.summaryCount(key), `summary "${key}" vs API ?status=${STATUS_BY_KEY[key]}`).toBe(apiCount);
      });
    }
    await test.step('rows listed on the dashboard carry the same status as the API', async () => {
      const all = (await api.listApplications(email)).body?.data ?? [];
      for (const id of await dashboard.applicationIds()) {
        const apiRow = all.find((a: { id: number }) => a.id === id);
        expect(apiRow, `application ${id} exists in API list`).toBeTruthy();
        expect(await dashboard.statusOf(id)).toBe(apiRow.application_status);
      }
    });
  });
});

test.describe('Dashboard (agent.new)', () => {
  test.use(asRole('new'));

  test(name('TC-DASH-003', 'new agent sees the empty state'), meta('TC-DASH-003'), async ({ page, api }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.emptyState).toBeVisible();
    await expect(dashboard.newApplicationButton).toBeVisible();
    for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
      expect(await dashboard.summaryCount(key), `count ${key}`).toBe(0);
    }
    const res = await api.listApplications(emailOf('new'));
    expectApiSuccess(res);
    expect(res.body?.data ?? []).toHaveLength(0);
  });
});

test.describe('Dashboard (learner: write flows)', () => {
  test.use(asRole('learner'));

  test(name('TC-DASH-004', 'draft can be resumed from the dashboard'), meta('TC-DASH-004'), async ({ page, api }) => {
    const agent = emailOf('learner');
    const app = await buildApplication(api, { agentEmail: agent, upTo: 'client' });

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.openApplication(app.id);
    await expect(page.getByTestId('application-summary-page')).toBeVisible();

    await test.step('the draft keeps the saved client data', async () => {
      const client = new ClientInformationPage(page);
      await client.goto(app.id);
      await expect(client.firstName).toHaveValue(app.client.firstName);
      await expect(client.lastName).toHaveValue(app.client.lastName);
      await expect(client.dob).toHaveValue(app.client.dob);
    });
  });

  test(name('TC-DASH-006', 'dashboard status matches the status API'), meta('TC-DASH-006'), async ({ page, api, otherAgent }) => {
    const agent = emailOf('learner');
    const app = await buildApplication(api, { agentEmail: agent, upTo: 'client' });

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const uiStatus = await dashboard.statusOf(app.id);

    const list = (await api.listApplications(agent)).body?.data ?? [];
    const listed = list.find((a: { id: number }) => a.id === app.id);
    const statusRes = await api.status(app.id, agent);
    expectApiSuccess(statusRes);

    expect(listed?.application_status, 'list API').toBe(uiStatus);
    expect(statusRes.body?.data?.application_status, 'status API').toBe(uiStatus);
    expect(uiStatus).toBe('DRAFT');

    await test.step('seeded submitted agent: every dashboard row equals the API status', async () => {
      const submitted = await otherAgent('submitted');
      const other = new DashboardPage(submitted);
      await other.goto();
      const apiRows = (await api.listApplications(emailOf('submitted'))).body?.data ?? [];
      for (const id of await other.applicationIds()) {
        const apiRow = apiRows.find((a: { id: number }) => a.id === id);
        expect(apiRow, `application ${id} in API`).toBeTruthy();
        expect(await other.statusOf(id)).toBe(apiRow.application_status);
      }
    });
  });

});
