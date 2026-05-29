export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface BrowserSettings {
  name: BrowserName;
  browsers?: BrowserName[];
  headless: boolean;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
}

export interface ApplicationSettings {
  baseUrl: string;
}

export interface ApiSettings {
  baseUrl: string;
  timeoutMs: number;
}

export interface DatabaseSettings {
  connectionString: string;
}

export interface TestSettings {
  browser: BrowserSettings;
  application: ApplicationSettings;
  api: ApiSettings;
  database: DatabaseSettings;
}
