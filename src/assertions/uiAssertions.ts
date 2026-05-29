import { expect, type Locator } from '@playwright/test';

export class UiAssertions {
  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
