# Interaction Catalog

This catalog defines the shared interaction vocabulary for framework-compatible UI automation.

Use these helpers from page objects and app components. Specs should stay at business intent level and should not contain raw Playwright locator chains unless a repo has no suitable abstraction yet.

## Principles

- Prefer the smallest reliable interaction that proves the test purpose.
- Put locators and reusable interaction details in page objects or app components.
- Use framework `actions` and `waits` before raw Playwright calls.
- Use direct navigation for setup when menu navigation is not the behavior under test.
- Use observable readiness signals instead of fixed sleeps.
- Add app-specific page/component methods before adding new framework helpers.

## Implemented Actions

### Pointer Actions

| Helper | Use When |
| --- | --- |
| `actions.click(locator, options?)` | Click a visible, enabled element. |
| `actions.doubleClick(locator, options?)` | Double-click an item such as an editable grid cell. |
| `actions.rightClick(locator, options?)` | Open a context menu or perform a right-click action. |
| `actions.hover(locator, options?)` | Reveal hover-only UI or tooltips. |
| `actions.scrollIntoView(locator, options?)` | Bring an element into viewport before reading or interacting. |

### Text Entry

| Helper | Use When |
| --- | --- |
| `actions.fill(locator, value, options?)` | Fill an input, textarea, or contenteditable element. |
| `actions.fillTextArea(locator, value, options?)` | Make textarea intent explicit while using the same fill behavior. |
| `actions.clear(locator, options?)` | Clear an editable field. |
| `actions.clearAndFill(locator, value, options?)` | Replace an existing field value. |
| `actions.typeSequentially(locator, value, options?)` | Type character by character only when the AUT depends on keyboard events. |

### Selects And Choices

| Helper | Use When |
| --- | --- |
| `actions.selectByText(locator, text, options?)` | Test data stores the visible option label. |
| `actions.selectByValue(locator, value, options?)` | Test data stores the option value/code. |
| `actions.selectMultipleByText(locator, labels, options?)` | Multi-select by visible labels. |
| `actions.selectMultipleByValue(locator, values, options?)` | Multi-select by option values/codes. |
| `actions.check(locator, options?)` | Check a checkbox or checkbox-like control. |
| `actions.uncheck(locator, options?)` | Uncheck a checkbox or checkbox-like control. |
| `actions.selectRadio(locator, options?)` | Select a radio option. |
| `actions.selectComboboxOption(combobox, option, options?)` | Open a custom combobox/autocomplete and select an option. |
| `actions.selectMultiChoiceOption(control, option, options?)` | Open a multi-choice picker and select an option/chip. |

### Files And Keyboard

| Helper | Use When |
| --- | --- |
| `actions.uploadFile(locator, filePath, options?)` | Upload one or more files through a file input. |
| `actions.press(locator, key, options?)` | Press a specific key or shortcut on a focused control. |
| `actions.pressEnter(locator, options?)` | Submit or confirm through Enter. |

### Stateful Menus

| Helper | Use When |
| --- | --- |
| `actions.clickMenuItem(menuButton, menuItem, options?)` | A menu, header nav, dropdown, or popover must be opened before clicking an item. |
| `actions.clickTab(tab, selectedPanel?, options?)` | Select a tab and optionally wait for its panel. |
| `actions.expandAccordion(header, panel?, options?)` | Expand an accordion section and optionally wait for its panel. |
| `actions.closeModal(closeButton, modal, options?)` | Close a modal/dialog and wait for it to disappear. |
| `actions.dismissToast(dismissButton, toast, options?)` | Dismiss a toast/banner and wait for it to disappear. |
| `actions.clickTableRowByText(rows, text, options?)` | Click the first table/grid row matching text. |
| `actions.paginateNext(nextButton, results?, options?)` | Go to next page and optionally wait for results. |

`clickMenuItem` retries the full open-and-click sequence. This matters for menus that close because of focus shift, async page load, or re-render.

Example:

```ts
await this.actions.clickMenuItem(
  this.categoriesMenuButton,
  this.rentalsMenuItem,
  { description: 'Categories > Rentals' }
);
```

## Implemented Waits

| Helper | Use When |
| --- | --- |
| `waits.forAttached(locator, options?)` | Element must exist in the DOM. |
| `waits.forVisible(locator, options?)` | Element must be visible before use or assertion. |
| `waits.forHidden(locator, options?)` | Spinner, overlay, modal, or toast must disappear. |
| `waits.forEnabled(locator, options?)` | Button/control must be enabled. |
| `waits.forEditable(locator, options?)` | Field must be ready for text entry. |
| `waits.forText(locator, value, options?)` | Element should contain text. |
| `waits.forExactText(locator, value, options?)` | Element should exactly match text. |
| `waits.forCount(locator, count, options?)` | Collection should have an exact count. |
| `waits.forCountAtLeast(locator, count, options?)` | Results/table/list should have at least a count. |
| `waits.forResults(locator, minimumCount?, options?)` | Results/table/list should contain at least one item by default. |
| `waits.forModalVisible(locator, options?)` | Modal/dialog/drawer should be visible. |
| `waits.forModalHidden(locator, options?)` | Modal/dialog/drawer should be hidden. |
| `waits.forToastVisible(locator, options?)` | Toast/banner/alert should be visible. |
| `waits.forToastHidden(locator, options?)` | Toast/banner/alert should be hidden. |
| `waits.forUrlContains(value, options?)` | Route or URL should match a path or pattern. |
| `waits.forPageReady(options?)` | Browser document reached `domcontentloaded`. |
| `waits.until(callback, options?)` | Custom app-state polling when no built-in wait fits. |

## Page Readiness

Every page object inherits:

```ts
async waitUntilReady(): Promise<void>
```

Override it when the page, panel, modal, or wizard step has a stronger readiness signal:

```ts
async waitUntilReady(): Promise<void> {
  await super.waitUntilReady();
  await this.waits.forVisible(this.heading, { description: 'Checkout heading' });
  await this.waits.forEditable(this.emailInput, { description: 'Guest email input' });
  await this.waits.forHidden(this.loadingSpinner, { description: 'Loading spinner' });
}
```

Workflow and page methods should call `waitUntilReady()` after navigation, form submission, search/filter actions, modal opens, wizard step changes, and other state transitions.

## Design Guidance For AI Generation

When converting recorder output:

- Map each low-level interaction to this catalog before writing raw Playwright code.
- Preserve interactions that prove the test purpose.
- Shorten setup steps when safe, including direct navigation to a stable route.
- Model stateful controls such as menus, comboboxes, modals, tabs, grids, and wizards as page/component methods.
- If a needed helper is missing from this catalog, implement the interaction in the app page object first and propose a framework helper separately.

## Future Candidates

These are common enterprise interactions that should be added when a real app needs them:

- `actions.sortGridColumn(...)`
- `actions.filterGridColumn(...)`
- `actions.selectTreeItem(...)`
- `actions.pickDate(...)`
- `actions.dragAndDrop(...)`
- `actions.switchToFrame(...)`
