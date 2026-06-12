# Test Generation Lessons Learned

Use this file to capture reusable lessons from comparing generated test output with the final accepted implementation.

These lessons should be included in future test-generation prompts.

## Active Lessons

- Prefer reusing existing page objects, workflows, models, and test data before creating new artifacts.
- Keep generated specs focused on business intent; move locator-level interactions into page objects.
- Add meaningful assertions when recorder output only contains actions.
- Remove dynamic query parameters and cache-busting values unless they affect test behavior.
- Mark assumptions clearly when the recorded flow does not reveal the full test intent.

## Candidate Lessons To Promote

Use this section for lessons that appeared in one review but need more examples before becoming active rules.

- None yet.

## Retired Lessons

Use this section for lessons that no longer apply because the framework convention changed.

- None yet.
