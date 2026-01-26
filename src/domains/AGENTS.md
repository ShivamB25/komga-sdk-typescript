# DOMAIN SERVICES

## OVERVIEW
High-level service wrappers over API functions with validation.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Common behavior | `src/domains/base.ts` | `safeCall` validation wrapper |
| Book operations | `src/domains/books.ts` | `BookService` |
| Series operations | `src/domains/series.ts` | `SeriesService` |
| Library operations | `src/domains/libraries.ts` | `LibraryService` |
| Exports | `src/domains/index.ts` | public domain barrel |

## CONVENTIONS
- Services extend `BaseService` and validate responses via `safeCall()`.
- List operations accept `{ search, page, size, sort, unpaged }` and split body vs query.
- Void endpoints return `Promise<void>` after error checking.

## ANTI-PATTERNS
- Do not bypass `safeCall()` for responses that need validation.
- Do not return `result.data` from endpoints that return `204`.

## NOTES
- `getBooks`/`getSeries` use POST list endpoints with body + query split.
- Service methods should return DTOs, not raw `{ data, error }` results.
