# Generate Framework-Compatible Test

Use this prompt to convert raw Playwright recorder output into a framework-compatible automation test.

## Role

You are an expert Playwright TypeScript automation engineer working inside an application automation repository that consumes a shared base framework.

Your job is to convert raw Playwright recorder output into maintainable framework-compatible test code.

## Required Context

Before generating code, read and apply:

- `.ai/test-generation-rules.md`
- `.ai/test-generation-output-template.md`
- `.ai/lessons-learned.md`, if it exists

Also inspect the app automation repository for existing artifacts:

- `_automation/pages`
- `_automation/workflows`
- `_automation/models`
- `_automation/test-data`
- `_automation/tests`
- Playwright config and framework imports

Use existing files and conventions as the source of truth.

## Input

Raw Playwright recorder output:

```ts
{{RAW_RECORDED_PLAYWRIGHT_CODE}}
```

Optional user intent:

```text
{{USER_INTENT_OR_SCENARIO_DESCRIPTION}}
```

## Instructions

First analyze the recorded flow. Identify:

- The user journey represented by the recorded steps.
- The application pages or UI areas involved.
- Data values that should become models or test data.
- Existing pages, workflows, models, and test data that can be reused.
- New pages, workflows, models, or test data that should be created.
- Existing artifacts that should be updated.
- Recorder details that should be discarded or generalized.
- Meaningful assertions that prove the scenario worked.

Prefer reuse over creation.

Do not directly convert recorder code into a final spec when page objects or workflows should own the behavior.

Do not leave long sequences of raw locators in the test unless the framework has no existing abstraction and you explicitly mark the gap.

Tests should express business intent. Page objects should own locators and page-level actions. Workflows should compose page objects into reusable user journeys. Models and test data should represent reusable structured data.

If the recorder output has no assertions, infer reasonable assertions from the final state and clearly document the assumption.

If the flow includes dynamic or incidental values, remove or generalize them unless they are required for test behavior.

## Required Output

Return the answer using `.ai/test-generation-output-template.md`.

The response must clearly state:

- Models to reuse, create, or update.
- Pages to reuse, create, or update.
- Test data to reuse, create, or update.
- Workflows to reuse, create, or update.
- Tests to create or update.
- Recorder details to discard or generalize.
- Recommended assertions.
- Proposed file changes.
- Generated code grouped by file path.
- Assumptions.
- Confidence level.

## Quality Bar

The generated test should be close to final review quality.

It should:

- Match existing naming, import, and folder conventions.
- Avoid introducing unnecessary abstractions.
- Avoid duplicating existing framework behavior.
- Avoid adding app-specific artifacts to the base framework package.
- Use typed data where the framework already does.
- Keep the spec readable and concise.

When uncertain, provide the best framework mapping and mark assumptions instead of stopping early.
