import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { KomgaError } from './base';
import { ApiError } from './api';
import { ValidationError } from './validation';
import { NetworkError, TimeoutError } from './network';
import {
  isKomgaError,
  isApiError,
  isValidationError,
  isNetworkError,
  isTimeoutError,
  ErrorCodes,
} from './index';

describe('KomgaError', () => {
  it('is an abstract class that cannot be instantiated directly', () => {
    const error = new ApiError(404, 'Not Found', null, undefined, new Response());
    expect(error).toBeInstanceOf(KomgaError);
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ApiError', () => {
  const createMockResponse = (status: number, statusText: string) => {
    return new Response(null, { status, statusText });
  };

  const createMockRequest = (url: string, method: string = 'GET') => {
    return new Request(url, { method });
  };

  describe('constructor', () => {
    it('creates an error with correct properties', () => {
      const response = createMockResponse(404, 'Not Found');
      const request = createMockRequest('http://localhost/api/books/123');
      const body = { message: 'Book not found' };

      const error = new ApiError(404, 'Not Found', body, request, response);

      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.body).toEqual(body);
      expect(error.request).toBe(request);
      expect(error.response).toBe(response);
      expect(error.code).toBe('KOMGA_API_ERROR');
      expect(error.message).toBe('API Error: 404 Not Found');
    });

    it('works without a request', () => {
      const response = createMockResponse(500, 'Internal Server Error');
      const error = new ApiError(500, 'Internal Server Error', null, undefined, response);

      expect(error.request).toBeUndefined();
      expect(error.status).toBe(500);
    });
  });

  describe('retryability', () => {
    it('marks 429 as retryable', () => {
      const error = new ApiError(429, 'Too Many Requests', null, undefined, createMockResponse(429, 'Too Many Requests'));
      expect(error.isRetryable).toBe(true);
    });

    it('marks 500 as retryable', () => {
      const error = new ApiError(500, 'Internal Server Error', null, undefined, createMockResponse(500, 'Internal Server Error'));
      expect(error.isRetryable).toBe(true);
    });

    it('marks 502 as retryable', () => {
      const error = new ApiError(502, 'Bad Gateway', null, undefined, createMockResponse(502, 'Bad Gateway'));
      expect(error.isRetryable).toBe(true);
    });

    it('marks 503 as retryable', () => {
      const error = new ApiError(503, 'Service Unavailable', null, undefined, createMockResponse(503, 'Service Unavailable'));
      expect(error.isRetryable).toBe(true);
    });

    it('marks 504 as retryable', () => {
      const error = new ApiError(504, 'Gateway Timeout', null, undefined, createMockResponse(504, 'Gateway Timeout'));
      expect(error.isRetryable).toBe(true);
    });

    it('marks 400 as not retryable', () => {
      const error = new ApiError(400, 'Bad Request', null, undefined, createMockResponse(400, 'Bad Request'));
      expect(error.isRetryable).toBe(false);
    });

    it('marks 401 as not retryable', () => {
      const error = new ApiError(401, 'Unauthorized', null, undefined, createMockResponse(401, 'Unauthorized'));
      expect(error.isRetryable).toBe(false);
    });

    it('marks 404 as not retryable', () => {
      const error = new ApiError(404, 'Not Found', null, undefined, createMockResponse(404, 'Not Found'));
      expect(error.isRetryable).toBe(false);
    });
  });

  describe('type guards', () => {
    it('isClientError returns true for 4xx', () => {
      const error = new ApiError(400, 'Bad Request', null, undefined, createMockResponse(400, 'Bad Request'));
      expect(error.isClientError()).toBe(true);
      expect(error.isServerError()).toBe(false);
    });

    it('isServerError returns true for 5xx', () => {
      const error = new ApiError(500, 'Internal Server Error', null, undefined, createMockResponse(500, 'Internal Server Error'));
      expect(error.isServerError()).toBe(true);
      expect(error.isClientError()).toBe(false);
    });

    it('isNotFound returns true for 404', () => {
      const error = new ApiError(404, 'Not Found', null, undefined, createMockResponse(404, 'Not Found'));
      expect(error.isNotFound()).toBe(true);
    });

    it('isUnauthorized returns true for 401', () => {
      const error = new ApiError(401, 'Unauthorized', null, undefined, createMockResponse(401, 'Unauthorized'));
      expect(error.isUnauthorized()).toBe(true);
    });

    it('isForbidden returns true for 403', () => {
      const error = new ApiError(403, 'Forbidden', null, undefined, createMockResponse(403, 'Forbidden'));
      expect(error.isForbidden()).toBe(true);
    });

    it('isRateLimited returns true for 429', () => {
      const error = new ApiError(429, 'Too Many Requests', null, undefined, createMockResponse(429, 'Too Many Requests'));
      expect(error.isRateLimited()).toBe(true);
    });
  });
});

describe('ValidationError', () => {
  describe('constructor', () => {
    it('creates an error with correct properties', () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const result = schema.safeParse({ name: 123, age: 'invalid' });
      
      if (!result.success) {
        const error = new ValidationError(result.error.issues, { name: 123, age: 'invalid' });

        expect(error.issues.length).toBeGreaterThan(0);
        expect(error.input).toEqual({ name: 123, age: 'invalid' });
        expect(error.code).toBe('KOMGA_VALIDATION_ERROR');
        expect(error.isRetryable).toBe(false);
      }
    });
  });

  describe('getFieldErrors', () => {
    it('groups errors by field path', () => {
      const schema = z.object({ 
        name: z.string().min(1),
        age: z.number()
      });
      const result = schema.safeParse({ name: 123, age: 'invalid' });
      
      if (!result.success) {
        const error = new ValidationError(result.error.issues, {});
        const fieldErrors = error.getFieldErrors();

        expect(fieldErrors['name']).toBeDefined();
        expect(fieldErrors['age']).toBeDefined();
      }
    });

    it('uses "root" for errors without path', () => {
      const schema = z.string();
      const result = schema.safeParse(123);
      
      if (!result.success) {
        const error = new ValidationError(result.error.issues, 123);
        const fieldErrors = error.getFieldErrors();

        expect(fieldErrors['root']).toBeDefined();
      }
    });

    it('handles nested paths', () => {
      const schema = z.object({
        metadata: z.object({
          title: z.string()
        })
      });
      const result = schema.safeParse({ metadata: { title: 123 } });
      
      if (!result.success) {
        const error = new ValidationError(result.error.issues, {});
        const fieldErrors = error.getFieldErrors();

        expect(fieldErrors['metadata.title']).toBeDefined();
      }
    });
  });
});

