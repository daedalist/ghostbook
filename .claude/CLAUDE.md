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

- **TypeScript**: Use for Next.js app directory files (.tsx)
- **JavaScript**: Acceptable for components and utilities (.js, .jsx)
- **Mixed approach**: Keep existing JS files as-is, use TS for new App Router files

### Formatting

**Prettier handles all code formatting automatically.** Configuration in `.prettierrc.json`:

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX attributes
- **Semicolons**: Always used
- **Line width**: 80 characters
- **Trailing commas**: ES5 style

**How to use:**

- Run `npm run format` to auto-format all code
- Enable "Format on Save" in your editor for automatic formatting
- Prettier integrates with ESLint (no conflicts)

### React Patterns

- Use functional components with hooks for new code
- Class components exist in legacy code (Ghostbook.jsx) - OK to keep
- Client components must have `'use client'` directive (Next.js 16 requirement)

### Naming Conventions

- **Components**: PascalCase (e.g., `ObservationList.jsx`)
- **Utilities**: camelCase (e.g., `evidenceState.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `NOT_SELECTED`)

## Project Architecture

### Directory Structure

```
src/
├── app/              # Next.js App Router (TypeScript)
├── components/       # React components (JS/JSX)
└── lib/              # Utilities and data (JavaScript)
```

### Key Files

- `src/lib/ghost_data_map.json` - Ghost evidence mappings (game data)
- `src/lib/evidenceState.js` - Evidence state constants
- `next.config.js` - Next.js configuration for static export
- `eslint.config.mjs` - ESLint configuration

### Static Site Generation

- Uses Next.js `output: 'export'` for static builds
- Base path: `/ghostbook` for GitHub Pages
- Build output: `build/` directory
- Images are unoptimized for static compatibility

## Important Notes

### GitHub Pages Deployment

- The site is deployed at `daedalist.github.io/ghostbook/`
- Always test with `npm run test:github-pages` before deploying
- Base path is configured in `next.config.js`

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

### Evidence State Logic

Four evidence states:

- `NOT_SELECTED` - Default
- `SELECTED` - User confirmed evidence
- `RULED_OUT` - User confirmed NOT present
- `DISABLED` - Impossible based on current candidates

### Ghost Scoring Algorithm

- +10 points: matching primary evidence
- +5 points: matching fake evidence
- -10 points: contradictory evidence (elimination)

## Dependencies

- Next.js 16.0.3
- React 19.2.0
- ESLint with Next.js config
- TypeScript 5.9.3 (for type checking)

## Working with Claude Code

### Important Reminders

**Working Directory Awareness:**

- Sessions may start in different directories (e.g., `/Users/david/Code/ghostbook/.claude/notes`)
- **ALWAYS check `pwd` before using relative paths** like `cd .claude/notes`
- Use absolute paths or verify current location first to avoid "no such file or directory" errors
- The Bash tool maintains a persistent working directory across tool calls

**Example of common mistake:**

```bash
# BAD: Blindly using relative path
cd .claude/notes && git status

# GOOD: Check location first
pwd                    # Verify current directory
git status            # Use commands directly if already in right place
```

**Git in .claude/notes:**

- `.claude/notes/` is a separate git repository (git-ignored in main repo)
- Work directly from the notes directory or use git commands without cd
- Changes stay local and private

### Git Workflow Best Practices

**When to Create a Pull Request:**

- Feature work (new functionality)
- Bug fixes
- Refactoring
- Any code changes that should be reviewed by CI

**When to Commit Directly to Main:**

- Documentation updates (README, CONTRIBUTING, etc.)
- `.claude/*` configuration changes (settings, commands)
- Typo fixes in documentation
- **NEVER**: Code changes, dependency updates, or breaking changes

**Branch Workflow:**

```bash
# Starting new work
git checkout main
git pull origin main
git checkout -b type/descriptive-name

# Make changes, then commit
git add <files>
git commit -m "type: description"

# Push and create PR
git push -u origin type/descriptive-name
gh pr create --title "..." --body "..."
```

**After PR is Merged:**

```bash
git checkout main
git pull origin main
git branch -d type/descriptive-name      # Delete local branch
git push origin --delete type/descriptive-name  # Delete remote if needed
```

**Avoid Unnecessary Complexity:**

- ❌ Don't use `git cherry-pick` unless truly needed (hotfixes, specific commits across branches)
- ❌ Don't create branches for simple doc changes - commit directly to main
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

## Recent Changes

- Upgraded from Next.js 15 to 16
- Upgraded Node.js to v24 for compatibility
- Migrated from Create React App to Next.js
- Updated ESLint config to Next.js 16 format
