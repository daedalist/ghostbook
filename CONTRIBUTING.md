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

**Before committing:**

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

- **TypeScript (.tsx, .ts):** Use for Next.js app directory files
- **JavaScript (.jsx, .js):** Acceptable for components and utilities
- **Mixed approach:** Keep existing JS files as-is, use TS for new App Router files

### Naming Conventions

- **Components:** PascalCase (e.g., `ObservationList.jsx`)
- **Utilities:** camelCase (e.g., `evidenceState.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `NOT_SELECTED`)

### React Patterns

- Use **functional components with hooks** for new code
- Class components exist in legacy code (`Ghostbook.jsx`) - OK to keep
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

Run these checks:

```bash
npm run format      # Format code
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

```
src/
├── app/                  # Next.js App Router (TypeScript)
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Global styles
│   └── [[...slug]]/      # Catch-all route for SPA behavior
│       ├── page.tsx      # Main page component
│       └── client.tsx    # Client-side wrapper
├── components/           # React components (JavaScript/JSX)
│   ├── Ghostbook.jsx     # Main application component (class)
│   ├── ObservationList.jsx  # Evidence tracking interface
│   ├── CandidateList.jsx    # Ghost filtering display
│   └── Ghost.jsx         # Individual ghost component
└── lib/                  # Utilities and data (JavaScript)
    ├── evidence.js       # Evidence definitions
    ├── evidenceState.js  # Evidence state constants
    └── ghost_data_map.json  # Ghost evidence mappings
```

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
- [ ] UI is responsive on mobile and desktop
- [ ] No console errors or warnings
- [ ] App works at `/ghostbook/` path (matches GitHub Pages)

### Build Verification

Always verify the build succeeds before submitting a PR:

```bash
npm run build
```

The build should complete without errors or warnings.

## Technical Details

### Evidence State Management

Evidence states are managed using JavaScript Maps and React class component state. Each evidence type can be in one of four states:

- `NOT_SELECTED` - Default state
- `SELECTED` - User has confirmed this evidence
- `RULED_OUT` - User has confirmed this evidence is NOT present
- `DISABLED` - Evidence is impossible based on current ghost candidates

### Ghost Scoring Algorithm

Ghosts are scored based on evidence:

- **+10 points** - Each matching primary evidence
- **+5 points** - Each matching fake evidence
- **-10 points** - Contradictory evidence (elimination)

### Static Site Generation

- Uses Next.js `output: 'export'` for static builds
- Base path: `/ghostbook` for GitHub Pages deployment
- Build output: `build/` directory
- Images are unoptimized for static compatibility

## Getting Help

- **Issues:** Check existing issues or create a new one
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** See [README.md](README.md) and [.claude/CLAUDE.md](.claude/CLAUDE.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Ghostbook! 👻
