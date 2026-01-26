/**
 * Enhanced client configuration options for Komga SDK with ky integration
 */

/**
 * Authentication configuration for the enhanced client
 */
export type AuthConfig =
  | {
      type: 'basic';
      username: string;
      password: string;
    }
  | {
      type: 'apiKey';
      key: string;
    };

/**
 * Retry configuration for automatic request retries with exponential backoff
 */
export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  limit?: number;

  /**
   * HTTP methods to retry on
   * @default ['get', 'put', 'head', 'delete', 'options', 'trace']
   */
  methods?: string[];

  /**
   * HTTP status codes that trigger a retry
   * @default [408, 413, 429, 500, 502, 503, 504]
   */
  statusCodes?: number[];

  /**
   * Maximum backoff delay in milliseconds for exponential backoff
   * @default 3000
   */
  backoffLimit?: number;
}

/**
 * Options for creating an enhanced Komga SDK client
 */
export interface EnhancedClientOptions {
  /**
   * Base URL for the Komga API server
   * @example 'http://localhost:25600'
   */
  baseUrl: string;

  /**
   * Authentication configuration (basic or API key)
   */
  auth?: AuthConfig;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Retry configuration for automatic retries
   */
  retry?: RetryConfig;

  /**
   * Enable debug logging for requests and responses
   * @default false
   */
  debug?: boolean;
}
