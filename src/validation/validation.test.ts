import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateResponse, safeValidateResponse } from './index';
import { ValidationError } from '../errors';
import {
  AuthorDtoSchema,
  WebLinkDtoSchema,
  PageDtoSchema,
  MediaDtoSchema,
  ReadProgressDtoSchema,
  createPageSchema,
  BookDtoSchema,
  BookMetadataDtoSchema,
  BookMetadataUpdateDtoSchema,
  SeriesDtoSchema,
  SeriesMetadataDtoSchema,
  SeriesMetadataUpdateDtoSchema,
  LibraryDtoSchema,
  LibraryCreationDtoSchema,
  LibraryUpdateDtoSchema,
  CollectionDtoSchema,
  CollectionCreationDtoSchema,
  CollectionUpdateDtoSchema,
  ReadListDtoSchema,
  ReadListCreationDtoSchema,
  ReadListUpdateDtoSchema,
  UserDtoSchema,
  UserCreationDtoSchema,
  UserUpdateDtoSchema,
  ApiKeyDtoSchema,
} from './schemas';

describe('validateResponse', () => {
  const TestSchema = z.object({
    id: z.string(),
    name: z.string(),
  }).strict();

  it('returns validated data for valid input', () => {
    const input = { id: '123', name: 'Test' };
    const result = validateResponse(TestSchema, input);
    expect(result).toEqual(input);
  });

  it('throws ValidationError for invalid input', () => {
    const input = { id: 123, name: 'Test' };

    expect(() => validateResponse(TestSchema, input)).toThrow(ValidationError);
  });

  it('throws ValidationError with correct issues', () => {
    const input = { id: 123, name: 456 };

    try {
      validateResponse(TestSchema, input);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validationError = error as ValidationError;
      expect(validationError.issues.length).toBe(2);
      expect(validationError.input).toEqual(input);
    }
  });

  it('rejects extra fields with strict schema', () => {
    const input = { id: '123', name: 'Test', extra: 'field' };

    expect(() => validateResponse(TestSchema, input)).toThrow(ValidationError);
  });
});

