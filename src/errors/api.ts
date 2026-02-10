import { KomgaError } from './base';

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

/**
 * Error thrown when the Komga API returns an HTTP error response (4xx, 5xx).
 * Contains detailed information about the HTTP error for debugging and error handling.
 */
export class ApiError extends KomgaError {
  readonly isRetryable: boolean;

  /**
   * HTTP status code (e.g., 404, 500)
   */
  readonly status: number;

  /**
   * HTTP status text (e.g., 'Not Found', 'Internal Server Error')
   */
  readonly statusText: string;

  /**
   * Response body content (typically parsed JSON or text)
   */
  readonly body: unknown;

  /**
   * Original fetch Request object (may be undefined in some contexts)
   */
  readonly request?: Request;

  /**
   * Original fetch Response object
   */
  readonly response: Response;

  constructor(
    status: number,
    statusText: string,
    body: unknown,
    request: Request | undefined,
    response: Response,
  ) {
    const message = `API Error: ${status} ${statusText}`;
    super(message);

    this.code = 'KOMGA_API_ERROR';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.request = request;
    this.response = response;

    this.isRetryable = this.determineRetryability(status);
  }

  private determineRetryability(status: number): boolean {
    return RETRYABLE_STATUSES.has(status);
  }

  /**
   * Type guard: Check if this is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Type guard: Check if this is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Type guard: Check if this is a 404 Not Found error
   */
  isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Type guard: Check if this is a 401 Unauthorized error
   */
  isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Type guard: Check if this is a 403 Forbidden error
   */
  isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Type guard: Check if this is a 429 Too Many Requests error (rate limited)
   */
  isRateLimited(): boolean {
    return this.status === 429;
  }
}
