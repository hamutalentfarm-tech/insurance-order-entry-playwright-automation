# Insurance Order Entry: Playwright + TypeScript automation

Automated UI and API tests for the **Insurance Order Entry Demo** (Whole Life, port 8081) from the Playwright QA Automation course project.
The suite implements the **81 test cases** of the Test Case Design Sheet v1.1, each traceable to a risk, a validation ID and (where relevant) a
candidate seeded defect.

> **Status you should know about.** The suite type-checks and all 81 tests are discovered, and the framework wiring (config, global setup, saved
> logins, fixtures, API client, page objects, reports, failure evidence) was proven against a small mock server. It has **not yet been run against
> the real lab application**. Expect a first-run tuning pass (see "First run" below).

## 1. Prerequisites

- Node.js 18 or newer, npm
- Access to your assigned lab VM (Insurance app on `http://35.244.49.205:8081`)
- The test credentials and API key from the **Lab Manual** (sections 3 and 4). They are never stored in this repository.

## 2. Setup

```bash
npm install
npx playwright install --with-deps chromium     # add firefox webkit if you want them
cp .env.example .env                            # Windows PowerShell: Copy-Item .env.example .env
# edit .env: your VM IP, API key, shared password, your learner account
npm run typecheck
npm run traceability                            # confirms every design-sheet test case is implemented once
```

### Environment variables (`.env`)

| Variable | Required | Meaning |
|---|---|---|
| `INSURANCE_BASE_URL` | yes | `http://<your-vm-ip>:8081` (no trailing slash) |
| `INSURANCE_API_KEY` | yes | Insurance API key from Lab Manual section 4 (sent as `X-API-Key`) |
| `INSURANCE_PASSWORD` | yes | Shared test password from Lab Manual section 3.1 |
| `LEARNER_USER` | recommended | Your assigned learner account. **All write flows run as this user** so seeded users stay untouched. Default `learner001@insurance.test` |
| `DISPOSABLE_USER` | optional | A spare learner account for the destructive lockout test (it will be locked for about 30 minutes). Empty = test is skipped |
| `INSURANCE_API_BASE_URL` | optional | Defaults to `INSURANCE_BASE_URL/api` |
| `BROWSERS` | optional | `chromium` (default), or e.g. `chromium,firefox,webkit` |
| `WORKERS` | optional | Default `1`. Keep 1 on the shared lab VM |

## 3. Running

```bash
npm test                      # everything (81 tests)
npm run test:smoke            # 11 smoke tests
npm run test:p1               # 35 priority-1 tests
npm run test:regression
npm run test:api
npm run test:e2e              # full submission journey, two data sets
npm run test:headed           # watch the browser
npx playwright test tests/beneficiaries                  # one module
npx playwright test --grep "TC-BEN-003"                   # one test case
npm run report                # open the HTML report
```

Tags on every test: `@smoke`, `@regression`, `@api`, `@e2e`, a module tag (`@authentication`, `@dashboard`, `@client`, `@address`, `@kyc`,
`@product`, `@rider`, `@beneficiary`, `@documents`, `@workflow`), a priority tag (`@P1`/`@P2`/`@P3`) and `@SDC-xx` for the seeded-defect candidate.
Test titles look like `TC-BEN-003 | BEN-V03 | primary allocation above 100% is blocked`.

## 4. Project structure

```
tests/        auth/ dashboard/ client-information/ address-contact/ kyc-financial/ product-selection/
              riders/ beneficiaries/ documents/ workflow/ api/          (one spec file per module)
pages/        BasePage + LoginPage, DashboardPage, ClientInformationPage, AddressContactPage, KycFinancialPage,
              ProductCatalogPage, ProductConfigurationPage, RiderSelectionPage, BeneficiaryPage, DocumentUploadPage,
              ReviewPage, ConfirmationPage, ApplicationStatusPage, ChangePasswordPage
fixtures/     auth.fixture.ts (api client, evidence capture, second-agent page), users.ts, applicationData.ts, referenceData.ts
utils/        apiClient.ts, applicationBuilder.ts (fast API set-up), assertions.ts, dataGenerator.ts, fileUploadHelper.ts,
              testHelpers.ts, flows.ts, messages.ts, premium.ts, testMeta.ts, env.ts, global-setup.ts
docs/         test-case-index.json / .csv  (the 81 test cases: id, risk, seeded defect, tags)
scripts/      check-traceability.js
reports/      HTML report, JUnit, JSON, traces, screenshots, videos (git-ignored)
.github/workflows/playwright.yml
```

## 5. How it works

