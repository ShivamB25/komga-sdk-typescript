# Mintlify Documentation Setup

## Current site
- Root: `docs/mintlify/`
- Config/navigation: `docs/mintlify/docs.json`
- CLI package: pinned `mint` in the isolated docs package/lockfile
- API reference: immutable Komga 1.26.3 OpenAPI URL
- Maintained package/API: komga-sdk 2.0.0 / Komga 1.26.3

Every maintained MDX page needs title and description frontmatter and must appear in `docs.json` navigation. Internal links are root-relative without `.mdx`; every code fence has a language; media needs alt text; the configured primary color must meet WCAG AA.

## Local commands
```bash
cd docs/mintlify
bun install
npx --yes node@22 node_modules/mint/index.js validate
npx --yes node@22 node_modules/mint/index.js broken-links
npx --yes node@22 node_modules/mint/index.js a11y
npx --yes node@22 node_modules/mint/index.js dev --port 3000 --no-open
```
The Bun-forced Mint command is not viable on the current workstation because Mint sees Node 26.3.0 and rejects it. Use Node 22. `mint dev` is preview only, never deployment proof.

## Release sampling
Open the real local site in Chromium and sample introduction, quickstart, configuration, migration, a deep workflow guide, and at least one generated endpoint page. Verify visible headings/content and browser errors.
