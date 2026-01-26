# Testing

## Unit Testing Domain Services

Domain services accept a client instance, so you can inject a mock client in unit tests:

```typescript
import { BookService, type Client } from 'komga-sdk';

const mockClient = {
  getBookById: vi.fn(),
} as unknown as Client;

const service = new BookService(mockClient);
```

## Testing Direct API Functions

For direct API functions, use a client configured with a mocked fetch adapter so you control request/response behavior.

## Integration Tests

For integration tests against a real Komga instance, create a client with test credentials and keep data isolated (separate test library, dedicated user).

## Recommended Commands

```bash
bun run test
bun run test:coverage
```
