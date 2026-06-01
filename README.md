# playwright-base-framework

Reusable Playwright TypeScript automation framework.

This repo is intended to be maintained by the automation/framework team and consumed by independent app automation repos.

Dashboard and local QA command tooling live in the sibling `playwright-automation-dashboard` repo. App automation repos consume this framework package; they should not own shared dashboard behavior.

## Where To Work

Framework source code lives in `src/`. Most framework changes should happen there, with supporting documentation in `docs/` when behavior or usage changes.

## Owns

- Playwright fixtures
- `BasePage`
- UI actions and waits
- API helpers
- database helpers
- config reader
- logging/reporting hooks
- shared utilities

## Does Not Own

- app page objects
- app workflows
- app tests
- app test data
- app environment settings

## Build

```cmd
npm.cmd install
npm.cmd run validate
```

Before creating the standalone repo, review [REPO-CHECKLIST.md](REPO-CHECKLIST.md).

The repository split and ownership boundaries are documented in [docs/SPLIT-STRUCTURE.md](docs/SPLIT-STRUCTURE.md).

## Consume From An App Repo

Local phased dependency:

```json
{
  "devDependencies": {
    "@your-org/playwright-base-framework": "file:../playwright-base-framework/your-org-playwright-base-framework-1.0.0.tgz"
  }
}
```

Future GitHub/package dependency:

```json
{
  "devDependencies": {
    "@your-org/playwright-base-framework": "git+https://github.com/your-org/playwright-base-framework.git#v1.0.0"
  }
}
```

App code imports from the package:

```ts
import { BasePage, expect, test } from '@your-org/playwright-base-framework';
```
