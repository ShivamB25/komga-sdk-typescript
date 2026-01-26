import { type Client } from '../client';
import { ValidationError } from '../errors';
import type { ZodSchema } from 'zod';

/**
 * Abstract base service class for all domain services.
 * Provides common functionality like safe API calls with validation.
 */
export abstract class BaseService {
  /**
   * Creates a new BaseService instance.
   * @param client - The HTTP client instance for making API calls
   */
  constructor(protected client: Client) {}

  /**
   * Safely calls an API function with validation.
   * Validates the response against the provided schema and handles errors.
   *
   * @template T - The expected response type
   * @param apiCall - The API function to call
   * @param schema - Zod schema for validating the response
   * @returns The validated response data
   * @throws ValidationError if response validation fails
   * @throws ApiError if the API call fails
   * @throws NetworkError if a network error occurs
   *
   * @example
   * const book = await this.safeCall(
   *   () => getBookById({ client: this.client, path: { bookId } }),
   *   BookDtoSchema
   * );
   */
  protected async safeCall<T>(
    apiCall: () => Promise<{ data: T; error: undefined } | { data: undefined; error: unknown }>,
    schema: ZodSchema
  ): Promise<T> {
    const result = await apiCall();
    
    if (result.error !== undefined) {
      throw new Error(`API error: ${JSON.stringify(result.error)}`);
    }

    const validated = schema.safeParse(result.data);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues, result.data);
    }

    return validated.data as T;
  }
}
