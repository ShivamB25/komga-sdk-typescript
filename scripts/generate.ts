import { createClient } from '@hey-api/openapi-ts';
import { mkdir, readFile, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import config from '../openapi-ts.config';

type JsonRecord = Record<string, unknown>;

const rootDir = resolve(import.meta.dir, '..');
const stageDir = join(rootDir, '.tmp', 'generated');
const backupDir = join(rootDir, '.tmp', 'generated.previous');
const outputDir = join(rootDir, 'src', 'generated');

const KOMGA_SPEC_URL =
  'https://raw.githubusercontent.com/gotson/komga/1.26.3/komga/docs/openapi.json';
const KOMGA_SPEC_SHA256 = 'bb632844224f3599d70b186e3278334f4ef9765c19069c56dec6c59406be7afe';

const searchOperators: Record<string, string> = {
  SearchOperatorAfter: 'after',
  SearchOperatorBefore: 'before',
  SearchOperatorBeginsWith: 'beginsWith',
  SearchOperatorContains: 'contains',
  SearchOperatorDoesNotBeginWith: 'doesNotBeginWith',
  SearchOperatorDoesNotContain: 'doesNotContain',
  SearchOperatorDoesNotEndWith: 'doesNotEndWith',
  SearchOperatorEndsWith: 'endsWith',
  SearchOperatorGreaterThan: 'greaterThan',
  SearchOperatorIs: 'is',
  SearchOperatorIsFalse: 'isFalse',
  SearchOperatorIsInTheLast: 'isInTheLast',
  SearchOperatorIsNot: 'isNot',
  SearchOperatorIsNotInTheLast: 'isNotInTheLast',
  SearchOperatorIsNotNull: 'isNotNull',
  SearchOperatorIsNotNullT: 'isNotNull',
  SearchOperatorIsNull: 'isNull',
  SearchOperatorIsNullT: 'isNull',
  SearchOperatorIsTrue: 'isTrue',
  SearchOperatorLessThan: 'lessThan',
};
const searchOperatorDefinitions: Record<string, string> = {
  SearchOperatorBoolean: 'SearchOperatorIsTrue | SearchOperatorIsFalse',
  SearchOperatorDate:
    'SearchOperatorBefore | SearchOperatorAfter | SearchOperatorIsInTheLast | SearchOperatorIsNotInTheLast | SearchOperatorIsNull | SearchOperatorIsNotNull',
  SearchOperatorEqualityAuthorMatch: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorEqualityMediaProfile: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorEqualityNullableString:
    'SearchOperatorIs | SearchOperatorIsNot | SearchOperatorIsNullT | SearchOperatorIsNotNullT',
  SearchOperatorEqualityPosterMatch: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorEqualityReadStatus: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorEqualityStatus: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorEqualityString: 'SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorNumericNullableInteger:
    'SearchOperatorGreaterThan | SearchOperatorLessThan | SearchOperatorIsNullT | SearchOperatorIsNotNullT | SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorNumericTFloat:
    'SearchOperatorGreaterThan | SearchOperatorLessThan | SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorString:
    'SearchOperatorBeginsWith | SearchOperatorDoesNotBeginWith | SearchOperatorContains | SearchOperatorDoesNotContain | SearchOperatorEndsWith | SearchOperatorDoesNotEndWith | SearchOperatorIs | SearchOperatorIsNot',
  SearchOperatorAfter: `{
    operator: 'after';
    dateTime: string;
  }`,
  SearchOperatorBefore: `{
    operator: 'before';
    dateTime: string;
  }`,
  SearchOperatorBeginsWith: `{
    operator: 'beginsWith';
    value: string;
  }`,
  SearchOperatorContains: `{
    operator: 'contains';
    value: string;
  }`,
  SearchOperatorDoesNotBeginWith: `{
    operator: 'doesNotBeginWith';
    value: string;
  }`,
  SearchOperatorDoesNotContain: `{
    operator: 'doesNotContain';
    value: string;
  }`,
  SearchOperatorDoesNotEndWith: `{
    operator: 'doesNotEndWith';
    value: string;
  }`,
  SearchOperatorEndsWith: `{
    operator: 'endsWith';
    value: string;
  }`,
  SearchOperatorGreaterThan: `{
    operator: 'greaterThan';
    value: unknown;
  }`,
  SearchOperatorIs: `{
    operator: 'is';
    value: unknown;
  }`,
  SearchOperatorIsFalse: `{
    operator: 'isFalse';
  }`,
  SearchOperatorIsInTheLast: `{
    operator: 'isInTheLast';
    duration: string;
  }`,
  SearchOperatorIsNot: `{
    operator: 'isNot';
    value: unknown;
  }`,
  SearchOperatorIsNotInTheLast: `{
    operator: 'isNotInTheLast';
    duration: string;
  }`,
  SearchOperatorIsNotNull: `{
    operator: 'isNotNull';
  }`,
  SearchOperatorIsNotNullT: `{
    operator: 'isNotNull';
  }`,
  SearchOperatorIsNull: `{
    operator: 'isNull';
  }`,
  SearchOperatorIsNullT: `{
    operator: 'isNull';
  }`,
  SearchOperatorIsTrue: `{
    operator: 'isTrue';
  }`,
  SearchOperatorLessThan: `{
    operator: 'lessThan';
    value: unknown;
  }`,
};

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function overlaySearchOperators(document: JsonRecord): JsonRecord {
  const components = isRecord(document.components) ? document.components : undefined;
  const schemas = components && isRecord(components.schemas) ? components.schemas : undefined;
  if (!schemas) {
    throw new Error('Komga OpenAPI document does not contain components.schemas');
  }

  for (const [name, operator] of Object.entries(searchOperators)) {
    const schema = schemas[name];
    if (!isRecord(schema)) {
      throw new Error(`Komga OpenAPI schema ${name} was not found`);
    }

    const existingProperties = isRecord(schema.properties) ? schema.properties : {};
    const existingRequired = Array.isArray(schema.required)
      ? schema.required.filter((value): value is string => typeof value === 'string')
      : [];
    const { allOf: _allOf, ...withoutAllOf } = schema;

    schemas[name] = {
      ...withoutAllOf,
      type: 'object',
      properties: {
        operator: { const: operator },
        ...existingProperties,
      },
      required: ['operator', ...existingRequired.filter((value) => value !== 'operator')],
    };
  }
  return document;
}

async function fetchInput(input: unknown): Promise<JsonRecord> {
  if (input !== KOMGA_SPEC_URL) {
    throw new Error(`Generation input must be ${KOMGA_SPEC_URL}`);
  }

  const response = await fetch(KOMGA_SPEC_URL);
  if (!response.ok) {
    throw new Error(`Unable to fetch OpenAPI input (${response.status} ${response.statusText})`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const checksum = Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('');
  if (checksum !== KOMGA_SPEC_SHA256) {
    throw new Error(`Komga OpenAPI checksum mismatch: expected ${KOMGA_SPEC_SHA256}, received ${checksum}`);
  }

  const document: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!isRecord(document)) {
    throw new Error('OpenAPI input must be a JSON object');
  }
  return overlaySearchOperators(document);
}

async function generate(): Promise<void> {
  await rm(stageDir, { force: true, recursive: true });
  await rm(backupDir, { force: true, recursive: true });

  const input = await fetchInput(config.input);
  await createClient({
    ...config,
    input,
    output: {
      ...config.output,
      clean: true,
      path: stageDir,
    },
  });

  const generatedTypes = join(stageDir, 'types.gen.ts');
  if (!existsSync(generatedTypes)) {
    throw new Error(`Hey API did not generate ${generatedTypes}`);
  }
  await normalizeSearchOperatorTypes(generatedTypes);
  await normalizeActuatorInfoResponseType(generatedTypes);
  await normalizeGeneratedRuntime(stageDir);

  await mkdir(join(rootDir, '.tmp'), { recursive: true });
  if (existsSync(outputDir)) {
    await rename(outputDir, backupDir);
  }

  try {
    await rename(stageDir, outputDir);
  } catch (error) {
    if (existsSync(backupDir) && !existsSync(outputDir)) {
      await rename(backupDir, outputDir);
    }
    throw error;
  }

  await rm(backupDir, { force: true, recursive: true });
}

function replaceType(source: string, name: string, body: string): string {
  const declaration = `export type ${name} = `;
  const start = source.indexOf(declaration);
  if (start === -1) {
    throw new Error(`Generated type ${name} was not found`);
  }

  let depth = 0;
  let quote: string | undefined;
  let escaped = false;

  for (let index = start + declaration.length; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{' || character === '(' || character === '[') {
      depth += 1;
      continue;
    }
    if (character === '}' || character === ')' || character === ']') {
      depth -= 1;
      continue;
    }
    if (character === ';' && depth === 0) {
      return `${source.slice(0, start)}${declaration}${body};${source.slice(index + 1)}`;
    }
  }

  throw new Error(`Generated type ${name} has no terminating semicolon`);
}

async function normalizeSearchOperatorTypes(path: string): Promise<void> {
  let source = await readFile(path, 'utf8');
  for (const [name, body] of Object.entries(searchOperatorDefinitions)) {
    source = replaceType(source, name, body);
  }
  await Bun.write(path, source);
}

async function normalizeActuatorInfoResponseType(path: string): Promise<void> {
  let source = await readFile(path, 'utf8');
  source = replaceExactlyOnce(
    source,
    `export type GetActuatorInfoResponses = {
    /**
     * OK
     */
    200: unknown;
};`,
    `export type GetActuatorInfoResponses = {
    /**
     * OK
     */
    200: Record<string, unknown>;
};`,
    path,
  );
  await Bun.write(path, source);
}

function replaceExactlyOnce(
  source: string,
  search: string,
  replacement: string,
  path: string,
): string {
  const first = source.indexOf(search);
  if (first === -1) {
    throw new Error(`Generated pattern was not found in ${path}`);
  }
  if (source.indexOf(search, first + search.length) !== -1) {
    throw new Error(`Generated pattern appeared more than once in ${path}`);
  }
  return `${source.slice(0, first)}${replacement}${source.slice(first + search.length)}`;
}

async function normalizeGeneratedRuntime(directory: string): Promise<void> {
  const clientPath = join(directory, 'client', 'client.gen.ts');
  const utilsPath = join(directory, 'client', 'utils.gen.ts');

  let clientSource = await readFile(clientPath, 'utf8');
  clientSource = replaceExactlyOnce(
    clientSource,
    `          let emptyData: any;
          switch (parseAs) {
            case 'arrayBuffer':
            case 'blob':
            case 'text':
              emptyData = await response[parseAs]();
              break;
            case 'formData':
              emptyData = new FormData();
              break;
            case 'stream':
              emptyData = response.body;
              break;
            case 'json':
            default:
              emptyData = {};
              break;
          }`,
    '          const emptyData = undefined;',
    clientPath,
  );
  await Bun.write(clientPath, clientSource);

  let utilsSource = await readFile(utilsPath, 'utf8');
  utilsSource = replaceExactlyOnce(
    utilsSource,
    `['application/', 'audio/', 'image/', 'video/']`,
    `['application/', 'audio/', 'font/', 'image/', 'video/']`,
    utilsPath,
  );
  await Bun.write(utilsPath, utilsSource);
}
await generate();
