# Mintlify Documentation Completion Guide

**Created:** 2026-01-27
**Purpose:** Complete guide for finishing Komga SDK Mintlify documentation
**Status:** Expanded coverage - new guides added for remaining endpoints

---

## Overview

The Komga SDK Mintlify documentation needs 5 additional usage guides to achieve ~95% API coverage. This memory contains everything needed to complete this task.

## Project Structure

```
/Users/shivambansal/Downloads/komga-sdk/
├── src/
│   ├── index.ts              # Public exports - CHECK THIS for import paths
│   ├── sdk.gen.ts            # All 165 API functions - REFERENCE for endpoints
│   ├── types.gen.ts          # All TypeScript types
│   ├── domains/              # Domain services (Book, Series, Library)
│   ├── validation/schemas/   # Zod schemas
│   ├── errors/               # Error types and guards
│   └── interceptors/         # Request/response middleware
├── docs/
│   ├── mintlify/             # <<<< WORK HERE
│   │   ├── docs.json         # Navigation config - UPDATE after adding pages
│   │   ├── AGENTS.md         # Mintlify-specific guidelines
│   │   ├── guides/           # <<<< ADD NEW GUIDES HERE
│   │   │   ├── books.mdx
│   │   │   ├── series.mdx
│   │   │   ├── libraries.mdx
│   │   │   ├── collections.mdx
│   │   │   ├── read-lists.mdx
│   │   │   ├── workflows.mdx
│   │   │   ├── testing.mdx
│   │   │   ├── troubleshooting.mdx
│   │   │   └── migration.mdx
│   │   └── reference/        # Reference docs
│   └── api/                  # TypeDoc output (generated)
└── AGENTS.md                 # Main project knowledge base
```

## Files Created / Updated

| File Path | Notes |
|-----------|-------|
| `docs/mintlify/guides/users.mdx` | User CRUD, API keys, auth activity, user settings, sync points |
| `docs/mintlify/guides/read-progress.mdx` | Book/series read tracking, OPDS progression |
| `docs/mintlify/guides/downloads.mdx` | File downloads incl. wildcard endpoint |
| `docs/mintlify/guides/metadata-lookups.mdx` | Genres, tags, authors, publishers, languages |
| `docs/mintlify/guides/admin.mdx` | Server settings, tasks, duplicates, transient pages, releases |
| `docs/mintlify/guides/book-content.mdx` | Pages, thumbnails, WebPub manifests, EPUB resources |
| `docs/mintlify/guides/thumbnails.mdx` | Thumbnails across books/series/collections/read lists |
| `docs/mintlify/guides/series-discovery.mdx` | Latest/new/updated series, release dates |
| `docs/mintlify/guides/library-maintenance.mdx` | Library scans, analyze, refresh, delete files |
| `docs/mintlify/guides/client-settings.mdx` | Global + user settings |
| `docs/mintlify/guides/book-discovery.mdx` | Latest/on-deck/duplicate books |
| `docs/mintlify/guides/mihon-sync.mdx` | Mihon/Tachiyomi progress sync |
| `docs/mintlify/guides/fonts.mdx` | Font resources for readers |
| `docs/mintlify/guides/deprecated-endpoints.mdx` | Legacy endpoints and replacements |
| `docs/mintlify/docs.json` | Navigation updated with new guides |

## API Endpoints to Document

### guides/users.mdx (HIGH PRIORITY)
```typescript
// From src/sdk.gen.ts - User Management
getUsers                              // List all users (ADMIN)
addUser                               // Create user (ADMIN)
getCurrentUser                        // Get authenticated user
updateUserById                        // Update user (ADMIN)
deleteUserById                        // Delete user (ADMIN)
updatePasswordForCurrentUser          // Update own password
updatePasswordByUserId                // Update user password (ADMIN)

// API Key Management
getApiKeysForCurrentUser              // List own API keys
createApiKeyForCurrentUser            // Create API key
deleteApiKeyByKeyId                   // Delete API key

// Authentication Activity
getAuthenticationActivity             // All auth activity (ADMIN)
getAuthenticationActivityForCurrentUser // Own auth activity
getLatestAuthenticationActivityByUserId // User's latest (ADMIN)
```

### guides/read-progress.mdx (HIGH PRIORITY)
```typescript
// Book Read Progress
markBookReadProgress                  // Mark book read/update page
deleteBookReadProgress                // Mark book unread
getBookProgression                    // Get OPDS progression
updateBookProgression                 // Update OPDS progression

// Series Read Progress
markSeriesAsRead                      // Mark all books in series read
markSeriesAsUnread                    // Mark all books in series unread

// Mihon/Tachiyomi specific (optional to document)
getMihonReadProgressBySeriesId
updateMihonReadProgressBySeriesId
getMihonReadProgressByReadListId
updateMihonReadProgressByReadListId
```

