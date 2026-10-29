import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly dashboardHeading: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await expect(this.username).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible();
  }
}
