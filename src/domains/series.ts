import { BaseService } from './base';
import {
  getSeriesById,
  getSeries,
  updateSeriesMetadata,
  getBooksBySeriesId,
  getCollectionsBySeriesId,
} from '../sdk.gen';
import {
  SeriesDtoSchema,
  PageSeriesDtoSchema,
  SeriesMetadataUpdateDtoSchema,
  PageBookDtoSchema,
  CollectionDtoSchema,
} from '../validation/schemas';
import type {
  SeriesDto,
  PageSeriesDto,
  SeriesMetadataUpdateDto,
  PageBookDto,
  CollectionDto,
} from '../validation/schemas';
import type { SeriesSearch } from '../types.gen';

/**
 * SeriesService - Domain service for series-related operations.
 * Provides methods for retrieving, updating, and managing series.
 */
export class SeriesService extends BaseService {
  /**
   * Retrieves a single series by ID.
   *
   * @param seriesId - The unique identifier of the series
   * @returns The series data
   * @throws ValidationError if response validation fails
   * @throws ApiError if the series is not found or API error occurs
   *
   * @example
   * const series = await seriesService.getById('series-123');
   * console.log(series.metadata.title);
   */
  async getById(seriesId: string): Promise<SeriesDto> {
    return this.safeCall(
      () => getSeriesById({ client: this.client, path: { seriesId } }),
      SeriesDtoSchema
    );
  }

  /**
   * Lists series with optional pagination and filtering.
   *
   * @param options - Pagination and filtering options
   * @param options.page - Page number (0-indexed)
   * @param options.size - Number of items per page
   * @returns Paginated series list
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   *
   * @example
   * const series = await seriesService.list({ page: 0, size: 20 });
   * console.log(`Found ${series.totalElements} series`);
   */
  async list(options?: {
    search?: SeriesSearch;
    page?: number;
    size?: number;
    sort?: Array<string>;
    unpaged?: boolean;
  }): Promise<PageSeriesDto> {
    return this.safeCall(
      () =>
        getSeries({
          client: this.client,
          body: options?.search ?? {},
          query: options
            ? {
                page: options.page,
                size: options.size,
                sort: options.sort,
                unpaged: options.unpaged,
              }
            : undefined,
        }),
      PageSeriesDtoSchema
    );
  }

  /**
   * Updates series metadata.
   *
   * @param seriesId - The unique identifier of the series
   * @param metadata - The metadata to update
   * @throws ValidationError if metadata validation fails
   * @throws ApiError if the series is not found or API error occurs
   *
   * @example
   * await seriesService.updateMetadata('series-123', {
   *   title: 'New Title',
   *   status: 'ONGOING'
   * });
   */
  async updateMetadata(
    seriesId: string,
    metadata: SeriesMetadataUpdateDto
  ): Promise<void> {
    // Validate input metadata
    const validated = SeriesMetadataUpdateDtoSchema.safeParse(metadata);
    if (!validated.success) {
      throw new Error(`Invalid metadata: ${validated.error.message}`);
    }

    await updateSeriesMetadata({
      client: this.client,
      path: { seriesId },
      body: validated.data,
    });
  }

  /**
   * Retrieves all books in a series.
   *
   * @param seriesId - The unique identifier of the series
   * @param options - Pagination and filtering options
   * @param options.page - Page number (0-indexed)
   * @param options.size - Number of items per page
   * @returns Paginated list of books in the series
   * @throws ValidationError if response validation fails
   * @throws ApiError if the series is not found or API error occurs
   *
   * @example
   * const books = await seriesService.getBooks('series-123', { page: 0, size: 50 });
   * console.log(`Series has ${books.totalElements} books`);
   */
  async getBooks(
    seriesId: string,
    options?: {
      page?: number;
      size?: number;
      [key: string]: unknown;
    }
  ): Promise<PageBookDto> {
    return this.safeCall(
      () =>
        getBooksBySeriesId({
          client: this.client,
          path: { seriesId },
          query: options,
        }),
      PageBookDtoSchema
    );
  }

  /**
   * Retrieves all collections that contain this series.
   *
   * @param seriesId - The unique identifier of the series
   * @returns Array of collections containing the series
   * @throws ValidationError if response validation fails
   * @throws ApiError if the series is not found or API error occurs
   *
   * @example
   * const collections = await seriesService.getCollections('series-123');
   * console.log(`Series is in ${collections.length} collections`);
   */
  async getCollections(seriesId: string): Promise<CollectionDto[]> {
    return this.safeCall(
      () =>
        getCollectionsBySeriesId({
          client: this.client,
          path: { seriesId },
        }),
      CollectionDtoSchema.array()
    );
  }
}
