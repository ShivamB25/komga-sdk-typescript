# NPM OIDC Trusted Publishing Skill

## Overview
Publishing to npm using OIDC (Trusted Publishing) eliminates the need for long-lived NPM tokens. This skill documents the complete setup and common pitfalls.

## When to Use
- Publishing npm packages from GitHub Actions
- Setting up new npm packages with CI/CD
- Migrating from NPM_TOKEN to OIDC authentication

## Requirements
- npm CLI 11.5.1+ (Node 22 ships with npm 10.x, MUST upgrade)
- GitHub-hosted runners (self-hosted not supported yet)
- Public repository for provenance (optional but recommended)

## Workflow Template

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

      # CRITICAL: Node 22 ships with npm 10.x, OIDC requires 11.5.1+
      - name: Upgrade npm for OIDC support
        run: npm install -g npm@latest

      - run: npm ci
      - run: npm run build --if-present
      - run: npm test

      - name: Publish to npm
        run: npm publish --access public
        env:
          # CRITICAL: Clear NODE_AUTH_TOKEN to force OIDC
          # actions/setup-node sets a default placeholder token that conflicts with OIDC
          NODE_AUTH_TOKEN: ""
```

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
**Fix:** Add `npm install -g npm@latest` before publish

### EOTP / "This operation requires a one-time password"
**Cause:** Using Automation token with 2FA enabled, or NODE_AUTH_TOKEN set
**Fix:** Clear `NODE_AUTH_TOKEN: ""` in publish step env

### 404 Not Found - PUT https://registry.npmjs.org/package-name
**Cause:** NODE_AUTH_TOKEN conflicts with OIDC, or setup-node placeholder token
**Fix:** Clear `NODE_AUTH_TOKEN: ""` in publish step env

### "Access token expired or revoked"
**Cause:** actions/setup-node creates .npmrc with placeholder token
**Fix:** Clear `NODE_AUTH_TOKEN: ""` in publish step env

## Critical Gotchas

1. **DO NOT use bun publish for OIDC** - bun only supports NPM_CONFIG_TOKEN (long-lived tokens)
2. **ALWAYS upgrade npm** - Node 22 LTS ships with npm 10.x, OIDC needs 11.5.1+
3. **ALWAYS clear NODE_AUTH_TOKEN** - actions/setup-node sets a default placeholder that breaks OIDC
4. **Workflow filename must match exactly** - Case-sensitive, include .yml extension
5. **Repository name case-sensitive** - Must match GitHub URL exactly

## Security Best Practices

After confirming OIDC works:
1. Go to Package Settings → Publishing access
2. Select "Require two-factor authentication and disallow tokens"
3. Revoke any old NPM tokens

## References
- https://docs.npmjs.com/trusted-publishers/
- https://github.com/actions/setup-node/issues/1440
- https://github.com/orgs/community/discussions/176761
