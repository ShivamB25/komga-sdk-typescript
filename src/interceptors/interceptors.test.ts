import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createLoggingInterceptor } from './logging';
import { createErrorTransformInterceptor } from './error-transform';
import { createValidationInterceptor } from './validation';
import { ApiError, NetworkError, TimeoutError, ValidationError } from '../errors';

const createMockRequest = (url: string, method: string = 'GET'): Request => {
  return new Request(url, { method });
};

const createMockResponse = (
  status: number,
  body: unknown = null,
  headers: Record<string, string> = {}
): Response => {
  const responseHeaders = new Headers(headers);
  if (body !== null && !responseHeaders.has('content-type')) {
    responseHeaders.set('content-type', 'application/json');
  }
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    statusText: status === 200 ? 'OK' : status === 404 ? 'Not Found' : 'Error',
    headers: responseHeaders,
  });
};

const mockResolvedRequestOptions = {} as any;

describe('createLoggingInterceptor', () => {
  describe('request interceptor', () => {
    it('logs request method and URL', async () => {
      const logger = vi.fn();
      const { request } = createLoggingInterceptor({ logger });

      const req = createMockRequest('http://localhost:25600/api/books', 'GET');
      const result = await request(req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('[Request] GET'));
      expect(logger).toHaveBeenCalledWith(expect.stringContaining('http://localhost:25600/api/books'));
      expect(result).toBe(req);
    });

    it('logs headers when logHeaders is true', async () => {
      const logger = vi.fn();
      const { request } = createLoggingInterceptor({ logger, logHeaders: true });

      const req = createMockRequest('http://localhost:25600/api/books');
      req.headers.set('Authorization', 'Bearer token');
      await request(req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('Headers:'));
      expect(logger).toHaveBeenCalledWith(expect.stringContaining('authorization'));
    });

    it('uses console.log by default', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { request } = createLoggingInterceptor();

      const req = createMockRequest('http://localhost:25600/api/books');
      await request(req, mockResolvedRequestOptions);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('response interceptor', () => {
    it('logs response status and URL', async () => {
      const logger = vi.fn();
      const { response } = createLoggingInterceptor({ logger });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200);
      const result = await response(res, req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('[Response] 200'));
      expect(result).toBe(res);
    });

    it('logs headers when logHeaders is true', async () => {
      const logger = vi.fn();
      const { response } = createLoggingInterceptor({ logger, logHeaders: true });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { data: 'test' }, { 'x-custom-header': 'value' });
      await response(res, req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('Headers:'));
    });

    it('logs body when logBody is true for JSON responses', async () => {
      const logger = vi.fn();
      const { response } = createLoggingInterceptor({ logger, logBody: true });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { id: '123' });
      await response(res, req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('Body:'));
    });

    it('logs body for text responses when logBody is true', async () => {
      const logger = vi.fn();
      const { response } = createLoggingInterceptor({ logger, logBody: true });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = new Response('Plain text response', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      });
      await response(res, req, mockResolvedRequestOptions);

      expect(logger).toHaveBeenCalledWith(expect.stringContaining('Body:'));
    });
  });
});

describe('createErrorTransformInterceptor', () => {
  describe('HTTP error responses', () => {
    it('transforms 4xx response to ApiError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books/invalid');
      const res = createMockResponse(404, { message: 'Not found' });

      const result = await errorInterceptor(null, res, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(ApiError);
      const apiError = result as ApiError;
      expect(apiError.status).toBe(404);
      expect(apiError.body).toEqual({ message: 'Not found' });
    });

    it('transforms 5xx response to ApiError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(500, { error: 'Internal error' });

      const result = await errorInterceptor(null, res, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(ApiError);
      expect((result as ApiError).status).toBe(500);
      expect((result as ApiError).isRetryable).toBe(true);
    });

    it('handles text error responses', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const res = new Response('Error message', {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'text/plain' },
      });

      const result = await errorInterceptor(null, res, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(ApiError);
      expect((result as ApiError).body).toBe('Error message');
    });

    it('handles unparseable response body', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      
      const res = new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await errorInterceptor(null, res, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(ApiError);
      // When no content-type is set, the interceptor reads body as blob
      // A null body becomes an empty Blob
      expect((result as ApiError).body).toBeInstanceOf(Blob);
    });
  });

  describe('network errors', () => {
    it('transforms Error to NetworkError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const error = new Error('Connection refused');

      const result = await errorInterceptor(error, undefined, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(NetworkError);
      expect((result as NetworkError).message).toBe('Connection refused');
      expect((result as NetworkError).cause).toBe(error);
    });

    it('transforms timeout error to TimeoutError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const error = new Error('Request timeout');
      error.name = 'TimeoutError';

      const result = await errorInterceptor(error, undefined, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(TimeoutError);
    });

    it('transforms AbortError to TimeoutError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const error = new Error('Aborted');
      error.name = 'AbortError';

      const result = await errorInterceptor(error, undefined, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(TimeoutError);
    });

    it('transforms string error to NetworkError', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');

      const result = await errorInterceptor('Network failed', undefined, req, mockResolvedRequestOptions);

      expect(result).toBeInstanceOf(NetworkError);
      expect((result as NetworkError).message).toBe('Network failed');
    });

    it('returns unknown errors as-is', async () => {
      const errorInterceptor = createErrorTransformInterceptor();
      const req = createMockRequest('http://localhost:25600/api/books');
      const unknownError = { code: 'UNKNOWN' };

      const result = await errorInterceptor(unknownError, undefined, req, mockResolvedRequestOptions);

      expect(result).toEqual(unknownError);
    });
  });
});

describe('createValidationInterceptor', () => {
  const BookSchema = z.object({
    id: z.string(),
    title: z.string(),
  }).strict();

  describe('response validation', () => {
    it('passes through non-OK responses without validation', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books': BookSchema },
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(404, { error: 'Not found' });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });

    it('passes through non-JSON responses without validation', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books': BookSchema },
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = new Response('Plain text', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });

    it('validates response against matching schema', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books': BookSchema },
        throwOnError: true,
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { id: 123, title: 'Test' });

      await expect(validator(res, req, mockResolvedRequestOptions)).rejects.toThrow(ValidationError);
    });

    it('passes valid responses', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books': BookSchema },
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { id: '123', title: 'Test' });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });

    it('matches schema patterns with regex', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books/.*': BookSchema },
        throwOnError: true,
      });

      const req = createMockRequest('http://localhost:25600/api/books/123');
      const res = createMockResponse(200, { id: 123, title: 'Test' });

      await expect(validator(res, req, mockResolvedRequestOptions)).rejects.toThrow(ValidationError);
    });

    it('matches schema patterns with string includes', async () => {
      const validator = createValidationInterceptor({
        schemas: { 'api/books': BookSchema },
        throwOnError: true,
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { id: '123', title: 'Test' });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });

    it('skips validation when no schema matches', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/series': BookSchema },
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { anything: 'goes' });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });

    it('logs warning instead of throwing when throwOnError is false', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const validator = createValidationInterceptor({
        schemas: { '/api/books': BookSchema },
        throwOnError: false,
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = createMockResponse(200, { id: 123, title: 'Test' });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Response validation failed:',
        expect.any(ValidationError)
      );
      expect(result).toBe(res);
      consoleSpy.mockRestore();
    });

    it('handles empty response body', async () => {
      const validator = createValidationInterceptor({
        schemas: { '/api/books': z.object({}).strict() },
      });

      const req = createMockRequest('http://localhost:25600/api/books');
      const res = new Response('', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

      const result = await validator(res, req, mockResolvedRequestOptions);

      expect(result).toBe(res);
    });
  });
});
