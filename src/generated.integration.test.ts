import { describe, expect, it } from 'vitest';
import { createKomgaClient } from './client';
import {
  getBooks,
  getBooksBySeriesId,
  getFontFile,
  getGenres,
  markAnnouncementsRead,
} from './generated/sdk.gen';
import type { BookSearch, ValidationErrorResponse } from './generated/types.gen';

function captureFetch(response: Response, requests: Request[]): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init);
    requests.push(request);
    return response;
  };
}

describe('generated operation integration', () => {
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
      'https://komga.example.test/api/v1/genres?library_id=missing-library',
    );
  });
});