### guides/downloads.mdx (MEDIUM PRIORITY)
```typescript
downloadBookFile                      // Download single book file
downloadBookFile1                     // Download with wildcard path
downloadSeriesAsZip                   // Download series as ZIP
downloadReadListAsZip                 // Download readlist as ZIP
```

### guides/metadata-lookups.mdx (MEDIUM PRIORITY)
```typescript
// Metadata endpoints - all support filtering
getGenres                             // List genres
getTags                               // List all tags
getBookTags                           // List book-specific tags
getSeriesTags                         // List series-specific tags
getPublishers                         // List publishers
getLanguages                          // List languages
getAgeRatings                         // List age ratings
getSharingLabels                      // List sharing labels

// Authors
getAuthors                            // List authors (v2)
getAuthorsNames                       // List author names only
getAuthorsRoles                       // List author roles
getAuthorsDeprecated                  // v1 deprecated
```

### guides/admin.mdx (MEDIUM PRIORITY)
```typescript
// Server Settings
getServerSettings                     // Get settings (ADMIN)
updateServerSettings                  // Update settings (ADMIN)

// Server Claim
claimServer                           // Initial server setup
getClaimStatus                        // Check if claimed

// Server Info
getActuatorInfo                       // Server info (ADMIN)
getAnnouncements                      // Get announcements (ADMIN)
markAnnouncementsRead                 // Mark read (ADMIN)

// Tasks
emptyTaskQueue                        // Clear task queue (ADMIN)

// History
getHistoricalEvents                   // List events (ADMIN)

// Filesystem
getDirectoryListing                   // Browse directories (ADMIN)

// Duplicate Detection
getKnownPageHashes                    // Known duplicates (ADMIN)
getUnknownPageHashes                  // Unknown duplicates (ADMIN)
createOrUpdateKnownPageHash           // Mark as known (ADMIN)
deleteDuplicatePagesByPageHash        // Delete by hash (ADMIN)
deleteSingleMatchByPageHash           // Delete single match (ADMIN)
getPageHashMatches                    // List matches (ADMIN)
getKnownPageHashThumbnail             // Get thumbnail (ADMIN)
getUnknownPageHashThumbnail           // Get thumbnail (ADMIN)

// Transient Books
scanTransientBooks                    // Scan folder (ADMIN)
analyzeTransientBook                  // Analyze book (ADMIN)
getPageByTransientBookId              // Get page (ADMIN)

// Import
importBooks                           // Import books (ADMIN)

// Sync Points (Kobo)
deleteSyncPointsForCurrentUser        // Delete sync points
```

## Documentation Style Guide

### Frontmatter Template
```yaml
---
title: "Page Title"
description: "Concise description for SEO"
icon: "font-awesome-icon-name"
---
```

### Icon Suggestions
- users.mdx: `"users"`
- read-progress.mdx: `"bookmark"`
- downloads.mdx: `"download"`
- metadata-lookups.mdx: `"tags"`
- admin.mdx: `"shield-halved"`

### Mintlify Components to Use
```mdx
<Note>Informational callout</Note>
<Warning>Warning - destructive or admin-only</Warning>
<Tip>Helpful tip</Tip>
<Info>Additional context</Info>

<Tabs>
  <Tab title="Tab 1">Content</Tab>
  <Tab title="Tab 2">Content</Tab>
</Tabs>

<CodeGroup>
```typescript title="example.ts"
// Code here
```
</CodeGroup>

<AccordionGroup>
  <Accordion title="Expandable section" icon="icon-name">
    Content
  </Accordion>
</AccordionGroup>

<CardGroup cols={2}>
  <Card title="Card" icon="icon" href="/path">
    Description
  </Card>
</CardGroup>

<Steps>
  <Step title="Step 1">Content</Step>
  <Step title="Step 2">Content</Step>
</Steps>
```

### Code Example Pattern
```typescript
import { functionName } from 'komga-sdk';

const result = await functionName({
  client,
  path: { id: 'resource-id' },      // Path parameters
  query: { page: 0, size: 20 },     // Query parameters
  body: { field: 'value' },         // Request body
});

if (result.data) {
  console.log(result.data);
}

// For error handling
if (result.error) {
  console.error(`Error: ${result.error}`);
}
```

### Admin Endpoint Pattern
```mdx
## Operation Name

<Warning>
Requires **ADMIN** role.
</Warning>

```typescript
// code example
```
```

## What NOT to Document

1. **Separate DTO/Type pages** - TypeDoc handles this
2. **Every field of every type** - Show only relevant fields in context
3. **Deprecated endpoints** - Mention briefly, link to replacement
4. **Internal implementation** - Focus on usage, not internals

