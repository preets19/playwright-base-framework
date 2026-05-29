import { expect, type Locator, type Page } from '@playwright/test';

export class Waits {
  constructor(private readonly page: Page) {}

  async forVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async forHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async forEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async forUrlContains(value: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(value instanceof RegExp ? value : new RegExp(value));
  }

  async forPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
