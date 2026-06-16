import type { Page } from '@playwright/test';
import { UiActions } from '../actions/uiActions.js';
import type { UiWaitSettings } from '../config/testSettings.js';
import { Waits } from './waits.js';

export class BasePage {
  readonly actions: UiActions;
  readonly waits: Waits;

  constructor(readonly page: Page, waitSettings: UiWaitSettings = {}) {
    this.actions = new UiActions(page, waitSettings);
    this.waits = new Waits(page, waitSettings);
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waits.forPageReady();
  }

  async waitUntilReady(): Promise<void> {
    await this.waits.forPageReady();
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async titleContains(expected: string): Promise<boolean> {
    return (await this.title()).includes(expected);
  }

  locator(selector: string) {
    return this.page.locator(selector);
  }
}
