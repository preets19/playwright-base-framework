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

## Assertions

Recommended assertions:

- None identified.

Reasoning:

- Explain what outcome proves the scenario worked.

Missing context:

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
