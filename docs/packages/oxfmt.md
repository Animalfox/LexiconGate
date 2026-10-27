# oxfmt

High-performance JavaScript/TypeScript formatter from the Oxc stack;
Prettier-compatible output and native JSDoc/TSDoc formatting.

**Version:** `0.75.0`

**Rationale:**

An offline formatter without quotas is required, with doc-comment wrapping to a
fixed line width. Oxfmt covers code and JSDoc format in one binary (`jsdoc`
option), without a Prettier + plugin chain. Aligned with Oxlint as a single Oxc
quality pipeline; the version is pinned without a range.

**Patch update:**

1. Set the new patch version of `oxfmt` in `package.json` without a range.
2. Run `npm install`.
3. Run `npm run check:fix`, `npm run check`, `npm run typecheck`, and
   `npm test`.
4. If the schema changed, update `$schema` in `.oxfmtrc.json`.
5. Update the **Version** field in this document.

**Minor update:**

1. Review the Oxfmt changelog for format and `jsdoc` option changes.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm run check:fix`, `npm run check`,
   `npm run typecheck`, and `npm test`.
4. On formatting diffs, accept them or adjust `.oxfmtrc.json`.
5. Update `$schema` in `.oxfmtrc.json` and the **Version** field here.

**Major update:**

1. Review breaking changes in the official major release notes.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm run check:fix`, `npm run check`,
   `npm run typecheck`, and `npm test`.
4. Resolve CLI and `.oxfmtrc.json` incompatibilities.
5. Update `$schema` in `.oxfmtrc.json` and the **Version** field here.

**Removal:**

Possible after removing `oxfmt`, format/check scripts, `.oxfmtrc.json`, README
mentions, and the format step in `.githooks/pre-commit`. While a single
formatter remains part of the quality pipeline, the dependency is required.
