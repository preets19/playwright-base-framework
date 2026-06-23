# Test Generation Rules — Compact Digest

Compacted from `test-generation-rules.md`, `test-generation-output-template.md`, and `lessons-learned.md`. This keeps only what the five guided-flow prompts (Recorder Parser, Framework Mapper, Artifact Contract Designer, Code Generator, Reviewer) do not already instruct themselves — general principles those prompts already enforce through their own phases and JSON schemas (reuse-before-create, business-intent-over-recorder-mechanics, the page/workflow/test ownership split, assertion-quality checks, etc.) are intentionally omitted here.

## Repository Ownership
- Base framework owns: Playwright fixtures, base page behavior, UI actions/waits, API and database helpers, config/logging/reporting/shared utilities.
- App automation repos own: `_automation/pages`, `_automation/workflows`, `_automation/models`, `_automation/tests`, `_automation/test-data`, app-specific configuration.
- Never add app-specific pages, workflows, models, tests, or test data to the base framework package.

## Naming
- `camelCase` for files, variables, methods, locator fields. `PascalCase` for classes, interfaces, type aliases.
- Page files/classes end with `Page` (`checkoutPage.ts` / `CheckoutPage`); workflow files/classes end with `Workflow`; model files/interfaces end with `Model`; spec files end with `.spec.ts`.
- Locator fields are `private readonly`, named with a semantic name plus full element-type suffix (`loginButton`, `countrySelect`, `firstNameInput`, `successMessage`, `accountMenu`, `profileMenuItem`).
- No abbreviated UI prefixes (`btn`, `dd`, `ddl`, `txt`, `lbl`, `msg`).
- Use app/domain prefixes only when multiple systems or domains coexist in the same automation repo and the prefix prevents ambiguity.

## Recorder Cleanup
- Discard or generalize dynamic query parameters and cache-busting values from the recorded entry URL/navigation unless they affect test behavior.
- State explicitly why a new artifact was needed over reusing/extending an existing one, even when the artifact category's own schema has no dedicated `reason` field for that decision.

## Page Objects & Readiness
- Readiness signals not already implied by Prompt 1's `boundaryType` taxonomy (route/modal/drawer/popover/menu/tab/panel/wizardStep/headingState already cover most UI-boundary-based readiness): a hidden loading indicator/spinner, and numeric/count-based state changes such as a loaded result count or an updated cart count.
- Use network waits only when the app repo already follows that convention, or UI signals are insufficient and the endpoint is stable.
- If no observable readiness signal exists, a fallback wait may still be used, but keep it isolated, call out the risk, and justify it explicitly — don't silently default to a fixed sleep.

## Workflows
- When a workflow's recorded trace includes a `uiBoundary`-triggering action (any boundaryType — route, modal, drawer, popover, menu, tab, panel, wizard step), call the destination page/component's `waitUntilReady()` immediately after that action. This is a generation-time action rule layered on top of Prompt 1's existing boundary classification — it doesn't introduce a separate list of trigger categories to re-detect.

## Models
- Create or update a model when recorder output reveals a reusable concept such as: User, Product, Account, Address, Search criteria, Navigation target, Form input.
- Do not create a model for one-off primitive values unless doing so matches an existing convention.

## Test Data
- Avoid dynamic/non-deterministic values in test data unless the scenario specifically requires uniqueness.

## Assertions
- Success-criterion derivation is intentionally generic across scenario types (see Prompt 1's successCoverage mechanism) rather than enumerated per scenario type — this is deliberate, not a gap to fill later.

## Tests
- Specs import `expect`/`test` from the framework package (`@your-org/playwright-base-framework`), not directly from `@playwright/test`.
- Use soft assertions only when continuing past a failure would give useful diagnostic value — not as a default.

## Interaction Catalog
Prefer these framework helpers over raw Playwright calls:
- `actions.click`, `actions.doubleClick`, `actions.rightClick`
- `actions.fill`, `actions.fillTextArea`, `actions.clearAndFill`
- `actions.selectByText`, `actions.selectByValue`, `actions.selectMultipleByText`, `actions.selectMultipleByValue`
- `actions.check`, `actions.uncheck`, `actions.selectRadio`, `actions.selectComboboxOption`, `actions.selectMultiChoiceOption`
- `actions.uploadFile`
- `actions.press`, `actions.pressEnter`, `actions.typeSequentially`
- `actions.clickMenuItem`, `actions.clickTab`, `actions.expandAccordion`, `actions.closeModal`, `actions.dismissToast`
- `actions.clickTableRowByText`, `actions.paginateNext`
- `waits.forVisible`, `waits.forHidden`, `waits.forEditable`, `waits.forCountAtLeast`, `waits.until`
- `waits.forResults`, `waits.forModalVisible`, `waits.forModalHidden`, `waits.forToastVisible`, `waits.forToastHidden`

If a needed interaction is missing from this catalog: implement it in the app-owned page object first, and include a framework enhancement proposal — do not edit the framework package directly from a generated-test task.
