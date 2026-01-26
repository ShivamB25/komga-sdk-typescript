import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseService } from './base';
import { BookService } from './books';
import { SeriesService } from './series';
import { LibraryService } from './libraries';
import { ValidationError } from '../errors';
import { z } from 'zod';

type MockClient = {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const createMockClient = (): MockClient => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
});

describe('BaseService', () => {
  class TestService extends BaseService {
    async testSafeCall<T>(
      apiCall: () => Promise<{ data: T; error: undefined } | { data: undefined; error: unknown }>,
      schema: z.ZodSchema
    ): Promise<T> {
      return this.safeCall(apiCall, schema);
    }
  }

  it('validates response and returns data on success', async () => {
    const mockClient = createMockClient();
    const service = new TestService(mockClient as any);

    const schema = z.object({ id: z.string() }).strict();
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { id: 'test-123' },
      error: undefined,
    });

    const result = await service.testSafeCall(mockApiCall, schema);

    expect(result).toEqual({ id: 'test-123' });
  });

  it('throws error when API call returns error', async () => {
    const mockClient = createMockClient();
    const service = new TestService(mockClient as any);

    const schema = z.object({ id: z.string() }).strict();
    const mockApiCall = vi.fn().mockResolvedValue({
      data: undefined,
      error: { message: 'Not found' },
    });

    await expect(service.testSafeCall(mockApiCall, schema)).rejects.toThrow('API error');
  });

  it('throws ValidationError when response fails schema validation', async () => {
    const mockClient = createMockClient();
    const service = new TestService(mockClient as any);

    const schema = z.object({ id: z.string() }).strict();
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { id: 123 },
      error: undefined,
    });

    await expect(service.testSafeCall(mockApiCall, schema)).rejects.toThrow(ValidationError);
  });
});

