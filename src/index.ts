/**
 * Public SDK entrypoint.
 *
 * Generated API operations and DTOs are re-exported alongside the handwritten
 * client helpers, domain services, errors, validation, and interceptors.
 */
export * from './client';
export { client } from './client.gen';
export * from './domains';
export * from './errors';
export * from './http';
export * from './validation';
export * from './interceptors';
export * from './sdk.gen';
export * from './types.gen';

// Explicit generated DTO exports resolve same-name schema aliases re-exported
// by validation without making either public surface ambiguous.
export type {
  AuthorDto,
  AuthorUpdateDto,
  WebLinkDto,
  ClientOptions,
  WebLinkUpdateDto,
  AlternateTitleDto,
  AlternateTitleUpdateDto,
  AgeRestrictionDto,
  AgeRestrictionUpdateDto,
  SortObject,
  PageableObject,
  MediaDto,
  ReadProgressDto,
  ReadProgressUpdateDto,
  PathDto,
  PageDto,
  GroupCountDto,
  Violation,
  ValidationErrorResponse,
  ClientSettingDto,
  ClientSettingGlobalUpdateDto,
  ClientSettingUserUpdateDto,
  PasswordUpdateDto,
  DirectoryRequestDto,
  DirectoryListingDto,
  ScanRequestDto,
  ClaimStatus,
  ApiKeyRequestDto,
  ApiKeyDto,
  OAuth2ClientDto,
  AuthenticationActivityDto,
  HistoricalEventDto,
  ReleaseDto,
  ItemDto,
  JsonFeedDto,
  Location,
  Text,
  R2Device,
  R2Locator,
  R2Progression,
  R2Positions,
  TachiyomiReadProgressDto,
  TachiyomiReadProgressUpdateDto,
  TachiyomiReadProgressV2Dto,
  TachiyomiReadProgressUpdateV2Dto,
  SettingMultiSourceString,
  SettingMultiSourceInteger,
  SettingsDto,
  SettingsUpdateDto,
  SharedLibrariesUpdateDto,
  ThumbnailBookDto,
  ThumbnailSeriesDto,
  ThumbnailSeriesCollectionDto,
  ThumbnailReadListDto,
  PageHashCreationDto,
  PageHashKnownDto,
  PageHashUnknownDto,
  PageHashMatchDto,
  ReadListMatchDto,
  ReadListRequestBookDto,
  ReadListRequestBookMatchBookDto,
  ReadListRequestBookMatchSeriesDto,
  ReadListRequestBookMatchDto,
  ReadListRequestBookMatchesDto,
  ReadListRequestMatchDto,
  WpLinkDto,
  WpContributorDto,
  WpBelongsToDto,
  WpMetadataDto,
  WpPublicationDto,
  TransientBookDto,
  BookMetadataAggregationDto,
  BookMetadataDto,
  BookDto,
  PageBookDto,
  BookMetadataUpdateDto,
  SeriesMetadataDto,
  SeriesDto,
  PageSeriesDto,
  SeriesMetadataUpdateDto,
  LibraryCreationDto,
  LibraryDto,
  LibraryUpdateDto,
  CollectionDto,
  PageCollectionDto,
  CollectionCreationDto,
  CollectionUpdateDto,
  ReadListDto,
  PageReadListDto,
  ReadListCreationDto,
  ReadListUpdateDto,
  UserDto,
  UserCreationDto,
  UserUpdateDto
} from './types.gen';

// sdk.gen.ts and client/types.gen.ts both define Options; retain the SDK
// operation options as the root name and keep the client barrel reachable.
export type { Options } from './sdk.gen';
