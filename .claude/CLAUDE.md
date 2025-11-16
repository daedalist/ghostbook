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

### Testing & Deployment
- `npm run test:github-pages` - Test GitHub Pages deployment locally
- `npm run clean` - Remove all build artifacts (build/, .next/, test-deploy/)

## Code Style & Conventions

### File Organization
- **TypeScript**: Use for Next.js app directory files (.tsx)
- **JavaScript**: Acceptable for components and utilities (.js, .jsx)
- **Mixed approach**: Keep existing JS files as-is, use TS for new App Router files

### Formatting
- **Indentation**: 2 spaces (no tabs)
- **Quote style**: Follow existing patterns in the file
- **Semicolons**: Use them consistently

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

## Recent Changes
- Upgraded from Next.js 15 to 16
- Upgraded Node.js to v24 for compatibility
- Migrated from Create React App to Next.js
- Updated ESLint config to Next.js 16 format
