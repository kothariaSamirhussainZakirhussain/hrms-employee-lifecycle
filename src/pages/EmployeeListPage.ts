import { Locator, Page, expect } from '@playwright/test';

export class EmployeeListPage {
  private readonly heading: Locator;
  private readonly employeeIdFilter: Locator;
  private readonly searchButton: Locator;
  private readonly rows: Locator;
  private readonly confirmDelete: Locator;
  private readonly toast: Locator;
  private readonly spinner: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Employee Information' });
    this.employeeIdFilter = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText('Employee Id', { exact: true }) })
      .locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.rows = page.locator('.oxd-table-body .oxd-table-card');
    this.confirmDelete = page.getByRole('button', { name: 'Yes, Delete' });
    this.toast = page.locator('.oxd-toast');
    this.spinner = page.locator('.oxd-loading-spinner');
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
    await expect(this.heading).toBeVisible();
  }

  async searchById(employeeId: string): Promise<void> {
    await this.employeeIdFilter.fill(employeeId);
    await this.searchButton.click();
    await expect(this.spinner).toHaveCount(0);
  }

  rowFor(employeeId: string): Locator {
    return this.rows.filter({ has: this.page.getByText(employeeId, { exact: true }) });
  }

  async expectRecordVisible(employeeId: string, nameParts: string[]): Promise<void> {
    const row = this.rowFor(employeeId);
    await expect(row).toHaveCount(1);
    for (const part of nameParts) {
      await expect(row).toContainText(part);
    }
  }

  async expectNoRecords(): Promise<void> {
    await expect(this.page.getByText('No Records Found').first()).toBeVisible();
    await expect(this.rows).toHaveCount(0);
  }

  async openEmployee(employeeId: string): Promise<void> {
    await this.rowFor(employeeId).click();
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.rowFor(employeeId).locator('.bi-trash').click();
    await this.confirmDelete.click();
    await expect(this.toast.filter({ hasText: 'Successfully Deleted' }).first()).toBeVisible();
  }
}
