# HTTP CLIENT LAYER

## OVERVIEW
Ky-based HTTP adapter and Komga client factory.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Client factory | `src/http/index.ts` | `createKomgaClient` entry point |
| Ky instance | `src/http/ky-client.ts` | auth, retry, timeout setup |
| Fetch adapter | `src/http/fetch-adapter.ts` | ky to fetch bridge |
| Options types | `src/http/types.ts` | auth/retry config types |

## CONVENTIONS
- Use ky instance through `createFetchAdapter` when wiring SDK clients.
- Keep retry/auth behavior centralized in `ky-client.ts`.

## ANTI-PATTERNS
- Do not call ky directly from domain services.

## NOTES
- `createKomgaClient` returns the core SDK client wired with ky.
- Interceptors live in `src/interceptors/` and can be attached to the client.
