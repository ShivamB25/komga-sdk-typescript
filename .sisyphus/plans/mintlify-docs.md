# Mintlify Documentation Implementation Plan

## Context

### Original Request
Create high-quality Mintlify usage docs (Stripe-level) for the komga-sdk repo while keeping TypeDoc side-by-side. Mintlify root at `docs/mintlify`.

### Interview Summary
**Key Findings**:
- Existing `docs/` has 11 markdown guides covering all SDK features
- TypeDoc configured at `docs/api/` with scripts in package.json
- Skeleton `docs/mintlify/` already exists with `docs.json` and empty directories
- OpenAPI integration already configured (upstream Komga spec URL)
- SDK has 3 domain services, 165 API functions, typed error hierarchy, Zod validation

**Existing Content to Transform**:
| Source | Target | Notes |
|--------|--------|-------|
| `docs/getting-started.md` | `introduction.mdx`, `quickstart.mdx` | Split and enhance |
| `docs/domain-services.md` | `domain-services.mdx`, `guides/books.mdx`, etc. | Expand per-domain |
| `docs/pagination-search.md` | `pagination.mdx` | Enhance with examples |
| `docs/validation.md` | `validation.mdx` | Add schema examples |
| `docs/interceptors.md` | `interceptors.mdx` | Expand patterns |
| `docs/configuration.md` | `reference/configuration.mdx` | Full param docs |
| `docs/errors.md` + `src/errors/README.md` | `errors.mdx` | Combine comprehensive |
| `docs/testing.md` | `guides/testing.mdx` | Add more patterns |
| `docs/troubleshooting.md` | `guides/troubleshooting.mdx` | Expand scenarios |
| `docs/migration.md` | `guides/migration.mdx` | Add code examples |

---

## Work Objectives

### Core Objective
Create 24 production-ready Mintlify MDX pages following Stripe-level documentation patterns, transforming existing markdown content into rich, interactive documentation with CodeGroups, Steps, Cards, and Accordions.

### Concrete Deliverables
1. **Configuration**: Updated `docs/mintlify/docs.json` with complete navigation
2. **Getting Started Pages** (4 pages): introduction, quickstart, installation, authentication
3. **Core Concepts Pages** (6 pages): domain-services, direct-api, pagination, validation, errors, interceptors
4. **Domain Guide Pages** (4 pages): books, series, libraries, workflows
5. **Operations Pages** (3 pages): troubleshooting, testing, migration
6. **Reference Pages** (4 pages): configuration, typescript, glossary, api-reference
7. **Supporting Files**: snippets for reusable code blocks

### Definition of Done
- [ ] All 24 MDX pages created with proper frontmatter
- [ ] `docs.json` navigation matches page structure
- [ ] Mintlify local preview renders without errors
- [ ] All code examples compile (TypeScript syntax valid)
- [ ] TypeDoc link in navigation works (`/api/`)
- [ ] OpenAPI tab renders endpoint documentation

### Must Have
- MDX format with Mintlify components (CodeGroup, Steps, Cards, etc.)
- Consistent frontmatter (title, description, icon)
- Copy-paste ready code examples
- Request/Response examples for API calls
- Error handling patterns with tables
- Links between related pages
- TypeDoc integration via external link

### Must NOT Have (Guardrails)
- NO changes to `docs/*.md` files (keep original markdown)
- NO changes to `typedoc.json` configuration
- NO changes to source code (`src/`)
- NO changes to `package.json` scripts
- NO removal of existing `docs/mintlify/docs.json` OpenAPI integration
- NO hardcoded credentials in examples (use environment variables)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (Mintlify CLI not installed)
- **User wants tests**: Manual verification only
- **Framework**: Mintlify CLI for local preview

### Manual QA Approach
Each TODO includes verification via:
1. **File creation check**: `ls -la` confirms file exists
2. **Content validation**: MDX syntax renders in preview
3. **Link verification**: Internal links resolve correctly

### Mintlify Preview Commands
```bash
# Install Mintlify CLI (one-time)
npm install -g mintlify

# Start local preview
cd docs/mintlify
mintlify dev

# Preview at http://localhost:3000
```

---

## Task Flow

