# Komga SDK

TypeScript bindings for the Komga media server API.

- **SDK version:** `2.0.0`
- **Komga API version:** `1.26.3`
- **Zero runtime dependencies.** The SDK uses the platform Fetch API and standard Web APIs.

Version 2.0.0 exposes the generated API operations directly. Each operation and generated
DTO/error type is available from the package root.

## Installation

```bash
npm install komga-sdk
```

The package can also be installed with Bun or pnpm:

```bash
bun add komga-sdk
pnpm add komga-sdk
```

## Requirements

Use Node.js 18 or newer, or a browser/runtime that provides `fetch`, `Request`, `Response`,
`Headers`, and `TextEncoder`. Binary operations additionally use the platform `Blob`/`File`
APIs.

## Quick start

```typescript
import { createKomgaClient, getBookById, unwrap } from 'komga-sdk';

const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: {
    type: 'basic',
    username: 'admin',
    password: 'your-password',
  },
});

const book = unwrap(
  await getBookById({ bookId: 'book-123' }, { client }),
);

console.log(book.metadata.title);
```

`createKomgaClient` returns an isolated client. Pass that client explicitly to each generated
operation instead of relying on shared configuration.

## Client and authentication

`createKomgaClient` accepts a required `baseUrl` and optional authentication:

### HTTP Basic authentication

```typescript
const client = createKomgaClient({
  baseUrl: 'https://komga.example.com',
  auth: {
    type: 'basic',
    username: 'user@example.com',
    password: 'password',
  },
});
```

Use HTTPS whenever Basic credentials are sent.

### API-key authentication

```typescript
const client = createKomgaClient({
  baseUrl: 'https://komga.example.com',
  auth: {
    type: 'apiKey',
    key: 'your-api-key',
  },
});
```

The factory overwrites only the authentication header owned by the configured auth mode: `apiKey`
sets `X-API-Key`, while `basic` sets `Authorization`. A caller-supplied inactive authentication
header is not automatically removed. Do not supply conflicting authentication headers; let the
configured auth mode provide authentication.

Fetch options are passed through the client options:

```typescript
const client = createKomgaClient({
  baseUrl: 'https://komga.example.com',
  auth: {
    type: 'apiKey',
    key: 'your-api-key',
  },
  credentials: 'include',
  headers: { 'X-Client-Name': 'my-reader' },
  fetch: globalThis.fetch,
});
```

`credentials` is the native Fetch credentials mode. Supply `fetch` when a runtime or test
needs a custom Fetch implementation. Authentication is optional for public or otherwise
unauthenticated requests.

## Generated operations

Operations use flat, generated parameter objects. When an operation has parameters, pass those
parameters first and a per-call options object second. Put the client in the second object:

```typescript
import { getBookById } from 'komga-sdk';

const result = await getBookById(
  { bookId: 'book-123' },
  { client },
);
```

An operation with no parameters takes the options object as its only argument:

```typescript
import { getLibraries } from 'komga-sdk';

const libraries = await getLibraries({ client });
```

Parameter names and types come from the generated declarations. For example, request bodies
are represented by the operation-specific fields in the first object:

```typescript
import { markBookReadProgress } from 'komga-sdk';

await markBookReadProgress(
  {
    bookId: 'book-123',
    readProgressUpdateDto: { page: 12, completed: false },
  },
  { client },
);
```

## Results and errors

Generated operations are non-throwing by default. Their default result contains
`{ data, error, request, response }`:

```typescript
const result = await getBookById({ bookId: 'book-123' }, { client });

if (result.error !== undefined) {
  console.error('Komga error:', result.error);
  console.error('HTTP status:', result.response?.status);
} else {
  console.log(result.data.metadata.title);
}
```

`data` is present for a successful response and `error` is present for an API, parsing, or
network failure. `request` and `response` are optional: a request-building or network failure
may not produce one or both objects.

Use the exported `unwrap` helper when an explicit throwing boundary is preferable:

```typescript
import { KomgaApiError, unwrap } from 'komga-sdk';

try {
  const book = unwrap(
    await getBookById({ bookId: 'book-123' }, { client }),
  );
  console.log(book.metadata.title);
} catch (error) {
  if (error instanceof KomgaApiError) {
    console.error(error.status, error.body);
  }
}
```

