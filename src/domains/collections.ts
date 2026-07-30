import { BaseService } from './base';
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollectionById,
  deleteCollectionById,
} from '../sdk.gen';
import {
  CollectionDtoSchema,
  PageCollectionDtoSchema,
  type CollectionDto,
  type PageCollectionDto,
  type CollectionCreationDto,
  type CollectionUpdateDto,
} from '../validation/schemas';
import type { GetCollectionsData } from '../types.gen';

type CollectionListOptions = NonNullable<GetCollectionsData['query']>;

/**
 * Service for managing collections in Komga.
 * Provides methods to list, create, update, and delete collections.
 */
export class CollectionService extends BaseService {
  /**
   * Get all collections with optional pagination.
   * @returns Paginated collection list
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async getAll(options?: CollectionListOptions): Promise<PageCollectionDto> {
    return this.safeCall(
      () => getCollections({ client: this.client, query: options }),
      PageCollectionDtoSchema
    );
  }

  /**
   * Get a collection by ID.
   * @param collectionId - The collection ID
   * @returns Collection DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if the collection is not found or API error occurs
   */
  async getById(collectionId: string): Promise<CollectionDto> {
    return this.safeCall(
      () => getCollectionById({ client: this.client, path: { id: collectionId } }),
      CollectionDtoSchema
    );
  }

  /**
   * Create a new collection.
   * @param data - Collection creation data
   * @returns Created collection DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async create(data: CollectionCreationDto): Promise<CollectionDto> {
    return this.safeCall(
      () => createCollection({ client: this.client, body: data }),
      CollectionDtoSchema
    );
  }

  /**
   * Update a collection.
   * @param collectionId - The collection ID
   * @param data - Collection update data
   * @throws ApiError if the collection is not found or API error occurs
   */
  async update(collectionId: string, data: CollectionUpdateDto): Promise<void> {
    await this.safeVoidCall(() =>
      updateCollectionById({
        client: this.client,
        path: { id: collectionId },
        body: data,
      })
    );
  }

  /**
   * Delete a collection.
   * @param collectionId - The collection ID
   * @throws ApiError if the collection is not found or API error occurs
   */
  async delete(collectionId: string): Promise<void> {
    await this.safeVoidCall(() =>
      deleteCollectionById({ client: this.client, path: { id: collectionId } })
    );
  }
}
