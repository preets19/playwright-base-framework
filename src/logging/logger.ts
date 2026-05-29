export class Logger {
  info(message: string): void {
    console.info(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  error(message: string, error?: unknown): void {
    console.error(message, error);
  }
}
