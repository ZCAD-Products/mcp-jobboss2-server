# Repository Guidelines

## Project Structure & Module Organization
This repository is TypeScript-first and Bun-first.

- `src/index.ts`: FastMCP server entrypoint.
- `src/fastmcp/registerTools.ts`: central tool registration and handler wiring.
- `src/tools/*.ts`: tool definitions and handler implementations by domain (`orders`, `inventory`, `production`, etc.).
- `src/schemas.ts` and `src/types.ts`: Zod validation schemas and shared types.
- `tests/*.test.ts`: Jest unit/integration tests.
- `tests/smoke/`: tier-one read-only smoke suite for staging environments.
- `dist/`: compiled output from `tsc` (generated).

## Build, Test, and Development Commands
- `bun install`: install dependencies.
- `bun run build`: compile TypeScript to `dist/`.
- `bun run watch`: rebuild continuously during development.
- `bun run start`: run compiled server (`dist/index.js`).
- `bun run dev`: one-shot build + run.
- `bun run test`: run Jest suites (`tests/**/*.test.ts`).
- `bun run test:smoke:tier1`: run staging-only, read-only smoke checks.

## Coding Style & Naming Conventions
- TypeScript is strict (`tsconfig.json` has `strict: true`); keep types explicit on public boundaries.
- Use ESM imports and `.js` file extensions in TypeScript import paths.
- Match local formatting in touched files (2-space style in most `src/`; older tests may use 4 spaces).
- Naming:
  - tool IDs: `snake_case` (for MCP tool names)
  - functions/vars: `camelCase`
  - types/classes/schemas: `PascalCase`

## Testing Guidelines
- Framework: Jest with `ts-jest` (`jest.config.cjs`).
- Test files: `*.test.ts` under `tests/`; keep domain coverage close to changed handlers.
- For new tools, add both behavior tests (handler output/errors) and registration/path tests when applicable.
- Smoke tests require explicit staging env vars (`SMOKE_TIER1=1`, allowlisted hosts, API credentials).

## Commit & Pull Request Guidelines
- Prefer Conventional Commit prefixes used in history: `feat:`, `fix:`, `perf:`, `test:`, `chore:`.
- Keep commit subjects short and imperative (example: `fix: encode dynamic URL path parameters`).
- PRs should include:
  - clear summary of affected tools/endpoints
  - linked issue (if available)
  - test evidence (at minimum `bun run test`; include smoke output when relevant)
  - notes on env/config changes

## Security & Configuration Tips
- Never commit real credentials or `.env`; use `.env.example` as the template.
- Keep smoke execution pointed at staging and respect host allowlist/blocklist guardrails.
