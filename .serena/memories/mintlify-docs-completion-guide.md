# Mintlify Documentation Maintenance Guide

## Current status
The maintained site in `docs/mintlify/` documents komga-sdk 2.0.0 generated from Komga 1.26.3. It covers 174 flat operations through workflow guides plus the immutable generated OpenAPI reference. No additional domain-service or validation guide is pending: those were obsolete pre-1.0 concepts and must not return as current SDK features.

## Content contract
- Live examples use `operation(parameters?, { client })`; parameterless calls receive `{ client }` only.
- Results are structured and non-throwing unless `unwrap()` or per-operation `throwOnError` is used.
- No BookService/domain wrappers, grouped `{ path, query, body }`, Ky settings, SDK Zod mirrors, Bearer auth, interceptors, or SDK retry policy.
- Referential v2 results use `data.content`; age ratings are `PageInteger`, release years and other string lookups are `PageString`.
- Scope IDs are arrays where generated; `getTags` include is SERIES/BOOK/BOTH.
- Historical old syntax is allowed only in clearly labeled before/migration sections.
- Preserve permissions, state transitions, failure modes, binary/void semantics, and troubleshooting.

## Required verification
Use Node 22 for the pinned Mint CLI, then run validate, broken-links, and a11y. Browser-preview introduction, quickstart, configuration, migration, a deep guide, and a generated API endpoint. Do not claim deployment from `mint dev`; production requires the Mintlify GitHub App check or dashboard confirmation.

See `mem:mintlify-docs-setup` and `mem:release/komga-update-flow`.
