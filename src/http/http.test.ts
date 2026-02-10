import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFetchAdapter } from './fetch-adapter';
import { getNodeEnv, getProcessRef } from './env';
import { createKomgaClient } from './index';
import { createHttpClient } from './ky-client';
import type { KomgaClientOptions } from './types';
import ky from 'ky';

vi.mock('ky', () => ({
  default: {
    create: vi.fn(() => ({ mocked: true })),
  },
}));

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
        method: 'GET',
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
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: { 'Content-Type': 'application/json' },
        throwHttpErrors: false,
      })
    );
  });

  it('preserves custom method casing for unknown methods', async () => {
    const mockResponse = new Response();
    const mockKy = vi.fn().mockResolvedValue(mockResponse);
    const adapter = createFetchAdapter(mockKy as any);

    await adapter('http://localhost:25600/api/books', {
      method: 'REPORT',
    });

    expect(mockKy).toHaveBeenCalledWith(
      'http://localhost:25600/api/books',
      expect.objectContaining({
        method: 'REPORT',
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
        method: 'GET',
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
  const originalNodeEnv = getNodeEnv();

  beforeEach(() => {
    vi.restoreAllMocks();
    const processRef = getProcessRef();
    if (processRef?.env) {
      processRef.env.NODE_ENV = originalNodeEnv;
    }
  });

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

  it('warns when using basic auth over HTTP in production', () => {
    const processRef = getProcessRef();
    if (processRef?.env) {
      processRef.env.NODE_ENV = 'production';
    }

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createKomgaClient({
      baseUrl: 'http://localhost:25600',
      auth: {
        type: 'basic',
        username: 'admin',
        password: 'password',
      },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Basic auth is configured over HTTP in production')
    );
  });

  it('does not warn for HTTPS basic auth in production', () => {
    const processRef = getProcessRef();
    if (processRef?.env) {
      processRef.env.NODE_ENV = 'production';
    }

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createKomgaClient({
      baseUrl: 'https://komga.example.com',
      auth: {
        type: 'basic',
        username: 'admin',
        password: 'password',
      },
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('createHttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets basic auth and request id headers in beforeRequest hook', () => {
    const randomUuidSpy = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('00000000-0000-4000-8000-000000000123');

    createHttpClient({
      baseUrl: 'http://localhost:25600',
      auth: {
        type: 'basic',
        username: 'admin',
        password: 'password',
      },
    });

    expect(ky.create).toHaveBeenCalledTimes(1);
    const options = vi.mocked(ky.create).mock.calls[0]?.[0] as any;
    const request = new Request('http://localhost:25600/api/v1/libraries');

    options.hooks.beforeRequest[0](request, {} as any, {} as any);

    expect(request.headers.get('Authorization')).toBe(
      `Basic ${btoa('admin:password')}`
    );
    expect(request.headers.get('X-Request-ID')).toBe(
      '00000000-0000-4000-8000-000000000123'
    );

    randomUuidSpy.mockRestore();
  });

  it('sets API key header in beforeRequest hook', () => {
    const randomUuidSpy = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('00000000-0000-4000-8000-000000000456');

    createHttpClient({
      baseUrl: 'http://localhost:25600',
      auth: {
        type: 'apiKey',
        key: 'api-key-123',
      },
    });

    const options = vi.mocked(ky.create).mock.calls[0]?.[0] as any;
    const request = new Request('http://localhost:25600/api/v1/libraries');

    options.hooks.beforeRequest[0](request, {} as any, {} as any);

    expect(request.headers.get('X-API-Key')).toBe('api-key-123');
    expect(request.headers.get('X-Request-ID')).toBe(
      '00000000-0000-4000-8000-000000000456'
    );

    randomUuidSpy.mockRestore();
  });

  it('applies custom retry configuration including capped delay', () => {
    createHttpClient({
      baseUrl: 'http://localhost:25600',
      retry: {
        limit: 5,
        methods: ['get', 'post'],
        statusCodes: [500, 503],
        backoffLimit: 5000,
      },
    });

    const options = vi.mocked(ky.create).mock.calls[0]?.[0] as any;

    expect(options.retry.limit).toBe(5);
    expect(options.retry.methods).toEqual(['get', 'post']);
    expect(options.retry.statusCodes).toEqual([500, 503]);
    expect(options.retry.delay(1)).toBe(300);
    expect(options.retry.delay(2)).toBe(600);
    expect(options.retry.delay(10)).toBe(5000);
  });

  it('uses default retry settings when retry options are omitted', () => {
    createHttpClient({
      baseUrl: 'http://localhost:25600',
    });

    const options = vi.mocked(ky.create).mock.calls[0]?.[0] as any;

    expect(options.retry.limit).toBe(3);
    expect(options.retry.methods).toEqual([
      'get',
      'put',
      'head',
      'delete',
      'options',
      'trace',
    ]);
    expect(options.retry.statusCodes).toEqual([
      408,
      413,
      429,
      500,
      502,
      503,
      504,
    ]);
    expect(options.retry.delay(10)).toBe(3000);
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