describe('BookService', () => {
  let mockClient: MockClient;
  let bookService: BookService;

  const mockBook = {
    created: '2024-01-01T00:00:00Z',
    deleted: false,
    fileHash: 'abc123',
    fileLastModified: '2024-01-01T00:00:00Z',
    id: 'book-123',
    lastModified: '2024-01-01T00:00:00Z',
    libraryId: 'lib-1',
    media: {
      comment: '',
      epubDivinaCompatible: false,
      epubIsKepub: false,
      mediaProfile: 'DIVINA',
      mediaType: 'application/zip',
      pagesCount: 100,
      status: 'READY',
    },
    metadata: {
      authors: [],
      authorsLock: false,
      created: '2024-01-01T00:00:00Z',
      isbn: '',
      isbnLock: false,
      lastModified: '2024-01-01T00:00:00Z',
      links: [],
      linksLock: false,
      number: '1',
      numberLock: false,
      numberSort: 1,
      numberSortLock: false,
      releaseDate: null,
      releaseDateLock: false,
      summary: '',
      summaryLock: false,
      tags: [],
      tagsLock: false,
      title: 'Test Book',
      titleLock: false,
    },
    name: 'book.cbz',
    number: 1,
    oneshot: false,
    readProgress: null,
    seriesId: 'series-1',
    seriesTitle: 'Test Series',
    size: '10MB',
    sizeBytes: 10485760,
    url: '/path/to/book.cbz',
  };

  beforeEach(() => {
    mockClient = createMockClient();
    bookService = new BookService(mockClient as any);

    vi.mock('../sdk.gen', () => ({
      getBookById: vi.fn(),
      getBooks: vi.fn(),
      updateBookMetadata: vi.fn(),
      deleteBookReadProgress: vi.fn(),
      getBookPages: vi.fn(),
      getSeriesById: vi.fn(),
      getSeries: vi.fn(),
      updateSeriesMetadata: vi.fn(),
      getBooksBySeriesId: vi.fn(),
      getCollectionsBySeriesId: vi.fn(),
      getLibraries: vi.fn(),
      getLibraryById: vi.fn(),
      addLibrary: vi.fn(),
      updateLibraryById: vi.fn(),
      deleteLibraryById: vi.fn(),
      libraryScan: vi.fn(),
    }));
  });

  describe('getById', () => {
    it('returns a book by ID', async () => {
      const { getBookById } = await import('../sdk.gen');
      vi.mocked(getBookById).mockResolvedValue({
        data: mockBook,
        error: undefined,
      } as any);

      const result = await bookService.getById('book-123');

      expect(getBookById).toHaveBeenCalledWith({
        client: mockClient,
        path: { bookId: 'book-123' },
      });
      expect(result.id).toBe('book-123');
    });
  });

  describe('list', () => {
    it('lists books with pagination', async () => {
      const { getBooks } = await import('../sdk.gen');
      vi.mocked(getBooks).mockResolvedValue({
        data: {
          content: [mockBook],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          size: 20,
        },
        error: undefined,
      } as any);

      const result = await bookService.list({ page: 0, size: 20 });

      expect(getBooks).toHaveBeenCalledWith({
        client: mockClient,
        body: {},
        query: {
          page: 0,
          size: 20,
          sort: undefined,
          unpaged: undefined,
        },
      });
      expect(result.content).toHaveLength(1);
    });

    it('lists books without options', async () => {
      const { getBooks } = await import('../sdk.gen');
      vi.mocked(getBooks).mockResolvedValue({
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
        },
        error: undefined,
      } as any);

      await bookService.list();

      expect(getBooks).toHaveBeenCalledWith({
        client: mockClient,
        body: {},
        query: undefined,
      });
    });
  });

  describe('updateMetadata', () => {
    it('updates book metadata', async () => {
      const { updateBookMetadata } = await import('../sdk.gen');
      vi.mocked(updateBookMetadata).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await bookService.updateMetadata('book-123', { title: 'New Title' });

      expect(updateBookMetadata).toHaveBeenCalledWith({
        client: mockClient,
        path: { bookId: 'book-123' },
        body: { title: 'New Title' },
      });
    });

    it('throws error for invalid metadata', async () => {
      await expect(
        bookService.updateMetadata('book-123', { title: 123 as any })
      ).rejects.toThrow('Invalid metadata');
    });
  });

  describe('deleteReadProgress', () => {
    it('deletes read progress', async () => {
      const { deleteBookReadProgress } = await import('../sdk.gen');
      vi.mocked(deleteBookReadProgress).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await bookService.deleteReadProgress('book-123');

      expect(deleteBookReadProgress).toHaveBeenCalledWith({
        client: mockClient,
        path: { bookId: 'book-123' },
      });
    });
  });

  describe('getPages', () => {
    it('returns book pages', async () => {
      const { getBookPages } = await import('../sdk.gen');
      vi.mocked(getBookPages).mockResolvedValue({
        data: [
          { fileName: 'page1.jpg', mediaType: 'image/jpeg', number: 1, size: '1MB' },
          { fileName: 'page2.jpg', mediaType: 'image/jpeg', number: 2, size: '1MB' },
        ],
        error: undefined,
      } as any);

      const result = await bookService.getPages('book-123');

      expect(result).toHaveLength(2);
      expect(result[0].number).toBe(1);
    });
  });

  describe('getThumbnailUrl', () => {
    it('returns correct thumbnail URL', () => {
      const url = bookService.getThumbnailUrl('book-123');
      expect(url).toBe('/api/v1/books/book-123/thumbnail');
    });
  });
});

