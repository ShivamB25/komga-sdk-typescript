# Task Completion Checklist

## Before Marking a Task Complete

1. **Type Safety**
   - [ ] Run `bun tsc --noEmit` and ensure no errors
   - [ ] No `any` types introduced
   - [ ] No `@ts-ignore` or `@ts-expect-error`

2. **Tests**
   - [ ] Run `bun run test` and ensure all tests pass
   - [ ] Add tests for new functionality when appropriate
   - [ ] Run `bun run test:coverage` to verify coverage thresholds

3. **Consistency**
   - [ ] Follow existing naming conventions
   - [ ] Keep exports updated in `src/index.ts` and domain barrel files

4. **Validation**
   - [ ] Update zod schemas when API response shapes change
   - [ ] Use `.nullish()` for fields that can be null or undefined

5. **Docs (if needed)**
   - [ ] Update docs/examples when public APIs change
