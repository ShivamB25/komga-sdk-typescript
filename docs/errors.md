# Errors

The SDK provides a typed error hierarchy with type guards and retryability helpers.

## Quick Example

```typescript
import { isApiError, isValidationError, isNetworkError } from 'komga-sdk';

try {
  await bookService.getById('invalid-id');
} catch (error) {
  if (isApiError(error)) {
    console.log(`HTTP ${error.status}: ${error.statusText}`);
  } else if (isValidationError(error)) {
    console.log('Validation failed:', error.getFieldErrors());
  } else if (isNetworkError(error)) {
    console.log('Network error:', error.message);
  }
}
```

## Full Reference

See `src/errors/README.md` for full class details and type guard usage.
