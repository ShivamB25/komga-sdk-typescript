import type { z } from 'zod';
import { ValidationError } from '../errors';
import type { ResolvedRequestOptions } from '../client/types.gen';

/**
 * Map of URL patterns to Zod schemas for response validation
 */
export type ValidationSchemaMap = Record<string, z.ZodSchema>;

/**
 * Options for the validation interceptor
 */
export interface ValidationInterceptorOptions {
  /**
   * Map of URL patterns (regex or string) to Zod schemas
   * Patterns are matched against the response URL
   */
  schemas: ValidationSchemaMap;

  /**
   * Whether to throw on validation failure. Defaults to true
   */
  throwOnError?: boolean;
}

/**
 * Creates a validation interceptor factory that validates successful JSON responses.
 *
 * Validates response bodies against matching Zod schemas based on URL patterns.
 * Throws ValidationError on schema mismatch.
 *
 * @param options - Configuration with schema map
 * @returns Response interceptor function to attach to client.interceptors.response
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 *
 * const BookSchema = z.object({
 *   id: z.string(),
 *   title: z.string(),
 * });
 *
 * const validation = createValidationInterceptor({
 *   schemas: {
 *     '/api/books': BookSchema,
 *     '/api/books/.*': BookSchema,
 *   },
 *   throwOnError: true,
 * });
 *
 * client.interceptors.response.use(validation);
 * ```
 */
export function createValidationInterceptor(options: ValidationInterceptorOptions) {
  const { schemas, throwOnError = true } = options;

  /**
   * Response interceptor - validates JSON responses against schemas
   */
  const response = async (
    res: Response,
    req: Request,
    opts: ResolvedRequestOptions,
  ): Promise<Response> => {
    // Only validate successful responses with JSON content
    if (!res.ok) {
      return res;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return res;
    }

    // Find matching schema for this URL
    const url = res.url || req.url;
    let matchingSchema: z.ZodSchema | undefined;

    for (const [pattern, schema] of Object.entries(schemas)) {
      // Try regex pattern first
      try {
        const regex = new RegExp(pattern);
        if (regex.test(url)) {
          matchingSchema = schema;
          break;
        }
      } catch {
        // If not a valid regex, try string matching
        if (url.includes(pattern)) {
          matchingSchema = schema;
          break;
        }
      }
    }

    // If no schema matches, return response as-is
    if (!matchingSchema) {
      return res;
    }

    // Clone response to read body without consuming it
    const clonedRes = res.clone();

    try {
      const text = await clonedRes.text();
      const data = text ? JSON.parse(text) : {};

      // Validate against schema
      const result = matchingSchema.safeParse(data);

      if (!result.success) {
        const validationError = new ValidationError(result.error.issues, data);

        if (throwOnError) {
          throw validationError;
        }

        // Log validation error but return original response
        console.warn('Response validation failed:', validationError);
      }

      return res;
    } catch (error) {
      // If it's already a ValidationError, re-throw or return based on throwOnError
      if (error instanceof ValidationError) {
        if (throwOnError) {
          throw error;
        }
        return res;
      }

      // For other errors (JSON parse, etc), return response as-is
      return res;
    }
  };

  return response;
}
