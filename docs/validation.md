# Validation

The SDK ships Zod schemas for DTOs and helpers for runtime validation.

## Validate a Response

```typescript
import { BookDtoSchema, validateResponse } from 'komga-sdk';

const book = validateResponse(BookDtoSchema, responseData);
```

## Safe Validation

```typescript
import { BookDtoSchema, safeValidateResponse } from 'komga-sdk';

const result = safeValidateResponse(BookDtoSchema, responseData);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}
```

## Pagination Schemas

Use `createPageSchema()` for custom paginated responses:

```typescript
import { createPageSchema, BookDtoSchema } from 'komga-sdk';

const PageBookSchema = createPageSchema(BookDtoSchema);
const page = PageBookSchema.parse(rawData);
```

## Nullish Fields

Fields that can be `null` from the API are represented as `nullish` in schemas. This matches optional TypeScript types (`string | undefined`) while allowing `null` at runtime.
