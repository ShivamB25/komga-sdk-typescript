# Troubleshooting

## 401 Unauthorized

Check your credentials and auth type. For API keys, ensure `auth.type` is `apiKey` and the key is valid.

## 404 Not Found

Verify the ID exists and you are using the correct endpoint for your Komga version. Some endpoints are deprecated; see `docs/migration.md`.

## Validation Errors

Schema validation failures indicate the response does not match expected DTOs. If you are on a different Komga version, update the SDK or disable validation for that path via the validation interceptor.

## Timeouts

Increase timeout and adjust retries:

```typescript
const client = createKomgaClient({
  baseUrl: 'http://localhost:25600',
  auth: { type: 'basic', username: 'admin', password: 'password' },
  timeout: 60000,
  retry: { limit: 5 },
});
```

## CORS (Browser)

If you are calling Komga from a browser, configure CORS on the server or proxy requests through your app server.