`KomgaApiError` preserves the typed API error body and, when available, the HTTP status,
request, and response. A successful no-content response unwraps to `undefined`.

## Pagination and search

List operations expose only the parameters declared for that operation. `getBooks` accepts
pagination fields alongside its generated search body:

```typescript
import { getBooks } from 'komga-sdk';

const result = await getBooks(
  {
    bookSearch: { fullTextSearch: 'sandman' },
    page: 0,
    size: 20,
    sort: ['metadata.title,asc'],
  },
  { client },
);

if (result.error === undefined) {
  for (const book of result.data.content ?? []) {
    console.log(book.metadata.title);
  }
}
```

Page responses expose generated fields such as `content`, `number`, `size`, `totalElements`,
and `totalPages`. Other list operations may additionally declare `unpaged`, filters, or
operation-specific search fields; TypeScript will surface the exact accepted shape.

## Binary and no-content responses

The generated response types preserve Komga's response semantics:

```typescript
import {
  getBookPageByNumber,
  getBookPageRawByNumber,
  markBookReadProgress,
  unwrap,
} from 'komga-sdk';

const image = unwrap(
  await getBookPageByNumber(
    { bookId: 'book-123', pageNumber: 1 },
    { client },
  ),
); // Blob | File

const rawPage = unwrap(
  await getBookPageRawByNumber(
    { bookId: 'book-123', pageNumber: 1 },
    { client },
  ),
); // string

const noContent = unwrap(
  await markBookReadProgress(
    {
      bookId: 'book-123',
      readProgressUpdateDto: { page: 1 },
    },
    { client },
  ),
); // undefined for HTTP 204
```

Image-producing page and thumbnail operations are typed as `Blob | File` where declared by the
API. Raw page and EPUB-resource endpoints are typed as `string`. Successful HTTP 204 responses
have `data: undefined`.

## Imports

The package root exports the client factory, result helpers, all generated operations, and all
generated types:

```typescript
import { createKomgaClient, getBookById, unwrap } from 'komga-sdk';
import type { BookDto } from 'komga-sdk';
```

Use the published subpaths when only the client or generated types are needed:

```typescript
import { createKomgaClient } from 'komga-sdk/client';
import type { BookDto, BookSearch } from 'komga-sdk/types';
```

Generated operations are root exports; `komga-sdk/client` exports the client factory and its
types, and `komga-sdk/types` exports generated DTOs and response types.

## API coverage

The SDK contains **174 flat operations** generated for Komga API `1.26.3`, covering books,
series, libraries, collections, read lists, users and authentication, settings, metadata,
pages and thumbnails, downloads, and task/transient-book endpoints.

The generated source is the authoritative reference for operation names, parameters, response
types, and endpoint-specific errors.

## Testing

Inject a Fetch implementation to test requests without contacting a Komga server:

```typescript
import { createKomgaClient, getBookById } from 'komga-sdk';

const fetchMock: typeof fetch = async () =>
  new Response(JSON.stringify({ id: 'book-123' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

const testClient = createKomgaClient({
  baseUrl: 'https://komga.test',
  fetch: fetchMock,
});

const result = await getBookById(
  { bookId: 'book-123' },
  { client: testClient },
);
```

For repository development:

```bash
bun run typecheck
bun run test
bun run test:coverage
```

## Historical migration note (pre-2.0.0)

This section is historical only. Documentation written for releases before `2.0.0` may not
describe this package. For `2.0.0`, follow the generated operation signatures,
`createKomgaClient`, and result handling shown above. See the changelog for release history.

## Useful links

- [Komga](https://komga.org/)
- [Komga API documentation](https://komga.org/docs/openapi/komga-api/)
- [komga-sdk on npm](https://www.npmjs.com/package/komga-sdk)
- [Repository](https://github.com/ShivamB25/komga-sdk-typescript)
- [Generated operations](https://github.com/ShivamB25/komga-sdk-typescript/blob/main/src/generated/sdk.gen.ts)
- [Generated types](https://github.com/ShivamB25/komga-sdk-typescript/blob/main/src/generated/types.gen.ts)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)
- [Issue tracker](https://github.com/ShivamB25/komga-sdk-typescript/issues)

## License

MIT (see [LICENSE](./LICENSE)).
