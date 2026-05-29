# Split Project Structure

The active automation work is split into two independent local Git repositories:

```text
../playwright-base-framework/
../app/
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
- local dashboard and Windows launchers

During local development, `app` consumes the framework through a generated local tarball:

```json
"@your-org/playwright-base-framework": "file:../playwright-base-framework/your-org-playwright-base-framework-1.0.0.tgz"
```

`Setup Automation.cmd` in the app folder builds and packs the framework before installing app dependencies.

When the projects are pushed to GitHub or a package registry, replace the local tarball dependency with the approved remote package dependency.

## Local QA Workflow After Split

From `app/`:

```text
Setup Automation.cmd
Start Automation Dashboard.cmd
Update Framework.cmd
Stop Automation.cmd
```

Framework owners work in `playwright-base-framework/` and run:

```cmd
npm.cmd run validate
npm.cmd run pack:local
```

Each folder has its own `.git` directory and can be opened, committed, and pushed independently.
