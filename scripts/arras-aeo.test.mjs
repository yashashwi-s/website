import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';

function calendar(date, forced = false) {
  const result = spawnSync(process.execPath, ['scripts/arras-aeo-calendar.mjs', ...(forced ? ['--force'] : [])], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, AEO_NOW: date, GITHUB_EVENT_NAME: 'schedule', GITHUB_OUTPUT: '' },
    encoding: 'utf8', timeout: 5000,
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('monthly review starts September 17 and uses the Indian calendar boundary', () => {
  assert.equal(calendar('2026-09-16T18:29:59Z').should_create, 'false');
  const first = calendar('2026-09-16T18:30:00Z');
  assert.equal(first.should_create, 'true');
  assert.equal(first.review_date, '2026-09-17');
  const october = calendar('2026-10-17T04:30:00Z');
  assert.equal(october.should_create, 'true');
  assert.equal(october.issue_key, '2026-10');
  assert.equal(october.quarterly, 'true');
  assert.equal(calendar('2026-10-18T04:30:00Z').should_create, 'false');
});

test('monthly review continues across year changes without the old first-Monday schedule', () => {
  assert.equal(calendar('2026-11-02T04:30:00Z').should_create, 'false');
  const january = calendar('2027-01-17T04:30:00Z');
  assert.equal(january.should_create, 'true');
  assert.equal(january.review_month, 'January 2027');
  assert.equal(january.quarterly, 'true');
  assert.equal(calendar('2027-02-17T04:30:00Z').quarterly, 'false');
});

test('manual review uses today rather than a future review date', () => {
  const manual = calendar('2026-10-18T04:30:00Z', true);
  assert.equal(manual.should_create, 'true');
  assert.equal(manual.review_date, '2026-10-18');
  assert.equal(manual.issue_key, '2026-10');
});
