import type { ReportStep } from './reportStep.js';
import type { ReportStatus } from './reportStatus.js';

export class TestReporter {
  startTest(name: string): void {
    console.info(`START ${name}`);
  }

  recordStep(step: ReportStep): void {
    console.info(`${step.status.toUpperCase()} ${step.name}`, step.details ?? '');
  }

  finishTest(name: string, status: ReportStatus): void {
    console.info(`${status.toUpperCase()} ${name}`);
  }
}
