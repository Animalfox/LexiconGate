# AGENTS

Rules for any agent that changes this repository.

- Public README: canon is `README.md` (English); mirror is `README.ru.md`.
  Same section structure; translate prose only.
- Every TypeScript file must have complete TSDoc coverage.
- Each file must start with an `@file` tag: one short sentence about the
  file’s purpose.
- In `@file`, do not use lists after a colon, algorithm summaries, history,
  external links, or long paragraphs. Details belong on declarations.
- Do not use `@module`. This repository does not generate API docs from
  TSDoc; `@module` only names a file for documentation tools. File purpose
  is stated once with `@file` (enforced by oxlint).
- Do not leave a blank line after the `@file` block.
- Write TSDoc in academic English: brief, unambiguous, without jargon or
  vagueness.
