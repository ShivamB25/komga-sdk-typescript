import { z } from 'zod';

// ============================================================================
// Common Reusable Schemas
// ============================================================================

/**
 * AuthorDto - Author information with name and role
 * Used in: BookMetadataDto, BookMetadataAggregationDto
 */
export const AuthorDtoSchema = z.object({
  name: z.string(),
  role: z.string(),
}).strict();

export type AuthorDto = z.infer<typeof AuthorDtoSchema>;

/**
 * AuthorUpdateDto - Author update payload
 */
export const AuthorUpdateDtoSchema = z.object({
  name: z.string(),
  role: z.string(),
}).strict();

export type AuthorUpdateDto = z.infer<typeof AuthorUpdateDtoSchema>;

/**
 * WebLinkDto - Web link with label and URL
 * Used in: BookMetadataDto, SeriesMetadataDto
 */
export const WebLinkDtoSchema = z.object({
  label: z.string(),
  url: z.string(),
}).strict();

export type WebLinkDto = z.infer<typeof WebLinkDtoSchema>;

/**
 * WebLinkUpdateDto - Web link update payload
 */
export const WebLinkUpdateDtoSchema = z.object({
  label: z.string(),
  url: z.string().optional(),
}).strict();

export type WebLinkUpdateDto = z.infer<typeof WebLinkUpdateDtoSchema>;

/**
 * AlternateTitleDto - Alternate title with label
 * Used in: SeriesMetadataDto
 */
export const AlternateTitleDtoSchema = z.object({
  label: z.string(),
  title: z.string(),
}).strict();

export type AlternateTitleDto = z.infer<typeof AlternateTitleDtoSchema>;

/**
 * AlternateTitleUpdateDto - Alternate title update payload
 */
export const AlternateTitleUpdateDtoSchema = z.object({
  label: z.string(),
  title: z.string(),
}).strict();

export type AlternateTitleUpdateDto = z.infer<typeof AlternateTitleUpdateDtoSchema>;

/**
 * AgeRestrictionDto - Age restriction settings
 * Used in: UserDto
 */
export const AgeRestrictionDtoSchema = z.object({
  age: z.number(),
  restriction: z.enum(['ALLOW_ONLY', 'EXCLUDE']),
}).strict();

export type AgeRestrictionDto = z.infer<typeof AgeRestrictionDtoSchema>;

/**
 * AgeRestrictionUpdateDto - Age restriction update payload
 */
export const AgeRestrictionUpdateDtoSchema = z.object({
  age: z.number(),
  restriction: z.enum(['ALLOW_ONLY', 'EXCLUDE', 'NONE']),
}).strict();

export type AgeRestrictionUpdateDto = z.infer<typeof AgeRestrictionUpdateDtoSchema>;

/**
 * SortObject - Pagination sort information
 */
export const SortObjectSchema = z.object({
  empty: z.boolean().optional(),
  sorted: z.boolean().optional(),
  unsorted: z.boolean().optional(),
}).strict();

export type SortObject = z.infer<typeof SortObjectSchema>;

/**
 * PageableObject - Pagination information
 * Used in: Page* DTOs
 */
export const PageableObjectSchema = z.object({
  offset: z.number().optional(),
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  paged: z.boolean().optional(),
  sort: SortObjectSchema.optional(),
  unpaged: z.boolean().optional(),
}).strict();

export type PageableObject = z.infer<typeof PageableObjectSchema>;

/**
 * Generic factory for paginated responses
 * Creates a schema for a paginated response with the given item schema
 *
 * @example
 * const PageBookDtoSchema = createPageSchema(BookDtoSchema);
 */
export const createPageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema).optional(),
    empty: z.boolean().optional(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    number: z.number().optional(),
    numberOfElements: z.number().optional(),
    pageable: PageableObjectSchema.optional(),
    size: z.number().optional(),
    sort: SortObjectSchema.optional(),
    totalElements: z.number().optional(),
    totalPages: z.number().optional(),
  }).strict();

