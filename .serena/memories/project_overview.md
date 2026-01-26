# Komga SDK - Project Overview

## Purpose
Manually maintained TypeScript SDK for the Komga API (media server for comics, manga, and digital books).

## Tech Stack
- **Language**: TypeScript
- **HTTP**: hey-api client + ky adapter
- **Validation**: zod

## Project Structure
```
komga-sdk/
├── src/
│   ├── index.ts               # Main entry - re-exports SDK + helpers
│   ├── sdk.gen.ts             # API functions (manual maintenance)
│   ├── types.gen.ts           # API types (manual maintenance)
│   ├── client.gen.ts          # Client factory exports
│   ├── client/                # Client implementation
│   ├── core/                  # Core utilities
│   ├── http/                  # ky adapter + client factory
│   ├── domains/               # Domain services
│   ├── validation/            # zod schemas + helpers
│   ├── interceptors/          # request/response middleware
│   └── errors/                # error types
├── tsconfig.json
├── package.json
└── bun.lock
```

## Key Characteristics
1. **Manual maintenance** — no generator; update API/spec changes directly in src
2. **Typed** — full TypeScript types for API operations and responses
3. **Validation** — zod schemas for runtime validation where used
4. **Authentication** — Basic auth and API Key (`X-API-Key`)

## API Coverage
Covers Komga API for libraries, series, books, collections, read lists, users, and admin operations.
