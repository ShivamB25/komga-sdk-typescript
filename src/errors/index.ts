export { KomgaError } from './base';
export { ApiError } from './api';
export { ValidationError } from './validation';
export { NetworkError, TimeoutError } from './network';

import { KomgaError } from './base';
import { ApiError } from './api';
import { ValidationError } from './validation';
import { NetworkError, TimeoutError } from './network';

/**
 * Error code constants for discrimination and error handling
 */
export const ErrorCodes = {
  KOMGA_ERROR: 'KOMGA_ERROR',
  KOMGA_API_ERROR: 'KOMGA_API_ERROR',
  KOMGA_VALIDATION_ERROR: 'KOMGA_VALIDATION_ERROR',
  KOMGA_NETWORK_ERROR: 'KOMGA_NETWORK_ERROR',
  KOMGA_TIMEOUT_ERROR: 'KOMGA_TIMEOUT_ERROR',
} as const;

/**
 * Type guard: Check if an error is a KomgaError
 */
export function isKomgaError(error: unknown): error is KomgaError {
  return error instanceof KomgaError;
}

/**
 * Type guard: Check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard: Check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard: Check if an error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard: Check if an error is a TimeoutError
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}
