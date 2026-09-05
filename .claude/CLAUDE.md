# Ghostbook Project Memory

## Project Overview

Ghostbook is a web application for the game Phasmophobia that helps players track evidence and identify ghosts during gameplay. Built with Next.js 16 and React 19, deployed as a static site to GitHub Pages.

## Claude Code Configuration

### .claude Directory Structure

```
.claude/
├── CLAUDE.md              # This file - project memory (committed)
├── settings.json          # Team permissions & config (committed)
├── settings.local.json    # Personal overrides (git-ignored)
├── commands/              # Custom slash commands (committed)
│   ├── pre-commit.md
│   ├── test-deploy.md
│   ├── clean-rebuild.md
│   ├── lint-fix.md
│   └── review-pr.md
└── notes/                 # Private planning & notes (git-ignored)
    └── improvement-plans.md
```

### Using the notes/ Directory

- **Purpose**: Store private planning documents, improvement ideas, personal notes
- **Git-ignored**: Contents are NOT committed to the repository
- **Convention**: Put any personal/private planning files in `.claude/notes/` to keep them separate from team configuration
- **Examples**: Project roadmaps, feature brainstorming, refactoring plans, personal TODOs

### Custom Slash Commands

Available custom commands:

- `/pre-commit` - Run comprehensive pre-commit checks (format, type-check, lint)
- `/test-deploy` - Test GitHub Pages deployment locally
- `/clean-rebuild` - Clean all artifacts and rebuild from scratch
- `/lint-fix` - Run ESLint with auto-fix
- `/review-pr` - Review code changes with React/Next.js focus

## Key Commands

### Development

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production (outputs to `build/` directory)
- `npm start` - Serve the production build locally

### Code Quality

- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Auto-format code with Prettier
- `npm run format:check` - Check if code is formatted (CI-friendly)
- `npm run type-check` - Check TypeScript types without building
- `npm run lint:types` - Run both type-check and lint together

### Testing & Deployment

- `npm run test:github-pages` - Test GitHub Pages deployment locally
- `npm run clean` - Remove all build artifacts (build/, .next/, test-deploy/)

## Code Style & Conventions

### File Organization

- **TypeScript throughout** (.ts, .tsx). The JavaScript migration is complete -
  no `.js`/`.jsx` remains in `src/`, and new files should not add any.

### Formatting

**Prettier handles all code formatting automatically.** The rules live in
`.prettierrc.json` - read that rather than a copy of it here. Note it also
formats Markdown, so documentation changes can fail `format:check` in CI.

**Pre-commit hook:**

- A husky pre-commit hook runs Prettier automatically on staged files via lint-staged
- No manual formatting step needed before committing — just commit and the hook handles it
- Run `npm run format` to manually format all files if needed
- Prettier integrates with ESLint (no conflicts)

### React Patterns

- Use functional components with hooks for new code
- Class components exist in legacy code (Ghostbook.tsx) - OK to keep
- Client components must have `'use client'` directive (Next.js 16 requirement)

### Naming Conventions

- **Components**: PascalCase (e.g., `ObservationList.tsx`)
- **Utilities**: camelCase (e.g., `evidenceState.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `NOT_SELECTED`)

## Project Architecture

### Directory Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
└── lib/              # Utilities, types and game data
```

Full file-by-file tree: [README.md → Project Structure](../README.md#project-structure).

### Key Files

- `src/lib/ghost_data_map.json` - Ghost evidence mappings (game data)
- `src/lib/evidenceState.ts` - Evidence state constants
- `next.config.mjs` - Next.js configuration for static export
- `eslint.config.mjs` - ESLint configuration

## Important Notes

### GitHub Pages Deployment

- The site is deployed at `daedalist.github.io/ghostbook/`
- Always test with `npm run test:github-pages` before deploying
- Base path is configured in `next.config.mjs`

### Analytics (Optional)

The project supports **Cloudflare Web Analytics** for basic page view tracking.

**Setup (Optional):**

1. Create a free Cloudflare account
2. Set up Web Analytics at https://dash.cloudflare.com
3. Copy your analytics token
4. Create `.env.local` file (git-ignored): `cp .env.local.example .env.local`
5. Add your token: `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_token_here`

**For GitHub Pages deployment:**

- Add the token as a GitHub Actions secret: `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
- The token is embedded into the build during GitHub Actions
- If no token is provided, the site works normally without analytics

**Privacy:**

- No cookies required (GDPR compliant)
- Privacy-focused tracking (page views only)
- Token is client-side by design (safe to be public)

### CI Tooling Is Pinned (Do Not Use `npx tool@latest`)

Anything CI runs must be an exact-pinned `devDependency` installed by `npm ci`,
invoked as a local binary - never fetched at runtime.

- Workflow steps: `./node_modules/.bin/serve` (the job needs its own `npm ci`)
- npm scripts: bare `http-server` (npm puts `node_modules/.bin` on `PATH`)

`npx serve@latest` previously downloaded `serve` inside the `test-deployment`
job's 30-second readiness budget; the download took ~24s and failed whenever a
runner landed in a slower region. `npx` can also swallow single-letter flags
meant for the tool (`-l`, `-p`). See CONTRIBUTING.md → "CI Tooling Must Be
Pinned" for the full write-up.

### Domain Logic

The four evidence states and the ghost scoring algorithm are described in
[README.md → Development Notes](../README.md#development-notes), and implemented
in `src/components/Ghostbook.tsx`. The code is the authority.

## Dependencies

Read `package.json`. Versions are not restated here - Dependabot moves them
weekly, so any copy is wrong within days. Production dependencies are just
`next`, `react` and `react-dom`.

## Working with Claude Code

### Important Reminders

**Working Directory Awareness:**

Sessions do not always start in the repository root, and the Bash tool keeps a
persistent working directory. Check `pwd` before relying on a relative path.

**Git in .claude/notes:**

- `.claude/notes/` is a separate git repository (git-ignored in main repo)
- Work directly from the notes directory or use git commands without cd
- Changes stay local and private

### Git Workflow Best Practices

**Everything goes through a pull request**, documentation included. `main`
requires a passing `all-checks` status, and `format:check` covers Markdown - so
a docs commit can fail CI just as a code change can. Admins can bypass branch
protection; don't.

**Avoid Unnecessary Complexity:**

- ❌ Don't use `git cherry-pick` unless truly needed (hotfixes, specific commits across branches)
- ❌ Don't commit on wrong branch then try to move changes - start over on correct branch
- ✅ Use simple, linear workflows when possible
- ✅ Check current branch with `git status` before making changes

**Branch Naming Conventions:**

- `feat/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks (tooling, deps, config)
- `docs/` - Documentation updates (if creating PR)
- `refactor/` - Code refactoring

**Commit Message Format:**

```
type: brief description (50 chars max)

Longer explanation if needed (wrap at 72 chars).
Can include multiple paragraphs.

Resolves #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