/**
 * MediaDto - Media information for books
 */
export const MediaDtoSchema = z.object({
  comment: z.string(),
  epubDivinaCompatible: z.boolean(),
  epubIsKepub: z.boolean(),
  mediaProfile: z.string(),
  mediaType: z.string(),
  pagesCount: z.number(),
  status: z.string(),
}).strict();

export type MediaDto = z.infer<typeof MediaDtoSchema>;

/**
 * ReadProgressDto - Reading progress information
 */
export const ReadProgressDtoSchema = z.object({
  completed: z.boolean(),
  created: z.string(),
  deviceId: z.string(),
  deviceName: z.string(),
  lastModified: z.string(),
  page: z.number(),
  readDate: z.string(),
}).strict();

export type ReadProgressDto = z.infer<typeof ReadProgressDtoSchema>;

/**
 * ReadProgressUpdateDto - Reading progress update payload
 */
export const ReadProgressUpdateDtoSchema = z.object({
  completed: z.boolean().optional(),
  page: z.number().optional(),
}).strict();

export type ReadProgressUpdateDto = z.infer<typeof ReadProgressUpdateDtoSchema>;

/**
 * PathDto - File system path information
 */
export const PathDtoSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
}).strict();

export type PathDto = z.infer<typeof PathDtoSchema>;

/**
 * PageDto - Page information in a book
 */
export const PageDtoSchema = z.object({
  fileName: z.string(),
  height: z.number().optional(),
  mediaType: z.string(),
  number: z.number(),
  size: z.string(),
  sizeBytes: z.number().optional(),
  width: z.number().optional(),
}).strict();

export type PageDto = z.infer<typeof PageDtoSchema>;

/**
 * GroupCountDto - Count grouped by a category
 */
export const GroupCountDtoSchema = z.object({
  count: z.number(),
  group: z.string(),
}).strict();

export type GroupCountDto = z.infer<typeof GroupCountDtoSchema>;

/**
 * Violation - Validation error violation
 */
export const ViolationSchema = z.object({
  fieldName: z.string().optional(),
  message: z.string().optional(),
}).strict();

export type Violation = z.infer<typeof ViolationSchema>;

/**
 * ValidationErrorResponse - Validation error response
 */
export const ValidationErrorResponseSchema = z.object({
  violations: z.array(ViolationSchema),
}).strict();

export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;

/**
 * ClientSettingDto - Client setting value
 */
export const ClientSettingDtoSchema = z.object({
  allowUnauthorized: z.boolean().optional(),
  value: z.string(),
}).strict();

export type ClientSettingDto = z.infer<typeof ClientSettingDtoSchema>;

/**
 * ClientSettingGlobalUpdateDto - Global client setting update
 */
export const ClientSettingGlobalUpdateDtoSchema = z.object({
  allowUnauthorized: z.boolean(),
  value: z.string(),
}).strict();

export type ClientSettingGlobalUpdateDto = z.infer<typeof ClientSettingGlobalUpdateDtoSchema>;

/**
 * ClientSettingUserUpdateDto - User client setting update
 */
export const ClientSettingUserUpdateDtoSchema = z.object({
  value: z.string(),
}).strict();

export type ClientSettingUserUpdateDto = z.infer<typeof ClientSettingUserUpdateDtoSchema>;

/**
 * PasswordUpdateDto - Password update payload
 */
export const PasswordUpdateDtoSchema = z.object({
  password: z.string(),
}).strict();

export type PasswordUpdateDto = z.infer<typeof PasswordUpdateDtoSchema>;

/**
 * DirectoryRequestDto - Directory listing request
 */
export const DirectoryRequestDtoSchema = z.object({
  path: z.string(),
  showFiles: z.boolean(),
}).strict();

export type DirectoryRequestDto = z.infer<typeof DirectoryRequestDtoSchema>;

/**
 * DirectoryListingDto - Directory listing response
 */
export const DirectoryListingDtoSchema = z.object({
  directories: z.array(PathDtoSchema),
  files: z.array(PathDtoSchema),
  parent: z.string().optional(),
}).strict();

