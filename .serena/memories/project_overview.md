# Komga SDK Project Overview

## Current baseline
- Package: `komga-sdk` 2.0.0
- Komga contract: 1.26.3
- Contract size: 139 OpenAPI paths, 174 flat generated operations
- Runtime dependencies: none
- Module format: Node-compatible ESM with `.js` relative specifiers
- Compiler: TypeScript 5.9.3; strict mode

## Architecture
- `src/generated/`: generator-owned operation functions, wire DTOs, Fetch client internals. Never hand-edit.
- `scripts/generate.ts`: checksum verification, SearchOperator overlay, deterministic compatibility normalizations, atomic generated-directory replacement.
- `src/client.ts`: per-instance `createKomgaClient` with Basic, `X-API-Key`, unauthenticated, headers, credentials, and injected native Fetch.
- `src/result.ts`: optional throwing boundary through `unwrap()` and `KomgaApiError`.
- `src/index.ts`: concise public barrel; mutable generated singleton is intentionally not exported.

## Public contract
Calls are flat and tree-shakeable: `operation(parameters?, { client })`. HTTP errors are non-throwing by default and return `{ data, error, request, response }`. No domain-service classes, Ky/Axios, SDK retries, Zod DTO mirrors, query cache, or framework state belong in core.

## Current compatibility corrections
- SearchOperator circular aliases/discriminator literals
- `font/*` responses parsed as `Blob`
- successful 204 data normalized to `undefined`
- actuator info success normalized from generator `unknown` to `Record<string, unknown>`

`AGENTS.md` is the authoritative detailed workflow. See `mem:release/komga-update-flow` for the proven release sequence.
