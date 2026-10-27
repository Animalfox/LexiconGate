# LexiconGate

[English](./README.md) · [Русский](./README.ru.md)

Text moderation library based on a deny list and an allow list. It inspects a
string, rewrites disallowed fragments when needed, and prepares data for
administrative review. The entry point is `createLexiconGate` and the
`LexiconGate` service.

## Purpose

- detect disallowed words;
- obtain text suitable for publication instead of the original;
- maintain lists with spelling normalization;
- apply a full replacement when there are many matches;
- build a review ticket and apply an `allow` / `ban` decision;
- store lists in memory or in files.

Message delivery to a messenger is out of scope.

## Installation

Internal package `@animalfox/lexicon-gate` (workspace, `file:`, or git). Requires
**Node.js ≥ 20**. After cloning, run `npm run build` (or rely on `prepack` when
using `npm pack`).

## Quick start

```ts
import { createLexiconGate } from "@animalfox/lexicon-gate";

const gate = createLexiconGate({ blackList: ["damn"] });
const hit = gate.inspect("has damn");

if (hit.isOffensive) {
  // publish hit.censoredDisplayText
  // if hit.adminTicket is set — offer admins allow / ban
}
```

File-backed lists:

```ts
const gate = createLexiconGate({
  files: { blackPath: "./black.txt", whitePath: "./white.txt" },
});
```

### Lists

```ts
gate.banWords("word");
gate.allowWords("exception");
gate.blackList;
gate.whiteList;
```

### Administrative decision

```ts
const decision = gate.tryApplyAdminCallback("white disputed");
// decision?.action === "allow" | "ban"
```

### Announcements

```ts
gate.announceBan("Admin");
gate.announceAllow("Admin", "word");
```

## `inspect` result

| Field                 | Meaning                                          |
| --------------------- | ------------------------------------------------ |
| `isOffensive`         | whether disallowed fragments were found          |
| `originalText`        | original string                                  |
| `censoredDisplayText` | string recommended for publication               |
| `offensiveTokens`     | matched tokens                                   |
| `usedMegaReplacement` | full-text replacement was applied                |
| `adminTicket`         | review ticket on inexact match, otherwise `null` |

## Public API

| Name                       | Meaning                      |
| -------------------------- | ---------------------------- |
| `createLexiconGate`        | create the service           |
| `LexiconGate`              | moderation service           |
| `LexiconGateOptions`       | options: memory **or** files |
| `LexiconGateMemoryOptions` | in-memory lists variant      |
| `LexiconGateFileOptions`   | file-path variant            |
| `LexiconInspection`        | `inspect` result             |

Other modules are not exported from the package barrel.

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
npm run check
npm run check:fix
npm pack
```

After `npm install`, `pre-commit` formats and auto-fixes staged files.

## License

Released under the [Apache License 2.0](./LICENSE).
Copyright notice: [NOTICE](./NOTICE).
