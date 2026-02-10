/**
 * Fetch adapter for ky HTTP client to work with hey-api SDK
 */

import type { KyInstance } from 'ky';

type KyRequestOptions = NonNullable<Parameters<KyInstance>[1]>;
type KyRequestMethod = NonNullable<KyRequestOptions['method']>;

type KnownHttpMethod =
  | 'connect'
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put'
  | 'trace';

function isKnownHttpMethod(method: string): method is KnownHttpMethod {
  switch (method) {
    case 'connect':
    case 'delete':
    case 'get':
    case 'head':
    case 'options':
    case 'patch':
    case 'post':
    case 'put':
    case 'trace':
      return true;
    default:
      return false;
  }
}

function toKyMethod(method: string): KyRequestMethod {
  const normalizedMethod = method.toLowerCase();
  if (isKnownHttpMethod(normalizedMethod)) {
    return normalizedMethod.toUpperCase() as KyRequestMethod;
  }

  return method as KyRequestMethod;
}

/**
 * Creates a fetch-compatible adapter from a ky instance
 *
 * This adapter wraps a ky instance to provide a standard fetch-compatible function
 * that can be used with the hey-api SDK. It uses `throwHttpErrors: false` to match
 * standard fetch behavior where HTTP errors don't throw exceptions.
 *
 * @param kyInstance - The ky instance to wrap
 * @returns A fetch-compatible function with signature (input, init?) => Promise<Response>
 *
 * @example
 * ```typescript
 * const kyInstance = createHttpClient(options);
 * const fetchAdapter = createFetchAdapter(kyInstance);
 * const client = createClient({ baseUrl, fetch: fetchAdapter });
 * ```
 */
export function createFetchAdapter(
  kyInstance: KyInstance
): typeof fetch {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    // Convert input to URL string if needed
    const url = input instanceof URL ? input.toString() : String(input);

    // Extract method from init or default to GET
    const method = init?.method ?? 'GET';

    // Create request options for ky
    const kyOptions: KyRequestOptions = {
      ...init,
      method: toKyMethod(method),
      throwHttpErrors: false, // Match standard fetch behavior
    };

    // Make the request using ky
    const response = await kyInstance(url, kyOptions);

    return response;
  };
}

/**
 * @deprecated Use createFetchAdapter instead.
 */
export const createKyFetchAdapter = createFetchAdapter;
