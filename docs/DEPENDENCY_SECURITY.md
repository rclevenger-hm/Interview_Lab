# Dependency security gate

Interview Lab uses a deliberately small frontend dependency set, but fast-moving build tooling still needs a repeatable security review instead of relying only on automated update PRs.

## Pull request checks

For dependency changes:

1. install exactly from the lockfile with `npm ci`;
2. run the existing test suite;
3. run the production build;
4. run `npm audit --omit=dev` and review any production finding before merge;
5. review high-severity development-tool findings when they affect the build pipeline, dev server, or generated artifact.

Do not accept a major-version update solely because it compiles. Confirm that the study catalog tests and built Pages artifact still behave as expected.

## Triage

For each advisory, record whether it is reachable in the shipped browser application, confined to development/build tooling, or not applicable. Prefer upgrading or removing the affected package. Overrides should be temporary, narrowly scoped, and documented with the advisory identifier and removal condition.

## Release gate

A release candidate should have a reproducible `npm ci`, passing tests, a successful TypeScript/Vite build, and no unresolved high-severity vulnerability in a production dependency. The lockfile is the source of truth for what is actually installed.

## Maintenance

Keep dependency updates bounded and reviewable. Group tightly related build-tool updates when they must move together, but avoid combining unrelated product changes with dependency refreshes so a regression can be attributed quickly.
