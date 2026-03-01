# Komga SDK Project Overview

## Project
TypeScript SDK for Komga media server API. Provides type-safe client, Zod validation, and high-level domain services.

## Current State (March 2026)
- Version: 0.2.0 (published to npm via OIDC trusted publishing)
- 149 tests passing across 5 test suites
- TypeScript strict mode, zero build errors
- CI/CD: GitHub Actions with npm OIDC (no long-lived tokens)

## Domain Services (7 total)
- BookService - book retrieval, metadata updates, thumbnails
- SeriesService - series management, book listings
- LibraryService - library CRUD, scanning, analysis
- CollectionService - collection CRUD (added v0.2.0)
- ReadListService - read list CRUD (added v0.2.0)
- UserService - user management (added v0.2.0)
- SettingsService - server settings (added v0.2.0)

## BaseService Patterns
- safeCall<T>() - for endpoints returning data (validates with Zod schema)
- safeVoidCall() - for void endpoints (checks result.error only)

## Validation
- All Zod schemas use .strict() enforcement
- Types from z.infer<typeof Schema>
- .nullish() for optional fields that API returns as null

## CI/CD Critical Notes
- Uses npm publish with OIDC (NOT bun publish - bun lacks OIDC support)
- npm 11.5.1+ required (Node 22 ships with 10.x - must upgrade in CI)
- NODE_AUTH_TOKEN must be explicitly cleared (setup-node sets placeholder)
- See skill: skills/npm-oidc-publishing for full setup

## Auth Methods Supported
- HTTP Basic Auth (username/password)
- API Key (X-API-Key header)
- NOT supported: Bearer/JWT tokens

## Package
- Published: https://www.npmjs.com/package/komga-sdk
- Install: bun add komga-sdk / npm install komga-sdk