describe('safeValidateResponse', () => {
  const TestSchema = z.object({
    id: z.string(),
    name: z.string(),
  }).strict();

  it('returns success result for valid input', () => {
    const input = { id: '123', name: 'Test' };
    const result = safeValidateResponse(TestSchema, input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('returns error result for invalid input', () => {
    const input = { id: 123, name: 'Test' };
    const result = safeValidateResponse(TestSchema, input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe('Common Schemas', () => {
  describe('AuthorDtoSchema', () => {
    it('validates correct author', () => {
      const author = { name: 'John Doe', role: 'Writer' };
      expect(() => AuthorDtoSchema.parse(author)).not.toThrow();
    });

    it('rejects missing fields', () => {
      expect(() => AuthorDtoSchema.parse({ name: 'John' })).toThrow();
    });

    it('rejects extra fields (strict)', () => {
      expect(() => AuthorDtoSchema.parse({ name: 'John', role: 'Writer', extra: 'field' })).toThrow();
    });
  });

  describe('WebLinkDtoSchema', () => {
    it('validates correct web link', () => {
      const link = { label: 'Website', url: 'https://example.com' };
      expect(() => WebLinkDtoSchema.parse(link)).not.toThrow();
    });
  });

  describe('PageDtoSchema', () => {
    it('validates correct page', () => {
      const page = {
        fileName: 'page001.jpg',
        mediaType: 'image/jpeg',
        number: 1,
        size: '1.2MB',
      };
      expect(() => PageDtoSchema.parse(page)).not.toThrow();
    });

    it('validates page with optional fields', () => {
      const page = {
        fileName: 'page001.jpg',
        mediaType: 'image/jpeg',
        number: 1,
        size: '1.2MB',
        width: 1920,
        height: 1080,
        sizeBytes: 1258291,
      };
      expect(() => PageDtoSchema.parse(page)).not.toThrow();
    });
  });

  describe('MediaDtoSchema', () => {
    it('validates correct media', () => {
      const media = {
        comment: '',
        epubDivinaCompatible: false,
        epubIsKepub: false,
        mediaProfile: 'DIVINA',
        mediaType: 'application/zip',
        pagesCount: 100,
        status: 'READY',
      };
      expect(() => MediaDtoSchema.parse(media)).not.toThrow();
    });
  });

  describe('ReadProgressDtoSchema', () => {
    it('validates correct read progress', () => {
      const progress = {
        completed: false,
        created: '2024-01-01T00:00:00Z',
        deviceId: 'device-123',
        deviceName: 'Web Browser',
        lastModified: '2024-01-02T00:00:00Z',
        page: 50,
        readDate: '2024-01-02T00:00:00Z',
      };
      expect(() => ReadProgressDtoSchema.parse(progress)).not.toThrow();
    });
  });

  describe('createPageSchema', () => {
    it('creates valid pagination schema', () => {
      const ItemSchema = z.object({ id: z.string() }).strict();
      const PageSchema = createPageSchema(ItemSchema);

      const page = {
        content: [{ id: '1' }, { id: '2' }],
        empty: false,
        first: true,
        last: false,
        number: 0,
        numberOfElements: 2,
        size: 20,
        totalElements: 100,
        totalPages: 5,
      };

      expect(() => PageSchema.parse(page)).not.toThrow();
    });

    it('allows empty content', () => {
      const ItemSchema = z.object({ id: z.string() }).strict();
      const PageSchema = createPageSchema(ItemSchema);

      const page = {
        content: [],
        empty: true,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
      };

      expect(() => PageSchema.parse(page)).not.toThrow();
    });
  });
});

describe('Book Schemas', () => {
  describe('BookMetadataDtoSchema', () => {
    it('validates correct book metadata', () => {
      const metadata = {
        authors: [{ name: 'Author', role: 'Writer' }],
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
        title: 'Book Title',
        titleLock: false,
      };
      expect(() => BookMetadataDtoSchema.parse(metadata)).not.toThrow();
    });
  });

  describe('BookMetadataUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        title: 'New Title',
        summary: 'New summary',
      };
      expect(() => BookMetadataUpdateDtoSchema.parse(update)).not.toThrow();
    });

    it('validates empty update', () => {
      expect(() => BookMetadataUpdateDtoSchema.parse({})).not.toThrow();
    });
  });

  describe('BookDtoSchema', () => {
    it('validates correct book', () => {
      const book = {
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
          title: 'Book Title',
          titleLock: false,
        },
        name: 'book.cbz',
        number: 1,
        oneshot: false,
        readProgress: null,
        seriesId: 'series-1',
        seriesTitle: 'Series Title',
        size: '10MB',
        sizeBytes: 10485760,
        url: '/path/to/book.cbz',
      };
      expect(() => BookDtoSchema.parse(book)).not.toThrow();
    });
  });
});

describe('Series Schemas', () => {
  describe('SeriesMetadataDtoSchema', () => {
    it('validates correct series metadata', () => {
      const metadata = {
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
        title: 'Series Title',
        titleLock: false,
        titleSort: 'Series Title',
        titleSortLock: false,
        totalBookCount: null,
        totalBookCountLock: false,
      };
      expect(() => SeriesMetadataDtoSchema.parse(metadata)).not.toThrow();
    });
  });

  describe('SeriesMetadataUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        title: 'New Title',
        status: 'ENDED',
      };
      expect(() => SeriesMetadataUpdateDtoSchema.parse(update)).not.toThrow();
    });
  });
});

describe('Library Schemas', () => {
  describe('LibraryDtoSchema', () => {
    it('validates correct library', () => {
      const library = {
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
        name: 'My Library',
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
      expect(() => LibraryDtoSchema.parse(library)).not.toThrow();
    });
  });

  describe('LibraryCreationDtoSchema', () => {
    it('validates correct creation payload', () => {
      const creation = {
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
        scanInterval: 'DAILY',
        scanOnStartup: true,
        scanPdf: true,
        seriesCover: 'FIRST',
      };
      expect(() => LibraryCreationDtoSchema.parse(creation)).not.toThrow();
    });
  });

  describe('LibraryUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        name: 'Updated Name',
        scanInterval: 'WEEKLY',
      };
      expect(() => LibraryUpdateDtoSchema.parse(update)).not.toThrow();
    });
  });
});