- **Page Object Model.** Tests contain business assertions; page objects hold selectors and actions. Locators are the application's own
  `data-testid` values (the Lab Manual's sample ids `login-email` / `login-submit` are *not* what this build uses).
- **Fast set-up through the API.** `applicationBuilder.buildApplication()` creates and fills an application up to any step
  (`draft`, `client`, `address`, `kyc`, `product`, `riders`, `beneficiaries`, `documents`). UI tests then start at the step under test.
- **Saved logins.** Global setup logs in once per seeded role and stores the session under `.auth/`. Only the login tests perform a UI login.
- **API rules.** The API is protected by a static `X-API-Key`; the acting agent is chosen with `agent_email` (if omitted the API silently uses
  `learner001`). Every API call passes the agent explicitly. UI and API values are only compared for the **same agent**.
  API paths have no leading slash and the base URL ends with `/` (otherwise `/api` is dropped by URL resolution).
- **Browser dialogs.** Over-allocation uses `alert()` and the irrevocable designation uses `confirm()`; `withDialogs()` answers and records them.
- **Browser validation.** Forms use HTML `required`; `disableBrowserValidation()` is used to reach the server-side messages as well.
- **Evidence.** Screenshot and video on failure, trace on first retry (retain-on-failure in CI), console errors and failed requests attached to
  the report for failing tests, HTML + JUnit + JSON reports.
- **Tolerant messages.** Expected messages in `utils/messages.ts` are regular expressions. Where the documents do not say *where* an error
  appears (form or review page), the helper checks both and records the observed location as a report annotation (`observation`).

## 6. Classifying a failure (before logging a defect)

Every failure is one of: **application defect**, **automation defect**, **test-data issue**, **environment issue**, or **unstable test**.

1. Re-run the single test (`--workers=1`, `--headed`). A failure that appears only under parallel load is an isolation observation, not a release blocker.
2. Open the trace (`npx playwright show-trace <trace.zip>`): locator/timing problem (automation) or unexpected response (application)?
3. Check the data: fresh application, correct agent, `agent_email` equal to the UI user.
4. For UI-versus-API mismatches confirm **both sides describe the same agent and scope** before calling it a defect.
5. Reproduce manually. Then log it with steps, evidence and business impact. A failing P1 test confirmed as an application defect is release-blocking.

Failing tests are **not automatically seeded defects**: the seeded defects are to be found by executing the tests and analysing the failures.
Report expected seeded defects and unexpected defects separately (Q-17).

## 7. First run (what to expect)

Run the smoke suite first (`npm run test:smoke`), then the rest. The following were derived from the application's markup and rules but could not
be confirmed against the live app, so check them if a test fails:

- Rider rows are found by name text (`RIDERS[...].rowPattern` in `fixtures/referenceData.ts`). Adjust a pattern if a rider name differs.
- Exact wording of error messages (`utils/messages.ts`) and whether an error appears on the form or on the review page.
- `TC-DOC-003` needs the server's PHP upload limit to be at least 5 MB, otherwise the 5,120 KB file is refused for an environment reason.
- `TC-AUTH-006` assumes `agent.locked` is still locked (its lock time must not have expired) and `TC-AUTH-007` is skipped unless `DISPOSABLE_USER` is set.
- Date-boundary tests (age 18/65) use the runner's clock; run them from a machine whose date matches the VM's, especially near midnight.
- Observations recorded rather than asserted: `TC-DOC-006` is skipped because review errors are plain text, not links; `TC-RID-006`,
  `TC-KYC-005` and `TC-WF-005` document behaviour that the Functional Module description requires but the markup may not implement. Raise these
  with your mentor.

## 8. CI/CD (GitHub Actions)

`.github/workflows/playwright.yml` has two jobs:

- **static-checks** (GitHub-hosted, on every push/PR): type-check and traceability. Needs no application.
- **tests** (manual `workflow_dispatch` or nightly, **self-hosted runner on the lab VM**, label `lab-vm`): runs the chosen suite and uploads the
  HTML report, traces, screenshots and videos as artifacts.

**Limitation (agreed in Q-13):** the app runs on a lab VM that GitHub-hosted runners cannot reach, so the application tests are started manually
from the VM (or by a self-hosted runner installed there). Add the secrets `INSURANCE_BASE_URL`, `INSURANCE_API_KEY`, `INSURANCE_PASSWORD`,
`LEARNER_USER` (and optionally `DISPOSABLE_USER`) to the repository.

## 9. Traceability

`docs/test-case-index.json` (and `.csv`) lists every test case with its validation ID, risk IDs, seeded-defect candidates, layer, type, priority
and tags. `npm run traceability` fails if a test case is missing or implemented twice. The source documents are the Submission 1 package
(QA Plan, Workflow Notes, Validation Strategy, Risk List, Assumptions) and the Test Case Design Sheet v1.1.

## 10. Security

Credentials, the API key and session files (`.env`, `.auth/`) are git-ignored. Do not paste them, or traces/HAR files that contain them, into
documents, chats or screenshots that leave the course workspace.