export type DirectoryListingDto = z.infer<typeof DirectoryListingDtoSchema>;

/**
 * ScanRequestDto - Scan request payload
 */
export const ScanRequestDtoSchema = z.object({
  path: z.string(),
}).strict();

export type ScanRequestDto = z.infer<typeof ScanRequestDtoSchema>;

/**
 * ClaimStatus - Claim status response
 */
export const ClaimStatusSchema = z.object({
  isClaimed: z.boolean(),
}).strict();

export type ClaimStatus = z.infer<typeof ClaimStatusSchema>;

/**
 * ApiKeyRequestDto - API key creation request
 */
export const ApiKeyRequestDtoSchema = z.object({
  comment: z.string(),
}).strict();

export type ApiKeyRequestDto = z.infer<typeof ApiKeyRequestDtoSchema>;

/**
 * ApiKeyDto - API key information
 */
export const ApiKeyDtoSchema = z.object({
  comment: z.string(),
  createdDate: z.string(),
  id: z.string(),
  key: z.string(),
  lastModifiedDate: z.string(),
  userId: z.string(),
}).strict();

export type ApiKeyDto = z.infer<typeof ApiKeyDtoSchema>;

/**
 * OAuth2ClientDto - OAuth2 client information
 */
export const OAuth2ClientDtoSchema = z.object({
  name: z.string(),
  registrationId: z.string(),
}).strict();

export type OAuth2ClientDto = z.infer<typeof OAuth2ClientDtoSchema>;

/**
 * AuthenticationActivityDto - Authentication activity log entry
 */
export const AuthenticationActivityDtoSchema = z.object({
  apiKeyComment: z.string().optional(),
  apiKeyId: z.string().optional(),
  dateTime: z.string(),
  email: z.string().optional(),
  error: z.string().optional(),
  ip: z.string().optional(),
  source: z.string().optional(),
  success: z.boolean(),
  userAgent: z.string().optional(),
  userId: z.string().optional(),
}).strict();

export type AuthenticationActivityDto = z.infer<typeof AuthenticationActivityDtoSchema>;

/**
 * HistoricalEventDto - Historical event log entry
 */
export const HistoricalEventDtoSchema = z.object({
  bookId: z.string().optional(),
  id: z.string(),
  properties: z.record(z.string(), z.string()),
  seriesId: z.string().optional(),
  timestamp: z.string(),
  type: z.string(),
}).strict();

export type HistoricalEventDto = z.infer<typeof HistoricalEventDtoSchema>;

/**
 * ReleaseDto - Release information
 */
export const ReleaseDtoSchema = z.object({
  description: z.string(),
  latest: z.boolean(),
  preRelease: z.boolean(),
  releaseDate: z.string(),
  url: z.string(),
  version: z.string(),
}).strict();

export type ReleaseDto = z.infer<typeof ReleaseDtoSchema>;

/**
 * ItemDto - Feed item (JSON Feed format)
 */
export const ItemDtoSchema = z.object({
  _komga: z.object({
    read: z.boolean(),
  }).strict().optional(),
  author: AuthorDtoSchema.optional(),
  content_html: z.string().optional(),
  date_modified: z.string().optional(),
  id: z.string(),
  summary: z.string().optional(),
  tags: z.array(z.string()),
  title: z.string().optional(),
  url: z.string().optional(),
}).strict();

export type ItemDto = z.infer<typeof ItemDtoSchema>;

/**
 * JsonFeedDto - JSON Feed format response
 */
export const JsonFeedDtoSchema = z.object({
  description: z.string().optional(),
  home_page_url: z.string().optional(),
  items: z.array(ItemDtoSchema),
  title: z.string(),
  version: z.string(),
}).strict();

export type JsonFeedDto = z.infer<typeof JsonFeedDtoSchema>;

/**
 * Location - Reading location in EPUB
 */
