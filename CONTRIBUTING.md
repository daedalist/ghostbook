# Contributing to Ghostbook

Thank you for your interest in contributing to Ghostbook! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style & Formatting](#code-style--formatting)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Getting Started

### Prerequisites

- **Node.js** v24 or higher
- **npm** (comes with Node.js)
- **Git**

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ghostbook.git
   cd ghostbook
   ```

3. **Add upstream remote:**

   ```bash
   git remote add upstream https://github.com/daedalist/ghostbook.git
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Open the app:** Navigate to [http://localhost:3000/ghostbook/](http://localhost:3000/ghostbook/)

   ⚠️ **Important:** The app uses the `/ghostbook` base path to match GitHub Pages deployment. You must include `/ghostbook/` in the URL for local development.

## Code Style & Formatting

### Automated Formatting with Prettier

This project uses **Prettier** for consistent code formatting. All formatting is handled automatically.

**Pre-commit hook:**

A pre-commit hook runs **Prettier automatically** on staged files via [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged). After running `npm install`, the hook is set up automatically — no manual formatting step is needed before committing.

**Manual commands:**

```bash
npm run format        # Auto-format all code
npm run format:check  # Check if code is formatted (CI-friendly)
npm run type-check    # Check TypeScript types
npm run lint:types    # Run both type-check and lint (comprehensive)
```

**Editor Setup (Recommended):**

- Install the Prettier extension for your editor (VS Code, IntelliJ, etc.)
- Enable "Format on Save" in your editor settings
- Prettier will automatically format on save

**Formatting Rules:**

- **Indentation:** 2 spaces (no tabs)
- **Quotes:** Single quotes for JavaScript/TypeScript, double quotes for JSX attributes
- **Semicolons:** Always required
- **Line width:** 80 characters
- **Trailing commas:** ES5 style

### Code Quality with ESLint

**Check for issues:**

```bash
npm run lint       # Check code quality
npm run lint:fix   # Auto-fix ESLint issues
```

**ESLint Rules:**

- React best practices
- TypeScript type checking
- Next.js conventions
- No formatting rules (handled by Prettier)

### File Organization

- **TypeScript (.tsx, .ts):** Used throughout. The migration from JavaScript
  is complete - there is no remaining `.js` or `.jsx` in `src/`, and new files
  should not introduce any.

### Naming Conventions

- **Components:** PascalCase (e.g., `ObservationList.tsx`)
- **Utilities:** camelCase (e.g., `evidenceState.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `NOT_SELECTED`)

### React Patterns

- Use **functional components with hooks** for new code
- Class components exist in legacy code (`Ghostbook.tsx`) - OK to keep
- Client components must have `'use client'` directive (Next.js 16 requirement)

## Making Changes

### Branch Naming

Create a descriptive branch name:

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `chore/task-description` - Maintenance tasks
- `docs/update-description` - Documentation updates

### Commit Messages

Follow conventional commit format:

```
type: brief description

Longer description if needed

Resolves #123
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `style:` - Code style changes (formatting, etc.)

### Before Committing

Prettier runs automatically on staged files via a pre-commit hook. You may also want to run these checks manually:

```bash
npm run type-check  # Check TypeScript types
npm run lint        # Check code quality
npm run lint:types  # Or run both type-check and lint together
npm run build       # Ensure build succeeds
```

## Submitting Changes

### Pull Request Process

1. **Update your fork:**

   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes and commit:**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork:**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create a Pull Request** on GitHub from your fork to the main repository

### Pull Request Guidelines

- **Title:** Clear, concise description of changes
- **Description:** Explain what changed and why
- **Link issues:** Reference related issues with "Resolves #123"
- **Tests:** Ensure all checks pass
- **Screenshots:** Include screenshots for UI changes

### Code Review

- Be responsive to feedback
- Make requested changes in new commits
- Keep discussions professional and constructive
- PRs require approval before merging

## Project Structure

See [README.md → Project Structure](README.md#project-structure). It is kept
there rather than duplicated here, so there is one tree to keep accurate.

### Key Files

- `next.config.mjs` - Next.js configuration for static export
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc.json` - Prettier formatting rules
- `.claude/CLAUDE.md` - Project memory for AI assistants

## Testing

### Local Testing

**Development server:**

```bash
npm run dev
```

Then open: [http://localhost:3000/ghostbook/](http://localhost:3000/ghostbook/)

**Production build:**

```bash
npm start
```

This builds and serves the production version with the correct `/ghostbook` base path at [http://localhost:3000/ghostbook/](http://localhost:3000/ghostbook/)

### Manual Testing Checklist

When testing your changes, verify:

- [ ] Evidence buttons cycle through states correctly (Not Selected → Selected → Ruled Out)
- [ ] Ghost list updates based on selected evidence
- [ ] Impossible evidence is disabled appropriately
- [ ] Reset button clears all evidence
- [ ] Display settings toggle the CRT theme and high-legibility mode
- [ ] UI is responsive on mobile and desktop
- [ ] No console errors or warnings
- [ ] App works at `/ghostbook/` path (matches GitHub Pages)

### Build Verification

Always verify the build succeeds before submitting a PR:

```bash
npm run build
```

The build should complete without errors or warnings.

### CI Tooling Must Be Pinned, Never Fetched at Runtime

Anything CI executes belongs in `devDependencies`, pinned to an exact version,
so `npm ci` installs it from `package-lock.json`. Never reach for
`npx some-tool@latest` in a workflow step or an npm script.

This is not a style preference - it broke CI. The `test-deployment` job used to
run:

```bash
npx --yes serve@latest ./build -l 8080   # don't do this
```

`serve` was not a dependency, so every run downloaded it from the registry
_inside_ the job's own 30-second server-readiness budget. On a fast runner the
download took ~24 seconds and passed with 6 seconds to spare; on a runner in a
slower region it exceeded 30 seconds and the job failed. Same commit, same
Node, same npm - only the runner's region differed. The e2e jobs had the same
problem via `npx http-server` inside Playwright's 120-second `webServer`
timeout.

Both are now pinned devDependencies, invoked as local binaries:

- **Workflow steps** run `./node_modules/.bin/serve` (the job needs its own
  `npm ci` step first - `node_modules` is not inherited between jobs).
- **npm scripts** call `http-server` bare; npm puts `node_modules/.bin` on
  `PATH` automatically.

Startup went from ~24s to ~2s, and the results are reproducible.

There is a second reason to avoid `npx <tool> <args>`: npm may consume
single-letter flags meant for the tool. `-l` (npm's `--long`) and `-p`
(`--parseable`) are both live hazards - on some npm versions
`npx serve ./build -l 8080` silently drops `-l`, and the tool never binds the
port you asked for. Calling the binary directly removes npm from the argument
path entirely.

Dependabot keeps these pins current through the `npm` ecosystem, so pinning
does not mean going stale.

## Technical Details

### Evidence States and Ghost Scoring

Described once in
[README.md → Development Notes](README.md#development-notes). The implementation
lives in `src/components/Ghostbook.tsx`, which is the authority if the two ever
disagree.

### Static Site Generation

- Uses Next.js `output: 'export'` for static builds
- Base path: `/ghostbook` for GitHub Pages deployment
- Build output: `build/` directory
- Images are unoptimized for static compatibility

## Getting Help

- **Issues:** Check existing issues or open a new one - this is the place for
  questions as well as bugs (Discussions is not enabled on this repository)
- **Documentation:** See [README.md](README.md) and [.claude/CLAUDE.md](.claude/CLAUDE.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Ghostbook! 👻
