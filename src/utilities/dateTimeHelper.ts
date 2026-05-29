export class DateTimeHelper {
  static utcTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}