```
Task 0 (docs.json) → Task 1-4 (Getting Started) → Task 5-10 (Core Concepts)
                                                       ↓
Task 11-14 (Domain Guides) → Task 15-17 (Operations) → Task 18-21 (Reference)
                                                       ↓
                                              Task 22 (Snippets) → Task 23 (Final QA)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1, 2, 3, 4 | Getting Started pages independent |
| B | 5, 6, 7, 8, 9, 10 | Core Concepts pages independent |
| C | 11, 12, 13, 14 | Domain Guide pages independent |
| D | 15, 16, 17 | Operations pages independent |
| E | 18, 19, 20, 21 | Reference pages independent |

| Task | Depends On | Reason |
|------|------------|--------|
| 1-21 | 0 | Pages need navigation structure defined |
| 22 | 1-21 | Snippets extracted from page patterns |
| 23 | All | Final QA after all pages complete |

---

## File Structure Overview

```
docs/mintlify/
├── docs.json                      # Navigation configuration
├── introduction.mdx               # What is Komga SDK
├── quickstart.mdx                 # 5-minute getting started
├── installation.mdx               # Package manager options
├── authentication.mdx             # Auth types (basic, apiKey, bearer)
├── domain-services.mdx            # Overview of service layer
├── direct-api.mdx                 # Using sdk.gen.ts functions
├── pagination.mdx                 # Pagination and search
├── validation.mdx                 # Zod schemas and helpers
├── errors.mdx                     # Error handling patterns
├── interceptors.mdx               # Request/response middleware
├── guides/
│   ├── books.mdx                  # BookService deep dive
│   ├── series.mdx                 # SeriesService deep dive
│   ├── libraries.mdx              # LibraryService deep dive
│   ├── workflows.mdx              # Common workflow patterns
│   ├── troubleshooting.mdx        # Common issues and fixes
│   ├── testing.mdx                # Testing strategies
│   └── migration.mdx              # Upgrading and deprecations
├── reference/
│   ├── configuration.mdx          # KomgaClientOptions full reference
│   ├── typescript.mdx             # TypeScript setup guide
│   ├── glossary.mdx               # Terms and concepts
│   └── api-reference.mdx          # TypeDoc and OpenAPI guide
└── snippets/
    ├── install-npm.mdx            # npm install snippet
    ├── install-bun.mdx            # bun add snippet
    └── client-basic.mdx           # Basic client creation
```

---

## TODOs

### Task 0: Update docs.json Configuration

**What to do**:
- Update `docs/mintlify/docs.json` with complete navigation structure
- Configure all tabs, groups, and page references
- Verify OpenAPI integration remains intact
- Add footer links and navbar configuration

**Must NOT do**:
- Remove existing OpenAPI URL configuration
- Change theme or color scheme

**Parallelizable**: NO (prerequisite for all other tasks)

**References**:
- `docs/mintlify/docs.json` (lines 1-71) - Current configuration to extend
- Mintlify docs.json schema: https://mintlify.com/docs/settings/global

**Acceptance Criteria**:
- [ ] File updated: `docs/mintlify/docs.json`
- [ ] Contains all 24 page references
- [ ] OpenAPI tab preserved with upstream URL
- [ ] TypeDoc tab links to `/api/`
- [ ] `cat docs/mintlify/docs.json | jq .` → valid JSON

**Commit**: YES
- Message: `docs(mintlify): configure complete navigation structure`
- Files: `docs/mintlify/docs.json`

---

### Task 1: Create introduction.mdx

**What to do**:
- Create homepage for Mintlify docs
- Include: SDK overview, key features, quick example, links to quickstart
- Use Cards for feature highlights
- Include installation snippet

**Must NOT do**:
- Duplicate full installation instructions (link to installation page)
- Include authentication details (link to auth page)

**Parallelizable**: YES (with 2, 3, 4)

**References**:
- `README.md` (lines 1-50) - Project overview and features
- `docs/getting-started.md` (lines 1-30) - Requirements and intro

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/introduction.mdx`
- [ ] Frontmatter includes: title, description, icon
- [ ] Contains CardGroup with 4+ feature cards
- [ ] Quick code example using CodeGroup
- [ ] Links to quickstart, installation, authentication

