/**
 * ky HTTP client factory for Komga SDK
 */

import ky from 'ky';
import type { KyInstance } from 'ky';
import type { KomgaClientOptions, RetryConfig } from './types';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  limit: 3,
  methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
  backoffLimit: 3000,
};

/**
 * Exponential backoff calculation for retry delays
 * @param attemptCount - The current attempt count (starts from 1)
 * @param backoffLimit - Maximum backoff delay in milliseconds
 * @returns Delay in milliseconds
 */
function calculateDelay(attemptCount: number, backoffLimit: number): number {
  const exponentialDelay = Math.min(
    0.3 * Math.pow(2, attemptCount - 1) * 1000,
    backoffLimit
  );
  return exponentialDelay;
}

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeUtf8Base64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  let encoded = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const chunk = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);

    encoded += BASE64_ALPHABET[(chunk >> 18) & 63];
    encoded += BASE64_ALPHABET[(chunk >> 12) & 63];
    encoded += second === undefined ? '=' : BASE64_ALPHABET[(chunk >> 6) & 63];
    encoded += third === undefined ? '=' : BASE64_ALPHABET[chunk & 63];
  }

  return encoded;
}

/**
 * Creates a ky HTTP client instance with configured retry, auth, and debug options
 *
 * @param options - Komga client configuration options
 * @returns Configured ky instance
 *
 * @example
 * ```typescript
 * const kyInstance = createHttpClient({
 *   baseUrl: 'http://localhost:25600',
 *   auth: { type: 'basic', username: 'admin', password: 'password' },
 *   timeout: 30000,
 *   retry: { limit: 3 },
 *   debug: true
 * });
 * ```
 */
export function createHttpClient(
  options: KomgaClientOptions
): KyInstance {
  const {
    baseUrl,
    auth,
    timeout = 30000,
    retry: retryOptions,
    debug = false,
    fetch: fetchImplementation,
  } = options;

  const retryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...retryOptions,
  };

  return ky.create({
    baseUrl,
    timeout,
    fetch: fetchImplementation,
    retry: {
      limit: retryConfig.limit,
      methods: retryConfig.methods,
      statusCodes: retryConfig.statusCodes,
      delay: (attemptCount) =>
        calculateDelay(attemptCount, retryConfig.backoffLimit),
      jitter: true,
    },
    hooks: {
      beforeRequest: [
        ({ request }) => {
          // Add authentication header
          if (auth) {
            if (auth.type === 'basic') {
              const credentials = encodeUtf8Base64(
                `${auth.username}:${auth.password}`
              );
              request.headers.set('Authorization', `Basic ${credentials}`);
            } else if (auth.type === 'apiKey') {
              request.headers.set('X-API-Key', auth.key);
            }
          }

          // Add request ID header for tracing
          const requestId = crypto.randomUUID();
          request.headers.set('X-Request-ID', requestId);

          if (debug) {
            console.log(
              `[${requestId}] ${request.method} ${request.url}`
            );
          }
        },
      ],
      afterResponse: [
        ({ request, response }) => {
          if (debug) {
            const requestId = request.headers.get('X-Request-ID') || 'unknown';
            console.log(
              `[${requestId}] Response: ${response.status} ${response.statusText}`
            );
          }
          return response;
        },
      ],
    },
  });
}

/**
 * @deprecated Use createHttpClient instead.
 */
export const createKyInstance = createHttpClient;
