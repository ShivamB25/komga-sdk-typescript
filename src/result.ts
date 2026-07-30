/** The fields returned by a generated request in its default response style. */
export type KomgaResult<TData, TError = unknown> =
  | {
      data: TData;
      error: undefined;
      request?: Request;
      response?: Response;
    }
  | {
      data: undefined;
      error: NonNullable<TError>;
      request?: Request;
      response?: Response;
    };

/** Error raised by {@link unwrap} when a generated request returns an error. */
export class KomgaApiError<TBody = unknown> extends Error {
  readonly body: TBody;
  readonly status?: number;
  readonly request?: Request;
  readonly response?: Response;

  constructor(body: TBody, response?: Response, request?: Request) {
    super(response ? `Komga API request failed with status ${response.status}` : 'Komga API request failed');
    this.name = 'KomgaApiError';
    this.body = body;
    this.status = response?.status;
    this.response = response;
    this.request = request;
  }
}

/**
 * Return generated response data or throw a typed API error.
 *
 * Successful void responses return `undefined`, matching their generated type.
 * An absent result is rejected as a malformed invocation.
 */
export function unwrap<TData, TError = unknown>(
  result: KomgaResult<TData, TError> | undefined,
): TData;
export function unwrap(result: KomgaResult<unknown, unknown> | undefined): unknown {
  if (result === undefined) {
    throw new Error('Komga API request did not return a result');
  }

  if (result.error !== undefined || (result.response !== undefined && !result.response.ok)) {
    throw new KomgaApiError(result.error, result.response, result.request);
  }

  return result.data;
}
