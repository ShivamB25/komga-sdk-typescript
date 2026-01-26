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
   */
  async getAll(): Promise<LibraryDto[]> {
    const result = await getLibraries({ client: this.client });
    if (result.error !== undefined) throw new Error(String(result.error));
    if (!result.data) throw new Error('No data returned');
    return result.data;
  }

  /**
   * Get a library by ID
   * @param libraryId - The library ID
   * @returns Library DTO
   */
  async getById(libraryId: string): Promise<LibraryDto> {
    const result = await getLibraryById({ client: this.client, path: { libraryId } });
    if (result.error !== undefined) throw new Error(String(result.error));
    if (!result.data) throw new Error('No data returned');
    return result.data;
  }

  /**
   * Create a new library
   * @param data - Library creation data
   * @returns Created library DTO
   */
  async create(data: LibraryCreationDto): Promise<LibraryDto> {
    const result = await addLibrary({ client: this.client, body: data });
    if (result.error !== undefined) throw new Error(String(result.error));
    if (!result.data) throw new Error('No data returned');
    return result.data;
  }

  /**
   * Update a library
   * @param libraryId - The library ID
   * @param data - Library update data
   */
  async update(libraryId: string, data: LibraryUpdateDto): Promise<void> {
    const result = await updateLibraryById({ client: this.client, path: { libraryId }, body: data });
    if (result.error !== undefined) throw new Error(String(result.error));
  }

  /**
   * Delete a library
   * @param libraryId - The library ID
   */
  async delete(libraryId: string): Promise<void> {
    const result = await deleteLibraryById({ client: this.client, path: { libraryId } });
    if (result.error !== undefined) throw new Error(String(result.error));
  }

  /**
   * Scan a library for new or updated files
   * @param libraryId - The library ID
   */
  async scan(libraryId: string): Promise<void> {
    const result = await libraryScan({ client: this.client, path: { libraryId } });
    if (result.error !== undefined) throw new Error(String(result.error));
  }
}
