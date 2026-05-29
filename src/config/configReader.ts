import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { TestSettings } from './testSettings.js';

export class ConfigReader {
  static read(path = 'appsettings.json'): TestSettings {
    const resolvedPath = resolve(process.cwd(), path);
    const content = readFileSync(resolvedPath, 'utf-8');
    return JSON.parse(content) as TestSettings;
  }
}
