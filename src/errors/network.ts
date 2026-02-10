import { KomgaError } from './base';

/**
 * Error thrown when a network request fails (timeout, connection error, etc).
 * Wraps the underlying fetch error for better error handling.
 */
export class NetworkError extends KomgaError {
  readonly isRetryable = true;

  /**
   * The underlying error that caused the network failure
   */
  override readonly cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message);
    this.code = 'KOMGA_NETWORK_ERROR';
    this.cause = cause;
  }
}

/**
 * Error thrown when a network request times out.
 * Extends NetworkError with timeout-specific behavior.
 */
export class TimeoutError extends NetworkError {
  constructor(message: string = 'Request timeout', cause?: Error) {
    super(message, cause);
    this.code = 'KOMGA_TIMEOUT_ERROR';
  }
}
