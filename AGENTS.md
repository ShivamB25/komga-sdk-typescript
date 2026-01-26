# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-26T20:00:15Z
**Commit:** c9b98f2
**Branch:** main

## OVERVIEW
Manual TypeScript SDK for the Komga API. Source lives in `src/` and ships a ky-based HTTP client plus zod validation utilities.

## STRUCTURE
```
./
├── src/
│   ├── index.ts              # Public barrel exports
│   ├── sdk.gen.ts            # API functions (manual maintenance)
│   ├── types.gen.ts          # API types (manual maintenance)
│   ├── client/               # Low-level client helpers
│   ├── core/                 # HTTP/core utilities
│   ├── http/                 # ky adapter + client factory
│   ├── domains/              # Domain services
│   ├── validation/           # zod schemas + helpers
│   ├── interceptors/         # request/response middleware
│   └── errors/               # error types
├── tsconfig.json
├── package.json
└── bun.lock
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| API operations | `src/sdk.gen.ts` | function entry points for REST calls |
| API types | `src/types.gen.ts` | DTOs + request/response types |
| Client factory | `src/client/index.ts` | `createClient` + core client types |
| ky adapter | `src/http/` | `createEnhancedClient` + ky fetch adapter |
| Domain services | `src/domains/` | BaseService + Book/Series/Library services |
| Validation | `src/validation/` | zod schemas + validate helpers |
| Errors | `src/errors/` | typed error hierarchy + guards |
| Interceptors | `src/interceptors/` | logging, validation, error transform |

## CONVENTIONS
- Source-only repo: `noEmit` TypeScript config; no build scripts defined.
- Filenames may use `.gen.ts`, but these are manually maintained in this repo.
- Zod schemas use `.strict()` and `z.infer` types in `src/validation/schemas/`.

## ANTI-PATTERNS (THIS PROJECT)
- Avoid endpoints marked `@deprecated` in `src/sdk.gen.ts` unless required.

## UNIQUE STYLES
- Domain services wrap API calls with `BaseService.safeCall()` for validation.
- Pagination schemas are generated via `createPageSchema()` in validation.

## COMMANDS
```bash
bun tsc --noEmit
```

## NOTES
- No CI/workflows or test configs are present.
