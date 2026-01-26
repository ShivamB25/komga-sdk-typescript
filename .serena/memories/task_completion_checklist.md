# Task Completion Checklist

## Before Marking a Task Complete

1. **Type Safety**
   - [ ] Run `bun tsc --noEmit` and ensure no errors
   - [ ] No `any` types introduced
   - [ ] No `@ts-ignore` or `@ts-expect-error`

2. **Consistency**
   - [ ] Follow existing naming conventions
   - [ ] Keep exports updated in `src/index.ts`

3. **Validation**
   - [ ] Update zod schemas when API response shapes change

4. **Docs (if needed)**
   - [ ] Update docs/examples when public APIs change
