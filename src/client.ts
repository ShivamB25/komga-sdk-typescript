import { createClient } from './generated/client/client.gen.js';
import type { Client, Config } from './generated/client/types.gen.js';

/** Authentication supported by Komga servers. */
export type AuthConfig =
  | {
      type: 'apiKey';
      key: string;
    }
  | {
      type: 'basic';
      username: string;
      password: string;
    };

type GeneratedClientOverrides = Omit<
  Partial<Config>,
  | 'auth'
  | 'baseUrl'
  | 'credentials'
  | 'fetch'
  | 'headers'
  | 'responseStyle'
  | 'throwOnError'
>;

/** Options for creating an isolated Komga API client. */
export type KomgaClientOptions = GeneratedClientOverrides & {
  /** Base URL for the Komga API server. */
  baseUrl: string;
  /** Optional API key or HTTP Basic credentials. */
  auth?: AuthConfig;
  /** Headers sent with every request, except auth-owned headers. */
  headers?: HeadersInit;
  /** Fetch credentials mode. */
  credentials?: RequestCredentials;
  /** Fetch implementation used by this client instance. */
  fetch?: typeof fetch;
};

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeUtf8Base64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let encoded = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const hasSecond = second !== undefined;
    const hasThird = third !== undefined;

    encoded += BASE64_ALPHABET[first >> 2];
    encoded += BASE64_ALPHABET[((first & 0x03) << 4) | ((second ?? 0) >> 4)];
    encoded += hasSecond
      ? BASE64_ALPHABET[((second! & 0x0f) << 2) | ((third ?? 0) >> 6)]
      : '=';
    encoded += hasThird ? BASE64_ALPHABET[third! & 0x3f] : '=';
  }

  return encoded;
}

function isProductionEnvironment(): boolean {
  const processRef = (globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  }).process;
  return processRef?.env?.NODE_ENV === 'production';
}

function warnForInsecureBasicAuth(baseUrl: string, auth: AuthConfig | undefined): void {
  if (auth?.type !== 'basic' || !isProductionEnvironment()) {
    return;
  }

  try {
    if (new URL(baseUrl).protocol === 'http:') {
      console.warn(
        '[Komga SDK] Basic auth is configured over HTTP in production. Use HTTPS to protect credentials in transit.',
      );
    }
  } catch {
    // Let the generated client report malformed base URLs when a request is made.
  }
}

function createHeaders(headers: HeadersInit | undefined, auth: AuthConfig | undefined): Headers {
  const merged = new Headers(headers);

  if (auth?.type === 'apiKey') {
    merged.set('X-API-Key', auth.key);
  } else if (auth?.type === 'basic') {
    merged.set('Authorization', `Basic ${encodeUtf8Base64(`${auth.username}:${auth.password}`)}`);
  }

  return merged;
}

/**
 * Create a per-instance generated Komga client using the platform Fetch API.
 * Generated requests remain non-throwing by default; use {@link unwrap} to
 * opt into typed exceptions at individual call sites.
 */
export function createKomgaClient(options: KomgaClientOptions): Client {
  const {
    auth,
    baseUrl,
    credentials,
    fetch: fetchImplementation,
    headers,
    ...generatedOverrides
  } = options;

  warnForInsecureBasicAuth(baseUrl, auth);

  const config: Config = {
    ...generatedOverrides,
    baseUrl,
    credentials,
    fetch: fetchImplementation,
    headers: createHeaders(headers, auth),
  };

  return createClient(config);
}
