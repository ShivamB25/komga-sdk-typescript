# Domain Services

Domain services wrap API calls with validation via `BaseService.safeCall()`. They provide a higher-level, validated interface on top of direct API functions.

## Available Services

- `BookService`
- `SeriesService`
- `LibraryService`

If you need endpoints beyond these services (collections, read lists, users, settings), use direct API functions from `sdk.gen.ts` via the main package exports.

## BookService

```typescript
import { BookService } from 'komga-sdk';

const service = new BookService(client);

const book = await service.getById('book-123');

const books = await service.list({
  search: { fullTextSearch: 'manga' },
  page: 0,
  size: 20,
  sort: ['metadata.title,asc'],
});

await service.updateMetadata('book-123', {
  title: 'New Title',
  summary: 'Updated summary',
});

const pages = await service.getPages('book-123');
```

## SeriesService

```typescript
import { SeriesService } from 'komga-sdk';

const service = new SeriesService(client);

const series = await service.getById('series-123');

const list = await service.list({ page: 0, size: 20 });

await service.updateMetadata('series-123', {
  status: 'ONGOING',
  publisher: 'Example Publisher',
});

const books = await service.getBooks('series-123');
```

## LibraryService

```typescript
import { LibraryService, type LibraryCreationDto } from 'komga-sdk';

const service = new LibraryService(client);

const libraries = await service.getAll();
const library = await service.getById('library-123');

const payload: LibraryCreationDto = getLibraryConfig();
const created = await service.create(payload);

await service.update(created.id, { name: 'Updated Library' });
await service.scan(created.id);
```

`LibraryCreationDto` has multiple required fields. Use the API reference to build a full payload that matches your Komga server settings.

## Domain Services vs Direct API

| Approach | When to use | Tradeoffs |
|---------|-------------|-----------|
| Domain services | Most app code | Validation and higher-level interface |
| Direct API functions | Advanced or unsupported endpoints | Full API coverage, manual validation |

See `docs/validation.md` for validation helpers if you use direct API functions.
