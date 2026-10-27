# oxlint

High-performance JavaScript/TypeScript linter from the Oxc stack.

**Version:** `1.90.0`

**Rationale:**

An offline linter without quotas is required, aligned with the Oxfmt formatter
in the same Oxc stack. Oxlint provides fast static diagnostics for ESM/TypeScript
and safe-fix without a heavy ESLint chain. The version is pinned without a
range.

**Patch update:**

1. Set the new patch version of `oxlint` in `package.json` without a range.
2. Run `npm install`.
3. Run `npm run check`, `npm run typecheck`, and `npm test`.
4. If the schema changed, update `$schema` in `.oxlintrc.json`.
5. Update the **Version** field in this document.

**Minor update:**

1. Review the Oxlint changelog for rules and plugins.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm run check`, `npm run typecheck`, and
   `npm test`.
4. On new diagnostics, fix sources or adjust `.oxlintrc.json`.
5. Update `$schema` in `.oxlintrc.json` and the **Version** field here.

**Major update:**

1. Review breaking changes in the official major release notes.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm run check`, `npm run typecheck`, and `npm test`.
4. Resolve CLI and `.oxlintrc.json` incompatibilities.
5. Update `$schema` in `.oxlintrc.json` and the **Version** field here.

**Removal:**

Possible after removing `oxlint`, related scripts, `.oxlintrc.json`, README
mentions, and the lint step in `.githooks/pre-commit`. While lint remains part of
the quality pipeline, the dependency is required.
