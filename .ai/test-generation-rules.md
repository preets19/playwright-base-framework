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

In template repos, artifacts named `sample*` are reference examples. Use them to understand framework style and structure. When real app artifacts exist, prefer those real artifacts for reuse and extension before copying or modifying sample artifacts.

Clearly explain why each new artifact is needed instead of reusing or extending an existing one.

Recorder output is an input signal, not the final implementation style.

The generated test should be concise and written at the user-intent level. Move low-level interactions into page objects and multi-step user journeys into workflows.

Do not automate every recorded action by default. Preserve interactions that prove the stated behavior, and shorten setup steps when a stable direct route or existing workflow is more reliable.

Discard or generalize recorder details that are not meaningful to the test, such as:

- Dynamic query parameters
- Cache-busting values
- Incidental navigation details
- Redundant clicks
- Timing artifacts
- Browser-generated noise

## Naming Contract

Use consistent, readable names that match the app repo convention.

- Use `camelCase` for files, variables, methods, and locator fields.
- Use `PascalCase` for classes, interfaces, and type aliases.
- Page files/classes should end with `Page`, such as `checkoutPage.ts` and `CheckoutPage`.
- Workflow files/classes should end with `Workflow`, such as `checkoutWorkflow.ts` and `CheckoutWorkflow`.
- Model files/interfaces should end with `Model`, such as `checkoutModel.ts` and `CheckoutModel`.
- Spec files should end with `.spec.ts`.
- Locator fields should be `private readonly` and use semantic names plus full element-type suffixes, such as `loginButton`, `countrySelect`, `firstNameInput`, `successMessage`, `accountMenu`, or `profileMenuItem`.
- Do not use abbreviated UI prefixes such as `btn`, `dd`, `ddl`, `txt`, `lbl`, or `msg`.
- Use app or domain prefixes only when multiple systems or domains coexist in the same automation repo and the prefix prevents ambiguity.

## Artifact Contracts

Generated artifacts should agree on explicit contracts before code is written.

- Framework mapping should decide whether each artifact is reused, updated, created, or reference-only.
- Artifact design should define page method signatures, workflow method signatures, workflow return shape, assertion inputs, data ownership, and wait ownership.
- Code generation should implement the approved names and contracts without renaming artifacts or changing return shapes.
- Specs should assert against resolved strings, booleans, numbers, or typed result objects returned by workflows, not raw `Locator` objects, unless the local pattern explicitly uses page-owned assertion helpers.
- If a spec assertion uses `toContain`, `toEqual`, or similar value matchers, the workflow/page method should return a resolved value of the expected type.
- Page objects own locators and reusable page-level interactions.
- Workflows own multi-page journeys and return only the state needed for spec assertions.
- Tests own business-level assertions and should not duplicate page/workflow logic.

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
- Provide or override `waitUntilReady()` when the page, modal, panel, or wizard step has asynchronous content or a stable readiness signal.
- Use shared framework waits/actions such as `this.waits.forVisible(...)`, `this.waits.forHidden(...)`, `this.waits.forEditable(...)`, and `this.actions.click(...)` instead of fixed sleeps.
- Map reusable interactions to `docs/INTERACTION-CATALOG.md` before writing raw Playwright calls.
- Wait for meaningful UI readiness signals such as headings, editable fields, loaded result collections, hidden spinners, enabled buttons, route changes, or confirmation messages.

Page objects should not:

- Contain test assertions that belong in the spec unless the local pattern explicitly allows assertion helpers.
- Own multi-page business journeys.
- Hard-code test-specific data when data belongs in models or test-data files.
- Use `page.waitForTimeout()` for normal readiness. If no observable readiness signal exists, call out the risk and keep any fallback wait isolated and justified.
- Reimplement generic interactions already covered by the framework interaction catalog.

## Workflows

Workflows should:

- Compose pages into reusable user journeys.
- Represent business actions that span multiple page interactions.
- Return the page object or result object that the test should assert against.
- Accept typed model or test data inputs when the journey depends on data.
- Call page/component `waitUntilReady()` after navigation, route changes, search/filter actions, modal or drawer opens, checkout/wizard step changes, add-to-cart operations, form submissions, and other actions that change visible application state.
- Keep state-transition waits in workflows or page methods so specs remain concise and business-focused.

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

## Readiness And Waiting

Playwright auto-waits for actionability on the specific locator being clicked, filled, or selected, but it does not know when an application screen is business-ready.

Generated automation should use framework readiness patterns:

- Use `BasePage.waitUntilReady()` as the default page readiness hook.
- Override `waitUntilReady()` in app page objects when the page has dynamic content or known readiness signals.
- Use shared waits/actions instead of raw `expect(locator)` waits when a framework helper already exists.
- Prefer observable state over time delays: visible heading, hidden loading indicator, enabled submit button, loaded result count, URL/path change, updated cart count, or confirmation text.
- Use network waits only when the app repo already follows that convention or when UI signals are insufficient and the endpoint is stable.
- Keep readiness logic out of specs unless there is no suitable page/workflow abstraction yet.

## Interaction Catalog

Use `docs/INTERACTION-CATALOG.md` as the vocabulary for reusable UI interactions.

Generated page objects should prefer helpers such as:

- `actions.click`, `actions.doubleClick`, `actions.rightClick`
- `actions.fill`, `actions.fillTextArea`, `actions.clearAndFill`
- `actions.selectByText`, `actions.selectByValue`, `actions.selectMultipleByText`, `actions.selectMultipleByValue`
- `actions.check`, `actions.uncheck`, `actions.selectRadio`, `actions.selectComboboxOption`, `actions.selectMultiChoiceOption`
- `actions.uploadFile`
- `actions.press`, `actions.pressEnter`, `actions.typeSequentially`
- `actions.clickMenuItem`, `actions.clickTab`, `actions.expandAccordion`, `actions.closeModal`, `actions.dismissToast`
- `actions.clickTableRowByText`, `actions.paginateNext`
- `waits.forVisible`, `waits.forHidden`, `waits.forEditable`, `waits.forCountAtLeast`, and `waits.until`
- `waits.forResults`, `waits.forModalVisible`, `waits.forModalHidden`, `waits.forToastVisible`, and `waits.forToastHidden`

If recorder output opens a menu/dropdown/popover and then clicks an item, use a page/component method backed by `actions.clickMenuItem(...)` when the navigation itself is under test. If the menu navigation is only setup, prefer direct navigation to the workflow start page when the route is stable and existing conventions allow it.

If a needed reusable interaction is missing from the catalog, implement the behavior in the app-owned page object first and include a framework enhancement proposal instead of editing the framework from a generated test task.

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
