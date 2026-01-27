# Mintlify Documentation

## Working relationship
- You can push back on ideas—this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up anything

## Project context
- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components

## Guide inventory
- Core domain guides: `books`, `series`, `libraries`, `collections`, `read-lists`, `users`
- Reading & discovery: `read-progress`, `mihon-sync`, `book-discovery`, `series-discovery`
- Content & media: `book-content`, `thumbnails`, `downloads`, `fonts`
- Admin & configuration: `admin`, `library-maintenance`, `client-settings`
- Reference/support: `metadata-lookups`, `deprecated-endpoints`, `workflows`

## Content strategy
- Document just enough for user success—not too much, not too little
- Prioritize accuracy and usability
- Make content evergreen when possible
- Search for existing content before adding anything new. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## docs.json
- Refer to the [docs.json schema](https://mintlify.com/docs.json) when building the docs.json file and site navigation

## Frontmatter requirements for pages
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions—always ask for clarification

## Project Reference

For SDK-specific context, patterns, and conventions, see the main project AGENTS.md:
**`../../AGENTS.md`**

This includes:
- SDK architecture and structure
- Domain service patterns
- Validation and error handling conventions
- Testing patterns
- API coverage details
- Deprecation information

**Important:** When updating SDK documentation, ensure both files remain in sync. Changes to SDK patterns should be reflected in the main AGENTS.md first, then documentation updates can reference those patterns here.
