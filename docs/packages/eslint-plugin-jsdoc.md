# eslint-plugin-jsdoc

ESLint plugin for checking the structure and completeness of JSDoc/TSDoc
comments.

**Version:** `65.4.2`

**Rationale:**

Oxlint’s native JSDoc plugin has no required file-overview rule.
`eslint-plugin-jsdoc` provides `require-file-overview` and is loaded into Oxlint
via `jsPlugins` (alias `jsdoc-js`), keeping a single `oxlint` run without a
separate ESLint CLI. The version is pinned without a range.

**Patch update:**

1. Set the new patch version of `eslint-plugin-jsdoc` in `package.json` without
   a range.
2. Run `npm install`.
3. Run `npm run check`, `npm run typecheck`, and `npm test`.
4. Update the **Version** field in this document.

**Minor update:**

1. Review the plugin changelog for rules and options.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm run check`, `npm run typecheck`, and
   `npm test`.
4. On new diagnostics, adjust sources or `.oxlintrc.json`.
5. Update the **Version** field in this document.

**Major update:**

1. Review breaking changes in the official major release notes.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm run check`, `npm run typecheck`, and `npm test`.
4. Resolve incompatibilities with Oxlint `jsPlugins` and rules in
   `.oxlintrc.json`.
5. Update the **Version** field in this document.

**Removal:**

Possible after removing `eslint-plugin-jsdoc`, the `jsPlugins` / `jsdoc-js/*`
block from `.oxlintrc.json`, and this document. While `@file` remains required
in TypeScript files via Oxlint, the dependency is needed.
