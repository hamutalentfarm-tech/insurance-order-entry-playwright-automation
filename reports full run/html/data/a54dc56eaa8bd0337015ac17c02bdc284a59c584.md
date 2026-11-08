# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\dashboard.spec.ts >> Dashboard (agent.new) >> TC-DASH-003 | DASH-V03 | new agent sees the empty state
- Location: tests\dashboard\dashboard.spec.ts:82:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('dashboard-empty-state')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('dashboard-empty-state') with timeout 10000ms
  - waiting for getByTestId('dashboard-empty-state')

```

```yaml
- navigation:
  - link "Insurance Order Entry Demo Platform QA Automation Training App":
    - /url: http://34.100.166.72:8081/dashboard
  - list:
    - listitem:
      - link "Dashboard":
        - /url: http://34.100.166.72:8081/dashboard
    - listitem:
      - link "Applications":
        - /url: http://34.100.166.72:8081/applications
    - listitem:
      - link "Products":
        - /url: http://34.100.166.72:8081/products
    - listitem:
      - link "Support":
        - /url: http://34.100.166.72:8081/support
  - link "New Agent":
    - /url: http://34.100.166.72:8081/profile
  - button "Logout"
- main:
  - heading "Agent Dashboard" [level=1]
  - paragraph: Track drafts, submitted applications, and policy order entry work.
  - link "Start New Application":
    - /url: http://34.100.166.72:8081/applications/new
  - text: Draft 1 Submitted 0 Under Review 0 Approved 0 Requires Info 0
  - heading "Recent Applications" [level=2]
  - link "View all":
    - /url: http://34.100.166.72:8081/applications
  - table:
    - rowgroup:
      - row "Reference Client Product Status Updated":
        - columnheader "Reference"
        - columnheader "Client"
        - columnheader "Product"
        - columnheader "Status"
        - columnheader "Updated"
        - columnheader
    - rowgroup:
      - 'row "Draft #47 Not selected DRAFT 03 Jun 2026 Open"':
        - 'cell "Draft #47"'
        - cell
        - cell "Not selected"
        - cell "DRAFT"
        - cell "03 Jun 2026"
        - cell "Open":
          - link "Open":
            - /url: http://34.100.166.72:8081/applications/47
