# Framework Repo Checklist

Before making this folder its own GitHub repo:

- `npm.cmd install` succeeds.
- `npm.cmd run validate` succeeds.
- `npm.cmd run pack:local` creates a package tarball.
- No app-specific pages, tests, workflows, models, or test data exist here.
- `package.json` has the intended package name.
- `.github/workflows/framework.yml` is present.
- `.gitignore` excludes `node_modules`, `dist`, `.npm-cache`, and generated tarballs.

Ownership:

- Framework/automation maintainers own this repo.
- QA/app teams consume this repo as a dependency.
