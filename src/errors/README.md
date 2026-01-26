# Komga SDK Error Classes

Production-ready error class hierarchy for the Komga SDK with comprehensive error handling and type guards.

## Files

### `base.ts` - KomgaError
Abstract base class for all SDK errors.

**Properties:**
- `code: string` - Unique error code for discrimination
- `isRetryable: boolean` - Whether the error is retryable

### `api.ts` - ApiError
HTTP error responses (4xx, 5xx).

**Properties:**
- `status: number` - HTTP status code
- `statusText: string` - HTTP status text
- `body: unknown` - Response body
- `request: Request` - Original fetch request
- `response: Response` - Original fetch response
- `isRetryable: boolean` - Auto-determined (true for 429, 5xx)

**Type Guards:**
- `isClientError()` - 4xx errors
- `isServerError()` - 5xx errors
- `isNotFound()` - 404
- `isUnauthorized()` - 401
- `isForbidden()` - 403
- `isRateLimited()` - 429

### `validation.ts` - ValidationError
Zod validation failures.

**Properties:**
- `issues: z.ZodIssue[]` - Validation issues
- `input: unknown` - Failed input
- `isRetryable: false`

**Methods:**
- `getFieldErrors()` - Returns `Record<string, string[]>` of errors by field

### `network.ts` - NetworkError & TimeoutError
Network request failures.

**NetworkError:**
- `cause: Error | undefined` - Underlying error
- `isRetryable: true`

**TimeoutError:**
- Extends NetworkError
- `code: 'KOMGA_TIMEOUT_ERROR'`

### `index.ts` - Exports & Type Guards
Re-exports all error classes and provides type guards.

**Exports:**
- All error classes
- `ErrorCodes` constant object
- Type guard functions: `isKomgaError()`, `isApiError()`, `isValidationError()`, `isNetworkError()`, `isTimeoutError()`

## Usage

```typescript
import {
  ApiError,
  ValidationError,
  NetworkError,
  isApiError,
  isValidationError,
  ErrorCodes,
} from 'komga-sdk';

try {
  // API call
} catch (error) {
  if (isApiError(error)) {
    if (error.isNotFound()) {
      console.log('Resource not found');
    } else if (error.isRateLimited()) {
      console.log('Rate limited, retry later');
    }
  } else if (isValidationError(error)) {
    const fieldErrors = error.getFieldErrors();
    console.log('Validation errors:', fieldErrors);
  }
}
```

## Error Codes

- `KOMGA_ERROR` - Base error
- `KOMGA_API_ERROR` - HTTP errors
- `KOMGA_VALIDATION_ERROR` - Validation failures
- `KOMGA_NETWORK_ERROR` - Network failures
- `KOMGA_TIMEOUT_ERROR` - Request timeouts

## Features

✅ Strict TypeScript (no `any`, no `@ts-ignore`)
✅ Proper error inheritance chain
✅ Type guards for runtime discrimination
✅ Comprehensive JSDoc documentation
✅ Zod v4 integration
✅ Retryability determination
✅ Field-level validation error extraction
