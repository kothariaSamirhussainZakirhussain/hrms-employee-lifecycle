import { Locator, Page, expect } from '@playwright/test';

export class AddEmployeePage {
  private readonly heading: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly employeeId: Locator;
  private readonly saveButton: Locator;
  private readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Add Employee' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.employeeId = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText('Employee Id', { exact: true }) })
      .locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.toast = page.locator('.oxd-toast');
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/pim/addEmployee', { waitUntil: 'domcontentloaded' });
    await expect(this.heading).toBeVisible();
  }

  /**
   * The application pre-fills the Employee Id asynchronously; this waits for it
   * and returns the system-generated value (never typed by the test).
   */
  async readGeneratedEmployeeId(): Promise<string> {
    await expect(this.employeeId).not.toHaveValue('');
    return this.employeeId.inputValue();
  }

  async fillName(firstName: string, lastName: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await expect(this.toast.filter({ hasText: 'Successfully Saved' }).first()).toBeVisible();
  }
}