describe('SeriesService', () => {
  let mockClient: MockClient;
  let seriesService: SeriesService;

  const mockSeries = {
    booksCount: 10,
    booksInProgressCount: 2,
    booksReadCount: 5,
    booksUnreadCount: 3,
    created: '2024-01-01T00:00:00Z',
    deleted: false,
    fileLastModified: '2024-01-01T00:00:00Z',
    id: 'series-123',
    lastModified: '2024-01-01T00:00:00Z',
    libraryId: 'lib-1',
    metadata: {
      ageRating: null,
      ageRatingLock: false,
      alternateTitles: [],
      alternateTitlesLock: false,
      created: '2024-01-01T00:00:00Z',
      genres: [],
      genresLock: false,
      language: '',
      languageLock: false,
      lastModified: '2024-01-01T00:00:00Z',
      links: [],
      linksLock: false,
      publisher: '',
      publisherLock: false,
      readingDirection: null,
      readingDirectionLock: false,
      sharingLabels: [],
      sharingLabelsLock: false,
      status: 'ONGOING',
      statusLock: false,
      summary: '',
      summaryLock: false,
      tags: [],
      tagsLock: false,
      title: 'Test Series',
      titleLock: false,
      titleSort: 'Test Series',
      titleSortLock: false,
      totalBookCount: null,
      totalBookCountLock: false,
    },
    name: 'Test Series',
    oneshot: false,
    url: '/path/to/series',
    booksMetadata: {
      authors: [],
      created: '2024-01-01T00:00:00Z',
      lastModified: '2024-01-01T00:00:00Z',
      releaseDate: null,
      summary: '',
      summaryNumber: '',
      tags: [],
    },
  };

  beforeEach(() => {
    mockClient = createMockClient();
    seriesService = new SeriesService(mockClient as any);
  });

  describe('getById', () => {
    it('returns a series by ID', async () => {
      const { getSeriesById } = await import('../sdk.gen');
      vi.mocked(getSeriesById).mockResolvedValue({
        data: mockSeries,
        error: undefined,
      } as any);

      const result = await seriesService.getById('series-123');

      expect(getSeriesById).toHaveBeenCalledWith({
        client: mockClient,
        path: { seriesId: 'series-123' },
      });
      expect(result.id).toBe('series-123');
    });
  });

  describe('list', () => {
    it('lists series with pagination', async () => {
      const { getSeries } = await import('../sdk.gen');
      vi.mocked(getSeries).mockResolvedValue({
        data: {
          content: [mockSeries],
          totalElements: 1,
          totalPages: 1,
        },
        error: undefined,
      } as any);

      const result = await seriesService.list({ page: 0, size: 20 });

      expect(getSeries).toHaveBeenCalledWith({
        client: mockClient,
        body: {},
        query: {
          page: 0,
          size: 20,
          sort: undefined,
          unpaged: undefined,
        },
      });
      expect(result.content).toHaveLength(1);
    });
  });

  describe('updateMetadata', () => {
    it('updates series metadata', async () => {
      const { updateSeriesMetadata } = await import('../sdk.gen');
      vi.mocked(updateSeriesMetadata).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await seriesService.updateMetadata('series-123', { title: 'New Title' });

      expect(updateSeriesMetadata).toHaveBeenCalledWith({
        client: mockClient,
        path: { seriesId: 'series-123' },
        body: { title: 'New Title' },
      });
    });
  });

  describe('getBooks', () => {
    it('returns books in series', async () => {
      const { getBooksBySeriesId } = await import('../sdk.gen');
      vi.mocked(getBooksBySeriesId).mockResolvedValue({
        data: {
          content: [],
          totalElements: 0,
        },
        error: undefined,
      } as any);

      await seriesService.getBooks('series-123', { page: 0, size: 50 });

      expect(getBooksBySeriesId).toHaveBeenCalledWith({
        client: mockClient,
        path: { seriesId: 'series-123' },
        query: { page: 0, size: 50 },
      });
    });
  });

  describe('getCollections', () => {
    it('returns collections containing series', async () => {
      const { getCollectionsBySeriesId } = await import('../sdk.gen');
      vi.mocked(getCollectionsBySeriesId).mockResolvedValue({
        data: [
          {
            createdDate: '2024-01-01T00:00:00Z',
            filtered: false,
            id: 'col-1',
            lastModifiedDate: '2024-01-01T00:00:00Z',
            name: 'Collection 1',
            ordered: true,
            seriesIds: ['series-123'],
          },
        ],
        error: undefined,
      } as any);

      const result = await seriesService.getCollections('series-123');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('col-1');
    });
  });
});

