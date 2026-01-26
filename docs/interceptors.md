# Interceptors

Interceptors let you hook into request, response, and error lifecycles.

## Attach Interceptors

```typescript
import {
  createKomgaClient,
  createLoggingInterceptor,
  createErrorTransformInterceptor,
  createValidationInterceptor,
  BookDtoSchema,
} from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: { type: 'basic', username: 'admin', password: 'password' },
});

const { request, response } = createLoggingInterceptor({ logHeaders: true });
const errorTransform = createErrorTransformInterceptor();
const validation = createValidationInterceptor({
  schemas: { '/api/books': BookDtoSchema },
});

client.interceptors.request.use(request);
client.interceptors.response.use(response);
client.interceptors.response.use(validation);
client.interceptors.error.use(errorTransform);
```

## Logging Interceptor

Options:

- `logger` (defaults to `console.log`)
- `logHeaders` (boolean)
- `logBody` (boolean)

Use this to inspect requests and responses during development.

## Error Transform Interceptor

Converts HTTP and network errors into typed errors:

- 4xx/5xx responses become `ApiError`
- network failures become `NetworkError`
- timeouts become `TimeoutError`

## Validation Interceptor

Validates JSON responses against schemas by URL pattern. Patterns can be regex or simple substring matches.

```typescript
const validation = createValidationInterceptor({
  schemas: {
    '/api/books': BookDtoSchema,
    '/api/books/.*': BookDtoSchema,
  },
  throwOnError: true,
});
```
