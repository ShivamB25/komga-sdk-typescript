import { z } from 'zod';
import { AuthorDtoSchema, WebLinkDtoSchema, createPageSchema } from './common';

/**
 * MediaDto schema - media information (status, mediaType, pagesCount, etc.)
 */
export const MediaDtoSchema = z.object({
  comment: z.string(),
  epubDivinaCompatible: z.boolean(),
  epubIsKepub: z.boolean(),
  mediaProfile: z.string(),
  mediaType: z.string(),
  pagesCount: z.number(),
  status: z.string(),
});

export type MediaDto = z.infer<typeof MediaDtoSchema>;

/**
 * ReadProgressDto schema - reading progress (page, completed, readDate, etc.)
 */
export const ReadProgressDtoSchema = z.object({
  completed: z.boolean(),
  created: z.string(),
  deviceId: z.string(),
  deviceName: z.string(),
  lastModified: z.string(),
  page: z.number(),
  readDate: z.string(),
});

export type ReadProgressDto = z.infer<typeof ReadProgressDtoSchema>;

/**
 * BookMetadataDto schema - metadata (title, summary, authors, etc.)
 */
export const BookMetadataDtoSchema = z.object({
  authors: AuthorDtoSchema.array(),
  authorsLock: z.boolean(),
  created: z.string(),
  isbn: z.string(),
  isbnLock: z.boolean(),
  lastModified: z.string(),
  links: WebLinkDtoSchema.array(),
  linksLock: z.boolean(),
  number: z.string(),
  numberLock: z.boolean(),
  numberSort: z.number(),
  numberSortLock: z.boolean(),
  releaseDate: z.string().optional(),
  releaseDateLock: z.boolean(),
  summary: z.string(),
  summaryLock: z.boolean(),
  tags: z.string().array(),
  tagsLock: z.boolean(),
  title: z.string(),
  titleLock: z.boolean(),
});

export type BookMetadataDto = z.infer<typeof BookMetadataDtoSchema>;

/**
 * BookDto schema - main book entity combining all above
 */
export const BookDtoSchema = z.object({
  created: z.string(),
  deleted: z.boolean(),
  fileHash: z.string(),
  fileLastModified: z.string(),
  id: z.string(),
  lastModified: z.string(),
  libraryId: z.string(),
  media: MediaDtoSchema,
  metadata: BookMetadataDtoSchema,
  name: z.string(),
  number: z.number(),
  oneshot: z.boolean(),
  readProgress: ReadProgressDtoSchema.optional(),
  seriesId: z.string(),
  seriesTitle: z.string(),
  size: z.string(),
  sizeBytes: z.number(),
  url: z.string(),
});

export type BookDto = z.infer<typeof BookDtoSchema>;

/**
 * PageBookDto schema - paginated books response
 */
export const PageBookDtoSchema = createPageSchema(BookDtoSchema);

export type PageBookDto = z.infer<typeof PageBookDtoSchema>;

/**
 * BookMetadataUpdateDto schema - for update requests (all fields optional)
 */
export const BookMetadataUpdateDtoSchema = z.object({
  authors: z.array(z.object({
    name: z.string(),
    role: z.string(),
  })).optional(),
  authorsLock: z.boolean().optional(),
  isbn: z.string().optional(),
  isbnLock: z.boolean().optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().optional(),
  })).optional(),
  linksLock: z.boolean().optional(),
  number: z.string().optional(),
  numberLock: z.boolean().optional(),
  numberSort: z.number().optional(),
  numberSortLock: z.boolean().optional(),
  releaseDate: z.string().optional(),
  releaseDateLock: z.boolean().optional(),
  summary: z.string().optional(),
  summaryLock: z.boolean().optional(),
  tags: z.string().array().optional(),
  tagsLock: z.boolean().optional(),
  title: z.string().optional(),
  titleLock: z.boolean().optional(),
});

export type BookMetadataUpdateDto = z.infer<typeof BookMetadataUpdateDtoSchema>;
