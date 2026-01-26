import type { ResolvedRequestOptions } from '../client/types.gen';

/**
 * Options for the logging interceptor
 */
export interface LoggingInterceptorOptions {
  /**
   * Custom logger function. Defaults to console.log
   */
  logger?: (msg: string) => void;

  /**
   * Whether to log request/response bodies. Defaults to false
   */
  logBody?: boolean;

  /**
   * Whether to log request/response headers. Defaults to false
   */
  logHeaders?: boolean;
}

/**
 * Creates a logging interceptor factory that logs HTTP requests and responses.
 *
 * @param options - Configuration options for logging
 * @returns Object with request and response interceptor functions
 *
 * @example
 * ```typescript
 * const { request, response } = createLoggingInterceptor({
 *   logger: console.log,
 *   logBody: true,
 *   logHeaders: true
 * });
 *
 * client.interceptors.request.use(request);
 * client.interceptors.response.use(response);
 * ```
 */
export function createLoggingInterceptor(options: LoggingInterceptorOptions = {}) {
  const logger = options.logger ?? console.log;
  const logBody = options.logBody ?? false;
  const logHeaders = options.logHeaders ?? false;

  /**
   * Request interceptor - logs outgoing requests
   */
  const request = async (
    req: Request,
    opts: ResolvedRequestOptions,
  ): Promise<Request> => {
    const method = req.method;
    const url = req.url;

    let logMessage = `[Request] ${method} ${url}`;

    if (logHeaders && req.headers) {
      const headerEntries: string[] = [];
      req.headers.forEach((value, key) => {
        headerEntries.push(`${key}: ${value}`);
      });
      if (headerEntries.length > 0) {
        logMessage += `\nHeaders:\n  ${headerEntries.join('\n  ')}`;
      }
    }

    if (logBody && req.body) {
      try {
        const bodyText = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        logMessage += `\nBody: ${bodyText}`;
      } catch {
        logMessage += '\nBody: [unable to serialize]';
      }
    }

    logger(logMessage);
    return req;
  };

  /**
   * Response interceptor - logs incoming responses
   */
  const response = async (
    res: Response,
    req: Request,
    opts: ResolvedRequestOptions,
  ): Promise<Response> => {
    const status = res.status;
    const statusText = res.statusText;
    const url = res.url;

    let logMessage = `[Response] ${status} ${statusText} ${url}`;

    if (logHeaders && res.headers) {
      const headerEntries: string[] = [];
      res.headers.forEach((value, key) => {
        headerEntries.push(`${key}: ${value}`);
      });
      if (headerEntries.length > 0) {
        logMessage += `\nHeaders:\n  ${headerEntries.join('\n  ')}`;
      }
    }

    if (logBody) {
      try {
        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const clonedRes = res.clone();
          const bodyText = await clonedRes.text();
          if (bodyText) {
            logMessage += `\nBody: ${bodyText}`;
          }
        } else if (contentType?.includes('text/')) {
          const clonedRes = res.clone();
          const bodyText = await clonedRes.text();
          if (bodyText) {
            logMessage += `\nBody: ${bodyText}`;
          }
        }
      } catch {
        logMessage += '\nBody: [unable to read]';
      }
    }

    logger(logMessage);
    return res;
  };

  return { request, response };
}
