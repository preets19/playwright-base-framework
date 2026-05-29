import { rm } from 'node:fs/promises';

const paths = ['dist', 'playwright-report', 'test-results'];

await Promise.all(
  paths.map((path) => rm(path, { recursive: true, force: true }))
);
