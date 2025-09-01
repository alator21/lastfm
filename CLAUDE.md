# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Bun as the runtime and package manager:

- **Install dependencies**: `bun install`
- **Run tests**: `bun test` (uses Bun's built-in test runner)
- **Type checking**: `bunx tsc --noEmit` (TypeScript compiler check)
- **Publish**: `bunx jsr publish --allow-slow-types` (publishes to JSR registry)

## Project Architecture

This is a Last.fm API wrapper library published as `@alator21/lastfm` on JSR. The architecture follows these patterns:

### Core Structure
- **Singleton API instance**: The library uses a singleton pattern via `initializeLastFmApi()` that must be called before using any API methods
- **Module-based organization**: API methods are organized by Last.fm API categories (`auth/`, `track/`, `user/`) under `src/api/`
- **Zod validation**: All API responses are validated using Zod schemas with exported TypeScript types

### Key Components
- `src/api/api.ts`: Core API class and singleton management with `getApi()` helper
- `src/api/utils.ts`: Signature creation for Last.fm API authentication using SparkMD5
- API methods follow consistent patterns: request type → validation → API call → Zod parsing

### Authentication Pattern
Last.fm API requires API signatures created by:
1. Sorting all parameters alphabetically
2. Concatenating key-value pairs with shared secret
3. MD5 hashing the result using SparkMD5

### Testing
- Uses Bun's native test runner with `describe/it/beforeAll`
- Tests require environment variables: `API_KEY`, `SHARED_SECRET`, `SESSION_KEY`
- Test files located alongside implementation in `__tests__/` subdirectories

### Module Exports
The library selectively exports functionality via `src/index.ts` - some methods are commented out indicating work-in-progress status.