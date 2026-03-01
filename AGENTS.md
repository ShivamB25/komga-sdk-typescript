# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-01
**Commit:** 8f7c5a9
**Branch:** main
**Komga API Version:** 1.24.1
**Package Version:** 0.2.0
**Last Verified:** 2026-03-01

## OVERVIEW
TypeScript SDK for the Komga media server API. Ships a ky-based HTTP client with Zod validation and high-level domain services. Published to npm with OIDC trusted publishing.

## API COVERAGE
| Metric | Value |
|--------|-------|
| OpenAPI Version | 3.1.0 |
| Komga API Version | 1.24.1 |
| Endpoint Paths | 130 |
| Total Operations | 165 |
| Deprecated Endpoints | 6 (properly marked) |
| Coverage | 100% |

## STRUCTURE
```
./
├── src/
│   ├── index.ts              # Public barrel exports
│   ├── sdk.gen.ts            # API functions (manually maintained)
│   ├── types.gen.ts          # API types (manually maintained)
│   ├── client/               # Low-level client helpers
│   ├── core/                 # HTTP/core utilities
│   ├── http/                 # ky adapter + client factory
│   ├── domains/              # Domain services (7 services)
│   │   ├── base.ts           # BaseService with safeCall/safeVoidCall
│   │   ├── books.ts          # BookService
│   │   ├── series.ts         # SeriesService
│   │   ├── libraries.ts      # LibraryService
│   │   ├── collections.ts    # CollectionService (v0.2.0)
│   │   ├── readlists.ts      # ReadListService (v0.2.0)
│   │   ├── users.ts          # UserService (v0.2.0)
│   │   ├── settings.ts       # SettingsService (v0.2.0)
│   │   └── index.ts          # Domain exports
│   ├── validation/           # zod schemas (*.test.ts)
│   ├── interceptors/         # request/response middleware (*.test.ts)
│   └── errors/               # error types (*.test.ts)
├── docs/
│   ├── mintlify/             # Mintlify documentation site
│   ├── api/                  # TypeDoc output
│   └── *.md                  # Legacy markdown docs
├── .github/workflows/        # CI/CD with OIDC publishing
├── vitest.config.ts          # Test configuration
├── tsconfig.json
├── package.json
└── bun.lock
```

## DOMAIN SERVICES

### BaseService (src/domains/base.ts)
Abstract base class providing:
- `safeCall<T>(apiCall, schema)` - validates response data with Zod
- `safeVoidCall(apiCall)` - checks errors on void endpoints

### Available Services
| Service | File | Description |
|---------|------|-------------|
| BookService | `books.ts` | Book retrieval, metadata, thumbnails |
| SeriesService | `series.ts` | Series management, book listings |
| LibraryService | `libraries.ts` | Library CRUD, scanning, analysis |
| CollectionService | `collections.ts` | Collection CRUD (NEW v0.2.0) |
| ReadListService | `readlists.ts` | Read list CRUD (NEW v0.2.0) |
| UserService | `users.ts` | User management (NEW v0.2.0) |
| SettingsService | `settings.ts` | Server settings (NEW v0.2.0) |

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| API operations | `src/sdk.gen.ts` | function entry points for REST calls |
| API types | `src/types.gen.ts` | DTOs + request/response types |
| Client factory | `src/client/index.ts` | `createClient` + core client types |
| ky adapter | `src/http/` | `createKomgaClient` + fetch adapter |
| Domain services | `src/domains/` | 7 services extending BaseService |
| Base patterns | `src/domains/base.ts` | safeCall, safeVoidCall |
| Validation | `src/validation/` | zod schemas + validate helpers |
| Errors | `src/errors/` | typed error hierarchy + guards |
| Interceptors | `src/interceptors/` | logging, validation, error transform |
| Tests | `src/**/*.test.ts` | vitest tests co-located with source |
| CI/CD | `.github/workflows/publish.yml` | OIDC trusted publishing |

## CONVENTIONS
- Source-only repo: `noEmit` TypeScript config
- `.gen.ts` files are manually maintained
- Zod schemas use `.strict()` enforcement
- Use `.nullish()` for nullable API fields
- Services use `safeCall()` for data endpoints
- Void endpoints use `safeVoidCall()` for error checking

## ANTI-PATTERNS
- Avoid `@deprecated` endpoints unless required
- Don't use `bun publish` for OIDC (bun doesn't support it)
- Don't skip npm upgrade in CI (Node 22 ships with npm 10.x, OIDC needs 11.5.1+)

## COMMANDS
```bash
# Development
bun tsc --noEmit        # TypeScript check
bun run test            # Run tests (149 tests)
bun run test:watch      # Watch mode
bun run test:coverage   # Coverage report

# Documentation
bun run docs            # Generate TypeDoc
cd docs/mintlify && bun run --bun mint dev  # Mintlify preview

# Build (for publishing)
bun run build           # Clean dist + tsc build
```

## CI/CD - OIDC TRUSTED PUBLISHING

### Critical Requirements
1. **npm 11.5.1+** - Node 22 ships with 10.x, must upgrade
2. **Clear NODE_AUTH_TOKEN** - setup-node sets placeholder that conflicts
3. **Use npm publish** - bun publish doesn't support OIDC

### Workflow Highlights
- Permissions: `id-token: write` (required for OIDC)
- Steps: setup-node → upgrade npm → test → publish
- No NPM_TOKEN secret needed (OIDC handles auth)

### npmjs.com Setup
Package Settings → Trusted Publisher:
- Owner: ShivamB25
- Repo: komga-sdk-typescript
- Workflow: publish.yml

See skill: `skills/npm-oidc-publishing`

## VERIFICATION CHECKLIST
- [x] All 130 endpoint paths match OpenAPI spec
- [x] All 6 deprecated endpoints marked with `@deprecated`
- [x] All Zod schemas use `.strict()` enforcement
- [x] Domain services use `safeCall()` / `safeVoidCall()`
- [x] TypeScript compiles clean (`bun tsc --noEmit`)
- [x] Tests pass (`bun run test`) - 149 tests across 5 suites
- [x] Package published to npm with OIDC (v0.2.0)
- [x] 7 domain services implemented

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
- OpenAPI spec: https://raw.githubusercontent.com/gotson/komga/master/komga/docs/openapi.json
- npm package: https://www.npmjs.com/package/komga-sdk
- Komga only supports Basic Auth + API Key (no Bearer/JWT)
- Test files excluded from build via tsconfig.build.json
