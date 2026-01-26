/**
 * Abstract base error class for all Komga SDK errors.
 * All SDK errors should extend this class to ensure consistent error handling.
 */
export abstract class KomgaError extends Error {
  /**
   * Unique error code for discrimination and error handling.
   * Examples: 'KOMGA_API_ERROR', 'KOMGA_VALIDATION_ERROR', 'KOMGA_NETWORK_ERROR'
   */
  code: string = 'KOMGA_ERROR';

  /**
   * Whether this error is retryable.
   * Used by retry logic to determine if an operation should be retried.
   */
  abstract readonly isRetryable: boolean;

  /**
   * Creates a new KomgaError instance.
   * @param message - Human-readable error message
   */
  constructor(message: string) {
    super(message);
  }
}
