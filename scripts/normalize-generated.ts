const generatedPath = '.tmp/generated/types.gen.ts';

const readGenerated = await Bun.file(generatedPath).text();

const definitions: Record<string, string> = {
  SearchOperatorBoolean: `SearchOperatorIsTrue | SearchOperatorIsFalse`,
  SearchOperatorDate: `SearchOperatorBefore | SearchOperatorAfter | SearchOperatorIsInTheLast | SearchOperatorIsNotInTheLast | SearchOperatorIsNull | SearchOperatorIsNotNull`,
  SearchOperatorEqualityAuthorMatch: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorEqualityMediaProfile: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorEqualityNullableString: `SearchOperatorIs | SearchOperatorIsNot | SearchOperatorIsNullT | SearchOperatorIsNotNullT`,
  SearchOperatorEqualityPosterMatch: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorEqualityReadStatus: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorEqualityStatus: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorEqualityString: `SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorNumericNullableInteger: `SearchOperatorGreaterThan | SearchOperatorLessThan | SearchOperatorIsNullT | SearchOperatorIsNotNullT | SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorNumericTFloat: `SearchOperatorGreaterThan | SearchOperatorLessThan | SearchOperatorIs | SearchOperatorIsNot`,
  SearchOperatorString: `SearchOperatorBeginsWith | SearchOperatorDoesNotBeginWith | SearchOperatorContains | SearchOperatorDoesNotContain | SearchOperatorEndsWith | SearchOperatorDoesNotEndWith | SearchOperatorIs | SearchOperatorIsNot`,
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

function replaceType(source: string, name: string, body: string): string {
  const declaration = `export type ${name} = `;
  const start = source.indexOf(declaration);
  if (start === -1) {
    throw new Error(`Generated type ${name} was not found`);
  }

  let depth = 0;
  let quote: string | undefined;
  let escaped = false;
  let end = -1;

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
      end = index + 1;
      break;
    }
  }

  if (end === -1) {
    throw new Error(`Generated type ${name} has no terminating semicolon`);
  }

  return `${source.slice(0, start)}${declaration}${body};${source.slice(end)}`;
}

let normalized = readGenerated;
for (const [name, body] of Object.entries(definitions)) {
  normalized = replaceType(normalized, name, body);
}

await Bun.write(generatedPath, normalized);
