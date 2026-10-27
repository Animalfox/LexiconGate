# typescript

TypeScript language compiler and static type system.

**Version:** `7.0.2`

**Rationale:**

Package sources are TypeScript; without the official compiler (`tsc`), type
checking, module-contract enforcement, and reproducible API-boundary diagnostics
are impossible. Using TypeScript as the sole source language avoids type vs
implementation drift and sets a single `strict` canon for the repository.

**Patch update:**

1. Set the new patch version of `typescript` in `package.json` without a range.
2. Run `npm install`.
3. Run `npm run typecheck` and `npm test`.
4. Update the **Version** field in this document.

**Minor update:**

1. Review the TypeScript changelog for type-checking semantics changes.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm run typecheck` and `npm test`.
4. On new type errors, fix sources until the check is green.
5. Update the **Version** field in this document.

**Major update:**

1. Review breaking changes in the official major release notes.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm run typecheck`, and `npm test`.
4. Resolve all type and `tsconfig.json` incompatibilities.
5. Update the **Version** field in this document.

**Removal:**

Not possible: package sources are TypeScript; without the TypeScript compiler,
static type checking and the stated module contract cannot be maintained.