describe('LibraryService', () => {
  let mockClient: MockClient;
  let libraryService: LibraryService;

  const mockLibrary = {
    analyzeDimensions: true,
    convertToCbz: false,
    emptyTrashAfterScan: false,
    hashFiles: true,
    hashKoreader: false,
    hashPages: false,
    id: 'lib-123',
    importBarcodeIsbn: false,
    importComicInfoBook: true,
    importComicInfoCollection: true,
    importComicInfoReadList: true,
    importComicInfoSeries: true,
    importComicInfoSeriesAppendVolume: false,
    importEpubBook: true,
    importEpubSeries: true,
    importLocalArtwork: true,
    importMylarSeries: false,
    name: 'Test Library',
    repairExtensions: false,
    root: '/path/to/library',
    scanCbx: true,
    scanDirectoryExclusions: [],
    scanEpub: true,
    scanForceModifiedTime: false,
    scanInterval: 'DAILY',
    scanOnStartup: true,
    scanPdf: true,
    seriesCover: 'FIRST',
    unavailable: false,
  };

  beforeEach(() => {
    mockClient = createMockClient();
    libraryService = new LibraryService(mockClient as any);
  });

  describe('getAll', () => {
    it('returns all libraries', async () => {
      const { getLibraries } = await import('../sdk.gen');
      vi.mocked(getLibraries).mockResolvedValue({
        data: [mockLibrary],
        error: undefined,
      } as any);

      const result = await libraryService.getAll();

      expect(getLibraries).toHaveBeenCalledWith({ client: mockClient });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('lib-123');
    });

    it('throws error when no data returned', async () => {
      const { getLibraries } = await import('../sdk.gen');
      vi.mocked(getLibraries).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await expect(libraryService.getAll()).rejects.toThrow('No data returned');
    });
  });

  describe('getById', () => {
    it('returns a library by ID', async () => {
      const { getLibraryById } = await import('../sdk.gen');
      vi.mocked(getLibraryById).mockResolvedValue({
        data: mockLibrary,
        error: undefined,
      } as any);

      const result = await libraryService.getById('lib-123');

      expect(getLibraryById).toHaveBeenCalledWith({
        client: mockClient,
        path: { libraryId: 'lib-123' },
      });
      expect(result.id).toBe('lib-123');
    });
  });

  describe('create', () => {
    it('creates a new library', async () => {
      const { addLibrary } = await import('../sdk.gen');
      vi.mocked(addLibrary).mockResolvedValue({
        data: mockLibrary,
        error: undefined,
      } as any);

      const createData = {
        analyzeDimensions: true,
        convertToCbz: false,
        emptyTrashAfterScan: false,
        hashFiles: true,
        hashKoreader: false,
        hashPages: false,
        importBarcodeIsbn: false,
        importComicInfoBook: true,
        importComicInfoCollection: true,
        importComicInfoReadList: true,
        importComicInfoSeries: true,
        importComicInfoSeriesAppendVolume: false,
        importEpubBook: true,
        importEpubSeries: true,
        importLocalArtwork: true,
        importMylarSeries: false,
        name: 'New Library',
        repairExtensions: false,
        root: '/path/to/new/library',
        scanCbx: true,
        scanDirectoryExclusions: [],
        scanEpub: true,
        scanForceModifiedTime: false,
        scanInterval: 'DAILY' as const,
        scanOnStartup: true,
        scanPdf: true,
        seriesCover: 'FIRST' as const,
      };

      await libraryService.create(createData);

      expect(addLibrary).toHaveBeenCalledWith({
        client: mockClient,
        body: createData,
      });
    });
  });

  describe('update', () => {
    it('updates a library', async () => {
      const { updateLibraryById } = await import('../sdk.gen');
      vi.mocked(updateLibraryById).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await libraryService.update('lib-123', { name: 'Updated Name' });

      expect(updateLibraryById).toHaveBeenCalledWith({
        client: mockClient,
        path: { libraryId: 'lib-123' },
        body: { name: 'Updated Name' },
      });
    });
  });

  describe('delete', () => {
    it('deletes a library', async () => {
      const { deleteLibraryById } = await import('../sdk.gen');
      vi.mocked(deleteLibraryById).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await libraryService.delete('lib-123');

      expect(deleteLibraryById).toHaveBeenCalledWith({
        client: mockClient,
        path: { libraryId: 'lib-123' },
      });
    });
  });

  describe('scan', () => {
    it('triggers a library scan', async () => {
      const { libraryScan } = await import('../sdk.gen');
      vi.mocked(libraryScan).mockResolvedValue({
        data: undefined,
        error: undefined,
      } as any);

      await libraryService.scan('lib-123');

      expect(libraryScan).toHaveBeenCalledWith({
        client: mockClient,
        path: { libraryId: 'lib-123' },
      });
    });
  });
});
