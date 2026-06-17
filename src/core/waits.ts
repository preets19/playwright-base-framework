import { expect, type Locator, type Page } from '@playwright/test';
import type { UiWaitSettings } from '../config/testSettings.js';

export interface WaitOptions {
  description?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

export const DEFAULT_UI_TIMEOUT_MS = 120_000;
export const DEFAULT_UI_POLL_INTERVAL_MS = 500;

export class Waits {
  constructor(
    private readonly page: Page,
    private readonly settings: UiWaitSettings = {}
  ) {}

  async forAttached(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toBeAttached({ timeout: this.timeout(options) });
  }

  async forVisible(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toBeVisible({ timeout: this.timeout(options) });
  }

  async forHidden(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toBeHidden({ timeout: this.timeout(options) });
  }

  async forEnabled(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toBeEnabled({ timeout: this.timeout(options) });
  }

  async forEditable(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toBeEditable({ timeout: this.timeout(options) });
  }

  async forText(locator: Locator, value: string | RegExp, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toContainText(value, { timeout: this.timeout(options) });
  }

  async forExactText(locator: Locator, value: string | RegExp, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toHaveText(value, { timeout: this.timeout(options) });
  }

  async forCount(locator: Locator, count: number, options: WaitOptions = {}): Promise<void> {
    await expect(locator, options.description).toHaveCount(count, { timeout: this.timeout(options) });
  }

  async forCountAtLeast(locator: Locator, count: number, options: WaitOptions = {}): Promise<void> {
    await expect
      .poll(async () => locator.count(), {
        message: options.description,
        timeout: this.timeout(options),
        intervals: [this.pollInterval(options)]
      })
      .toBeGreaterThanOrEqual(count);
  }

  async forResults(locator: Locator, minimumCount = 1, options: WaitOptions = {}): Promise<void> {
    await this.forCountAtLeast(locator, minimumCount, options);
  }

  async forModalVisible(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.forVisible(locator, options);
  }

  async forModalHidden(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.forHidden(locator, options);
  }

  async forToastVisible(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.forVisible(locator, options);
  }

  async forToastHidden(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.forHidden(locator, options);
  }

  async forUrlContains(value: string | RegExp, options: WaitOptions = {}): Promise<void> {
    await expect(this.page, options.description).toHaveURL(value instanceof RegExp ? value : new RegExp(value), {
      timeout: this.timeout(options)
    });
  }

  async forPageReady(options: WaitOptions = {}): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: this.timeout(options) });
  }

  async until(
    callback: () => Promise<boolean> | boolean,
    options: WaitOptions = {}
  ): Promise<void> {
    await expect
      .poll(async () => callback(), {
        message: options.description,
        timeout: this.timeout(options),
        intervals: [this.pollInterval(options)]
      })
      .toBe(true);
  }

  private timeout(options: WaitOptions): number {
    return options.timeoutMs ?? this.settings.timeoutMs ?? DEFAULT_UI_TIMEOUT_MS;
  }

  private pollInterval(options: WaitOptions): number {
    return options.pollIntervalMs ?? this.settings.pollIntervalMs ?? DEFAULT_UI_POLL_INTERVAL_MS;
  }
}
