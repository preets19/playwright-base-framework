import type { Locator, Page } from '@playwright/test';
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

  /**
   * Returns the first candidate locator that resolves to exactly one visible element.
   * A candidate matching zero or multiple elements is skipped, not auto-narrowed with
   * .first() — an ambiguous match must fall through to the next candidate rather than
   * silently picking one of several matches.
   *
   * @category locatorResolution
   */
  async resolveLocator(candidates: Array<() => Locator>): Promise<Locator> {
    if (!candidates.length) {
      throw new Error('resolveLocator: at least one candidate is required.');
    }

    const attempts: string[] = [];

    for (let index = 0; index < candidates.length; index += 1) {
      let locator: Locator;
      let count: number;

      try {
        locator = candidates[index]();
        count = await locator.count();
      } catch (error) {
        attempts.push(`[${index}] threw while resolving: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }

      if (count !== 1) {
        attempts.push(`[${index}] ${this.describeLocator(locator)} — ${count} match(es)`);
        continue;
      }

      if (!(await locator.isVisible())) {
        attempts.push(`[${index}] ${this.describeLocator(locator)} — 1 match, not visible`);
        continue;
      }

      return locator;
    }

    throw new Error(
      `resolveLocator: no candidate resolved to exactly one visible element after trying ${candidates.length} candidate(s):\n${attempts
        .map((attempt) => `  ${attempt}`)
        .join('\n')}`
    );
  }

  private describeLocator(locator: Locator): string {
    try {
      return String(locator);
    } catch {
      return '<locator>';
    }
  }

  /**
   * Repeatedly attempts `resolve` (e.g. a `resolveLocator` call) until it succeeds, then force-clicks
   * the result and stops itself. Built for unpredictable, app-specific interruptions (cookie banners,
   * push-notification opt-ins, etc.) that can appear at any point during a test, including mid-wait --
   * Playwright's own `addLocatorHandler` only fires before actions, never before passive `expect()`-based
   * waits, so a continuous poll is the only way to catch one regardless of what the test is doing.
   * `resolve` failing (nothing to dismiss yet) is the expected, common case and is silently ignored.
   * Cleans up automatically on page close, but the returned stop function can be called earlier if needed.
   *
   * @category locatorResolution
   */
  pollAndDismiss(resolve: () => Promise<Locator>, options: { intervalMs?: number } = {}): () => void {
    let interval: ReturnType<typeof setInterval>;
    const stop = () => clearInterval(interval);

    interval = setInterval(() => {
      resolve()
        .then((locator) => locator.click({ force: true, timeout: 500 }))
        .then(stop)
        .catch(() => {});
    }, options.intervalMs ?? 250);

    this.page.once('close', stop);

    return stop;
  }
}
