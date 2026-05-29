import { expect, type APIResponse } from '@playwright/test';

export class ApiAssertions {
  static async expectStatus(response: APIResponse, status: number): Promise<void> {
    expect(response.status()).toBe(status);
  }

  static async expectOk(response: APIResponse): Promise<void> {
    expect(response.ok()).toBeTruthy();
  }

  static async json<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }
}
