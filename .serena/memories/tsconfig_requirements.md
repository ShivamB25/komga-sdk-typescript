# TypeScript Configuration Requirements

## Current compiler
TypeScript is pinned to 5.9.3. The current `@hey-api/openapi-ts` 0.99.0 generation stack fails with TypeScript 7.0.2: `Cannot read properties of undefined (reading 'Kind')`. Do not accept a compiler upgrade until generation and the full release gate pass.

## Required `tsconfig.json` characteristics
- `module` and `target`: `ESNext`
- `moduleResolution`: `bundler`
- libs: `ESNext`, `DOM`, `DOM.Iterable`
- `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `isolatedModules`
- `noEmit` in `tsconfig.json` for `bun run typecheck`; `bun run build` invokes `tsc -p tsconfig.build.json`, which emits `dist` with declarations, declaration maps, source maps, and JavaScript
- declarations and source maps enabled
- `skipLibCheck`, `esModuleInterop`, `allowSyntheticDefaultImports`, `resolveJsonModule`
- include `src/**/*.ts`

Generated and handwritten package imports still require explicit `.js` relative specifiers for native Node ESM even though TypeScript uses bundler resolution.