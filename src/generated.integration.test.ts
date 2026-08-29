import { describe, expect, it } from 'vitest';
import { createKomgaClient } from './client';
import {
  getActuatorInfo,
  getAuthors,
  getAuthorsNames,
  getBookById,
  getBooks,
  getBooksBySeriesId,
  getFontFile,
  getGenres,
  getSeriesById,
  getTags,
  markAnnouncementsRead,
} from './generated/sdk.gen';
import type { BookSearch, PageString, ValidationErrorResponse } from './generated/types.gen';

function captureFetch(response: Response, requests: Request[]): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init);
    requests.push(request);
    return response;
  };
}

describe('generated operation integration', () => {

  it('parses actuator info as a JSON map', async () => {
    const requests: Request[] = [];
    const responseBody = { version: '1.26.3', build: { commit: 'test' } };
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(
        new Response(JSON.stringify(responseBody), {
          headers: { 'content-type': 'application/json' },
        }),
        requests,
      ),
    });

    const result = await getActuatorInfo({ client });
    const data: Record<string, unknown> | undefined = result.data;

    expect(data).toEqual(responseBody);
    expect(requests).toHaveLength(1);
    expect(requests[0]?.method).toBe('GET');
    expect(requests[0]?.url).toBe('https://komga.example.test/actuator/info');
  });

  it('serializes a GET path and query exactly and sends the configured API key', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      auth: { type: 'apiKey', key: 'api-key-value' },
      fetch: captureFetch(new Response('{}', { headers: { 'content-type': 'application/json' } }), requests),
    });

    const result = await getBooksBySeriesId(
      {
        seriesId: 'series/42',
        media_status: ['READY', 'ERROR'],
        read_status: ['READ'],
        tag: ['tag one', 'tag&two'],
        deleted: false,
        unpaged: false,
        page: 2,
        size: 25,
        sort: ['title,asc'],
        author: ['A B'],
      },
      { client },
    );

    expect(result.error).toBeUndefined();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.method).toBe('GET');
    expect(requests[0]?.url).toBe(
      'https://komga.example.test/api/v1/series/series%2F42/books?media_status=READY&media_status=ERROR&read_status=READ&tag=tag%20one&tag=tag%26two&deleted=false&unpaged=false&page=2&size=25&sort=title%2Casc&author=A%20B',
    );
    expect(requests[0]?.headers.get('X-API-Key')).toBe('api-key-value');
  });

  it('serializes a paginated POST body and propagates Basic auth', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      auth: { type: 'basic', username: 'reader', password: 'secret' },
      fetch: captureFetch(new Response('{}', { headers: { 'content-type': 'application/json' } }), requests),
    });
    const bookSearch: BookSearch = { fullTextSearch: 'space opera' };

    const result = await getBooks(
      { page: 4, size: 50, sort: ['title,desc'], bookSearch },
      { client },
    );

    expect(result.error).toBeUndefined();
    expect(requests).toHaveLength(1);
    const request = requests[0];
    expect(request?.method).toBe('POST');
    expect(request?.url).toBe(
      'https://komga.example.test/api/v1/books/list?page=4&size=50&sort=title%2Cdesc',
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Basic cmVhZGVyOnNlY3JldA==');
    await expect(request?.text()).resolves.toBe('{"fullTextSearch":"space opera"}');
  });

  it('parses a Blob response declared by the generated endpoint', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(
        new Response(new Uint8Array([0, 1, 2, 255]), {
          headers: { 'content-type': 'font/woff2' },
        }),
        requests,
      ),
    });

    const result = await getFontFile(
      { fontFamily: 'Open Sans', fontFile: 'regular.woff2' },
      { client },
    );

    if (result.data === undefined) {
      throw new Error('Expected generated font operation to return data');
    }
    expect(result.data).toBeInstanceOf(Blob);
    expect(Array.from(new Uint8Array(await result.data.arrayBuffer()))).toEqual([0, 1, 2, 255]);
    expect(requests[0]?.url).toBe(
      'https://komga.example.test/api/v1/fonts/resource/Open%20Sans/regular.woff2',
    );
  });

  it('returns the generated void result for a 204 mutation and serializes its JSON body', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(new Response(null, { status: 204 }), requests),
    });

    const result = await markAnnouncementsRead({ body: ['announcement-1', 'announcement-2'] }, { client });

    expect(result.error).toBeUndefined();
    expect(result.data).toBeUndefined();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.method).toBe('PUT');
    expect(requests[0]?.url).toBe('https://komga.example.test/api/v1/announcements');
    expect(requests[0]?.headers.get('Content-Type')).toBe('application/json');
    await expect(requests[0]?.text()).resolves.toBe('["announcement-1","announcement-2"]');
  });

  it('reads content from a v2 PageString response and serializes pagination', async () => {
    const requests: Request[] = [];
    const page: PageString = {
      content: ['Alice', 'Bob'],
      number: 2,
      size: 2,
      totalElements: 6,
      totalPages: 3,
    };
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(
        new Response(JSON.stringify(page), { headers: { 'content-type': 'application/json' } }),
        requests,
      ),
    });

    const result = await getAuthorsNames({ page: 2, size: 2 }, { client });

    expect(result.error).toBeUndefined();
    expect(result.data?.content).toEqual(['Alice', 'Bob']);
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe(
      'https://komga.example.test/api/v2/authors/names?page=2&size=2',
    );
  });

  it('serializes repeated collection, series, and readlist filters for authors', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(
        new Response('{"content":[]}', { headers: { 'content-type': 'application/json' } }),
        requests,
      ),
    });

    const result = await getAuthors(
      {
        collection_id: ['collection/1', 'collection/2'],
        series_id: ['series/1', 'series/2'],
        readlist_id: ['readlist/1', 'readlist/2'],
      },
      { client },
    );

    expect(result.error).toBeUndefined();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe(
      'https://komga.example.test/api/v2/authors?collection_id=collection%2F1&collection_id=collection%2F2&series_id=series%2F1&series_id=series%2F2&readlist_id=readlist%2F1&readlist_id=readlist%2F2',
    );
  });

  it('serializes the BOOK include scope for tags', async () => {
    const requests: Request[] = [];
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(
        new Response('{"content":[]}', { headers: { 'content-type': 'application/json' } }),
        requests,
      ),
    });

    const result = await getTags({ include: 'BOOK' }, { client });

    expect(result.error).toBeUndefined();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe('https://komga.example.test/api/v2/tags?include=BOOK');
  });

  it('preserves the original Response and empty generated errors for missing books and series', async () => {
    const bookRequests: Request[] = [];
    const bookResponse = new Response(null, { status: 404, statusText: 'Not Found' });
    const bookClient = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(bookResponse, bookRequests),
    });

    const bookResult = await getBookById({ bookId: 'missing-book' }, { client: bookClient });

    expect(bookResult.data).toBeUndefined();
    expect(bookResult.error).toEqual({});
    expect(bookResult.response).toBe(bookResponse);
    expect(bookResult.request?.url).toBe('https://komga.example.test/api/v1/books/missing-book');

    const seriesRequests: Request[] = [];
    const seriesResponse = new Response(null, { status: 404, statusText: 'Not Found' });
    const seriesClient = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(seriesResponse, seriesRequests),
    });

    const seriesResult = await getSeriesById({ seriesId: 'missing-series' }, { client: seriesClient });

    expect(seriesResult.data).toBeUndefined();
    expect(seriesResult.error).toEqual({});
    expect(seriesResult.response).toBe(seriesResponse);
    expect(seriesResult.request?.url).toBe(
      'https://komga.example.test/api/v1/series/missing-series',
    );
  });

  it('returns a documented typed error while preserving the original Response', async () => {
    const requests: Request[] = [];
    const errorBody: ValidationErrorResponse = {
      violations: [{ fieldName: 'library_id', message: 'unknown library' }],
    };
    const response = new Response(JSON.stringify(errorBody), {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'content-type': 'application/json' },
    });
    const client = createKomgaClient({
      baseUrl: 'https://komga.example.test',
      fetch: captureFetch(response, requests),
    });

    const result = await getGenres({ library_id: ['missing-library'] }, { client });

    if (result.error === undefined) {
      throw new Error('Expected generated operation to return its documented 400 error');
    }
    expect(result.data).toBeUndefined();
    expect(result.error.violations).toEqual(errorBody.violations);
    expect(result.response).toBe(response);
    expect(result.request?.url).toBe(
      'https://komga.example.test/api/v2/genres?library_id=missing-library',
    );
  });
});
