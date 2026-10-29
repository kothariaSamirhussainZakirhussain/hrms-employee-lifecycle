import { expect, test } from '../src/fixtures/test';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

/** Letters only, unique per run, so repeated runs never collide on the shared demo. */
const uniqueName = (prefix: string): string =>
  prefix + Date.now().toString(36).replace(/[0-9]/g, (digit) => 'abcdefghij'[Number(digit)]);

test('HRMS employee lifecycle: create, search, update, delete', async ({
  loginPage,
  addEmployeePage,
  employeeListPage,
  employeeDetailsPage,
}) => {
  const firstName = uniqueName('Sam');
  const lastName = uniqueName('Test');
  const updatedFirstName = uniqueName('Ravi');
  const updatedLastName = uniqueName('Shah');
  const updatedNationality = 'Indian';
  let employeeId = '';

  await test.step('Step 1: Login as Admin', async () => {
    await loginPage.open();
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await loginPage.expectLoggedIn();
  });

  await test.step('Step 2: Create employee and validate dynamic Employee ID', async () => {
    await addEmployeePage.open();
    employeeId = await addEmployeePage.readGeneratedEmployeeId();
    expect(employeeId, 'Employee ID must be auto-generated').toMatch(/^\d+$/);

    await addEmployeePage.fillName(firstName, lastName);
    await addEmployeePage.save();

    await employeeDetailsPage.expectLoaded();
    await employeeDetailsPage.expectEmployeeId(employeeId);
  });

  await test.step('Step 3: Search employee by generated ID', async () => {
    await employeeListPage.open();
    await employeeListPage.searchById(employeeId);
    await employeeListPage.expectRecordVisible(employeeId, [firstName, lastName]);
  });

  await test.step('Step 4: Update employee details', async () => {
    await employeeListPage.openEmployee(employeeId);
    await employeeDetailsPage.expectLoaded();
    await employeeDetailsPage.update(updatedFirstName, updatedLastName, updatedNationality);
  });

  await test.step('Step 5: Verify update', async () => {
    await employeeListPage.open();
    await employeeListPage.searchById(employeeId);
    await employeeListPage.expectRecordVisible(employeeId, [updatedFirstName, updatedLastName]);
    await employeeListPage.openEmployee(employeeId);
    await employeeDetailsPage.expectDetails(updatedFirstName, updatedLastName, updatedNationality);
  });

  await test.step('Step 6: Delete employee', async () => {
    await employeeListPage.open();
    await employeeListPage.searchById(employeeId);
    await employeeListPage.deleteEmployee(employeeId);
  });

  await test.step('Step 7: Search after deletion returns no records', async () => {
    await employeeListPage.searchById(employeeId);
    await employeeListPage.expectNoRecords();
  });
});
