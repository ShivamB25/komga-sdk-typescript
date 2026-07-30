# Komga SDK documentation

This directory contains the Mintlify site for the Komga SDK.

## Install

From this directory, install the pinned local CLI and its dependencies:

```bash
bun install
```

## Validate

Validate `docs.json`, navigation, frontmatter, and MDX content locally:

```bash
bun run --bun mint validate
```

Check internal links locally:

```bash
bun run --bun mint broken-links
```

## Preview locally

Start the local preview server at `http://localhost:3000`:

```bash
bun run --bun mint dev
```

`mint dev` is a local preview only. It does not publish the site.

## Deploy

Production deployment is handled by Mintlify's Git integration. Push changes
to the repository and merge them into the branch connected to the Mintlify
site. Mintlify builds and deploys the merged revision; there is no local
deployment command to run.
