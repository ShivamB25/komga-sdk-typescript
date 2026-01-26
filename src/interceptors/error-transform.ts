import { ApiError, NetworkError, TimeoutError } from '../errors';
import type { ResolvedRequestOptions } from '../client/types.gen';

/**
 * Creates an error transform interceptor that converts raw fetch errors to typed errors.
 *
 * Transforms:
 * - HTTP error responses (response.ok === false) → ApiError
 * - Network/fetch errors → NetworkError
 * - Timeout errors → TimeoutError
 *
 * @returns Error interceptor function to attach to client.interceptors.error
 *
 * @example
 * ```typescript
 * const errorTransform = createErrorTransformInterceptor();
 * client.interceptors.error.use(errorTransform);
 * ```
 */
export function createErrorTransformInterceptor() {
  /**
   * Error interceptor - transforms raw errors to typed errors
   */
  const error = async (
    err: unknown,
    res: Response | undefined,
    req: Request,
    opts: ResolvedRequestOptions,
  ): Promise<ApiError | NetworkError | TimeoutError | unknown> => {
    // Handle HTTP error responses (4xx, 5xx)
    if (res && !res.ok) {
      try {
        const contentType = res.headers.get('content-type');
        let body: unknown;

        if (contentType?.includes('application/json')) {
          const text = await res.text();
          body = text ? JSON.parse(text) : undefined;
        } else if (contentType?.includes('text/')) {
          body = await res.text();
        } else {
          body = await res.blob();
        }

        return new ApiError(res.status, res.statusText, body, req, res);
      } catch (parseError) {
        // If we can't parse the response, still create ApiError with raw response
        return new ApiError(res.status, res.statusText, undefined, req, res);
      }
    }

    // Handle network/fetch errors
    if (err instanceof Error) {
      // Check for timeout errors
      if (
        err.name === 'AbortError' ||
        err.message.includes('timeout') ||
        err.message.includes('Timeout')
      ) {
        return new TimeoutError('Request timeout', err);
      }

      // Generic network error
      return new NetworkError(err.message || 'Network request failed', err);
    }

    // Handle string errors
    if (typeof err === 'string') {
      return new NetworkError(err);
    }

    // Return unknown errors as-is
    return err;
  };

  return error;
}
