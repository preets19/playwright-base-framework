import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

export class ScreenshotService {
  constructor(private readonly page: Page) {}

  async capture(directory: string, name: string): Promise<string> {
    await mkdir(directory, { recursive: true });
    const safeName = name.replace(/[^a-z0-9._-]/gi, '_');
    const path = join(directory, `${safeName}_${new Date().toISOString().replace(/[:.]/g, '-')}.png`);
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }
}