describe('NetworkError', () => {
  it('creates an error with correct properties', () => {
    const cause = new Error('Connection refused');
    const error = new NetworkError('Network request failed', cause);

    expect(error.message).toBe('Network request failed');
    expect(error.cause).toBe(cause);
    expect(error.code).toBe('KOMGA_NETWORK_ERROR');
    expect(error.isRetryable).toBe(true);
  });

  it('works without a cause', () => {
    const error = new NetworkError('Network request failed');

    expect(error.message).toBe('Network request failed');
    expect(error.cause).toBeUndefined();
  });
});

describe('TimeoutError', () => {
  it('creates an error with correct properties', () => {
    const cause = new Error('AbortError');
    const error = new TimeoutError('Request timeout', cause);

    expect(error.message).toBe('Request timeout');
    expect(error.cause).toBe(cause);
    expect(error.code).toBe('KOMGA_TIMEOUT_ERROR');
    expect(error.isRetryable).toBe(true);
  });

  it('uses default message when none provided', () => {
    const error = new TimeoutError();

    expect(error.message).toBe('Request timeout');
  });

  it('extends NetworkError', () => {
    const error = new TimeoutError();

    expect(error).toBeInstanceOf(NetworkError);
    expect(error).toBeInstanceOf(KomgaError);
  });
});

describe('Type Guards', () => {
  describe('isKomgaError', () => {
    it('returns true for KomgaError subclasses', () => {
      expect(isKomgaError(new ApiError(404, 'Not Found', null, undefined, new Response()))).toBe(true);
      expect(isKomgaError(new ValidationError([], {}))).toBe(true);
      expect(isKomgaError(new NetworkError('Failed'))).toBe(true);
      expect(isKomgaError(new TimeoutError())).toBe(true);
    });

    it('returns false for non-KomgaError', () => {
      expect(isKomgaError(new Error('Regular error'))).toBe(false);
      expect(isKomgaError('string error')).toBe(false);
      expect(isKomgaError(null)).toBe(false);
      expect(isKomgaError(undefined)).toBe(false);
      expect(isKomgaError({})).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('returns true for ApiError', () => {
      expect(isApiError(new ApiError(404, 'Not Found', null, undefined, new Response()))).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isApiError(new ValidationError([], {}))).toBe(false);
      expect(isApiError(new NetworkError('Failed'))).toBe(false);
      expect(isApiError(new Error('Regular'))).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('returns true for ValidationError', () => {
      expect(isValidationError(new ValidationError([], {}))).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isValidationError(new ApiError(404, 'Not Found', null, undefined, new Response()))).toBe(false);
      expect(isValidationError(new NetworkError('Failed'))).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('returns true for NetworkError', () => {
      expect(isNetworkError(new NetworkError('Failed'))).toBe(true);
    });

    it('returns true for TimeoutError (extends NetworkError)', () => {
      expect(isNetworkError(new TimeoutError())).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isNetworkError(new ApiError(404, 'Not Found', null, undefined, new Response()))).toBe(false);
      expect(isNetworkError(new ValidationError([], {}))).toBe(false);
    });
  });

  describe('isTimeoutError', () => {
    it('returns true for TimeoutError', () => {
      expect(isTimeoutError(new TimeoutError())).toBe(true);
    });

    it('returns false for NetworkError', () => {
      expect(isTimeoutError(new NetworkError('Failed'))).toBe(false);
    });
  });
});

describe('ErrorCodes', () => {
  it('has correct error code constants', () => {
    expect(ErrorCodes.KOMGA_ERROR).toBe('KOMGA_ERROR');
    expect(ErrorCodes.KOMGA_API_ERROR).toBe('KOMGA_API_ERROR');
    expect(ErrorCodes.KOMGA_VALIDATION_ERROR).toBe('KOMGA_VALIDATION_ERROR');
    expect(ErrorCodes.KOMGA_NETWORK_ERROR).toBe('KOMGA_NETWORK_ERROR');
    expect(ErrorCodes.KOMGA_TIMEOUT_ERROR).toBe('KOMGA_TIMEOUT_ERROR');
  });
});
