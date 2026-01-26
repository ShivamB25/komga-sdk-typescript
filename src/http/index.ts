/**
 * Enhanced Komga SDK client with ky integration
 *
 * Provides a high-level client factory that combines ky HTTP client with hey-api SDK
 * for automatic retry, authentication, and request/response handling.
 */

import { createClient } from '../client/client.gen';
import type { Client } from '../client/types.gen';
import { createKyFetchAdapter } from './fetch-adapter';
import { createKyInstance } from './ky-client';
import type { EnhancedClientOptions } from './types';

/**
 * Creates an enhanced Komga SDK client with ky integration
 *
 * This factory function:
 * 1. Creates a ky HTTP client instance with configured retry, auth, and debug options
 * 2. Wraps the ky instance as a fetch-compatible adapter
 * 3. Returns a hey-api SDK client configured with the fetch adapter
 *
 * @param options - Enhanced client configuration options
 * @returns Configured hey-api SDK client
 *
 * @example
 * ```typescript
 * import { createEnhancedClient } from './http';
 *
 * const client = createEnhancedClient({
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
export function createEnhancedClient(
  options: EnhancedClientOptions
): Client {
  // Create ky instance with all configured options
  const kyInstance = createKyInstance(options);

  // Create fetch adapter from ky instance
  const fetchAdapter = createKyFetchAdapter(kyInstance);

  // Create and return hey-api client with the fetch adapter
  return createClient({
    baseUrl: options.baseUrl,
    fetch: fetchAdapter,
  });
}

// Re-export types for convenience
export type { EnhancedClientOptions, AuthConfig, RetryConfig } from './types';
export type { Client } from '../client/types.gen';
export { createKyInstance } from './ky-client';
export { createKyFetchAdapter } from './fetch-adapter';
