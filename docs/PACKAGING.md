# Packaging

Framework maintainers own this package:

```text
@your-org/playwright-base-framework
```

## Local Package For Phased Testing

From `playwright-base-framework`:

```cmd
npm.cmd install
npm.cmd run pack:local
```

This creates:

```text
your-org-playwright-base-framework-1.0.0.tgz
```

The sibling `app` project can consume that tarball during the phased transition.

## Future Publishing Options

Recommended enterprise options:

- GitHub Packages
- Azure Artifacts
- private npm registry
- GitHub repo tags

App projects should consume a versioned framework package instead of copying framework files.

Configure npm registry and proxy settings before install or package restore in managed networks. Enterprise CI agents and developer workstations should not depend on direct public npm registry access unless that is explicitly approved.

## Release Flow

1. Update framework code.
2. Run `npm.cmd run validate`.
3. Version the package.
4. Publish/tag the package.
5. QA app repos update their dependency version.