**Commit**: NO (groups with Task 2, 3, 4)

---

### Task 2: Create quickstart.mdx

**What to do**:
- 5-minute getting started guide
- Use Steps component for progressive flow
- Include: install, create client, make first request, see output
- Add "Next Steps" CardGroup at end

**Must NOT do**:
- Cover all auth types (just basic auth)
- Explain pagination in detail

**Parallelizable**: YES (with 1, 3, 4)

**References**:
- `docs/getting-started.md` (lines 10-70) - Installation and client creation
- `README.md` (lines 25-45) - Quick start example

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/quickstart.mdx`
- [ ] Uses Steps component (4-5 steps)
- [ ] Includes CodeGroup with TypeScript example
- [ ] Shows expected output
- [ ] CardGroup with 4 next steps links

**Commit**: NO (groups with Task 1, 3, 4)

---

### Task 3: Create installation.mdx

**What to do**:
- Comprehensive installation guide
- CodeGroup with npm, yarn, pnpm, bun
- TypeScript configuration section
- Version requirements
- Verification steps

**Must NOT do**:
- Include auth setup (separate page)
- Include client creation (separate page)

**Parallelizable**: YES (with 1, 2, 4)

**References**:
- `docs/getting-started.md` (lines 10-22) - Package manager commands
- `docs/getting-started.md` (lines 72-86) - TypeScript config

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/installation.mdx`
- [ ] CodeGroup with 4 package managers
- [ ] TypeScript config section with json code block
- [ ] Requirements section (Node 18+, Komga API 1.23.6)
- [ ] Verification command

**Commit**: NO (groups with Task 1, 2, 4)

---

### Task 4: Create authentication.mdx

**What to do**:
- All auth types: basic, apiKey, bearer
- Use Tabs component for different auth methods
- Security best practices section
- Environment variable examples

