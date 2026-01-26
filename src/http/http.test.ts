import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFetchAdapter } from './fetch-adapter';
import { createKomgaClient } from './index';
import type { KomgaClientOptions } from './types';

describe('createFetchAdapter', () => {
  it('creates a fetch-compatible function', () => {
    const mockKy = vi.fn().mockResolvedValue(new Response());
    const adapter = createFetchAdapter(mockKy as any);

    expect(typeof adapter).toBe('function');
  });

  it('calls ky with correct URL', async () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
      status: 200,
    });
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    await adapter('http://localhost:25600/api/books');

    expect(mockKy).toHaveBeenCalledWith(
      'http://localhost:25600/api/books',
      expect.objectContaining({
        method: 'get',
        throwHttpErrors: false,
      })
    );
  });

  it('converts URL object to string', async () => {
    const mockResponse = new Response();
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    const url = new URL('http://localhost:25600/api/books');
    await adapter(url);

    expect(mockKy).toHaveBeenCalledWith(
      'http://localhost:25600/api/books',
      expect.any(Object)
    );
  });

  it('passes init options to ky', async () => {
    const mockResponse = new Response();
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    await adapter('http://localhost:25600/api/books', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(mockKy).toHaveBeenCalledWith(
      'http://localhost:25600/api/books',
      expect.objectContaining({
        method: 'post',
        body: JSON.stringify({ data: 'test' }),
        headers: { 'Content-Type': 'application/json' },
        throwHttpErrors: false,
      })
    );
  });

  it('defaults to GET method when not specified', async () => {
    const mockResponse = new Response();
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    await adapter('http://localhost:25600/api/books', {});

    expect(mockKy).toHaveBeenCalledWith(
      'http://localhost:25600/api/books',
      expect.objectContaining({
        method: 'get',
      })
    );
  });

  it('returns the response from ky', async () => {
    const mockResponse = new Response(JSON.stringify({ id: '123' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    const response = await adapter('http://localhost:25600/api/books');

    expect(response).toBe(mockResponse);
  });
});

describe('createKomgaClient', () => {
  it('creates a client with the client options', () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
      auth: {
        type: 'basic',
        username: 'admin',
        password: 'password',
      },
      timeout: 30000,
      retry: { limit: 3 },
      debug: false,
    };

    const client = createKomgaClient(options);

    expect(client).toBeDefined();
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  it('creates a client without auth', () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
    };

    const client = createKomgaClient(options);

    expect(client).toBeDefined();
  });

  it('creates a client with API key auth', () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
      auth: {
        type: 'apiKey',
        key: 'my-api-key',
      },
    };

    const client = createKomgaClient(options);

    expect(client).toBeDefined();
  });

  it('creates a client with custom retry config', () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
      retry: {
        limit: 5,
        statusCodes: [500, 502],
        backoffLimit: 5000,
      },
    };

    const client = createKomgaClient(options);

    expect(client).toBeDefined();
  });

  it('creates a client with debug mode', () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
      debug: true,
    };

    const client = createKomgaClient(options);

    expect(client).toBeDefined();
  });
});

describe('Type Exports', () => {
  it('exports KomgaClientOptions type', async () => {
    const options: KomgaClientOptions = {
      baseUrl: 'http://localhost:25600',
    };
    
    expect(options.baseUrl).toBe('http://localhost:25600');
  });
});
