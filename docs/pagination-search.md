# Pagination and Search

List endpoints accept pagination and optional search filters. Domain services expose this via `list()`.

## Pagination Basics

```typescript
const books = await bookService.list({
  page: 0,
  size: 20,
});

console.log(books.totalElements, books.totalPages);
```

## Sorting

Sort values are comma-separated: `field,asc` or `field,desc`.

```typescript
const series = await seriesService.list({
  page: 0,
  size: 20,
  sort: ['metadata.title,asc'],
});
```

## Search Filters

Search filters are passed under `search` and are typed as `BookSearch` or `SeriesSearch`.

```typescript
const books = await bookService.list({
  search: { fullTextSearch: 'manga' },
  page: 0,
  size: 20,
});
```

## Unpaged Requests

If you need to disable pagination, set `unpaged: true` (supported by list endpoints).

```typescript
const all = await bookService.list({
  unpaged: true,
  sort: ['metadata.title,asc'],
});
```

## Raw API Functions

When using direct API functions, list endpoints accept body + query split:

```typescript
import { getBooks } from 'komga-sdk';

const result = await getBooks({
  client,
  body: { fullTextSearch: 'manga' },
  query: { page: 0, size: 20, sort: ['metadata.title,asc'] },
});

if (result.data) {
  console.log(result.data.totalElements);
}
```
