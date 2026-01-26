import { z } from 'zod';

/**
 * Age restriction DTO schema
 */
export const AgeRestrictionDtoSchema = z.object({
  age: z.number().int().nonnegative(),
  restriction: z.enum(['ALLOW_ONLY', 'EXCLUDE']),
});

export type AgeRestrictionDto = z.infer<typeof AgeRestrictionDtoSchema>;

/**
 * Age restriction update DTO schema
 */
export const AgeRestrictionUpdateDtoSchema = z.object({
  age: z.number().int().nonnegative(),
  restriction: z.enum(['ALLOW_ONLY', 'EXCLUDE', 'NONE']),
});

export type AgeRestrictionUpdateDto = z.infer<typeof AgeRestrictionUpdateDtoSchema>;

/**
 * Shared libraries update DTO schema
 */
export const SharedLibrariesUpdateDtoSchema = z.object({
  all: z.boolean(),
  libraryIds: z.array(z.string()),
});

export type SharedLibrariesUpdateDto = z.infer<typeof SharedLibrariesUpdateDtoSchema>;

/**
 * User DTO schema - represents a user entity
 */
export const UserDtoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  sharedAllLibraries: z.boolean(),
  sharedLibrariesIds: z.array(z.string()),
  labelsAllow: z.array(z.string()),
  labelsExclude: z.array(z.string()),
  ageRestriction: AgeRestrictionDtoSchema.optional(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;

/**
 * User creation DTO schema - for creating new users
 */
export const UserCreationDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  roles: z.array(z.string()),
  labelsAllow: z.array(z.string()).optional(),
  labelsExclude: z.array(z.string()).optional(),
  sharedLibraries: SharedLibrariesUpdateDtoSchema.optional(),
  ageRestriction: AgeRestrictionUpdateDtoSchema.optional(),
});

export type UserCreationDto = z.infer<typeof UserCreationDtoSchema>;

/**
 * User update DTO schema - for updating existing users
 */
export const UserUpdateDtoSchema = z.object({
  roles: z.array(z.string()).optional(),
  labelsAllow: z.array(z.string()).optional(),
  labelsExclude: z.array(z.string()).optional(),
  sharedLibraries: SharedLibrariesUpdateDtoSchema.optional(),
  ageRestriction: AgeRestrictionUpdateDtoSchema.optional(),
});

export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;

/**
 * API key DTO schema - represents an API key entity
 */
export const ApiKeyDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  key: z.string(),
  comment: z.string(),
  createdDate: z.string().datetime(),
  lastModifiedDate: z.string().datetime(),
});

export type ApiKeyDto = z.infer<typeof ApiKeyDtoSchema>;

/**
 * API key request DTO schema - for creating API keys
 */
export const ApiKeyRequestDtoSchema = z.object({
  comment: z.string(),
});

export type ApiKeyRequestDto = z.infer<typeof ApiKeyRequestDtoSchema>;
