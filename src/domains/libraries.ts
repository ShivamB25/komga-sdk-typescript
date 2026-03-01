import { BaseService } from './base';
import {
  getLibraries,
  getLibraryById,
  addLibrary,
  updateLibraryById,
  deleteLibraryById,
  libraryScan,
} from '../sdk.gen';
import {
  LibraryDtoSchema,
  type LibraryDto,
  type LibraryCreationDto,
  type LibraryUpdateDto,
} from '../validation/schemas';

/**
 * Service for managing libraries in Komga
 * Provides methods to list, create, update, delete, and scan libraries
 */
export class LibraryService extends BaseService {
  /**
   * Get all libraries
   * @returns Array of library DTOs
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async getAll(): Promise<LibraryDto[]> {
    return this.safeCall(
      () => getLibraries({ client: this.client }),
      LibraryDtoSchema.array()
    );
  }

  /**
   * Get a library by ID
   * @param libraryId - The library ID
   * @returns Library DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if the library is not found or API error occurs
   */
  async getById(libraryId: string): Promise<LibraryDto> {
    return this.safeCall(
      () => getLibraryById({ client: this.client, path: { libraryId } }),
      LibraryDtoSchema
    );
  }

  /**
   * Create a new library
   * @param data - Library creation data
   * @returns Created library DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async create(data: LibraryCreationDto): Promise<LibraryDto> {
    return this.safeCall(
      () => addLibrary({ client: this.client, body: data }),
      LibraryDtoSchema
    );
  }

  /**
   * Update a library
   * @param libraryId - The library ID
   * @param data - Library update data
   * @throws ApiError if the library is not found or API error occurs
   */
  async update(libraryId: string, data: LibraryUpdateDto): Promise<void> {
    await this.safeVoidCall(() => updateLibraryById({ client: this.client, path: { libraryId }, body: data }));
  }

  /**
   * Delete a library
   * @param libraryId - The library ID
   * @throws ApiError if the library is not found or API error occurs
   */
  async delete(libraryId: string): Promise<void> {
    await this.safeVoidCall(() => deleteLibraryById({ client: this.client, path: { libraryId } }));
  }

  /**
   * Scan a library for new or updated files
   * @param libraryId - The library ID
   * @throws ApiError if the library is not found or API error occurs
   */
  async scan(libraryId: string): Promise<void> {
    await this.safeVoidCall(() => libraryScan({ client: this.client, path: { libraryId } }));
  }
}
