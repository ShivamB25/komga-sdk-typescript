# Migration and Deprecations

The SDK tracks Komga API deprecations and avoids old endpoints where possible. If you are upgrading, use these mappings.

## Deprecated Endpoints

| Deprecated | Replacement | Since |
|------------|-------------|-------|
| `GET /api/v1/books` | `POST /api/v1/books/list` | 1.19.0 |
| `GET /api/v1/series` | `POST /api/v1/series/list` | 1.19.0 |
| `GET /api/v1/authors` | `GET /api/v2/authors` | 1.20.0 |
| `PUT /api/v1/libraries/{libraryId}` | `PATCH /api/v1/libraries/{libraryId}` | 1.3.0 |

## Guidance

- Prefer list endpoints (`POST /list`) over deprecated `GET` variants.
- Use the `v2` authors endpoint.
- Use `PATCH` for library updates.
