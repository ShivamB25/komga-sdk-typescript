import { z } from 'zod';
import { AuthorDtoSchema, WebLinkDtoSchema, createPageSchema } from './common';

/**
 * AlternateTitleDto schema - represents an alternate title for a series
 */
export const AlternateTitleDtoSchema = z.object({
  label: z.string(),
  title: z.string(),
}).strict();

export type AlternateTitleDto = z.infer<typeof AlternateTitleDtoSchema>;

/**
 * AlternateTitleUpdateDto schema - for updating alternate titles
 */
export const AlternateTitleUpdateDtoSchema = z.object({
  label: z.string(),
  title: z.string(),
}).strict();

export type AlternateTitleUpdateDto = z.infer<typeof AlternateTitleUpdateDtoSchema>;

/**
 * BookMetadataAggregationDto schema - aggregated metadata from books in a series
 */
export const BookMetadataAggregationDtoSchema = z.object({
  authors: AuthorDtoSchema.array(),
  created: z.string(),
  lastModified: z.string(),
  releaseDate: z.string().nullish(),
  summary: z.string(),
  summaryNumber: z.string(),
  tags: z.string().array(),
}).strict();

export type BookMetadataAggregationDto = z.infer<typeof BookMetadataAggregationDtoSchema>;

/**
 * SeriesMetadataDto schema - series metadata including title, status, summary, etc.
 */
export const SeriesMetadataDtoSchema = z.object({
  ageRating: z.number().nullish(),
  ageRatingLock: z.boolean(),
  alternateTitles: AlternateTitleDtoSchema.array(),
  alternateTitlesLock: z.boolean(),
  created: z.string(),
  genres: z.string().array(),
  genresLock: z.boolean(),
  language: z.string(),
  languageLock: z.boolean(),
  lastModified: z.string(),
  links: WebLinkDtoSchema.array(),
  linksLock: z.boolean(),
  publisher: z.string(),
  publisherLock: z.boolean(),
  readingDirection: z.string().nullish(),
  readingDirectionLock: z.boolean(),
  sharingLabels: z.string().array(),
  sharingLabelsLock: z.boolean(),
  status: z.string(),
  statusLock: z.boolean(),
  summary: z.string(),
  summaryLock: z.boolean(),
  tags: z.string().array(),
  tagsLock: z.boolean(),
  title: z.string(),
  titleLock: z.boolean(),
  titleSort: z.string(),
  titleSortLock: z.boolean(),
  totalBookCount: z.number().nullish(),
  totalBookCountLock: z.boolean(),
}).strict();

export type SeriesMetadataDto = z.infer<typeof SeriesMetadataDtoSchema>;

/**
 * SeriesDto schema - main series entity with all properties
 */
export const SeriesDtoSchema = z.object({
  booksCount: z.number(),
  booksInProgressCount: z.number(),
  booksMetadata: BookMetadataAggregationDtoSchema,
  booksReadCount: z.number(),
  booksUnreadCount: z.number(),
  created: z.string(),
  deleted: z.boolean(),
  fileLastModified: z.string(),
  id: z.string(),
  lastModified: z.string(),
  libraryId: z.string(),
  metadata: SeriesMetadataDtoSchema,
  name: z.string(),
  oneshot: z.boolean(),
  url: z.string(),
}).strict();

export type SeriesDto = z.infer<typeof SeriesDtoSchema>;

/**
 * PageSeriesDto schema - paginated response of series
 */
export const PageSeriesDtoSchema = createPageSchema(SeriesDtoSchema);

export type PageSeriesDto = z.infer<typeof PageSeriesDtoSchema>;

/**
 * SeriesMetadataUpdateDto schema - for updating series metadata (all fields optional)
 */
export const SeriesMetadataUpdateDtoSchema = z.object({
  ageRating: z.number().optional(),
  ageRatingLock: z.boolean().optional(),
  alternateTitles: AlternateTitleUpdateDtoSchema.array().optional(),
  alternateTitlesLock: z.boolean().optional(),
  genres: z.string().array().optional(),
  genresLock: z.boolean().optional(),
  language: z.string().optional(),
  languageLock: z.boolean().optional(),
  links: z.object({
    label: z.string(),
    url: z.string(),
  }).strict().array().optional(),
  linksLock: z.boolean().optional(),
  publisher: z.string().optional(),
  publisherLock: z.boolean().optional(),
  readingDirection: z.enum(['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT', 'VERTICAL', 'WEBTOON']).optional(),
  readingDirectionLock: z.boolean().optional(),
  sharingLabels: z.string().array().optional(),
  sharingLabelsLock: z.boolean().optional(),
  status: z.enum(['ENDED', 'ONGOING', 'ABANDONED', 'HIATUS']).optional(),
  statusLock: z.boolean().optional(),
  summary: z.string().optional(),
  summaryLock: z.boolean().optional(),
  tags: z.string().array().optional(),
  tagsLock: z.boolean().optional(),
  title: z.string().optional(),
  titleLock: z.boolean().optional(),
  titleSort: z.string().optional(),
  titleSortLock: z.boolean().optional(),
  totalBookCount: z.number().optional(),
  totalBookCountLock: z.boolean().optional(),
}).strict();

export type SeriesMetadataUpdateDto = z.infer<typeof SeriesMetadataUpdateDtoSchema>;