**Must NOT do**:
- Hardcode real credentials
- Cover session management (Komga doesn't have SDK-level sessions)

**Parallelizable**: YES (with 1, 2, 3)

**References**:
- `README.md` (lines 47-75) - Auth type examples
- `docs/configuration.md` (lines 1-37) - Auth config interface

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/authentication.mdx`
- [ ] Tabs component with 3 auth types
- [ ] Warning callout about credential security
- [ ] Environment variable usage example
- [ ] Link to configuration reference

**Commit**: YES
- Message: `docs(mintlify): add getting started pages`
- Files: `docs/mintlify/introduction.mdx`, `docs/mintlify/quickstart.mdx`, `docs/mintlify/installation.mdx`, `docs/mintlify/authentication.mdx`

---

### Task 5: Create domain-services.mdx

**What to do**:
- Overview of domain service pattern
- Comparison table: Domain Services vs Direct API
- Quick examples of each service
- Link to individual service guides

**Must NOT do**:
- Deep dive into each service (separate guide pages)
- Explain validation internals

**Parallelizable**: YES (with 6, 7, 8, 9, 10)

**References**:
- `docs/domain-services.md` (lines 1-83) - Full service documentation
- `src/domains/base.ts` - BaseService.safeCall pattern

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/domain-services.mdx`
- [ ] Comparison table (Services vs Direct API)
- [ ] Example for each service (BookService, SeriesService, LibraryService)
- [ ] CardGroup linking to guides/books, guides/series, guides/libraries

**Commit**: NO (groups with Core Concepts)

---

### Task 6: Create direct-api.mdx

**What to do**:
- Using 165 generated API functions directly
- Pattern: function + client + path/query/body
- When to use direct API vs domain services
- Error handling with result pattern

**Must NOT do**:
- List all 165 functions
- Duplicate domain service examples

**Parallelizable**: YES (with 5, 7, 8, 9, 10)

**References**:
- `docs/getting-started.md` (lines 55-68) - Direct API example
- `README.md` (lines 77-92) - Direct API functions section
- `src/sdk.gen.ts` (lines 1-50) - Function signature pattern

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/direct-api.mdx`
- [ ] getBookById example with full pattern
- [ ] Result pattern explanation (data vs error)
- [ ] When to use decision table
- [ ] Link to API Reference tab

**Commit**: NO (groups with Core Concepts)

---

### Task 7: Create pagination.mdx

**What to do**:
- PageRequest interface
- Sorting syntax (field,asc / field,desc)
- Search filters (BookSearch, SeriesSearch)
- Unpaged requests
- Direct API body/query split

**Must NOT do**:
- Cover all search filter options (link to API reference)

**Parallelizable**: YES (with 5, 6, 8, 9, 10)

**References**:
- `docs/pagination-search.md` (lines 1-68) - Full pagination guide

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/pagination.mdx`
- [ ] PageRequest interface code block
- [ ] Sorting examples
- [ ] Search filter example
- [ ] Unpaged example
- [ ] ResponseField components for page response

**Commit**: NO (groups with Core Concepts)

---

### Task 8: Create validation.mdx

**What to do**:
- Zod schema usage
- validateResponse vs safeValidateResponse
- createPageSchema helper
- Schema strict mode explanation
- Field error extraction

**Must NOT do**:
- List all schemas (too many)
- Duplicate error handling content

**Parallelizable**: YES (with 5, 6, 7, 9, 10)

**References**:
- `docs/validation.md` (lines 1-40) - Validation guide
- `src/validation/index.ts` - Helper function signatures

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/validation.mdx`
- [ ] validateResponse example
- [ ] safeValidateResponse example with success/error handling
- [ ] createPageSchema example
- [ ] Note about .strict() enforcement

**Commit**: NO (groups with Core Concepts)

---

### Task 9: Create errors.mdx

**What to do**:
- Error class hierarchy diagram
- Type guards (isApiError, isValidationError, etc.)
- Error properties table
- Retryability determination
- Field-level validation error extraction
- Comprehensive example with all error types

**Must NOT do**:
- Duplicate troubleshooting content

**Parallelizable**: YES (with 5, 6, 7, 8, 10)

**References**:
- `docs/errors.md` (lines 1-26) - Quick example
- `src/errors/README.md` (lines 1-108) - Full error reference

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/errors.mdx`
- [ ] Error class table with properties
- [ ] Type guard usage examples
- [ ] AccordionGroup for each error type
- [ ] Retryability explanation
- [ ] getFieldErrors() example

**Commit**: NO (groups with Core Concepts)

---

### Task 10: Create interceptors.mdx

**What to do**:
- What are interceptors (request, response, error)
- createLoggingInterceptor with options
- createErrorTransformInterceptor
- createValidationInterceptor with schema mapping
- Attaching interceptors to client

**Must NOT do**:
- Create custom interceptor tutorial (advanced topic)

**Parallelizable**: YES (with 5, 6, 7, 8, 9)

**References**:
- `docs/interceptors.md` (lines 1-64) - Full interceptor guide
- `src/interceptors/index.ts` - Interceptor exports

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/interceptors.mdx`
- [ ] Diagram/explanation of interceptor flow
- [ ] Example for each interceptor type
- [ ] Full client setup example with all interceptors
- [ ] Options table for each interceptor

**Commit**: YES
- Message: `docs(mintlify): add core concepts pages`
- Files: `docs/mintlify/domain-services.mdx`, `docs/mintlify/direct-api.mdx`, `docs/mintlify/pagination.mdx`, `docs/mintlify/validation.mdx`, `docs/mintlify/errors.mdx`, `docs/mintlify/interceptors.mdx`

---

### Task 11: Create guides/books.mdx

**What to do**:
- BookService deep dive
- All BookService methods with examples
- Common workflows (list, get, update metadata, get pages)
- Filtering and sorting books
- Real-world use cases

**Must NOT do**:
- Cover series or library operations

**Parallelizable**: YES (with 12, 13, 14)

**References**:
- `docs/domain-services.md` (lines 14-35) - BookService examples
- `src/domains/books.ts` - BookService implementation

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/books.mdx`
- [ ] All BookService methods documented
- [ ] CodeGroup examples for each method
- [ ] Search filter examples
- [ ] Link to Series guide for related operations

**Commit**: NO (groups with Domain Guides)

---

### Task 12: Create guides/series.mdx

**What to do**:
- SeriesService deep dive
- All SeriesService methods with examples
- Common workflows (list, get, update metadata, get books)
- Filtering and sorting series
- Relationship between series and books

**Must NOT do**:
- Cover book or library operations in detail

**Parallelizable**: YES (with 11, 13, 14)

**References**:
- `docs/domain-services.md` (lines 38-54) - SeriesService examples
- `src/domains/series.ts` - SeriesService implementation

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/series.mdx`
- [ ] All SeriesService methods documented
- [ ] CodeGroup examples for each method
- [ ] Series-to-books relationship explanation
- [ ] Link to Books guide

**Commit**: NO (groups with Domain Guides)

---

### Task 13: Create guides/libraries.mdx

**What to do**:
- LibraryService deep dive
- All LibraryService methods with examples
- Library creation with LibraryCreationDto
- Library scanning
- Update vs create patterns

**Must NOT do**:
- Cover book or series operations in detail

**Parallelizable**: YES (with 11, 12, 14)

**References**:
- `docs/domain-services.md` (lines 56-73) - LibraryService examples
- `src/domains/libraries.ts` - LibraryService implementation

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/libraries.mdx`
- [ ] All LibraryService methods documented
- [ ] LibraryCreationDto type explanation
- [ ] Scanning workflow
- [ ] Warning about required fields

**Commit**: NO (groups with Domain Guides)

---

### Task 14: Create guides/workflows.mdx

**What to do**:
- Common multi-step workflows
- Example: Scan library → List books → Update metadata
- Example: Search across libraries
- Example: Batch operations pattern
- Combining services effectively

**Must NOT do**:
- Repeat single-service operations in detail

**Parallelizable**: YES (with 11, 12, 13)

**References**:
- All domain service examples combined
- `docs/pagination-search.md` - Search patterns

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/workflows.mdx`
- [ ] 3+ complete workflow examples
- [ ] Steps component for multi-step flows
- [ ] Error handling within workflows
- [ ] Links to individual service guides

**Commit**: YES
- Message: `docs(mintlify): add domain guide pages`
- Files: `docs/mintlify/guides/books.mdx`, `docs/mintlify/guides/series.mdx`, `docs/mintlify/guides/libraries.mdx`, `docs/mintlify/guides/workflows.mdx`

---

### Task 15: Create guides/troubleshooting.mdx

**What to do**:
- Common issues: 401, 404, validation errors, timeouts, CORS
- Diagnostic steps for each issue
- Fix examples with code
- AccordionGroup for each issue type

**Must NOT do**:
- Duplicate error handling concepts (link to errors.mdx)

**Parallelizable**: YES (with 16, 17)

**References**:
- `docs/troubleshooting.md` (lines 1-31) - Full troubleshooting guide

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/troubleshooting.mdx`
- [ ] AccordionGroup with 5+ issue types
- [ ] Diagnostic commands/steps
- [ ] Fix code examples
- [ ] Link to errors page for type guard usage

**Commit**: NO (groups with Operations)

---

### Task 16: Create guides/testing.mdx

**What to do**:
- Unit testing domain services (mock client injection)
- Testing direct API functions (mocked fetch)
- Integration testing patterns
- Recommended commands (bun run test, coverage)
- Vitest configuration tips

**Must NOT do**:
- Write actual test files
- Cover e2e testing in detail

**Parallelizable**: YES (with 15, 17)

**References**:
- `docs/testing.md` (lines 1-31) - Testing guide

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/testing.mdx`
- [ ] Mock client example
- [ ] Mock fetch adapter example
- [ ] Integration test guidelines
- [ ] Test command examples

**Commit**: NO (groups with Operations)

---

### Task 17: Create guides/migration.mdx

**What to do**:
- Deprecated endpoints table with replacements
- Migration code examples (old → new)
- Version compatibility notes
- API version tracking

**Must NOT do**:
- Cover unreleased deprecations

**Parallelizable**: YES (with 15, 16)

**References**:
- `docs/migration.md` (lines 1-19) - Deprecation table
- `AGENTS.md` - Deprecated endpoints section

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/guides/migration.mdx`
- [ ] Deprecation table (4+ endpoints)
- [ ] Before/after code examples
- [ ] Guidance section with recommendations
- [ ] Link to API Reference for current endpoints

**Commit**: YES
- Message: `docs(mintlify): add operations guide pages`
- Files: `docs/mintlify/guides/troubleshooting.mdx`, `docs/mintlify/guides/testing.mdx`, `docs/mintlify/guides/migration.mdx`

---

### Task 18: Create reference/configuration.mdx

**What to do**:
- Full KomgaClientOptions reference
- All properties with ParamField components
- RetryConfig nested properties
- AuthConfig variants
- Default values table

**Must NOT do**:
- Repeat auth examples (link to authentication page)

**Parallelizable**: YES (with 19, 20, 21)

**References**:
- `docs/configuration.md` (lines 1-37) - Config interfaces
- `src/http/types.ts` - KomgaClientOptions definition

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/reference/configuration.mdx`
- [ ] ParamField for each option
- [ ] Expandable for nested configs (auth, retry)
- [ ] Default values noted
- [ ] Complete example with all options

**Commit**: NO (groups with Reference)

---

### Task 19: Create reference/typescript.mdx

**What to do**:
- TypeScript configuration guide
- Recommended tsconfig.json settings
- ESM module requirements
- Type imports and inference
- IDE setup tips

**Must NOT do**:
- Cover non-TypeScript usage

**Parallelizable**: YES (with 18, 20, 21)

**References**:
- `docs/getting-started.md` (lines 72-86) - TypeScript config
- `README.md` (TypeScript section) - tsconfig recommendations

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/reference/typescript.mdx`
- [ ] Complete tsconfig.json example
- [ ] Explanation of each compiler option
- [ ] Type import patterns
- [ ] IDE/editor recommendations

**Commit**: NO (groups with Reference)

---

### Task 20: Create reference/glossary.mdx

**What to do**:
- SDK terminology definitions
- Komga concepts (library, series, book, collection, read list)
- Technical terms (DTO, schema, interceptor, type guard)
- Alphabetical order

**Must NOT do**:
- Explain implementation details (link to relevant pages)

**Parallelizable**: YES (with 18, 19, 21)

**References**:
- All documentation pages for terminology
- Komga official docs for Komga concepts

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/reference/glossary.mdx`
- [ ] 15+ terms defined
- [ ] Alphabetical organization
- [ ] Links to relevant documentation pages
- [ ] Clear, concise definitions

**Commit**: NO (groups with Reference)

---

### Task 21: Create reference/api-reference.mdx

**What to do**:
- Guide to using TypeDoc API reference
- Guide to using OpenAPI tab
- Generation commands (bun run docs)
- Link to TypeDoc output
- Link to upstream Komga API spec

**Must NOT do**:
- Duplicate TypeDoc content
- Document individual endpoints

**Parallelizable**: YES (with 18, 19, 20)

**References**:
- `docs/api-reference.md` (lines 1-18) - Current guide
- `typedoc.json` - TypeDoc configuration

**Acceptance Criteria**:
- [ ] File created: `docs/mintlify/reference/api-reference.mdx`
- [ ] TypeDoc generation instructions
- [ ] Link to docs/api/ (TypeDoc output)
- [ ] Link to OpenAPI tab in Mintlify
- [ ] Link to upstream Komga API spec

**Commit**: YES
- Message: `docs(mintlify): add reference pages`
- Files: `docs/mintlify/reference/configuration.mdx`, `docs/mintlify/reference/typescript.mdx`, `docs/mintlify/reference/glossary.mdx`, `docs/mintlify/reference/api-reference.mdx`

---

### Task 22: Create Snippets

**What to do**:
- Create reusable MDX snippets for common code blocks
- `snippets/install-npm.mdx` - npm install command
- `snippets/install-bun.mdx` - bun add command
- `snippets/client-basic.mdx` - Basic client creation

**Must NOT do**:
- Create snippets for one-off code

**Parallelizable**: NO (depends on page patterns)

**References**:
- Mintlify snippets documentation
- Common patterns from created pages

**Acceptance Criteria**:
- [ ] Directory created: `docs/mintlify/snippets/`
- [ ] 3+ snippet files created
- [ ] Snippets reusable via `<Snippet file="..." />`
- [ ] Update pages to use snippets where appropriate

**Commit**: YES
- Message: `docs(mintlify): add reusable snippets`
- Files: `docs/mintlify/snippets/*.mdx`

---

### Task 23: Final QA and Verification

**What to do**:
- Install Mintlify CLI
- Run `mintlify dev` in docs/mintlify
- Verify all pages render
- Check all internal links
- Verify OpenAPI tab loads
- Verify TypeDoc link works
- Document any issues found

**Must NOT do**:
- Deploy to production
- Make fixes without documenting

**Parallelizable**: NO (final verification)

**References**:
- Mintlify CLI documentation
- All created pages

**Acceptance Criteria**:
- [ ] `npm install -g mintlify` succeeds
- [ ] `cd docs/mintlify && mintlify dev` starts server
- [ ] All 24 pages accessible via navigation
- [ ] No broken internal links
- [ ] OpenAPI tab shows endpoint documentation
- [ ] TypeDoc link navigates to docs/api
- [ ] Code examples have valid TypeScript syntax

**Commit**: NO (verification only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `docs(mintlify): configure complete navigation structure` | docs.json | JSON valid |
| 4 | `docs(mintlify): add getting started pages` | 4 MDX files | Files exist |
| 10 | `docs(mintlify): add core concepts pages` | 6 MDX files | Files exist |
| 14 | `docs(mintlify): add domain guide pages` | 4 MDX files | Files exist |
| 17 | `docs(mintlify): add operations guide pages` | 3 MDX files | Files exist |
| 21 | `docs(mintlify): add reference pages` | 4 MDX files | Files exist |
| 22 | `docs(mintlify): add reusable snippets` | 3+ MDX files | Files exist |

---

## Success Criteria

### Verification Commands
```bash
# Check docs.json is valid
cat docs/mintlify/docs.json | jq .

# Count MDX files (should be 24+)
find docs/mintlify -name "*.mdx" | wc -l

# Install Mintlify CLI
npm install -g mintlify

# Start local preview
cd docs/mintlify && mintlify dev

# In browser: http://localhost:3000
# - Navigate all pages
# - Click all internal links
# - Check OpenAPI tab
# - Check TypeDoc tab link
```

### Final Checklist
- [ ] 24 MDX pages created
- [ ] docs.json has complete navigation
- [ ] All pages render in Mintlify preview
- [ ] No broken links
- [ ] OpenAPI integration works
- [ ] TypeDoc link works
- [ ] Code examples use TypeScript syntax
- [ ] No hardcoded credentials
- [ ] All pages have proper frontmatter
- [ ] Commits follow conventional format

---

## Page-by-Page Summary

| # | Page | Path | Source Content |
|---|------|------|----------------|
| 1 | Introduction | `introduction.mdx` | README.md + getting-started.md |
| 2 | Quickstart | `quickstart.mdx` | getting-started.md |
| 3 | Installation | `installation.mdx` | getting-started.md |
| 4 | Authentication | `authentication.mdx` | README.md + configuration.md |
| 5 | Domain Services | `domain-services.mdx` | domain-services.md |
| 6 | Direct API | `direct-api.mdx` | getting-started.md + README.md |
| 7 | Pagination | `pagination.mdx` | pagination-search.md |
| 8 | Validation | `validation.mdx` | validation.md |
| 9 | Errors | `errors.mdx` | errors.md + src/errors/README.md |
| 10 | Interceptors | `interceptors.mdx` | interceptors.md |
| 11 | Books Guide | `guides/books.mdx` | domain-services.md |
| 12 | Series Guide | `guides/series.mdx` | domain-services.md |
| 13 | Libraries Guide | `guides/libraries.mdx` | domain-services.md |
| 14 | Workflows | `guides/workflows.mdx` | Combined patterns |
| 15 | Troubleshooting | `guides/troubleshooting.mdx` | troubleshooting.md |
| 16 | Testing | `guides/testing.mdx` | testing.md |
| 17 | Migration | `guides/migration.mdx` | migration.md |
| 18 | Configuration | `reference/configuration.mdx` | configuration.md |
| 19 | TypeScript | `reference/typescript.mdx` | getting-started.md |
| 20 | Glossary | `reference/glossary.mdx` | New content |
| 21 | API Reference | `reference/api-reference.mdx` | api-reference.md |
| 22-24 | Snippets | `snippets/*.mdx` | Extracted patterns |
