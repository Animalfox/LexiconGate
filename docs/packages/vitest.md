# vitest

Test runner with native ESM and TypeScript support without a separate
transpiler.

**Version:** `3.2.7`

**Rationale:**

The package ships as ESM (`"type": "module"`) on TypeScript; the runner must
execute specs in the same module model without a transform chain different from
the production contract. Vitest closes that gap: a single ESM + TypeScript path
for tests, predictable diagnostics, and minimal runner configuration versus
CommonJS-oriented alternatives or a separate babel/ts-jest layer.

**Patch update:**

1. Set the new patch version of `vitest` in `package.json` without a range.
2. Run `npm install`.
3. Run `npm test` and `npm run typecheck`.
4. Update the **Version** field in this document.

**Minor update:**

1. Review the Vitest changelog for config and runner API changes.
2. Set the new minor version in `package.json` without a range.
3. Run `npm install`, then `npm test` and `npm run typecheck`.
4. On API or `vitest.config.ts` breakages, fix until the run is green.
5. Update the **Version** field in this document.

**Major update:**

1. Review breaking changes in the official major release notes.
2. Set the new major version in `package.json` without a range.
3. Run `npm install`, `npm test`, and `npm run typecheck`.
4. Resolve config, `vitest` / `vitest/config` import, and spec syntax issues.
5. Update the **Version** field in this document.

**Removal:**

Possible after removing the `tests` directory, `vitest.config.ts`, the `test`
script in `package.json`, and the `vitest` dependency from `devDependencies`.
While automated specs remain part of package quality, the runner is required.
