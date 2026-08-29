# Getting Started

This guide covers prerequisites, installation, client configuration, authentication, and a first API request with the 2.0.0 SDK.

## Requirements

- SDK version: 2.0.0
- Komga API version: 1.26.3
- A runtime with Fetch and Web Crypto (for example, Node 18+ or a modern browser)

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

`createKomgaClient` creates an isolated client backed by the platform Fetch API. `baseUrl` is required; authentication is optional for endpoints that allow anonymous access.

Keep credentials in environment variables or a secret manager rather than committing them to source:

```typescript
import { createKomgaClient } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: process.env.KOMGA_URL ?? 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: process.env.KOMGA_USERNAME ?? 'admin',
    password: process.env.KOMGA_PASSWORD ?? 'your-password',
  },
});
```

### API-key authentication

Use the `apiKey` form when your Komga server provides an API key:

```typescript
const client = createKomgaClient({
  baseUrl: 'https://komga.example.com',
  auth: {
    type: 'apiKey',
    key: 'your-api-key',
  },
});
```

For production deployments, use HTTPS whenever credentials are sent to Komga.

### Native Fetch options

The client accepts standard Fetch configuration:

- `headers` adds headers to every request.
- `credentials` selects the Fetch credentials mode.
- `fetch` supplies a custom Fetch implementation when the runtime needs one.

```typescript
const client = createKomgaClient({
  baseUrl: 'https://komga.example.com',
  headers: {
    'X-Client-Name': 'my-app',
  },
  credentials: 'include',
  fetch: globalThis.fetch,
});
```

Omit `fetch` to use the runtime's native implementation.

## Make the First Request

Import a flat operation and pass the per-instance client as the second argument:

```typescript
import { createKomgaClient, getBookById } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'admin',
    password: 'your-password',
  },
});

const bookId = 'book-123';
const result = await getBookById({ bookId }, { client });

if (result.error === undefined) {
  console.log(result.data.metadata.title);
} else {
  console.error('Komga request failed', result.response?.status, result.error);
}
```

Requests return a structured result by default, so inspect `error` before reading `data`. The result also includes the underlying `request` and `response` when available.

### Unwrap a result

When throwing on an unsuccessful request is more convenient, use the exported `unwrap` helper explicitly:

```typescript
import { getBookById, unwrap } from 'komga-sdk';

const book = unwrap(await getBookById({ bookId }, { client }));
console.log(book.metadata.title);
```

`unwrap` returns the successful data and throws a typed `KomgaApiError` for an unsuccessful result.

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

- API reference: `docs/api-reference.md`
- Result and error handling: `docs/errors.md`
- Pagination and search: `docs/pagination-search.md`
- Client configuration: `docs/configuration.md`
