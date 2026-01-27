# Komga SDK

A TypeScript SDK for the [Komga](https://komga.org/) media server API. It provides a type-safe client, Zod validation, and high-level domain services.

## Documentation

We provide multiple documentation formats:

### Mintlify Docs (Recommended)
Stripe-quality usage documentation with interactive API reference.
- Deployed: https://routrtechnologiesllc.mintlify.app/
- Location: `docs/mintlify/`
- Local preview: `cd docs/mintlify && bun run --bun mint dev`
- Structure:
  - **Guides**: Getting Started, Core Concepts, Domain Guides, Operations
  - **API Reference**: Auto-generated from Komga OpenAPI spec
  - **TypeDoc**: Links to TypeScript SDK reference

### Markdown Docs
Traditional markdown documentation for quick reference.
- Start here: `docs/getting-started.md`
- Domain Services: `docs/domain-services.md`
- Pagination & Search: `docs/pagination-search.md`
- Interceptors: `docs/interceptors.md`
- Validation: `docs/validation.md`
- Configuration: `docs/configuration.md`
- Errors (full reference): `src/errors/README.md`
- Testing: `docs/testing.md`
- Troubleshooting: `docs/troubleshooting.md`
- Migration / Deprecations: `docs/migration.md`
- API Reference (TypeDoc): `docs/api-reference.md`

## Table of Contents

- Documentation (Mintlify + Markdown)
- Installation
- Quick Start
- Requirements
- Authentication
- Domain Services
- Direct API Functions
- Pagination & Search
- Interceptors
- Error Handling
- Validation
- Configuration
- API Reference
- API Coverage
- TypeScript
- Changelog
- Contributing
- License

## Installation

```bash
# Using bun
bun add komga-sdk

# Using npm
npm install komga-sdk

# Using pnpm
pnpm add komga-sdk
```

## Quick Start

```typescript
import { createKomgaClient, BookService } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'admin@example.com',
    password: 'your-password',
  },
  timeout: 30000,
  retry: { limit: 3 },
  debug: false,
});

const bookService = new BookService(client);
const book = await bookService.getById('book-123');
console.log(book.metadata.title);
```

## Requirements

- Komga API version: 1.23.6
- Runtime with Fetch and Web Crypto (e.g. Node 18+ or modern browsers)

## Authentication

```typescript
import { createKomgaClient } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'user@example.com',
    password: 'password',
  },
});
```

API key authentication:

```typescript
const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'apiKey',
    key: 'your-api-key',
  },
});
```

Bearer token authentication:

```typescript
const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'bearer',
    token: 'your-jwt-token',
  },
});
```

## Domain Services

Use domain services for validated, high-level operations:

```typescript
import { BookService, SeriesService, LibraryService } from 'komga-sdk';

const bookService = new BookService(client);
const seriesService = new SeriesService(client);
const libraryService = new LibraryService(client);

const books = await bookService.list({ page: 0, size: 20 });
const series = await seriesService.getById('series-123');
const libraries = await libraryService.getAll();
```

More examples: `docs/domain-services.md`.

## Direct API Functions

Use direct API functions for low-level access:

```typescript
import { createKomgaClient, getBookById } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: { type: 'basic', username: 'admin', password: 'password' },
});

const result = await getBookById({
  client,
  path: { bookId: 'book-123' },
});

if (result.data) {
  console.log(result.data.metadata.title);
}
```

## Pagination & Search

Pagination and search examples: `docs/pagination-search.md`.

## Interceptors

Attach request/response/error interceptors to the client:

```typescript
import {
  createLoggingInterceptor,
  createErrorTransformInterceptor,
  createValidationInterceptor,
  BookDtoSchema,
} from 'komga-sdk';

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

More details: `docs/interceptors.md`.

## Error Handling

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

Full error reference: `src/errors/README.md`.

## Validation

All responses are validated against Zod schemas with `.strict()` enforcement.

```typescript
import { BookDtoSchema, validateResponse, safeValidateResponse } from 'komga-sdk';

const validated = validateResponse(BookDtoSchema, responseData);

const result = safeValidateResponse(BookDtoSchema, responseData);
if (result.success) {
  console.log(result.data);
}
```

More details: `docs/validation.md`.

## Configuration

```typescript
interface KomgaClientOptions {
  baseUrl: string;           // Komga server URL
  auth?: AuthConfig;         // Authentication config
  timeout?: number;          // Request timeout in ms (default: 30000)
  retry?: RetryConfig;       // Retry configuration
  debug?: boolean;           // Enable debug logging
}

interface RetryConfig {
  limit?: number;            // Max retry attempts (default: 3)
  methods?: string[];        // HTTP methods to retry
  statusCodes?: number[];    // Status codes to retry
  backoffLimit?: number;     // Max backoff delay in ms
}
```

More details: `docs/configuration.md`.

## API Reference

- Generate TypeDoc API docs: `bun run docs`
- Output directory: `docs/api/`
- Guide: `docs/api-reference.md`

## API Coverage

This SDK covers Komga API v1.23.6 with 130 unique endpoint paths across 165 operations.

### Endpoint Categories

| Category | Description |
|----------|-------------|
| Books | Book retrieval, metadata, pages, thumbnails |
| Series | Series management, metadata, book listings |
| Libraries | Library CRUD, scanning, analysis |
| Collections | Collection management |
| Read Lists | Read list management |
| Users | User management, authentication |
| Settings | Server and client settings |
| Tasks | Background task management |

### Deprecated Endpoints

| Endpoint | Replacement | Since |
|----------|-------------|-------|
| `GET /api/v1/books` | `POST /api/v1/books/list` | 1.19.0 |
| `GET /api/v1/series` | `POST /api/v1/series/list` | 1.19.0 |
| `GET /api/v1/authors` | `GET /api/v2/authors` | 1.20.0 |
| `PUT /api/v1/libraries/{libraryId}` | `PATCH /api/v1/libraries/{libraryId}` | 1.3.0 |

## TypeScript

This SDK is source-only with `noEmit`. Use these settings for best results:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Changelog

See `CHANGELOG.md`.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT (see `LICENSE`).
