/**
 * Komga SDK client with ky integration
 *
 * Provides a high-level client factory that combines ky HTTP client with hey-api SDK
 * for automatic retry, authentication, and request/response handling.
 */

import { createClient } from '../client/client.gen';
import type { Client } from '../client/types.gen';
import { getNodeEnv } from './env';
import { createFetchAdapter } from './fetch-adapter';
import { createHttpClient } from './ky-client';
import type { KomgaClientOptions } from './types';

function isProductionEnvironment(): boolean {
  const nodeEnv = getNodeEnv();
  return nodeEnv === 'production';
}

function usesInsecureBasicAuth(options: KomgaClientOptions): boolean {
  if (options.auth?.type !== 'basic') {
    return false;
  }

  try {
    return new URL(options.baseUrl).protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Creates a Komga SDK client with ky integration
 *
 * This factory function:
 * 1. Creates a ky HTTP client instance with configured retry, auth, and debug options
 * 2. Wraps the ky instance as a fetch-compatible adapter
 * 3. Returns a hey-api SDK client configured with the fetch adapter
 *
 * @param options - Komga client configuration options
 * @returns Configured hey-api SDK client
 *
 * @example
 * ```typescript
 * import { createKomgaClient } from './http';
 *
 * const client = createKomgaClient({
 *   baseUrl: 'http://localhost:25600',
 *   auth: { type: 'basic', username: 'admin', password: 'password' },
 *   timeout: 30000,
 *   retry: { limit: 3 },
 *   debug: true
 * });
 *
 * // Use with SDK functions
 * const books = await getBooks({ client });
 * ```
 */
export function createKomgaClient(
  options: KomgaClientOptions
): Client {
  if (isProductionEnvironment() && usesInsecureBasicAuth(options)) {
    console.warn(
      '[Komga SDK] Basic auth is configured over HTTP in production. Use HTTPS to protect credentials in transit.'
    );
  }

  // Create ky instance with all configured options
  const kyInstance = createHttpClient(options);

  // Create fetch adapter from ky instance
  const fetchAdapter = createFetchAdapter(kyInstance);

  // Create and return hey-api client with the fetch adapter
  return createClient({
    baseUrl: options.baseUrl,
    fetch: fetchAdapter,
  });
}

/**
 * @deprecated Use createKomgaClient instead.
 */
export const createEnhancedClient = createKomgaClient;

// Re-export types for convenience
export type { KomgaClientOptions, AuthConfig, RetryConfig } from './types';
export type { Client } from '../client/types.gen';
export { createHttpClient } from './ky-client';
export { createFetchAdapter } from './fetch-adapter';
