# Proven Komga SDK Release Update Flow

## Baseline established 2026-08-29
- Updated Komga 1.25.0 → 1.26.3 and package 1.0.0 → 2.0.0.
- Official release: https://github.com/gotson/komga/releases/tag/1.26.3
- Immutable spec: https://raw.githubusercontent.com/gotson/komga/1.26.3/komga/docs/openapi.json
- SHA-256: `bb632844224f3599d70b186e3278334f4ef9765c19069c56dec6c59406be7afe`
- Result: 139 paths, 174 operations.
- Implementation commit: `f0b074c feat!: update SDK for Komga 1.26.3`.

## Evidence order
1. Tagged release metadata and immutable tagged OpenAPI bytes are authoritative.
2. Compare old/new specs semantically, not as generated text.
3. Use official Hey API docs/source, Context7, Firecrawl Developer Index, and DeepWiki as corroboration. DeepWiki was stale for the 1.26 referential deprecations, so it must never override the tagged contract.

## 1.26.3 contract delta that required migration
- Nine v2 referential endpoints; PageString/PageInteger results use `data.content`.
- Deprecated legacy v1 referential routes regenerate with suffixed operation names; no compatibility aliases.
- `getAuthors` collection/series/readlist scope IDs are arrays and serialize as repeated query keys.
- `getTags` adds SERIES/BOOK/BOTH include semantics.
- `ItemDto.author` becomes optional ItemAuthorDto; multi-source setting fields become optional.
- `getBookById` and `getSeriesById` gain typed 404 maps.
- actuator info is an arbitrary object, requiring deterministic normalization to `Record<string, unknown>` because the generator emits `unknown`.

## Implementation sequence
1. Fetch latest stable release evidence and both tagged specs.
2. Compute exact checksum bytes and complete semantic matrix: info/version, counts, paths/operations, IDs/deprecations, parameters, security, media, schemas, special responses.
3. Map local generator overlays/tests/docs before editing.
4. Update both immutable URLs and checksum; regenerate only through `bun run generate`.
5. Review every operation/type/security/content change; add focused injected-Fetch tests for new behavior classes.
6. Apply SemVer from observable breaking changes, regenerate lockfile, update AGENTS/changelog/README/Mintlify.
7. Validate SDK gate, package contents, Node 18 ESM subpaths, and authenticated built operation.
8. Validate Mintlify with Node 22 and browser-sample required pages.
9. Fetch remote before push. If remote moved, rebase the unpublished release commit, rerun `bun install` and every gate, then push.

## Toolchain pitfalls proven by the update
- TypeScript 7.0.2 breaks current Hey API generation with missing `Kind`; keep 5.9.3.
- Mint rejects Node 26 and Bun exposes Node 26.3.0; invoke local Mint with `npx --yes node@22 node_modules/mint/index.js`.
- A validation pass before rebase/dependency integration is not sufficient; rerun after integration.
- Root README/getting-started can drift independently of Mintlify; audit both for removed service/Ky/Zod/Bearer/grouped-call APIs.

`AGENTS.md` remains authoritative for invariants and exact commands. See `mem:task_completion_checklist` and `mem:mintlify-docs-completion-guide`.
