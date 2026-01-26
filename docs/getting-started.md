# Getting Started

This guide covers prerequisites, basic setup, and the recommended client configuration.

## Requirements

- Komga API version: 1.23.6
- Runtime with Fetch and Web Crypto (e.g. Node 18+ or modern browsers)

## Installation

```bash
# Using bun
bun add komga-sdk

# Using npm
npm install komga-sdk

# Using pnpm
pnpm add komga-sdk
```

## Create a Client

`createKomgaClient` is the recommended entry point. It wires ky, retry/backoff, auth, and the hey-api client.

```typescript
import { createKomgaClient } from 'komga-sdk';

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
```

## Use a Domain Service

```typescript
import { BookService } from 'komga-sdk';

const bookService = new BookService(client);
const book = await bookService.getById('book-123');
console.log(book.metadata.title);
```

## Use Direct API Functions

```typescript
import { getBookById } from 'komga-sdk';

const result = await getBookById({
  client,
  path: { bookId: 'book-123' },
});

if (result.data) {
  console.log(result.data.metadata.title);
}
```

## TypeScript Configuration

This SDK is source-only and ships ESM. Recommended `tsconfig.json` options:

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

## Next Steps

- Domain services: `docs/domain-services.md`
- Pagination and search: `docs/pagination-search.md`
- Validation: `docs/validation.md`
- Interceptors: `docs/interceptors.md`