## What TO Document

1. **How to call each endpoint** - Practical examples
2. **Key parameters** - What's required, common options
3. **Error handling** - How to handle failures
4. **Common workflows** - Combining multiple calls
5. **Admin requirements** - Mark admin-only clearly
6. **Related endpoints** - Link to related guides

## Reference Documentation

### Mintlify Docs (use Context7)
```
context7_resolve-library-id: "mintlify"
context7_query-docs: Components, configuration, MDX syntax
```

### Key References
- Mintlify Components: https://mintlify.com/docs/components
- Mintlify Configuration: https://mintlify.com/docs/settings
- Font Awesome Icons: https://fontawesome.com/icons

### Project References
- Main AGENTS.md: `/Users/shivambansal/Downloads/komga-sdk/AGENTS.md`
- Mintlify AGENTS.md: `/Users/shivambansal/Downloads/komga-sdk/docs/mintlify/AGENTS.md`
- SDK exports: `/Users/shivambansal/Downloads/komga-sdk/src/index.ts`
- API functions: `/Users/shivambansal/Downloads/komga-sdk/src/sdk.gen.ts`

## Update docs.json After Creating Guides

Location: `docs/mintlify/docs.json`

Add to the "Domain Guides" group:
```json
{
  "group": "Domain Guides",
  "pages": [
    "guides/books",
    "guides/series",
    "guides/libraries",
    "guides/collections",
    "guides/read-lists",
    "guides/users",
    "guides/read-progress",
    "guides/downloads",
    "guides/metadata-lookups",
    "guides/admin",
    "guides/workflows"
  ]
}
```

## Verification Checklist

After creating each guide:
- [ ] File exists at `docs/mintlify/guides/{name}.mdx`
- [ ] Frontmatter has title, description, icon
- [ ] All imports match `src/index.ts` exports
- [ ] Code examples are syntactically correct
- [ ] Admin endpoints marked with `<Warning>`
- [ ] Error handling shown for key operations
- [ ] Links to related guides work
- [ ] Added to `docs.json` navigation
- [ ] Preview works: `cd docs/mintlify && bun run --bun mint dev`

## Commands

```bash
# Preview Mintlify docs locally
cd docs/mintlify && bun run --bun mint dev

# Check TypeScript validity
bun tsc --noEmit

# Run SDK tests
bun run test

# Generate TypeDoc
bun run docs
```

## Serena Tools to Use

```
# Read existing guides for pattern reference
serena_read_file: docs/mintlify/guides/books.mdx

# Find API functions
serena_search_for_pattern: "export const getUsers"
serena_find_symbol: "getUsers" in src/sdk.gen.ts

# Check exports
serena_get_symbols_overview: src/index.ts

# Write new guide
Write tool: docs/mintlify/guides/users.mdx

# Update navigation
Edit tool: docs/mintlify/docs.json
```

## Context7 Queries for Mintlify Help

```
# Resolve Mintlify library
context7_resolve-library-id:
  libraryName: "mintlify"
  query: "MDX components documentation"

# Query specific topics
context7_query-docs:
  libraryId: "/mintlify/docs"
  query: "accordion component usage"

context7_query-docs:
  libraryId: "/mintlify/docs"
  query: "tabs component examples"

context7_query-docs:
  libraryId: "/mintlify/docs"
  query: "code blocks syntax highlighting"
```

## Progress Tracking

| Guide | Status | Notes |
|-------|--------|-------|
| guides/users.mdx | COMPLETED | User CRUD, API keys, auth, settings, sync points |
| guides/read-progress.mdx | COMPLETED | Book/series read tracking, OPDS progression |
| guides/downloads.mdx | COMPLETED | File downloads incl. wildcard endpoint |
| guides/metadata-lookups.mdx | COMPLETED | Genres, tags, authors, publishers, languages |
| guides/admin.mdx | COMPLETED | Server settings, tasks, duplicates, transient pages, releases |
| guides/book-content.mdx | COMPLETED | Pages, thumbnails, WebPub manifests |
| guides/thumbnails.mdx | COMPLETED | Thumbnails across content types |
| guides/series-discovery.mdx | COMPLETED | Discovery endpoints |
| guides/library-maintenance.mdx | COMPLETED | Maintenance operations |
| guides/client-settings.mdx | COMPLETED | Global/user settings |
| guides/book-discovery.mdx | COMPLETED | Latest/on-deck/duplicates |
| guides/mihon-sync.mdx | COMPLETED | Mihon/Tachiyomi sync |
| guides/fonts.mdx | COMPLETED | Font resources |
| guides/deprecated-endpoints.mdx | COMPLETED | Legacy endpoints |
| docs.json update | COMPLETED | Navigation updated |
