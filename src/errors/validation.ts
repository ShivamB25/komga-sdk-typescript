import { z } from 'zod';
import { KomgaError } from './base';

/**
 * Error thrown when Zod validation fails.
 * Contains detailed validation issue information for debugging and user feedback.
 */
export class ValidationError extends KomgaError {
  readonly isRetryable = false;

  /**
   * Array of Zod validation issues
   */
  readonly issues: z.ZodIssue[];

  /**
   * The input data that failed validation
   */
  readonly input: unknown;

  constructor(issues: z.ZodIssue[], input: unknown) {
    const message = `Validation Error: ${issues.length} issue(s) found`;
    super(message);

    this.code = 'KOMGA_VALIDATION_ERROR';
    this.issues = issues;
    this.input = input;
  }

  /**
   * Get validation errors grouped by field path.
   * Returns a record mapping field paths to arrays of error messages.
   */
  getFieldErrors(): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      const path = issue.path.join('.');
      const key = path || 'root';

      if (!fieldErrors[key]) {
        fieldErrors[key] = [];
      }

      fieldErrors[key].push(issue.message);
    }

    return fieldErrors;
  }
}
