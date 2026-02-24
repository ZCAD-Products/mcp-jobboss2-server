# JobBOSS2 MCP Rust Switchover Plan (100%)

This branch is now explicitly committed to a **full Rust switchover**.

## Goal
Replace the Bun/TypeScript server runtime with a native Rust MCP server that provides full parity for all manual and generated tools.

## Definition of Done
- Rust MCP server is the production runtime for stdio + HTTP transports.
- All current MCP tools are implemented in Rust (manual + generated).
- Rust has schema/input validation parity with current TypeScript behavior.
- OAuth/token lifecycle, retries, and error contracts match current server behavior.
- Existing test coverage is migrated (or equivalent) and passing for Rust runtime.
- TypeScript runtime path is removed from default startup and deployment flow.

## Phased Execution
1. **Runtime foundation**
   - Native Rust MCP transport handling.
   - Structured logging and graceful shutdown.
2. **Client parity**
   - JobBOSS2 API client in Rust with OAuth caching and robust error normalization.
3. **Tool parity**
   - Port manual tool handlers by domain.
   - Port generated tool mapping from OpenAPI source.
4. **Validation parity**
   - Recreate schema validation + path/query/body normalization behavior.
5. **Verification**
   - Port tests and execute parity checks against staging-safe smoke suite.
6. **Cutover**
   - Make Rust binary the primary start path.
   - Keep TS implementation only as temporary fallback until decommission.

## Branch Commitment
Until this plan is completed, work on this branch should continue prioritizing parity and full Rust ownership of runtime/tooling behavior.