- contentinfo: TalentFarm QA Automation Lab Insurance Order Entry Demo
```

# Test source

```ts
  1   | import { test, expect, asRole } from '../../fixtures/auth.fixture';
  2   | import { emailOf } from '../../fixtures/users';
  3   | import { DashboardPage, type SummaryKey } from '../../pages/DashboardPage';
  4   | import { ClientInformationPage } from '../../pages/ClientInformationPage';
  5   | import { buildApplication } from '../../utils/applicationBuilder';
  6   | import { expectApiSuccess } from '../../utils/assertions';
  7   | import { name, meta } from '../../utils/testMeta';
  8   | 
  9   | const STATUS_BY_KEY: Record<SummaryKey, string> = {
  10  |   draft: 'DRAFT',
  11  |   submitted: 'SUBMITTED',
  12  |   'under-review': 'UNDER_REVIEW',
  13  |   approved: 'APPROVED',
  14  |   'requires-info': 'REQUIRES_INFO',
  15  | };
  16  | 
  17  | test.describe('Dashboard (agent.valid)', () => {
  18  |   test.use(asRole('valid'));
  19  | 
  20  |   test(name('TC-DASH-001', 'dashboard loads after login'), meta('TC-DASH-001'), async ({ page }) => {
  21  |     const dashboard = new DashboardPage(page);
  22  |     await dashboard.goto();
  23  |     for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
  24  |       await expect(dashboard.summaryCard(key), `summary card ${key}`).toBeVisible();
  25  |     }
  26  |     await expect(dashboard.newApplicationButton).toBeVisible();
  27  |     await expect(dashboard.newApplicationButton).toBeEnabled();
  28  |     // agent.valid owns a seeded draft, so the table (not the empty state) is expected
  29  |     await expect(dashboard.table).toBeVisible();
  30  |   });
  31  | 
  32  |   test(name('TC-DASH-002', 'agent sees only their own applications'), meta('TC-DASH-002'), async ({ page, otherAgent, api }) => {
  33  |     const mine = emailOf('valid');
  34  |     const theirs = emailOf('draft');
  35  | 
  36  |     const dashboard = new DashboardPage(page);
  37  |     await dashboard.goto();
  38  |     const myUiIds = await dashboard.applicationIds();
  39  | 
  40  |     const otherPage = await otherAgent('draft');
  41  |     const other = new DashboardPage(otherPage);
  42  |     await other.goto();
  43  |     const otherUiIds = await other.applicationIds();
  44  | 
  45  |     const myApi = ((await api.listApplications(mine)).body?.data ?? []).map((a: { id: number }) => a.id);
  46  |     const otherApi = ((await api.listApplications(theirs)).body?.data ?? []).map((a: { id: number }) => a.id);
  47  | 
  48  |     expect(myUiIds.length, 'agent.valid has applications').toBeGreaterThan(0);
  49  |     expect(otherUiIds.length, 'agent.draft has applications').toBeGreaterThan(0);
  50  |     expect(myUiIds.filter((id) => otherUiIds.includes(id)), 'no application shown to both agents').toEqual([]);
  51  |     expect(myUiIds.every((id) => myApi.includes(id)), 'every UI row for agent.valid is in that agent\'s API list').toBe(true);
  52  |     expect(otherUiIds.every((id) => otherApi.includes(id)), 'every UI row for agent.draft is in that agent\'s API list').toBe(true);
  53  |     expect(myApi.filter((id: number) => otherApi.includes(id)), 'API lists do not overlap').toEqual([]);
  54  |   });
  55  | 
  56  |   test(name('TC-DASH-005', 'summary counts equal the API counts per status'), meta('TC-DASH-005'), async ({ page, api }) => {
  57  |     const dashboard = new DashboardPage(page);
  58  |     await dashboard.goto();
  59  |     const email = emailOf('valid');
  60  |     for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
  61  |       await test.step(`status ${STATUS_BY_KEY[key]}`, async () => {
  62  |         const res = await api.listApplications(email, STATUS_BY_KEY[key]);
  63  |         expectApiSuccess(res);
  64  |         const apiCount = (res.body?.data ?? []).length;
  65  |         expect(await dashboard.summaryCount(key), `summary "${key}" vs API ?status=${STATUS_BY_KEY[key]}`).toBe(apiCount);
  66  |       });
  67  |     }
  68  |     await test.step('rows listed on the dashboard carry the same status as the API', async () => {
  69  |       const all = (await api.listApplications(email)).body?.data ?? [];
  70  |       for (const id of await dashboard.applicationIds()) {
  71  |         const apiRow = all.find((a: { id: number }) => a.id === id);
  72  |         expect(apiRow, `application ${id} exists in API list`).toBeTruthy();
  73  |         expect(await dashboard.statusOf(id)).toBe(apiRow.application_status);
  74  |       }
  75  |     });
  76  |   });
  77  | });
  78  | 
  79  | test.describe('Dashboard (agent.new)', () => {
  80  |   test.use(asRole('new'));
  81  | 
  82  |   test(name('TC-DASH-003', 'new agent sees the empty state'), meta('TC-DASH-003'), async ({ page, api }) => {
  83  |     const dashboard = new DashboardPage(page);
  84  |     await dashboard.goto();
> 85  |     await expect(dashboard.emptyState).toBeVisible();
      |                                        ^ Error: expect(locator).toBeVisible() failed
  86  |     await expect(dashboard.newApplicationButton).toBeVisible();
  87  |     for (const key of Object.keys(STATUS_BY_KEY) as SummaryKey[]) {
  88  |       expect(await dashboard.summaryCount(key), `count ${key}`).toBe(0);
  89  |     }
  90  |     const res = await api.listApplications(emailOf('new'));
  91  |     expectApiSuccess(res);
  92  |     expect(res.body?.data ?? []).toHaveLength(0);
  93  |   });
  94  | });
  95  | 
  96  | test.describe('Dashboard (learner: write flows)', () => {
  97  |   test.use(asRole('learner'));
  98  | 
  99  |   test(name('TC-DASH-004', 'draft can be resumed from the dashboard'), meta('TC-DASH-004'), async ({ page, api }) => {
  100 |     const agent = emailOf('learner');
  101 |     const app = await buildApplication(api, { agentEmail: agent, upTo: 'client' });
  102 | 
  103 |     const dashboard = new DashboardPage(page);
  104 |     await dashboard.goto();
  105 |     await dashboard.openApplication(app.id);
  106 |     await expect(page.getByTestId('application-summary-page')).toBeVisible();
  107 | 
  108 |     await test.step('the draft keeps the saved client data', async () => {
  109 |       const client = new ClientInformationPage(page);
  110 |       await client.goto(app.id);
  111 |       await expect(client.firstName).toHaveValue(app.client.firstName);
  112 |       await expect(client.lastName).toHaveValue(app.client.lastName);
  113 |       await expect(client.dob).toHaveValue(app.client.dob);
  114 |     });
  115 |   });
  116 | 
  117 |   test(name('TC-DASH-006', 'dashboard status matches the status API'), meta('TC-DASH-006'), async ({ page, api, otherAgent }) => {
  118 |     const agent = emailOf('learner');
  119 |     const app = await buildApplication(api, { agentEmail: agent, upTo: 'client' });
  120 | 
  121 |     const dashboard = new DashboardPage(page);
  122 |     await dashboard.goto();
  123 |     const uiStatus = await dashboard.statusOf(app.id);
  124 | 
  125 |     const list = (await api.listApplications(agent)).body?.data ?? [];
  126 |     const listed = list.find((a: { id: number }) => a.id === app.id);
  127 |     const statusRes = await api.status(app.id, agent);
  128 |     expectApiSuccess(statusRes);
  129 | 
  130 |     expect(listed?.application_status, 'list API').toBe(uiStatus);
  131 |     expect(statusRes.body?.data?.application_status, 'status API').toBe(uiStatus);
  132 |     expect(uiStatus).toBe('DRAFT');
  133 | 
  134 |     await test.step('seeded submitted agent: every dashboard row equals the API status', async () => {
  135 |       const submitted = await otherAgent('submitted');
  136 |       const other = new DashboardPage(submitted);
  137 |       await other.goto();
  138 |       const apiRows = (await api.listApplications(emailOf('submitted'))).body?.data ?? [];
  139 |       for (const id of await other.applicationIds()) {
  140 |         const apiRow = apiRows.find((a: { id: number }) => a.id === id);
  141 |         expect(apiRow, `application ${id} in API`).toBeTruthy();
  142 |         expect(await other.statusOf(id)).toBe(apiRow.application_status);
  143 |       }
  144 |     });
  145 |   });
  146 | 
  147 | });
  148 | 
```