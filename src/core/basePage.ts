import type { Page } from '@playwright/test';
import { UiActions } from '../actions/uiActions.js';
import { Waits } from './waits.js';

export class BasePage {
  readonly actions: UiActions;
  readonly waits: Waits;

  constructor(readonly page: Page) {
    this.actions = new UiActions(page);
    this.waits = new Waits(page);
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
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
