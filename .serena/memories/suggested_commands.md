# Suggested Commands

## Install and SDK gate
```bash
bun install
bun run generate
bun run typecheck
bun run test
bun run test:coverage
bun run build
npm pack --dry-run
```

## Mintlify gate
Mint rejects Node 26 and Bun currently reports Node 26.3.0, so invoke the pinned local CLI through Node 22:
```bash
cd docs/mintlify
bun install
npx --yes node@22 node_modules/mint/index.js validate
npx --yes node@22 node_modules/mint/index.js broken-links
npx --yes node@22 node_modules/mint/index.js a11y
npx --yes node@22 node_modules/mint/index.js dev --port 3000 --no-open
```

## Delivery checks
```bash
git fetch --prune origin
git status --short --branch
git diff --check
```
After any rebase or dependency change, rerun `bun install`, the full SDK/docs gates, Node 18 ESM subpath imports, and one authenticated built operation.
