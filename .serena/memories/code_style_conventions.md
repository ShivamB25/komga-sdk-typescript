# Code Style & Conventions

## General
This repo is manually maintained. Follow existing TypeScript patterns in `src/`.

## Naming
- **Functions**: camelCase (e.g., `getBooks`, `addLibrary`)
- **Types**: PascalCase (e.g., `BookDto`, `LibraryDto`)
- **Type Suffixes**:
  - `*Data` for request data types
  - `*Errors` for error response types
  - `*Responses` for success response types

## File Organization
- Main exports in `src/index.ts`
- API functions in `src/sdk.gen.ts`
- Types in `src/types.gen.ts`
- Client in `src/client/`
- Core utilities in `src/core/`
- Domain services in `src/domains/`
- Validation in `src/validation/`
- HTTP adapter in `src/http/`
- Interceptors in `src/interceptors/`
- Errors in `src/errors/`
