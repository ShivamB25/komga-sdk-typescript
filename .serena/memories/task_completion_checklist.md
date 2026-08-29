# Task Completion Checklist

## Source and contract
- [ ] Never hand-edit `src/generated/**`; update the pinned spec/config/generator and regenerate.
- [ ] Preserve flat operation functions, Fetch-native core, empty runtime dependencies, per-instance clients, and non-throwing default results.
- [ ] Before exported-symbol changes, map references/callers and migrate all call sites with no aliases.
- [ ] For API updates, compare the tagged OpenAPI documents semantically: paths, operationIds, deprecated flags, security, parameters, request/response media, schemas, binary/text/stream/204 behavior.
- [ ] Verify exact input SHA-256 bytes and keep generation fail-loudly deterministic.

## Tests and package
- [ ] Add behavior coverage only for changed observable contracts using injected Fetch; never mock generated functions or assert source text.
- [ ] Run `bun run generate`, `bun run typecheck`, `bun run test`, `bun run build`, and `npm pack --dry-run`.
- [ ] Smoke Node 18 imports for `komga-sdk`, `komga-sdk/client`, and `komga-sdk/types`.
- [ ] Smoke one built operation with Basic or API-key auth and exact path/query serialization.

## Documentation
- [ ] Update package/Komga versions, counts, changelog, migration notes, README, and maintained Mintlify pages.
- [ ] Verify every live example against regenerated symbols and call shapes.
- [ ] Keep every maintained page in `docs.json`; preserve unique workflows, permissions, edge cases, and troubleshooting.
- [ ] Run Mintlify validate, broken-links, a11y, then browser-sample introduction, quickstart, configuration, migration, a deep guide, and one generated endpoint.

## Delivery
- [ ] Fetch remote changes before push; inspect rather than blindly pull.
- [ ] Rebase only an unpublished local release commit when safe.
- [ ] Rerun all gates after rebase/dependency changes.
- [ ] Confirm clean status and pushed remote tip.
