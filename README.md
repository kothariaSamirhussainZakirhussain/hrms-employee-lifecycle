# HRMS Employee Lifecycle Automation (OrangeHRM)

Playwright + TypeScript framework using the Page Object Model that automates the full
CRUD lifecycle of an employee on <https://opensource-demo.orangehrmlive.com/>
(Dyad Technologies assessment, Scenario 2).

## Scenario coverage

| Step | Action | Where |
|------|--------|-------|
| 1 | Login as Admin | `LoginPage` |
| 2 | Create employee | `AddEmployeePage` |
| 3 | Search employee (by generated ID) | `EmployeeListPage.searchById` |
| 4 | Update employee details (first name, last name, nationality) | `EmployeeDetailsPage.update` |
| 5 | Verify update (search result + details page) | `EmployeeListPage.expectRecordVisible`, `EmployeeDetailsPage.expectDetails` |
| 6 | Delete employee | `EmployeeListPage.deleteEmployee` |
| 7 | Search after deletion returns no records | `EmployeeListPage.expectNoRecords` |

Validation criteria (both are real assertions):

1. **Employee ID generated dynamically** - the ID is read from the pre-filled Add Employee form (never typed by the test), asserted numeric, matched on the saved record, and used for every later search.
2. **Search after deletion returns no records** - asserts "No Records Found" and zero table rows.

## Project structure

```
src/
  pages/      LoginPage, AddEmployeePage, EmployeeListPage, EmployeeDetailsPage
  fixtures/   test.ts - injects page objects into the test
tests/        employee-lifecycle.spec.ts - the scenario, one test.step per workflow step
playwright.config.ts
```

## Prerequisites

- Node.js 18+
- Internet access to the demo site

## Setup and run

```bash
npm install
npx playwright install chromium
cp .env.example .env   # base URL and Admin credentials (already filled with the public demo values)
npm test              # headless
npm run test:headed   # watch the browser
npm run report        # open the HTML report
```

## Reporting

HTML report in `playwright-report/` (every `test.step`, plus screenshot, video and trace on failure).

## Assumptions

- Base URL and Admin credentials come from `.env` at the project root (git-ignored; `.env.example` is the template). The values are the demo's public login, not secrets.
- Employee names get a unique letters-only suffix so repeated runs do not collide on the shared demo. The Employee ID is always system-generated and is kept as a string (it can have leading zeros).
- The test deletes the employee it creates as part of the scenario.
- No fixed sleeps: only Playwright auto-waiting and web-first assertions.
