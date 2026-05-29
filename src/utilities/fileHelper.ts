import { mkdir } from 'node:fs/promises';

export class FileHelper {
  static async ensureDirectory(path: string): Promise<string> {
    await mkdir(path, { recursive: true });
    return path;
  }
}
