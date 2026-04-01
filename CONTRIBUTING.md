# Contributing to Photobot

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Start local dev: `pnpm dev:local`

See [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md) for detailed setup instructions.

## Making Changes

1. Create a branch from `main` (`git checkout -b my-feature`)
2. Make your changes
3. Run tests: `pnpm test`
4. Commit with a clear message describing what and why
5. Push and open a pull request

## Pull Requests

- Keep PRs focused on a single change
- Include a description of what changed and why
- Make sure all tests pass before requesting review
- Add tests for new functionality

## Code Style

- TypeScript throughout the monorepo
- Use the existing patterns in the codebase as a guide
- `@/` path alias maps to `apps/dashboard/src/`
- Tests use Vitest with `vi.clearAllMocks()` in `beforeEach`

## Reporting Bugs

Open a [GitHub issue](https://github.com/kevinkiklee/photobot/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Node version and OS

## Security Issues

Please do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.
