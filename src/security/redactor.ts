export class Redactor {
  static redact(value: string): string {
    return value.replace(/password/gi, '[REDACTED]');
  }
}
