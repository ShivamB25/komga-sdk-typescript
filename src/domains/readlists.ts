import { BaseService } from './base';
import {
  getReadLists,
  getReadListById,
  createReadList,
  updateReadListById,
  deleteReadListById,
} from '../sdk.gen';
import {
  ReadListDtoSchema,
  PageReadListDtoSchema,
  type ReadListDto,
  type PageReadListDto,
  type ReadListCreationDto,
  type ReadListUpdateDto,
} from '../validation/schemas';
import type { GetReadListsData } from '../types.gen';

type ReadListOptions = NonNullable<GetReadListsData['query']>;

/**
 * Service for managing read lists in Komga.
 * Provides methods to list, create, update, and delete read lists.
 */
export class ReadListService extends BaseService {
  /**
   * Get all read lists with optional pagination.
   * @returns Paginated read list
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async getAll(options?: ReadListOptions): Promise<PageReadListDto> {
    return this.safeCall(
      () => getReadLists({ client: this.client, query: options }),
      PageReadListDtoSchema
    );
  }

  /**
   * Get a read list by ID.
   * @param readListId - The read list ID
   * @returns ReadList DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if the read list is not found or API error occurs
   */
  async getById(readListId: string): Promise<ReadListDto> {
    return this.safeCall(
      () => getReadListById({ client: this.client, path: { id: readListId } }),
      ReadListDtoSchema
    );
  }

  /**
   * Create a new read list.
   * @param data - Read list creation data
   * @returns Created read list DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async create(data: ReadListCreationDto): Promise<ReadListDto> {
    return this.safeCall(
      () => createReadList({ client: this.client, body: data }),
      ReadListDtoSchema
    );
  }

  /**
   * Update a read list.
   * @param readListId - The read list ID
   * @param data - Read list update data
   * @throws ApiError if the read list is not found or API error occurs
   */
  async update(readListId: string, data: ReadListUpdateDto): Promise<void> {
    await this.safeVoidCall(() =>
      updateReadListById({
        client: this.client,
        path: { id: readListId },
        body: data,
      })
    );
  }

  /**
   * Delete a read list.
   * @param readListId - The read list ID
   * @throws ApiError if the read list is not found or API error occurs
   */
  async delete(readListId: string): Promise<void> {
    await this.safeVoidCall(() =>
      deleteReadListById({ client: this.client, path: { id: readListId } })
    );
  }
}
