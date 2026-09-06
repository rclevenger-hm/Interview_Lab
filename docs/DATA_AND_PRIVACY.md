# Data ownership and privacy boundary

Signal Interview Lab is currently a local-first browser application. Practice attempts and user preferences are persisted in browser `localStorage`; progress export/import lets the user move that data explicitly.

That architecture is a useful privacy boundary and should remain explicit as the product evolves.

## Current local data

The application stores:

- attempt records used for scoring, mastery, recommendations, and streaks;
- the selected discipline/company preferences;
- user-triggered progress export/import data.

The current app does not require an account-backed progress service to use these features.

## Reliability implications

`localStorage` is convenient but not durable cloud storage. Users can lose progress when browser/site data is cleared, a device fails, or they switch browsers/devices without exporting first. Import validation should therefore continue to reject malformed records rather than trusting arbitrary JSON.

Export is the current recovery mechanism. Product copy should not imply cross-device sync or durable backup until a real account-backed service exists.

## Privacy expectations

- Do not transmit local attempts merely to implement UI analytics.
- Do not add third-party tracking that captures answer text without explicit product/privacy review.
- Treat interview answers as potentially sensitive personal/career data.
- Keep exported progress human-controlled and avoid including unrelated browser/device data.
- When telemetry is added, prefer aggregate product events over raw answer content.

## Future account-backed sync

If cloud sync is introduced, separate these concerns:

1. **identity/authentication** — who owns the progress;
2. **authorization** — who can read/write it;
3. **sync/idempotency** — how offline/local changes reconcile safely;
4. **encryption/retention** — how long attempts and answer text exist server-side;
5. **export/delete** — how the user retrieves or removes their data;
6. **operational recovery** — backups, restore tests, and corruption handling.

Do not replace local-first progress with a required account simply to add analytics. A reasonable migration path is optional authenticated sync while retaining a usable local mode.

## Data-contract changes

Changes to the persisted attempt or preference schema should include:

- backwards-compatible parsing or an explicit migration path;
- tests for malformed/stale records;
- export/import compatibility checks;
- a clear version boundary when old data can no longer be interpreted safely.

The current application already sanitizes persisted attempts on read; new persisted fields should preserve that fail-safe approach.