export const LocationSchema = z.object({
  fragments: z.array(z.string()),
  position: z.number().optional(),
  progression: z.number().optional(),
  totalProgression: z.number().optional(),
}).strict();

export type Location = z.infer<typeof LocationSchema>;

/**
 * Text - Text context in reading location
 */
export const TextSchema = z.object({
  after: z.string().optional(),
  before: z.string().optional(),
  highlight: z.string().optional(),
}).strict();

export type Text = z.infer<typeof TextSchema>;

/**
 * R2Device - Readium2 device information
 */
export const R2DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
}).strict();

export type R2Device = z.infer<typeof R2DeviceSchema>;

/**
 * R2Locator - Readium2 locator
 */
export const R2LocatorSchema = z.object({
  href: z.string(),
  koboSpan: z.string().optional(),
  locations: LocationSchema.optional(),
  text: TextSchema.optional(),
  title: z.string().optional(),
  type: z.string(),
}).strict();

export type R2Locator = z.infer<typeof R2LocatorSchema>;

/**
 * R2Progression - Readium2 reading progression
 */
export const R2ProgressionSchema = z.object({
  device: R2DeviceSchema,
  locator: R2LocatorSchema,
  modified: z.string(),
}).strict();

export type R2Progression = z.infer<typeof R2ProgressionSchema>;

/**
 * R2Positions - Readium2 positions
 */
export const R2PositionsSchema = z.object({
  positions: z.array(R2LocatorSchema),
  total: z.number(),
}).strict();

export type R2Positions = z.infer<typeof R2PositionsSchema>;

/**
 * TachiyomiReadProgressDto - Tachiyomi reading progress
 */
export const TachiyomiReadProgressDtoSchema = z.object({
  booksCount: z.number(),
  booksInProgressCount: z.number(),
  booksReadCount: z.number(),
  booksUnreadCount: z.number(),
  lastReadContinuousIndex: z.number(),
}).strict();

export type TachiyomiReadProgressDto = z.infer<typeof TachiyomiReadProgressDtoSchema>;

/**
 * TachiyomiReadProgressUpdateDto - Tachiyomi reading progress update
 */
export const TachiyomiReadProgressUpdateDtoSchema = z.object({
  lastBookRead: z.number(),
}).strict();

export type TachiyomiReadProgressUpdateDto = z.infer<typeof TachiyomiReadProgressUpdateDtoSchema>;

/**
 * TachiyomiReadProgressV2Dto - Tachiyomi V2 reading progress
 */
export const TachiyomiReadProgressV2DtoSchema = z.object({
  booksCount: z.number(),
  booksInProgressCount: z.number(),
  booksReadCount: z.number(),
  booksUnreadCount: z.number(),
  lastReadContinuousNumberSort: z.number(),
  maxNumberSort: z.number(),
}).strict();

export type TachiyomiReadProgressV2Dto = z.infer<typeof TachiyomiReadProgressV2DtoSchema>;

/**
 * TachiyomiReadProgressUpdateV2Dto - Tachiyomi V2 reading progress update
 */
export const TachiyomiReadProgressUpdateV2DtoSchema = z.object({
  lastBookNumberSortRead: z.number(),
}).strict();

export type TachiyomiReadProgressUpdateV2Dto = z.infer<typeof TachiyomiReadProgressUpdateV2DtoSchema>;

/**
 * SettingMultiSourceString - Multi-source string setting
 */
export const SettingMultiSourceStringSchema = z.object({
  configurationSource: z.string(),
  databaseSource: z.string(),
  effectiveValue: z.string(),
}).strict();

export type SettingMultiSourceString = z.infer<typeof SettingMultiSourceStringSchema>;

/**
 * SettingMultiSourceInteger - Multi-source integer setting
 */
export const SettingMultiSourceIntegerSchema = z.object({
  configurationSource: z.number(),
  databaseSource: z.number(),
  effectiveValue: z.number(),
}).strict();

export type SettingMultiSourceInteger = z.infer<typeof SettingMultiSourceIntegerSchema>;

/**
 * SettingsDto - Server settings
 */
