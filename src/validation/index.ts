import { z } from 'zod';
import { ValidationError } from '../errors';

// Re-export all schemas
export * from './schemas';

/**
 * Validate data against a Zod schema, throwing ValidationError on failure
 * @template T - The type of data being validated
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data of type T
 * @throws ValidationError if validation fails
 */
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.issues, data);
  }
  return result.data;
}

/**
 * Safely validate data, returning a result object instead of throwing
 * @template T - The type of data being validated
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Result object with success flag and either data or error
 */
export function safeValidateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
