# Split Project Structure

The active automation work is split into three independent local Git repositories:

```text
../playwright-base-framework/
../playwright-app-template/ or ../app-automation-repo/
../playwright-automation-dashboard/
```

## playwright-base-framework

Reusable framework package maintained by the framework/automation team.

It owns:

- framework fixtures
- `BasePage`
- UI/API/database helpers
- config reader
- reporting/logging hooks
- shared utilities

It does not own app-specific tests, pages, workflows, or test data.

## app

Independent application automation project maintained by a QA/app team.

It owns:

- `_automation/pages`
- `_automation/workflows`
- `_automation/models`
- `_automation/tests`
- `_automation/test-data`
- `appsettings.json`
- app-specific Playwright config and package dependency on the framework

During local development, `app` consumes the framework through a generated local tarball:

```json
"@your-org/playwright-base-framework": "file:../playwright-base-framework/your-org-playwright-base-framework-1.0.0.tgz"
```

Dashboard Home in `playwright-automation-dashboard` can run setup against a loaded app repo. During local phased development, setup builds and packs the sibling framework before installing app dependencies.

When the projects are pushed to GitHub or a package registry, replace the local tarball dependency with the approved remote package dependency.

## playwright-automation-dashboard

QA-facing dashboard and local Windows command tooling.

It owns:

- `Start Automation Dashboard.cmd`
- Dashboard Home
- copied Test Dashboard
- Windows setup, framework update, Git status, and stop command wrappers
- handoff between Dashboard Home and Test Dashboard

It does not own app page objects, app tests, or framework source code.

## Local QA Workflow After Split

From `playwright-automation-dashboard/`:

```text
Start Automation Dashboard.cmd
```

Then use Dashboard Home to discover and load an app automation repo. Use `Setup Automation`, `Open Test Dashboard`, `Check Git Status`, or `Update Framework` from there.

Framework owners work in `playwright-base-framework/` and run:

```cmd
npm.cmd run validate
npm.cmd run pack:local
```

Each folder has its own `.git` directory and can be opened, committed, and pushed independently.
