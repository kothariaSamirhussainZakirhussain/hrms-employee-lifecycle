import { Locator, Page, expect } from '@playwright/test';

export class EmployeeDetailsPage {
  private readonly heading: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly employeeId: Locator;
  private readonly nationalityDropdown: Locator;
  private readonly personalSaveButton: Locator;
  private readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Personal Details' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.employeeId = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText('Employee Id', { exact: true }) })
      .locator('input');
    this.nationalityDropdown = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText('Nationality', { exact: true }) })
      .locator('.oxd-select-text');
    this.personalSaveButton = page
      .locator('form')
      .filter({ has: page.getByText('Employee Full Name') })
      .getByRole('button', { name: 'Save' });
    this.toast = page.locator('.oxd-toast');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.firstName).not.toHaveValue('');
  }

  async expectEmployeeId(employeeId: string): Promise<void> {
    await expect(this.employeeId).toHaveValue(employeeId);
  }

  async update(firstName: string, lastName: string, nationality: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.nationalityDropdown.click();
    await this.page.getByRole('option', { name: nationality, exact: true }).click();
    await this.personalSaveButton.click();
    await expect(this.toast.filter({ hasText: 'Successfully Updated' }).first()).toBeVisible();
  }

  async expectDetails(firstName: string, lastName: string, nationality: string): Promise<void> {
    await this.expectLoaded();
    await expect(this.firstName).toHaveValue(firstName);
    await expect(this.lastName).toHaveValue(lastName);
    await expect(this.nationalityDropdown).toHaveText(nationality);
  }
}
