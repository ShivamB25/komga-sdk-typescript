import { z } from 'zod';
import { createPageSchema } from './common';

// ============================================================================
// ReadList Schemas
// ============================================================================

/**
 * ReadListDto - ReadList entity with books
 * Represents a read list (ordered or unordered collection of books)
 */
export const ReadListDtoSchema = z.object({
  bookIds: z.array(z.string()),
  createdDate: z.string(),
  filtered: z.boolean(),
  id: z.string(),
  lastModifiedDate: z.string(),
  name: z.string(),
  ordered: z.boolean(),
  summary: z.string(),
}).strict();

export type ReadListDto = z.infer<typeof ReadListDtoSchema>;

/**
 * PageReadListDto - Paginated read list response
 * Used for listing read lists with pagination
 */
export const PageReadListDtoSchema = createPageSchema(ReadListDtoSchema);

export type PageReadListDto = z.infer<typeof PageReadListDtoSchema>;

/**
 * ReadListCreationDto - Request payload for creating a new read list
 * Required fields: name, bookIds, ordered, summary
 */
export const ReadListCreationDtoSchema = z.object({
  bookIds: z.array(z.string()),
  name: z.string(),
  ordered: z.boolean(),
  summary: z.string(),
}).strict();

export type ReadListCreationDto = z.infer<typeof ReadListCreationDtoSchema>;

/**
 * ReadListUpdateDto - Request payload for updating an existing read list
 * All fields are optional - omit fields you don't want to update
 */
export const ReadListUpdateDtoSchema = z.object({
  bookIds: z.array(z.string()).optional(),
  name: z.string().optional(),
  ordered: z.boolean().optional(),
  summary: z.string().optional(),
}).strict();

export type ReadListUpdateDto = z.infer<typeof ReadListUpdateDtoSchema>;
