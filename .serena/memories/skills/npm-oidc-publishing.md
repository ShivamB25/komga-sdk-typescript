# NPM OIDC Trusted Publishing Skill

## Overview
Publishing to npm using OIDC (Trusted Publishing) eliminates the need for long-lived NPM tokens. This skill documents the complete setup and common pitfalls.

## When to Use
- Publishing npm packages from GitHub Actions
- Setting up new npm packages with CI/CD
- Migrating from NPM_TOKEN to OIDC authentication

## Requirements
- npm CLI >=11.5.1 (Node 22 ships with npm 10.x, so upgrade before publishing)
- Use `npm publish` for OIDC publishing; do not use `bun publish`
- GitHub Actions job permission `id-token: write`
- Clear the `NODE_AUTH_TOKEN` placeholder on the publish step
- Do not configure or use an `NPM_TOKEN` repository/org secret; trusted publishing uses GitHub's OIDC token
- GitHub-hosted runners (self-hosted not supported yet)
- Public repository for provenance (optional but recommended)

## Workflow Template

Use Bun for repository installation and all validation/build gates, then use npm for the OIDC publish itself:

```yaml
name: Publish Package

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

permissions:
  contents: read
  id-token: write # Required for OIDC

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          registry-url: "https://registry.npmjs.org"

      - uses: oven-sh/setup-bun@v2

      # CRITICAL: Node 22 ships with npm 10.x; OIDC requires npm >=11.5.1
      - name: Upgrade npm for OIDC support
        run: npm install -g npm@latest

      # Repository installation and gates must use Bun, in this order
      - run: bun install
      - run: bun run generate
      - run: bun run typecheck
      - run: bun run test
      - run: bun run build

      - name: Publish to npm
        run: npm publish --access public
        env:
          # CRITICAL: Clear NODE_AUTH_TOKEN to force OIDC
          # actions/setup-node sets a default placeholder token that conflicts with OIDC
          NODE_AUTH_TOKEN: ""
```

Do not add `NPM_TOKEN` to repository or organization secrets, and do not pass it through the workflow environment.

## npmjs.com Setup

1. Go to Package Settings → Trusted Publisher
2. Select GitHub Actions
3. Configure:
   - Organization/user: Your GitHub username/org
   - Repository: repo-name
   - Workflow filename: publish.yml (exact match, case-sensitive)
   - Environment: (optional, leave blank unless using GitHub environments)

## Common Errors & Solutions

### ENEEDAUTH / "need auth This command requires you to be logged in"
**Cause:** npm version too old (10.x), OIDC requires 11.5.1+
**Fix:** Add `npm install -g npm@latest` before the Bun gates and publish.

### EOTP / "This operation requires a one-time password"
**Cause:** Using an Automation token with 2FA enabled, or `NODE_AUTH_TOKEN` is set
**Fix:** Do not use an NPM_TOKEN; clear `NODE_AUTH_TOKEN: ""` in the publish step env.

### 404 Not Found - PUT https://registry.npmjs.org/package-name
**Cause:** `NODE_AUTH_TOKEN` conflicts with OIDC, or setup-node's placeholder token is still active
**Fix:** Clear `NODE_AUTH_TOKEN: ""` in the publish step env.

### "Access token expired or revoked"
**Cause:** actions/setup-node creates .npmrc with a placeholder token
**Fix:** Clear `NODE_AUTH_TOKEN: ""` in the publish step env.

## Critical Gotchas

1. **DO NOT use `bun publish` for OIDC** - Bun only supports `NPM_CONFIG_TOKEN` (long-lived tokens); publish with npm.
2. **ALWAYS use npm >=11.5.1** - Node 22 LTS ships with npm 10.x, so upgrade before `npm publish`.
3. **ALWAYS clear `NODE_AUTH_TOKEN`** - actions/setup-node sets a default placeholder that breaks OIDC.
4. **NEVER configure an `NPM_TOKEN` secret** - it is unnecessary for trusted publishing and undermines tokenless OIDC authentication.
5. **Workflow filename must match exactly** - Case-sensitive, include `.yml` extension.
6. **Repository name case-sensitive** - Must match GitHub URL exactly.

## Security Best Practices

After confirming OIDC works:
1. Go to Package Settings → Publishing access
2. Select "Require two-factor authentication and disallow tokens"
3. Revoke any old NPM tokens

## References
- https://docs.npmjs.com/trusted-publishers/
- https://github.com/actions/setup-node/issues/1440
- https://github.com/orgs/community/discussions/176761
