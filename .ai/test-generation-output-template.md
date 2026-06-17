# Test Generation Output Template

Use this template when converting raw Playwright recorder output into a framework-compatible test.

## Framework Mapping

### Models

Reuse:

- None identified.

Create:

- None.

Update:

- None.

Reasoning:

- Explain whether the recorded flow contains structured business or test data that should be modeled.

### Pages

Reuse:

- None identified.

Create:

- None.

Update:

- None.

Reasoning:

- Explain which screens, panels, or stable UI areas are involved and whether existing page objects cover them.
- Explain each page/component readiness signal and whether it needs to override `waitUntilReady()`.

### Test Data

Reuse:

- None identified.

Create:

- None.

Update:

- None.

Reasoning:

- Explain which values should be reusable data, which values should be inline, and which recorder values should be discarded.

### Workflows

Reuse:

- None identified.

Create:

- None.

Update:

- None.

Reasoning:

- Explain the business journey represented by the recorded steps and whether it belongs in a workflow.
- Explain where the workflow should call page/component `waitUntilReady()` after navigation or state transitions.

### Tests

Create:

- None.

Update:

- None.

Reasoning:

- Explain the final test intent, expected describe block, and expected test name.

## Recorder Cleanup

Discard or generalize:

- None identified.

Keep:

- None identified.

Reasoning:

- Explain which recorded details are meaningful and which are implementation noise.

## Naming And Contracts

Naming decisions:

- None identified.

Method and return-shape contracts:

- None identified.

Assertion inputs:

- None identified.

Reasoning:

- Explain the approved artifact names, page/workflow method signatures, workflow return values, and assertion input types.

## Interaction Catalog Mapping

Use framework helpers:

- None identified.

App-specific interactions:

- None identified.

Framework enhancement proposals:

- None.

## Assertions

Recommended assertions:

- None identified.

Reasoning:

- Explain what outcome proves the scenario worked.

Missing context:

- None.

## Readiness And Waiting

Page readiness methods:

- None identified.

Workflow transition waits:

- None identified.

Fallback waits or risks:

- None.

## Proposed File Changes

Create:

- None.

Update:

- None.

No change:

- None.

## Generated Code

Provide generated code grouped by file path.

```ts
// path/to/file.ts
```

## Assumptions

- None.

## Confidence

Confidence: High | Medium | Low

Reason:

- Explain the confidence level in one or two sentences.
