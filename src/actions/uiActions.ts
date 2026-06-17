import type { Locator, Page } from '@playwright/test';
import type { UiWaitSettings } from '../config/testSettings.js';
import { DEFAULT_UI_TIMEOUT_MS, Waits, type WaitOptions } from '../core/waits.js';

export interface MenuItemOptions extends WaitOptions {
  itemClickTimeoutMs?: number;
}

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

  async doubleClick(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await this.waits.forEnabled(locator, options);
    await locator.dblclick({ timeout: this.timeout(options) });
  }

  async rightClick(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await this.waits.forEnabled(locator, options);
    await locator.click({ button: 'right', timeout: this.timeout(options) });
  }

  async clear(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.clear({ timeout: this.timeout(options) });
  }

  async fill(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.fill(value, { timeout: this.timeout(options) });
  }

  async fillTextArea(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.fill(locator, value, options);
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

  async selectMultipleByText(locator: Locator, labels: string[], options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.selectOption(labels.map((label) => ({ label })), { timeout: this.timeout(options) });
  }

  async selectMultipleByValue(locator: Locator, values: string[], options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.selectOption(values.map((value) => ({ value })), { timeout: this.timeout(options) });
  }

  async check(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await this.waits.forEnabled(locator, options);
    await locator.setChecked(true, { timeout: this.timeout(options) });
  }

  async uncheck(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.waits.forVisible(locator, options);
    await this.waits.forEnabled(locator, options);
    await locator.setChecked(false, { timeout: this.timeout(options) });
  }

  async selectRadio(locator: Locator, options: WaitOptions = {}): Promise<void> {
    await this.check(locator, options);
  }

  async selectComboboxOption(combobox: Locator, option: Locator, options: MenuItemOptions = {}): Promise<void> {
    await this.clickMenuItem(combobox, option, options);
  }

  async selectMultiChoiceOption(control: Locator, option: Locator, options: MenuItemOptions = {}): Promise<void> {
    await this.clickMenuItem(control, option, options);
  }

  async uploadFile(locator: Locator, filePath: string | string[], options: WaitOptions = {}): Promise<void> {
    await this.waits.forAttached(locator, options);
    await locator.setInputFiles(filePath, { timeout: this.timeout(options) });
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

  async clickTab(tab: Locator, selectedPanel?: Locator, options: WaitOptions = {}): Promise<void> {
    await this.click(tab, options);
    if (selectedPanel) {
      await this.waits.forVisible(selectedPanel, options);
    }
  }

  async expandAccordion(header: Locator, panel?: Locator, options: WaitOptions = {}): Promise<void> {
    await this.click(header, options);
    if (panel) {
      await this.waits.forVisible(panel, options);
    }
  }

  async closeModal(closeButton: Locator, modal: Locator, options: WaitOptions = {}): Promise<void> {
    await this.click(closeButton, options);
    await this.waits.forHidden(modal, options);
  }

  async dismissToast(dismissButton: Locator, toast: Locator, options: WaitOptions = {}): Promise<void> {
    await this.click(dismissButton, options);
    await this.waits.forHidden(toast, options);
  }

  async clickTableRowByText(rows: Locator, text: string | RegExp, options: WaitOptions = {}): Promise<void> {
    const row = rows.filter({ hasText: text }).first();
    await this.click(row, options);
  }

  async paginateNext(nextButton: Locator, results?: Locator, options: WaitOptions = {}): Promise<void> {
    await this.click(nextButton, options);
    if (results) {
      await this.waits.forResults(results, 1, options);
    }
  }

  async press(locator: Locator, key: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEnabled(locator, options);
    await locator.press(key, { timeout: this.timeout(options) });
  }

  async typeSequentially(locator: Locator, value: string, options: WaitOptions = {}): Promise<void> {
    await this.waits.forEditable(locator, options);
    await locator.pressSequentially(value, { timeout: this.timeout(options) });
  }

  async clickMenuItem(menuButton: Locator, menuItem: Locator, options: MenuItemOptions = {}): Promise<void> {
    const itemClickTimeoutMs = options.itemClickTimeoutMs ?? 1_500;
    await this.waits.until(async () => {
      try {
        await menuButton.click({ timeout: itemClickTimeoutMs });
        await menuItem.click({ timeout: itemClickTimeoutMs });
        return true;
      } catch {
        return false;
      }
    }, options);
  }

  private timeout(options: WaitOptions): number {
    return options.timeoutMs ?? this.waitSettings.timeoutMs ?? DEFAULT_UI_TIMEOUT_MS;
  }
}
