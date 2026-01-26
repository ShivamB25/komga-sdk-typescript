import { BaseService } from './base';
import {
  getBookById,
  getBooks,
  updateBookMetadata,
  deleteBookReadProgress,
  getBookPages,
} from '../sdk.gen';
import {
  BookDtoSchema,
  PageBookDtoSchema,
  BookMetadataUpdateDtoSchema,
  PageDtoSchema,
} from '../validation/schemas';
import type {
  BookDto,
  PageBookDto,
  BookMetadataUpdateDto,
  PageDto,
} from '../validation/schemas';
import type { BookSearch } from '../types.gen';

/**
 * BookService - Domain service for book-related operations.
 * Provides methods for retrieving, updating, and managing books.
 */
export class BookService extends BaseService {
  /**
   * Retrieves a single book by ID.
   *
   * @param bookId - The unique identifier of the book
   * @returns The book data
   * @throws ValidationError if response validation fails
   * @throws ApiError if the book is not found or API error occurs
   *
   * @example
   * const book = await bookService.getById('book-123');
   * console.log(book.metadata.title);
   */
  async getById(bookId: string): Promise<BookDto> {
    return this.safeCall(
      () => getBookById({ client: this.client, path: { bookId } }),
      BookDtoSchema
    );
  }

  /**
   * Lists books with optional pagination and filtering.
   *
   * @param options - Pagination and filtering options
   * @param options.page - Page number (0-indexed)
   * @param options.size - Number of items per page
   * @returns Paginated book list
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   *
   * @example
   * const books = await bookService.list({ page: 0, size: 20 });
   * console.log(`Found ${books.totalElements} books`);
   */
  async list(options?: {
    search?: BookSearch;
    page?: number;
    size?: number;
    sort?: Array<string>;
    unpaged?: boolean;
  }): Promise<PageBookDto> {
    return this.safeCall(
      () =>
        getBooks({
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
      PageBookDtoSchema
    );
  }

  /**
   * Updates book metadata.
   *
   * @param bookId - The unique identifier of the book
   * @param metadata - The metadata to update
   * @throws ValidationError if metadata validation fails
   * @throws ApiError if the book is not found or API error occurs
   *
   * @example
   * await bookService.updateMetadata('book-123', {
   *   title: 'New Title',
   *   summary: 'Updated summary'
   * });
   */
  async updateMetadata(
    bookId: string,
    metadata: BookMetadataUpdateDto
  ): Promise<void> {
    // Validate input metadata
    const validated = BookMetadataUpdateDtoSchema.safeParse(metadata);
    if (!validated.success) {
      throw new Error(`Invalid metadata: ${validated.error.message}`);
    }

    await updateBookMetadata({
      client: this.client,
      path: { bookId },
      body: validated.data,
    });
  }

  /**
   * Deletes the reading progress for a book.
   *
   * @param bookId - The unique identifier of the book
   * @throws ApiError if the book is not found or API error occurs
   *
   * @example
   * await bookService.deleteReadProgress('book-123');
   */
  async deleteReadProgress(bookId: string): Promise<void> {
    await deleteBookReadProgress({
      client: this.client,
      path: { bookId },
    });
  }

  /**
   * Retrieves all pages in a book.
   *
   * @param bookId - The unique identifier of the book
   * @returns Array of page information
   * @throws ValidationError if response validation fails
   * @throws ApiError if the book is not found or API error occurs
   *
   * @example
   * const pages = await bookService.getPages('book-123');
   * console.log(`Book has ${pages.length} pages`);
   */
  async getPages(bookId: string): Promise<PageDto[]> {
    return this.safeCall(
      () => getBookPages({ client: this.client, path: { bookId } }),
      PageDtoSchema.array()
    );
  }

  /**
   * Gets the thumbnail URL for a book.
   * This method constructs the URL without making an API call.
   *
   * @param bookId - The unique identifier of the book
   * @returns The thumbnail URL
   *
   * @example
   * const url = bookService.getThumbnailUrl('book-123');
   * // Returns: /api/v1/books/book-123/thumbnail
   */
  getThumbnailUrl(bookId: string): string {
    return `/api/v1/books/${bookId}/thumbnail`;
  }
}
