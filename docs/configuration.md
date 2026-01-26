# Configuration

`createKomgaClient` accepts options for auth, timeout, retry, and debug logging.

## KomgaClientOptions

```typescript
interface KomgaClientOptions {
  baseUrl: string;
  auth?: AuthConfig;
  timeout?: number;
  retry?: RetryConfig;
  debug?: boolean;
}
```

## Retry Configuration

```typescript
interface RetryConfig {
  limit?: number;
  methods?: string[];
  statusCodes?: number[];
  backoffLimit?: number;
}
```

## Debug Logging

```typescript
const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: { type: 'basic', username: 'admin', password: 'password' },
  debug: true,
});
```
