import { type Client } from '../client';
import { ValidationError } from '../errors';
import type { ZodType } from 'zod';

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

  private formatApiErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string' && error.length > 0) {
      return error;
    }

    if (typeof error === 'object' && error !== null) {
      const candidate = error as {
        message?: unknown;
        status?: unknown;
        statusText?: unknown;
      };

      if (typeof candidate.message === 'string' && candidate.message.length > 0) {
        return candidate.message;
      }

      if (typeof candidate.status === 'number') {
        const statusText =
          typeof candidate.statusText === 'string' && candidate.statusText.length > 0
            ? ` ${candidate.statusText}`
            : '';
        return `HTTP ${candidate.status}${statusText}`;
      }
    }

    return 'Request failed';
  }

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
    apiCall: () => Promise<{ data?: unknown; error?: unknown } | undefined>,
    schema: ZodType<T>
  ): Promise<T> {
    const result = await apiCall();

    if (result?.error !== undefined) {
      throw new Error(`API error: ${this.formatApiErrorMessage(result.error)}`);
    }

    const data = result?.data;
    const validated = schema.safeParse(data);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues, data);
    }

    return validated.data;
  }

  /**
   * Safely calls an API function that returns void (e.g. update, delete, scan).
   * Checks for API errors without schema validation.
   *
   * @param apiCall - The API function to call
   * @throws Error if the API call returns an error
   *
   * @example
   * await this.safeVoidCall(
   *   () => updateLibraryById({ client: this.client, path: { libraryId }, body: data })
   * );
   */
  protected async safeVoidCall(
    apiCall: () => Promise<{ data?: unknown; error?: unknown } | undefined>
  ): Promise<void> {
    const result = await apiCall();

    if (result?.error !== undefined) {
      throw new Error(`API error: ${this.formatApiErrorMessage(result.error)}`);
    }
  }
}
