# Komga SDK

A TypeScript SDK for the [Komga](https://komga.org/) media server API. This SDK provides a type-safe, validated client for interacting with Komga's REST API.

## Features

- **Full API Coverage**: 130 endpoints covering all Komga API operations
- **Type Safety**: Complete TypeScript types for all requests and responses
- **Runtime Validation**: Zod schemas for response validation with `.strict()` enforcement
- **Modern HTTP Client**: Built on [ky](https://github.com/sindresorhus/ky) with automatic retry, timeout, and error handling
- **Domain Services**: High-level service classes for common operations (Books, Series, Libraries)
- **Error Handling**: Typed error hierarchy with guards for precise error handling

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

### Basic Usage with Enhanced Client

```typescript
import { createEnhancedClient, BookService, SeriesService } from 'komga-sdk';

// Create a client with authentication
const client = createEnhancedClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'admin@example.com',
    password: 'your-password'
  },
  timeout: 30000,
  retry: { limit: 3 },
  debug: false
});

// Use domain services for high-level operations
const bookService = new BookService(client);
const seriesService = new SeriesService(client);

// Get a book by ID
const book = await bookService.getById('book-123');
console.log(book.metadata.title);

// List series with pagination
const series = await seriesService.list({ page: 0, size: 20 });
console.log(`Found ${series.totalElements} series`);
```

### Direct SDK Functions

```typescript
import { createEnhancedClient, getBookById, getBooks } from 'komga-sdk';

const client = createEnhancedClient({
  baseUrl: 'http://localhost:25600',
  auth: { type: 'basic', username: 'admin', password: 'password' }
});

// Direct API call
const result = await getBookById({
  client,
  path: { bookId: 'book-123' }
});

if (result.data) {
  console.log(result.data.metadata.title);
}
```

## Authentication

The SDK supports three authentication methods:

### Basic Authentication
```typescript
const client = createEnhancedClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'user@example.com',
    password: 'password'
  }
});
```

### API Key Authentication
```typescript
const client = createEnhancedClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'apiKey',
    key: 'your-api-key'
  }
});
```

### Bearer Token Authentication
```typescript
const client = createEnhancedClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'bearer',
    token: 'your-jwt-token'
  }
});
```

## Domain Services

The SDK provides high-level service classes that wrap API calls with validation:

### BookService
```typescript
const bookService = new BookService(client);

// Get book by ID
const book = await bookService.getById('book-123');

// List books with search and pagination
const books = await bookService.list({
  search: { fullTextSearch: 'manga' },
  page: 0,
  size: 20,
  sort: ['metadata.title,asc']
});

// Update book metadata
await bookService.updateMetadata('book-123', {
  title: 'New Title',
  summary: 'Updated summary'
});

// Get book pages
const pages = await bookService.getPages('book-123');
```

### SeriesService
```typescript
const seriesService = new SeriesService(client);

// Get series by ID
const series = await seriesService.getById('series-123');

// List series
const seriesList = await seriesService.list({
  page: 0,
  size: 20
});

// Update series metadata
await seriesService.updateMetadata('series-123', {
  status: 'ONGOING',
  publisher: 'Example Publisher'
});

// Get books in a series
const books = await seriesService.getBooks('series-123');
```

## Error Handling

The SDK provides a typed error hierarchy:

```typescript
import {
  isApiError,
  isValidationError,
  isNetworkError,
  ApiError,
  ValidationError
} from 'komga-sdk';

try {
  const book = await bookService.getById('invalid-id');
} catch (error) {
  if (isApiError(error)) {
    console.log(`HTTP ${error.status}: ${error.statusText}`);
    if (error.isNotFound()) {
      console.log('Book not found');
    }
  } else if (isValidationError(error)) {
    console.log('Validation failed:', error.getFieldErrors());
  } else if (isNetworkError(error)) {
    console.log('Network error:', error.message);
  }
}
```

### Error Types

| Error | Description | Retryable |
|-------|-------------|-----------|
| `ApiError` | HTTP 4xx/5xx responses | 5xx and 429 only |
| `ValidationError` | Zod schema validation failures | No |
| `NetworkError` | Connection/timeout errors | Yes |
| `TimeoutError` | Request timeout (extends NetworkError) | Yes |

## Validation

All responses are validated against Zod schemas with `.strict()` enforcement:

```typescript
import { BookDtoSchema, validateResponse } from 'komga-sdk';

// Manual validation
const validated = validateResponse(BookDtoSchema, responseData);

// Or use safeValidateResponse for non-throwing validation
const result = safeValidateResponse(BookDtoSchema, responseData);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}
```

## API Coverage

This SDK covers **Komga API v1.23.6** with 130 unique endpoint paths across 165 operations.

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

The following endpoints are deprecated and should not be used:

| Endpoint | Replacement | Since |
|----------|-------------|-------|
| `GET /api/v1/books` | `POST /api/v1/books/list` | 1.19.0 |
| `GET /api/v1/series` | `POST /api/v1/series/list` | 1.19.0 |
| `GET /api/v1/authors` | `GET /api/v2/authors` | 1.20.0 |
| `PUT /api/v1/libraries/{libraryId}` | `PATCH /api/v1/libraries/{libraryId}` | 1.3.0 |

## Configuration Options

```typescript
interface EnhancedClientOptions {
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

## TypeScript

This SDK is written in TypeScript and provides full type definitions. The project uses `noEmit` configuration - types are checked but not compiled to JavaScript.

```bash
# Type check
bun tsc --noEmit
```

## License

MIT

## Related

- [Komga](https://komga.org/) - The media server this SDK interfaces with
- [Komga API Documentation](https://komga.org/docs/openapi/komga-api) - Official API reference
