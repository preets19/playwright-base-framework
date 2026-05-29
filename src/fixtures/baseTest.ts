import { test as base } from '@playwright/test';
import { ApiClient } from '../api/apiClient.js';
import { ConfigReader } from '../config/configReader.js';
import type { TestSettings } from '../config/testSettings.js';
import { SqlServerClient } from '../db/sqlServerClient.js';

type BaseFixtures = {
  settings: TestSettings;
  apiClient: ApiClient;
  dbClient: SqlServerClient;
};

export const test = base.extend<BaseFixtures>({
  settings: async ({}, use) => {
    await use(ConfigReader.read(process.env.APP_SETTINGS_PATH ?? 'appsettings.json'));
  },

  apiClient: async ({ request, settings }, use) => {
    await use(new ApiClient(request, settings.api.baseUrl));
  },

  dbClient: async ({ settings }, use) => {
    await use(new SqlServerClient(settings.database.connectionString));
  }
});

export const expect = test.expect;
