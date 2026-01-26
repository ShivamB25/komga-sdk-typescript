import { z } from 'zod';

/**
 * Scan interval enum for library scanning
 */
const ScanIntervalEnum = z.enum(['DISABLED', 'HOURLY', 'EVERY_6H', 'EVERY_12H', 'DAILY', 'WEEKLY']);

/**
 * Series cover selection enum
 */
const SeriesCoverEnum = z.enum(['FIRST', 'FIRST_UNREAD_OR_FIRST', 'FIRST_UNREAD_OR_LAST', 'LAST']);

/**
 * LibraryCreationDto schema - for creating new libraries
 */
export const LibraryCreationDtoSchema = z.object({
  analyzeDimensions: z.boolean(),
  convertToCbz: z.boolean(),
  emptyTrashAfterScan: z.boolean(),
  hashFiles: z.boolean(),
  hashKoreader: z.boolean(),
  hashPages: z.boolean(),
  importBarcodeIsbn: z.boolean(),
  importComicInfoBook: z.boolean(),
  importComicInfoCollection: z.boolean(),
  importComicInfoReadList: z.boolean(),
  importComicInfoSeries: z.boolean(),
  importComicInfoSeriesAppendVolume: z.boolean(),
  importEpubBook: z.boolean(),
  importEpubSeries: z.boolean(),
  importLocalArtwork: z.boolean(),
  importMylarSeries: z.boolean(),
  name: z.string(),
  oneshotsDirectory: z.string().optional(),
  repairExtensions: z.boolean(),
  root: z.string(),
  scanCbx: z.boolean(),
  scanDirectoryExclusions: z.array(z.string()),
  scanEpub: z.boolean(),
  scanForceModifiedTime: z.boolean(),
  scanInterval: ScanIntervalEnum,
  scanOnStartup: z.boolean(),
  scanPdf: z.boolean(),
  seriesCover: SeriesCoverEnum,
});

export type LibraryCreationDto = z.infer<typeof LibraryCreationDtoSchema>;

/**
 * LibraryDto schema - main library entity
 */
export const LibraryDtoSchema = z.object({
  analyzeDimensions: z.boolean(),
  convertToCbz: z.boolean(),
  emptyTrashAfterScan: z.boolean(),
  hashFiles: z.boolean(),
  hashKoreader: z.boolean(),
  hashPages: z.boolean(),
  id: z.string(),
  importBarcodeIsbn: z.boolean(),
  importComicInfoBook: z.boolean(),
  importComicInfoCollection: z.boolean(),
  importComicInfoReadList: z.boolean(),
  importComicInfoSeries: z.boolean(),
  importComicInfoSeriesAppendVolume: z.boolean(),
  importEpubBook: z.boolean(),
  importEpubSeries: z.boolean(),
  importLocalArtwork: z.boolean(),
  importMylarSeries: z.boolean(),
  name: z.string(),
  oneshotsDirectory: z.string().optional(),
  repairExtensions: z.boolean(),
  root: z.string(),
  scanCbx: z.boolean(),
  scanDirectoryExclusions: z.array(z.string()),
  scanEpub: z.boolean(),
  scanForceModifiedTime: z.boolean(),
  scanInterval: ScanIntervalEnum,
  scanOnStartup: z.boolean(),
  scanPdf: z.boolean(),
  seriesCover: SeriesCoverEnum,
  unavailable: z.boolean(),
});

export type LibraryDto = z.infer<typeof LibraryDtoSchema>;

/**
 * LibraryUpdateDto schema - for updating libraries (all fields optional)
 */
export const LibraryUpdateDtoSchema = z.object({
  analyzeDimensions: z.boolean().optional(),
  convertToCbz: z.boolean().optional(),
  emptyTrashAfterScan: z.boolean().optional(),
  hashFiles: z.boolean().optional(),
  hashKoreader: z.boolean().optional(),
  hashPages: z.boolean().optional(),
  importBarcodeIsbn: z.boolean().optional(),
  importComicInfoBook: z.boolean().optional(),
  importComicInfoCollection: z.boolean().optional(),
  importComicInfoReadList: z.boolean().optional(),
  importComicInfoSeries: z.boolean().optional(),
  importComicInfoSeriesAppendVolume: z.boolean().optional(),
  importEpubBook: z.boolean().optional(),
  importEpubSeries: z.boolean().optional(),
  importLocalArtwork: z.boolean().optional(),
  importMylarSeries: z.boolean().optional(),
  name: z.string().optional(),
  oneshotsDirectory: z.string().optional(),
  repairExtensions: z.boolean().optional(),
  root: z.string().optional(),
  scanCbx: z.boolean().optional(),
  scanDirectoryExclusions: z.array(z.string()).optional(),
  scanEpub: z.boolean().optional(),
  scanForceModifiedTime: z.boolean().optional(),
  scanInterval: ScanIntervalEnum.optional(),
  scanOnStartup: z.boolean().optional(),
  scanPdf: z.boolean().optional(),
  seriesCover: SeriesCoverEnum.optional(),
});

export type LibraryUpdateDto = z.infer<typeof LibraryUpdateDtoSchema>;
