import { describe, expect, it } from 'vitest';
import { KomgaApiError, unwrap } from './result';

describe('unwrap', () => {
  it('returns data from a successful generated result', () => {
    expect(unwrap({ data: { id: 'book-1' }, error: undefined })).toEqual({ id: 'book-1' });
  });

  it('throws a typed API error with the body and original response', () => {
    const response = new Response(JSON.stringify({ message: 'not found' }), { status: 404 });
    const body = { message: 'not found' };

    expect(() => unwrap<{ id: string }, typeof body>({ data: undefined, error: body, response })).toThrow(
      KomgaApiError,
    );

    try {
      unwrap<{ id: string }, typeof body>({ data: undefined, error: body, response });
      throw new Error('expected unwrap to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(KomgaApiError);
      expect((error as KomgaApiError<typeof body>).body).toEqual(body);
      expect((error as KomgaApiError<typeof body>).response).toBe(response);
      expect((error as KomgaApiError<typeof body>).status).toBe(404);
    }
  });

  it('returns undefined for a successful void response', () => {
    expect(unwrap<void>({ data: undefined, error: undefined })).toBeUndefined();
  });

  it('throws for an absent result', () => {
    expect(() => unwrap<{ id: string }>(undefined)).toThrow(
      'Komga API request did not return a result',
    );
  });
});
