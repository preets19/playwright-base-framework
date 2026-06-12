# Test Generation Rules

These rules guide the conversion of raw Playwright recorder output into framework-compatible automation tests.

## Goal

Generate tests that are ready for the application automation framework with minimal manual refinement.

The generated result should identify and produce the right framework artifacts:

- Models
- Page objects
- Test data
- Workflows
- Tests

The final test should express business intent, not recorder mechanics.

## Repository Ownership

The base framework owns shared automation infrastructure, including:

- Playwright fixtures
- Base page behavior
- UI actions and waits
- API and database helpers
- Config, logging, reporting, and shared utilities

Application automation repositories own app-specific artifacts, including:

- `_automation/pages`
- `_automation/workflows`
- `_automation/models`
- `_automation/tests`
- `_automation/test-data`
- App-specific configuration

Do not add app-specific pages, workflows, models, tests, or test data to the base framework package.

## Generation Principles

Prefer reuse over creation.

Before proposing a new artifact, inspect the existing app automation structure for matching or reusable pages, workflows, models, and test data.

Check for both full and partial matches.

If an existing workflow, page, model, test-data file, or test partially maps to the requested scenario, prefer reuse, composition, or a focused update when that keeps ownership clear and avoids mixing unrelated behavior.

Clearly explain why each new artifact is needed instead of reusing or extending an existing one.

Recorder output is an input signal, not the final implementation style.

The generated test should be concise and written at the user-intent level. Move low-level interactions into page objects and multi-step user journeys into workflows.

Discard or generalize recorder details that are not meaningful to the test, such as:

- Dynamic query parameters
- Cache-busting values
- Incidental navigation details
- Redundant clicks
- Timing artifacts
- Browser-generated noise

## Tests

Tests should:

- Use the framework test fixture and assertion exports.
- Describe business behavior in readable language.
- Call workflows or high-level page methods.
- Keep raw locators out of the spec when a page object can own them.
- Assert meaningful outcomes, not only that actions completed.
- Use soft assertions only when continuing after a failure gives useful diagnostic value.

Tests should not:

- Contain long sequences of raw `page.getByRole`, `page.locator`, or `page.click` calls.
- Duplicate workflow logic.
- Inline reusable test data.
- Preserve recorder-generated values unless they are required for the scenario.

## Page Objects

Page objects should:

- Represent a screen, page, panel, or stable UI area.
- Own locators for that UI area.
- Provide readable methods for page-level actions.
- Provide assertion helpers or state methods when useful.
- Extend or follow the framework `BasePage` pattern when applicable.

Page objects should not:

- Contain test assertions that belong in the spec unless the local pattern explicitly allows assertion helpers.
- Own multi-page business journeys.
- Hard-code test-specific data when data belongs in models or test-data files.

## Workflows

Workflows should:

- Compose pages into reusable user journeys.
- Represent business actions that span multiple page interactions.
- Return the page object or result object that the test should assert against.
- Accept typed model or test data inputs when the journey depends on data.

Workflows should not:

- Replace page objects by owning all locators directly.
- Contain unrelated scenarios in one broad method.
- Hide important assertions that the test should make explicit.

## Models

Models should:

- Define typed shapes for reusable business or test entities.
- Be used when data has meaningful structure or appears in more than one place.
- Make generated tests easier to read and maintain.

Create or update a model when recorder output reveals a reusable concept such as:

- User
- Product
- Account
- Address
- Search criteria
- Navigation target
- Form input

Do not create a model for one-off primitive values unless doing so matches an existing convention.

## Test Data

Test data should:

- Live in app-owned test-data files.
- Export named, reusable data instances.
- Use model types when available.
- Avoid dynamic values unless the scenario requires uniqueness.

Prefer existing test data when it matches the scenario.

Create new test data when:

- The scenario needs a distinct reusable entity.
- Existing data would make the test misleading.
- The value is used by multiple generated artifacts.

## Assertions

Every generated test should include meaningful assertions.

Choose assertions based on the intent of the recorded flow:

- Successful navigation should assert the destination page, heading, title, URL, or key content.
- Successful login should assert an authenticated landing page or user-specific content.
- Form submission should assert a confirmation, persisted value, or resulting state.
- Search or filtering should assert relevant results.
- Error scenarios should assert the expected error state.

If recorder output does not include assertions, infer reasonable assertions from the final page or state and call out the assumption.

## Required Output

Every generation response must include:

- Existing artifacts to reuse.
- New artifacts to create.
- Existing artifacts to update.
- Recorder details to discard or generalize.
- Final test code.
- Any assumptions or unresolved questions.

The response should make it clear whether each model, page, workflow, and test-data item is reused, created, or updated.

## Confidence And Clarification

Proceed without asking questions when the framework structure and test intent are clear.

Ask for clarification only when a reasonable assumption would likely produce the wrong test behavior.

When confidence is low, still provide the best proposed mapping and clearly mark assumptions.
