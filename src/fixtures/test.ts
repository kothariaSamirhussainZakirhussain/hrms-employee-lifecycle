import { test as base } from '@playwright/test';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { LoginPage } from '../pages/LoginPage';

interface Pages {
  loginPage: LoginPage;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  employeeDetailsPage: EmployeeDetailsPage;
}

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  addEmployeePage: async ({ page }, use) => use(new AddEmployeePage(page)),
  employeeListPage: async ({ page }, use) => use(new EmployeeListPage(page)),
  employeeDetailsPage: async ({ page }, use) => use(new EmployeeDetailsPage(page)),
});

export { expect } from '@playwright/test';
