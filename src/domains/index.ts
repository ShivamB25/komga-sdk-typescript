/**
 * Domain Services
 *
 * High-level services for managing Komga entities.
 * Each service extends BaseService and provides domain-specific operations.
 *
 * @example
 * import { BookService, SeriesService } from './domains';
 * import { createClient } from './client';
 *
 * const client = createClient({
 *   baseUrl: 'http://localhost:25600',
 *   auth: { username: 'admin', password: 'password' }
 * });
 *
 * const bookService = new BookService(client);
 * const seriesService = new SeriesService(client);
 *
 * const book = await bookService.getById('book-123');
 * const series = await seriesService.getById('series-456');
 */

export { BaseService } from './base';
export { BookService } from './books';
export { SeriesService } from './series';
