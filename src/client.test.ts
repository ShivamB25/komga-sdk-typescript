import { describe, expect, it, vi } from 'vitest';
import { createKomgaClient } from './client';

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('createKomgaClient', () => {
  it('sends an API key while preserving unrelated caller headers', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      expect(request.headers.get('X-API-Key')).toBe('server-key');
      expect(request.headers.get('X-Trace')).toBe('trace');
      expect(request.headers.get('Authorization')).toBe('caller-auth');
      return jsonResponse({ ok: true });
    });

    const client = createKomgaClient({
      baseUrl: 'https://komga.example.com',
      auth: { type: 'apiKey', key: 'server-key' },
      headers: {
        Authorization: 'caller-auth',
        'X-API-Key': 'caller-key',
        'X-Trace': 'trace',
      },
      fetch: fetchMock,
    });

    await client.get({ url: '/health' });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('encodes UTF-8 Basic credentials without Buffer', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      expect(request.headers.get('Authorization')).toBe('Basic dXPDqXJpbzpww6Rzcw==');
      expect(request.headers.get('X-Trace')).toBe('trace');
      return jsonResponse({ ok: true });
    });

    const client = createKomgaClient({
      baseUrl: 'https://komga.example.com',
      auth: { type: 'basic', username: 'usério', password: 'päss' },
      headers: { Authorization: 'caller-auth', 'X-Trace': 'trace' },
      fetch: fetchMock,
    });

    await client.get({ url: '/health' });
  });

  it('supports unauthenticated requests and custom fetch credentials', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      expect(request.headers.get('Authorization')).toBeNull();
      expect(request.headers.get('X-API-Key')).toBeNull();
      expect(request.headers.get('X-Trace')).toBe('trace');
      expect(request.credentials).toBe('include');
      return jsonResponse({ ok: true });
    });

    const client = createKomgaClient({
      baseUrl: 'https://komga.example.com',
      headers: { 'X-Trace': 'trace' },
      credentials: 'include',
      fetch: fetchMock,
    });

    await client.get({ url: '/health' });
  });
});