export const SettingsDtoSchema = z.object({
  deleteEmptyCollections: z.boolean(),
  deleteEmptyReadLists: z.boolean(),
  kepubifyPath: SettingMultiSourceStringSchema,
  koboPort: z.number().optional(),
  koboProxy: z.boolean(),
  rememberMeDurationDays: z.number(),
  serverContextPath: SettingMultiSourceStringSchema,
  serverPort: SettingMultiSourceIntegerSchema,
  taskPoolSize: z.number(),
  thumbnailSize: z.enum(['DEFAULT', 'MEDIUM', 'LARGE', 'XLARGE']),
}).strict();

export type SettingsDto = z.infer<typeof SettingsDtoSchema>;

/**
 * SettingsUpdateDto - Server settings update
 */
export const SettingsUpdateDtoSchema = z.object({
  deleteEmptyCollections: z.boolean().optional(),
  deleteEmptyReadLists: z.boolean().optional(),
  kepubifyPath: z.string().optional(),
  koboPort: z.number().optional(),
  koboProxy: z.boolean().optional(),
  rememberMeDurationDays: z.number().optional(),
  renewRememberMeKey: z.boolean().optional(),
  serverContextPath: z.string().optional(),
  serverPort: z.number().optional(),
  taskPoolSize: z.number().optional(),
  thumbnailSize: z.enum(['DEFAULT', 'MEDIUM', 'LARGE', 'XLARGE']).optional(),
}).strict();

export type SettingsUpdateDto = z.infer<typeof SettingsUpdateDtoSchema>;

/**
 * SharedLibrariesUpdateDto - Shared libraries update
 */
export const SharedLibrariesUpdateDtoSchema = z.object({
  all: z.boolean(),
  libraryIds: z.array(z.string()),
}).strict();

export type SharedLibrariesUpdateDto = z.infer<typeof SharedLibrariesUpdateDtoSchema>;

/**
 * ThumbnailBookDto - Book thumbnail information
 */
export const ThumbnailBookDtoSchema = z.object({
  bookId: z.string(),
  fileSize: z.number(),
  height: z.number(),
  id: z.string(),
  mediaType: z.string(),
  selected: z.boolean(),
  type: z.string(),
  width: z.number(),
}).strict();

export type ThumbnailBookDto = z.infer<typeof ThumbnailBookDtoSchema>;

/**
 * ThumbnailSeriesDto - Series thumbnail information
 */
export const ThumbnailSeriesDtoSchema = z.object({
  fileSize: z.number(),
  height: z.number(),
  id: z.string(),
  mediaType: z.string(),
  selected: z.boolean(),
  seriesId: z.string(),
  type: z.string(),
  width: z.number(),
}).strict();

export type ThumbnailSeriesDto = z.infer<typeof ThumbnailSeriesDtoSchema>;

/**
 * ThumbnailSeriesCollectionDto - Collection thumbnail information
 */
export const ThumbnailSeriesCollectionDtoSchema = z.object({
  collectionId: z.string(),
  fileSize: z.number(),
  height: z.number(),
  id: z.string(),
  mediaType: z.string(),
  selected: z.boolean(),
  type: z.string(),
  width: z.number(),
}).strict();

export type ThumbnailSeriesCollectionDto = z.infer<typeof ThumbnailSeriesCollectionDtoSchema>;

/**
 * ThumbnailReadListDto - Read list thumbnail information
 */
export const ThumbnailReadListDtoSchema = z.object({
  fileSize: z.number(),
  height: z.number(),
  id: z.string(),
  mediaType: z.string(),
  readListId: z.string(),
  selected: z.boolean(),
  type: z.string(),
  width: z.number(),
}).strict();

export type ThumbnailReadListDto = z.infer<typeof ThumbnailReadListDtoSchema>;

/**
 * PageHashCreationDto - Page hash creation request
 */
export const PageHashCreationDtoSchema = z.object({
  action: z.enum(['DELETE_AUTO', 'DELETE_MANUAL', 'IGNORE']),
  hash: z.string(),
  size: z.number().optional(),
}).strict();

