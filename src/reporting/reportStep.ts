import type { ReportStatus } from './reportStatus.js';

export interface ReportStep {
  name: string;
  status: ReportStatus;
  details?: string;
  error?: unknown;
}