describe('Collection Schemas', () => {
  describe('CollectionDtoSchema', () => {
    it('validates correct collection', () => {
      const collection = {
        createdDate: '2024-01-01T00:00:00Z',
        filtered: false,
        id: 'col-123',
        lastModifiedDate: '2024-01-01T00:00:00Z',
        name: 'My Collection',
        ordered: true,
        seriesIds: ['series-1', 'series-2'],
      };
      expect(() => CollectionDtoSchema.parse(collection)).not.toThrow();
    });
  });

  describe('CollectionCreationDtoSchema', () => {
    it('validates correct creation payload', () => {
      const creation = {
        name: 'New Collection',
        ordered: true,
        seriesIds: ['series-1'],
      };
      expect(() => CollectionCreationDtoSchema.parse(creation)).not.toThrow();
    });
  });

  describe('CollectionUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        name: 'Updated Collection',
      };
      expect(() => CollectionUpdateDtoSchema.parse(update)).not.toThrow();
    });
  });
});

describe('ReadList Schemas', () => {
  describe('ReadListDtoSchema', () => {
    it('validates correct read list', () => {
      const readList = {
        bookIds: ['book-1', 'book-2'],
        createdDate: '2024-01-01T00:00:00Z',
        filtered: false,
        id: 'rl-123',
        lastModifiedDate: '2024-01-01T00:00:00Z',
        name: 'My Read List',
        ordered: true,
        summary: 'A reading list',
      };
      expect(() => ReadListDtoSchema.parse(readList)).not.toThrow();
    });
  });

  describe('ReadListCreationDtoSchema', () => {
    it('validates correct creation payload', () => {
      const creation = {
        bookIds: ['book-1'],
        name: 'New Read List',
        ordered: true,
        summary: 'A new reading list',
      };
      expect(() => ReadListCreationDtoSchema.parse(creation)).not.toThrow();
    });
  });

  describe('ReadListUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        name: 'Updated Read List',
        summary: 'Updated summary',
      };
      expect(() => ReadListUpdateDtoSchema.parse(update)).not.toThrow();
    });
  });
});

describe('User Schemas', () => {
  describe('UserDtoSchema', () => {
    it('validates correct user', () => {
      const user = {
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        sharedAllLibraries: true,
        sharedLibrariesIds: [],
        labelsAllow: [],
        labelsExclude: [],
      };
      expect(() => UserDtoSchema.parse(user)).not.toThrow();
    });

    it('validates user with age restriction', () => {
      const user = {
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        sharedAllLibraries: false,
        sharedLibrariesIds: ['lib-1'],
        labelsAllow: [],
        labelsExclude: [],
        ageRestriction: {
          age: 18,
          restriction: 'ALLOW_ONLY',
        },
      };
      expect(() => UserDtoSchema.parse(user)).not.toThrow();
    });
  });

  describe('UserCreationDtoSchema', () => {
    it('validates correct creation payload', () => {
      const creation = {
        email: 'newuser@example.com',
        password: 'password123',
        roles: ['USER'],
      };
      expect(() => UserCreationDtoSchema.parse(creation)).not.toThrow();
    });
  });

  describe('UserUpdateDtoSchema', () => {
    it('validates partial update', () => {
      const update = {
        roles: ['ADMIN'],
      };
      expect(() => UserUpdateDtoSchema.parse(update)).not.toThrow();
    });
  });

  describe('ApiKeyDtoSchema', () => {
    it('validates correct API key', () => {
      const apiKey = {
        id: 'key-123',
        userId: 'user-123',
        key: 'abc123def456',
        comment: 'Test key',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-01T00:00:00Z',
      };
      expect(() => ApiKeyDtoSchema.parse(apiKey)).not.toThrow();
    });
  });
});