export type PageHashCreationDto = z.infer<typeof PageHashCreationDtoSchema>;

/**
 * PageHashKnownDto - Known page hash information
 */
export const PageHashKnownDtoSchema = z.object({
  action: z.enum(['DELETE_AUTO', 'DELETE_MANUAL', 'IGNORE']),
  created: z.string(),
  deleteCount: z.number(),
  hash: z.string(),
  lastModified: z.string(),
  matchCount: z.number(),
  size: z.number().optional(),
}).strict();

export type PageHashKnownDto = z.infer<typeof PageHashKnownDtoSchema>;

/**
 * PageHashUnknownDto - Unknown page hash information
 */
export const PageHashUnknownDtoSchema = z.object({
  hash: z.string(),
  matchCount: z.number(),
  size: z.number().optional(),
}).strict();

export type PageHashUnknownDto = z.infer<typeof PageHashUnknownDtoSchema>;

/**
 * PageHashMatchDto - Page hash match information
 */
export const PageHashMatchDtoSchema = z.object({
  bookId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mediaType: z.string(),
  pageNumber: z.number(),
  url: z.string(),
}).strict();

export type PageHashMatchDto = z.infer<typeof PageHashMatchDtoSchema>;

/**
 * ReadListMatchDto - Read list match information
 */
export const ReadListMatchDtoSchema = z.object({
  errorCode: z.string(),
  name: z.string(),
}).strict();

export type ReadListMatchDto = z.infer<typeof ReadListMatchDtoSchema>;

/**
 * ReadListRequestBookDto - Read list request book
 */
export const ReadListRequestBookDtoSchema = z.object({
  number: z.string(),
  series: z.array(z.string()),
}).strict();

export type ReadListRequestBookDto = z.infer<typeof ReadListRequestBookDtoSchema>;

/**
 * ReadListRequestBookMatchBookDto - Read list request book match
 */
export const ReadListRequestBookMatchBookDtoSchema = z.object({
  bookId: z.string(),
  number: z.string(),
  title: z.string(),
}).strict();

export type ReadListRequestBookMatchBookDto = z.infer<typeof ReadListRequestBookMatchBookDtoSchema>;

/**
 * ReadListRequestBookMatchSeriesDto - Read list request book match series
 */
export const ReadListRequestBookMatchSeriesDtoSchema = z.object({
  releaseDate: z.string().optional(),
  seriesId: z.string(),
  title: z.string(),
}).strict();

export type ReadListRequestBookMatchSeriesDto = z.infer<typeof ReadListRequestBookMatchSeriesDtoSchema>;

/**
 * ReadListRequestBookMatchDto - Read list request book match
 */
export const ReadListRequestBookMatchDtoSchema = z.object({
  books: z.array(ReadListRequestBookMatchBookDtoSchema),
  series: ReadListRequestBookMatchSeriesDtoSchema,
}).strict();

export type ReadListRequestBookMatchDto = z.infer<typeof ReadListRequestBookMatchDtoSchema>;

/**
 * ReadListRequestBookMatchesDto - Read list request book matches
 */
export const ReadListRequestBookMatchesDtoSchema = z.object({
  matches: z.array(ReadListRequestBookMatchDtoSchema),
  request: ReadListRequestBookDtoSchema,
}).strict();

export type ReadListRequestBookMatchesDto = z.infer<typeof ReadListRequestBookMatchesDtoSchema>;

/**
 * ReadListRequestMatchDto - Read list request match
 */
export const ReadListRequestMatchDtoSchema = z.object({
  errorCode: z.string(),
  readListMatch: ReadListMatchDtoSchema,
  requests: z.array(ReadListRequestBookMatchesDtoSchema),
}).strict();

export type ReadListRequestMatchDto = z.infer<typeof ReadListRequestMatchDtoSchema>;

/**
 * WpLinkDto - Web Publication link
 */
