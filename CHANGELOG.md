# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- Documentation overhaul (README restructure and new docs guides)
- TypeDoc configuration and scripts for API reference

## [2.0.0] - 2026-08-29

- Regenerated for Komga 1.26.3: coverage is now 139 unique endpoint paths across 174 operations.
- **Breaking generated type changes:** `ItemDto.author` is now optional `ItemAuthorDto { name?: string; url?: string }`, replacing required `AuthorDto { name: string; role: string }`. All fields on `SettingMultiSourceInteger` and `SettingMultiSourceString` are now optional.
- Callable operations `getBookById` and `getSeriesById` now include documented `404` responses in the exact generated error-map type aliases `GetBookByIdErrors` and `GetSeriesByIdErrors`; callers should handle not-found responses explicitly. The PascalCase names are type aliases, not callable operations.
- Added nine v2 referential endpoints (`age-ratings`, `authors/names`, `authors/roles`, `genres`, `languages`, `publishers`, `series/release-years`, `sharing-labels`, and `tags`). Their unsuffixed functions now return paginated `PageInteger`/`PageString` results; the prior v1 array operations are deprecated and regenerated with suffixed names (`getAgeRatings1`, `getAuthorsNames1`, `getAuthorsRoles1`, `getGenres1`, `getLanguages1`, `getPublishers1`, `getSharingLabels1`, and `getTags1`).
- Migration: switch to the unsuffixed v2 functions and read `data.content` plus page metadata, or retain v1 array behavior through the suffixed operations. Scope filters (`library_id`, `collection_id`, `series_id`, and `readlist_id`, where supported) are now arrays.

## [0.1.0] - 2026-01-27

- Initial SDK release
