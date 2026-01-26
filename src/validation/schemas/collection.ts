import { z } from 'zod';
import { createPageSchema } from './common';

// ============================================================================
// Collection Schemas
// ============================================================================

/**
 * CollectionDto - Collection entity with series
 * Represents a collection of series in the Komga library
 */
export const CollectionDtoSchema = z.object({
  createdDate: z.string(),
  filtered: z.boolean(),
  id: z.string(),
  lastModifiedDate: z.string(),
  name: z.string(),
  ordered: z.boolean(),
  seriesIds: z.array(z.string()),
}).strict();

export type CollectionDto = z.infer<typeof CollectionDtoSchema>;

/**
 * PageCollectionDto - Paginated collection response
 * Used for listing collections with pagination
 */
export const PageCollectionDtoSchema = createPageSchema(CollectionDtoSchema);

export type PageCollectionDto = z.infer<typeof PageCollectionDtoSchema>;

/**
 * CollectionCreationDto - Request payload for creating a new collection
 * Required fields: name, ordered, seriesIds
 */
export const CollectionCreationDtoSchema = z.object({
  name: z.string(),
  ordered: z.boolean(),
  seriesIds: z.array(z.string()),
}).strict();

export type CollectionCreationDto = z.infer<typeof CollectionCreationDtoSchema>;

/**
 * CollectionUpdateDto - Request payload for updating an existing collection
 * All fields are optional - omit fields you don't want to update
 */
export const CollectionUpdateDtoSchema = z.object({
  name: z.string().optional(),
  ordered: z.boolean().optional(),
  seriesIds: z.array(z.string()).optional(),
}).strict();

export type CollectionUpdateDto = z.infer<typeof CollectionUpdateDtoSchema>;
