# Mintlify Documentation Setup

## Overview
This project now includes Stripe-quality documentation using Mintlify, coexisting with TypeDoc API reference.

## Location
- Mintlify docs: `docs/mintlify/`
- TypeDoc output: `docs/api/` (generated)

## Structure
```
docs/mintlify/
├── docs.json              # Mintlify configuration
├── introduction.mdx       # Landing page
├── quickstart.mdx         # Getting started
├── authentication.mdx     # Auth patterns
├── domain-services.mdx    # Domain services overview
├── direct-api.mdx         # Direct API usage
├── pagination.mdx         # Pagination patterns
├── validation.mdx         # Validation helpers
├── errors.mdx             # Error handling
├── interceptors.mdx       # Interceptor usage
├── guides/                # Domain guides
│   ├── books.mdx
│   ├── series.mdx
│   ├── libraries.mdx
│   ├── workflows.mdx
│   ├── troubleshooting.mdx
│   ├── testing.mdx
│   └── migration.mdx
└── reference/             # Reference docs
    ├── configuration.mdx
    ├── typescript.mdx
    ├── api-reference.mdx
    └── glossary.mdx
```

## Running Locally
```bash
cd docs/mintlify
bun run --bun mint dev
```

Server runs at http://localhost:3333

## Key Features
- Three tabs: Guides, API Reference (OpenAPI), TypeDoc
- Real code examples from SDK usage patterns
- Navigation organized by Getting Started, Core Concepts, Guides, Reference
- Links between Mintlify docs and TypeDoc output

## Notes
- Mintlify requires Bun runtime (`--bun` flag) to avoid Node version issues
- TypeDoc generates to `docs/api/` and is linked as a tab in Mintlify
- OpenAPI spec is loaded directly from Komga's GitHub repository