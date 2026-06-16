import type { Locator, Page } from '@playwright/test';
import type { UiWaitSettings } from '../config/testSettings.js';
import { DEFAULT_UI_TIMEOUT_MS, Waits, type WaitOptions } from '../core/waits.js';

export class UiActions {
  private readonly waits: Waits;

  constructor(
    private readonly page: Page,
    private readonly waitSettings: UiWaitSettings = {}
  ) {
    this.waits = new Waits(page, waitSettings);
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await this.waits.forEnabled(locator, options);
    await locator.click({ timeout: this.timeout(options) });
  }

  async clear(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.clear({ timeout: this.timeout(options) });
  }

  async fill(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.fill(value, { timeout: this.timeout(options) });
  }

  async clearAndFill(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.clear({ timeout: this.timeout(options) });
    await locator.fill(value, { timeout: this.timeout(options) });
  }

  async text(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async selectByText(locator: Locator, text: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.selectOption({ label: text }, { timeout: this.timeout(options) });
  }

  async selectByValue(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.selectOption({ value }, { timeout: this.timeout(options) });
  }

  async hover(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await locator.hover({ timeout: this.timeout(options) });
  }

  async scrollIntoView(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await locator.scrollIntoViewIfNeeded({ timeout: this.timeout(options) });
  }

  async pressEnter(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.press('Enter', { timeout: this.timeout(options) });
  }

  private timeout(options: WaitOptions): number {
    return options.timeoutMs ?? this.waitSettings.timeoutMs ?? DEFAULT_UI_TIMEOUT_MS;
  }
}
