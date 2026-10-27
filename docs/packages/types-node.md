# @types/node

Official TypeScript types for built-in Node.js modules.

**Version:** `24.19.2`

**Rationale:**

The package runtime is Node.js; the TypeScript compiler does not ship
descriptions of platform built-ins. `@types/node` provides canonical ambient
types for the Node API and closes the gap between the platform contract and
static checking. The major line is aligned with `engines.node` (≥20).

**Patch update:**

1. Set the new patch version of `@types/node` in `package.json` without a range.
2. Run `npm install`.
3. Run `npm run typecheck` and `npm test`.
4. Update the **Version** field in this document.

**Minor update:**

1. Compare the `@types/node` changelog with the target Node.js minor line.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm run typecheck` and `npm test`.
4. On new type errors, fix sources until the check is green.
5. Update the **Version** field in this document.

**Major update:**

1. Ensure the `@types/node` major matches the target Node.js major and the
   `engines` field.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm run typecheck`, and `npm test`.
4. Resolve Node API type incompatibilities in sources.
5. Update the **Version** field in this document.

**Removal:**

Possible only after sources fully stop using typed Node APIs (`node:*` built-ins
and platform globals). While such calls remain, the package is required for
static checking.
