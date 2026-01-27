# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-27T01:56:00Z
**Commit:** c9b98f2
**Branch:** main
**Komga API Version:** 1.23.6
**Last Verified:** 2026-01-27

## OVERVIEW
Manual TypeScript SDK for the Komga API. Source lives in `src/` and ships a ky-based HTTP client plus zod validation utilities.

## API COVERAGE
| Metric | Value |
|--------|-------|
| OpenAPI Version | 3.1.0 |
| Komga API Version | 1.23.6 |
| Endpoint Paths | 130 |
| Total Operations | 165 |
| Deprecated Endpoints | 6 (properly marked) |
| Coverage | 100% |

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
│   ├── domains/              # Domain services (*.test.ts for tests)
│   ├── validation/           # zod schemas + helpers (*.test.ts for tests)
│   ├── interceptors/         # request/response middleware (*.test.ts for tests)
│   └── errors/               # error types (*.test.ts for tests)
├── docs/
│   ├── mintlify/             # Mintlify documentation site
│   │   ├── docs.json         # Mintlify configuration
│   │   ├── *.mdx             # Core concept pages
│   │   ├── guides/           # Usage guides (books, series, libraries)
│   │   └── reference/        # Reference docs (config, typescript, api)
│   ├── api/                  # TypeDoc output (generated)
│   └── *.md                  # Legacy markdown docs
├── vitest.config.ts          # Test configuration
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
| ky adapter | `src/http/` | `createKomgaClient` + fetch adapter |
| Domain services | `src/domains/` | BaseService + Book/Series/Library services |
| Validation | `src/validation/` | zod schemas + validate helpers |
| Errors | `src/errors/` | typed error hierarchy + guards |
| Interceptors | `src/interceptors/` | logging, validation, error transform |
| Tests | `src/**/*.test.ts` | vitest tests co-located with source |
| Test config | `vitest.config.ts` | coverage thresholds, exclusions |
| Mintlify docs | `docs/mintlify/` | Stripe-quality usage docs |
| TypeDoc output | `docs/api/` | Generated API reference |
| Legacy docs | `docs/*.md` | Markdown documentation |

## CONVENTIONS
- Source-only repo: `noEmit` TypeScript config; no build scripts defined.
- Filenames may use `.gen.ts`, but these are manually maintained in this repo.
- Zod schemas use `.strict()` and `z.infer` types in `src/validation/schemas/`.
- Use `.nullish()` for fields that API returns as `null` (aligns with TypeScript optional types).

## ANTI-PATTERNS (THIS PROJECT)
- Avoid endpoints marked `@deprecated` in `src/sdk.gen.ts` unless required.

## UNIQUE STYLES
- Domain services wrap API calls with `BaseService.safeCall()` for validation.
- Pagination schemas are generated via `createPageSchema()` in validation.

## COMMANDS
```bash
bun tsc --noEmit        # TypeScript check
bun run test            # Run tests
bun run test:watch      # Watch mode
bun run test:coverage   # With coverage report
bun run docs            # Generate TypeDoc API docs
```

## DOCUMENTATION COMMANDS
```bash
# Mintlify docs (Stripe-quality usage docs)
cd docs/mintlify && bun run --bun mint dev          # Local preview
bun run docs                                         # Generate TypeDoc to docs/api/

# TypeDoc API reference
bun run docs            # Output to docs/api/
bun run docs:watch      # Watch mode
bun run docs:serve      # Generate and serve
```

## VERIFICATION CHECKLIST
- [x] All 130 endpoint paths match OpenAPI spec
- [x] All 6 deprecated endpoints properly marked with `@deprecated`
- [x] All Zod schemas use `.strict()` enforcement
- [x] Domain services use `safeCall()` with proper validation
- [x] TypeScript compiles clean (`bun tsc --noEmit`)
- [x] Tests pass (`bun run test`) - 134 tests across 5 suites
- [x] README.md created with full documentation
- [x] Mintlify docs created with full structure
- [x] TypeDoc and Mintlify coexist side-by-side

## DEPRECATED ENDPOINTS
| Endpoint | Replacement | Since |
|----------|-------------|-------|
| `GET /api/v1/books` | `POST /api/v1/books/list` | 1.19.0 |
| `GET /api/v1/series` | `POST /api/v1/series/list` | 1.19.0 |
| `GET /api/v1/series/alphabetical-groups` | `POST /api/v1/series/list/alphabetical-groups` | 1.19.0 |
| `GET /api/v1/series/{seriesId}/books` | `POST /api/v1/books/list` | 1.19.0 |
| `GET /api/v1/authors` | `GET /api/v2/authors` | 1.20.0 |
| `PUT /api/v1/libraries/{libraryId}` | `PATCH /api/v1/libraries/{libraryId}` | 1.3.0 |

## NOTES
- OpenAPI spec source: https://raw.githubusercontent.com/gotson/komga/refs/heads/master/komga/docs/openapi.json
