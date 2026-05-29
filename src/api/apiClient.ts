import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = ''
  ) {}

  async get(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(this.url(path), options);
  }

  async post(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(this.url(path), options);
  }

  async put(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(this.url(path), options);
  }

  async patch(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(this.url(path), options);
  }

  async delete(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(this.url(path), options);
  }

  private url(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}
