# VALIDATION SCHEMAS

## OVERVIEW
Zod schemas and inferred types for Komga DTOs.

## STRUCTURE
```
src/validation/schemas/
├── common.ts      # Shared DTOs + pagination helpers
├── book.ts
├── series.ts
├── library.ts
├── collection.ts
├── readlist.ts
├── user.ts
└── index.ts       # Re-exports
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Shared DTOs | `src/validation/schemas/common.ts` | base types, `createPageSchema` |
| Per-entity DTOs | `src/validation/schemas/*.ts` | Book/Series/Library/etc. |
| Schema exports | `src/validation/schemas/index.ts` | barrel export |

## CONVENTIONS
- Use `z.object(...).strict()` for DTO schemas.
- Export `FooDtoSchema` and `FooDto` via `z.infer`.
- Update DTOs should make fields optional.
- Pagination uses `createPageSchema()`.

## ANTI-PATTERNS
- Do not mix runtime validation with plain types; keep schema + type paired.

## NOTES
- `common.ts` is the shared base; prefer reusing schemas over duplicating.
- When adding fields, update both schema and exported type alias.