export const WpLinkDtoSchema = z.object({
  height: z.number().optional(),
  href: z.string().optional(),
  properties: z.record(z.string(), z.record(z.string(), z.unknown())),
  rel: z.string().optional(),
  templated: z.boolean().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  width: z.number().optional(),
}).strict();

export type WpLinkDto = z.infer<typeof WpLinkDtoSchema>;

/**
 * WpContributorDto - Web Publication contributor
 */
export const WpContributorDtoSchema = z.object({
  links: z.array(WpLinkDtoSchema),
  name: z.string(),
  position: z.number().optional(),
}).strict();

export type WpContributorDto = z.infer<typeof WpContributorDtoSchema>;

/**
 * WpBelongsToDto - Web Publication belongs to
 */
export const WpBelongsToDtoSchema = z.object({
  collection: z.array(WpContributorDtoSchema),
  series: z.array(WpContributorDtoSchema),
}).strict();

export type WpBelongsToDto = z.infer<typeof WpBelongsToDtoSchema>;

/**
 * WpMetadataDto - Web Publication metadata
 */
export const WpMetadataDtoSchema = z.object({
  artist: z.array(z.string()),
  author: z.array(z.string()),
  belongsTo: WpBelongsToDtoSchema.optional(),
  colorist: z.array(z.string()),
  conformsTo: z.string().optional(),
  contributor: z.array(z.string()),
  description: z.string().optional(),
  editor: z.array(z.string()),
  identifier: z.string().optional(),
  illustrator: z.array(z.string()),
  inker: z.array(z.string()),
  language: z.string().optional(),
  letterer: z.array(z.string()),
  modified: z.string().optional(),
  numberOfPages: z.number().optional(),
  penciler: z.array(z.string()),
  published: z.string().optional(),
  publisher: z.array(z.string()),
  readingProgression: z.enum(['rtl', 'ltr', 'ttb', 'btt', 'auto']).optional(),
  rendition: z.record(z.string(), z.unknown()),
  sortAs: z.string().optional(),
  subject: z.array(z.string()),
  subtitle: z.string().optional(),
  title: z.string(),
  translator: z.array(z.string()),
  type: z.string().optional(),
}).strict();

export type WpMetadataDto = z.infer<typeof WpMetadataDtoSchema>;

/**
 * WpPublicationDto - Web Publication
 */
export const WpPublicationDtoSchema = z.object({
  context: z.string().optional(),
  images: z.array(WpLinkDtoSchema),
  landmarks: z.array(WpLinkDtoSchema),
  links: z.array(WpLinkDtoSchema),
  metadata: WpMetadataDtoSchema,
  pageList: z.array(WpLinkDtoSchema),
  readingOrder: z.array(WpLinkDtoSchema),
  resources: z.array(WpLinkDtoSchema),
  toc: z.array(WpLinkDtoSchema),
}).strict();

export type WpPublicationDto = z.infer<typeof WpPublicationDtoSchema>;

/**
 * TransientBookDto - Transient book information
 */
export const TransientBookDtoSchema = z.object({
  comment: z.string(),
  fileLastModified: z.string(),
  files: z.array(z.string()),
  id: z.string(),
  mediaType: z.string(),
  name: z.string(),
  number: z.number().optional(),
  pages: z.array(PageDtoSchema),
  seriesId: z.string().optional(),
  size: z.string(),
  sizeBytes: z.number(),
  status: z.string(),
  url: z.string(),
}).strict();

export type TransientBookDto = z.infer<typeof TransientBookDtoSchema>;

/**
 * BookMetadataAggregationDto - Aggregated book metadata
 */
export const BookMetadataAggregationDtoSchema = z.object({
  authors: z.array(AuthorDtoSchema),
  created: z.string(),
  lastModified: z.string(),
  releaseDate: z.string().optional(),
  summary: z.string(),
  summaryNumber: z.string(),
  tags: z.array(z.string()),
}).strict();

export type BookMetadataAggregationDto = z.infer<typeof BookMetadataAggregationDtoSchema>;
