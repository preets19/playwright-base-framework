import assert from 'node:assert/strict';
import { BasePage } from '../dist/core/basePage.js';

const page = new BasePage({});

function fakeLocator(count, visible, label) {
  return {
    label,
    count: async () => count,
    isVisible: async () => visible,
    toString: () => label
  };
}

// 1. First candidate resolves cleanly — later candidates must never be evaluated.
{
  let secondCalled = false;
  const result = await page.resolveLocator([
    () => fakeLocator(1, true, 'first'),
    () => {
      secondCalled = true;
      return fakeLocator(1, true, 'second');
    }
  ]);
  assert.equal(result.label, 'first');
  assert.equal(secondCalled, false, 'a candidate after a successful match must not be invoked');
}

// 2. The exact cricinfo failure mode: a candidate matching MULTIPLE visible elements must
//    be skipped, not narrowed with .first() — fall through to the next candidate instead.
{
  const result = await page.resolveLocator([
    () => fakeLocator(2, true, 'ambiguous-broad-scope'),
    () => fakeLocator(1, true, 'specific-scope')
  ]);
  assert.equal(result.label, 'specific-scope');
}

// 3. A single match that is not visible must be skipped (existence alone is not a hit).
{
  const result = await page.resolveLocator([
    () => fakeLocator(1, false, 'hidden-match'),
    () => fakeLocator(1, true, 'visible-match')
  ]);
  assert.equal(result.label, 'visible-match');
}

// 4. A zero-match candidate must be skipped.
{
  const result = await page.resolveLocator([
    () => fakeLocator(0, false, 'zero-match'),
    () => fakeLocator(1, true, 'fallback-match')
  ]);
  assert.equal(result.label, 'fallback-match');
}

// 5. A candidate factory that throws while building the locator is caught and skipped,
//    not allowed to abort the whole resolution.
{
  const result = await page.resolveLocator([
    () => {
      throw new Error('invalid selector syntax');
    },
    () => fakeLocator(1, true, 'recovered')
  ]);
  assert.equal(result.label, 'recovered');
}

// 6. When no candidate qualifies, the thrown error must name every attempt with enough
//    detail to diagnose why each one failed (zero match, multi-match, hidden, threw).
{
  await assert.rejects(
    () =>
      page.resolveLocator([
        () => fakeLocator(0, false, 'zero-match'),
        () => fakeLocator(2, true, 'multi-match'),
        () => fakeLocator(1, false, 'hidden-match'),
        () => {
          throw new Error('boom');
        }
      ]),
    (error) => {
      assert.match(error.message, /no candidate resolved to exactly one visible element/);
      assert.match(error.message, /after trying 4 candidate\(s\)/);
      assert.match(error.message, /\[0\] zero-match — 0 match\(es\)/);
      assert.match(error.message, /\[1\] multi-match — 2 match\(es\)/);
      assert.match(error.message, /\[2\] hidden-match — 1 match, not visible/);
      assert.match(error.message, /\[3\] threw while resolving: boom/);
      return true;
    }
  );
}

// 7. Empty candidate list is a usage error, not a silent no-op.
{
  await assert.rejects(
    () => page.resolveLocator([]),
    /at least one candidate is required/
  );
}

console.log('resolveLocator smoke test passed');
