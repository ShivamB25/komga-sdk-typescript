# Draft: Mintlify Documentation Implementation Plan

## Requirements (confirmed)
- Create Stripe-level quality Mintlify usage docs
- Root at `docs/mintlify` directory
- Keep TypeDoc side-by-side at `docs/api`
- No code changes outside `docs/mintlify` unless necessary
- Use existing repo patterns
- Include success criteria and verification plan

## Current State Analysis

### Existing Documentation Assets
1. **11 markdown docs in `docs/`**:
   - getting-started.md (installation, client creation)
   - domain-services.md (BookService, SeriesService, LibraryService)
   - pagination-search.md (pagination, sorting, filters)
   - validation.md (Zod schemas, validateResponse)
   - interceptors.md (logging, error transform, validation)
   - configuration.md (KomgaClientOptions, RetryConfig)
   - errors.md (type guards, quick example)
   - testing.md (mocking, integration tests)
   - troubleshooting.md (401, 404, timeouts, CORS)
   - migration.md (deprecated endpoints)
   - api-reference.md (TypeDoc generation guide)

2. **TypeDoc Configuration** (`typedoc.json`):
   - Entry point: `src/index.ts`
   - Output: `docs/api/`
   - Excludes: private, protected, internal, externals
   - Scripts: `docs`, `docs:watch`, `docs:serve`

3. **Existing Mintlify Skeleton** (`docs/mintlify/`):
   - `docs.json` with basic navigation structure (placeholder pages)
   - Empty `guides/` and `reference/` directories
   - OpenAPI integration configured (links to upstream Komga spec)
   - TypeDoc tab configured (links to `/api/`)

### Key SDK Features to Document
1. **Client Creation**: `createKomgaClient()` with auth types (basic, apiKey, bearer)
2. **Domain Services**: BookService, SeriesService, LibraryService with safeCall validation
3. **Direct API Functions**: 165 operations from `sdk.gen.ts`
4. **Validation**: Zod schemas, validateResponse, safeValidateResponse, createPageSchema
5. **Error Handling**: Error hierarchy, type guards, retryability
6. **Interceptors**: Logging, error transform, validation interceptors
7. **Pagination**: PageRequest, sorting, search filters

### OpenAPI Spec Source
- URL: https://raw.githubusercontent.com/gotson/komga/refs/heads/master/komga/docs/openapi.json
- Already configured in existing `docs.json`

## Technical Decisions

### Content Strategy
1. **Mintlify for**: Usage guides, tutorials, conceptual docs, code examples
2. **TypeDoc for**: Complete API reference, type definitions, method signatures
3. **OpenAPI integration**: Auto-generated endpoint docs from upstream spec

### File Format
- MDX files for rich component support (CodeGroup, Steps, Cards, etc.)
- Frontmatter with title, description, icon

### Navigation Structure
- Tab 1: Guides (Getting Started → Core Concepts → Domain Guides → Operations)
- Tab 2: API Reference (OpenAPI-generated)
- Tab 3: TypeDoc (external link to `docs/api/`)

## Research Findings

### Mintlify Best Practices (from librarian)
1. Use `docs.json` (not deprecated `mint.json`)
2. Tabs → Groups → Pages hierarchy
3. Use rich components: CodeGroup, Steps, Cards, Accordions
4. ~30 pages is typical for SDK docs
5. Include snippets for reusable code

### Stripe-Style Patterns
1. Clear progression: Introduction → Quickstart → Auth → Core → Guides
2. Code examples in every section
3. Request/Response examples for API calls
4. Error tables with codes and handling
5. Copy-paste ready snippets

## Open Questions
None - all requirements clear

## Scope Boundaries
- **INCLUDE**: All pages in `docs/mintlify/`, docs.json configuration
- **EXCLUDE**: TypeDoc config changes, source code changes, build scripts
