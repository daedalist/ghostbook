# Phasmophobia Ghostbook

A web app for [Phasmophobia](https://store.steampowered.com/app/739630/Phasmophobia/) to keep track of evidence and narrow down which ghost you are hunting (or is hunting you)!

Built with Next.js and deployed as a static site.

🔗 **Live App**: [daedalist.github.io/ghostbook](https://daedalist.github.io/ghostbook/)

## Features

- **Evidence Tracking**: Click evidence to cycle through states (Not Selected → Selected → Ruled Out)
- **Smart Ghost Filtering**: Automatically filters possible ghosts based on your evidence
- **Evidence Disabling**: Grays out evidence that's impossible based on current selections
- **Reset Function**: Clear all evidence with one click
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/daedalist/ghostbook.git
   cd ghostbook
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/ghostbook/](http://localhost:3000/ghostbook/) in your browser

   ⚠️ **Note:** The app uses the `/ghostbook` base path to match the GitHub Pages deployment structure.

## Available Scripts

### Development

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the app for production
- `npm start` - Build and serve the production version locally

### Testing

- `npm test` - Run the unit test suite once
- `npm run test:watch` - Run tests in watch mode during development
- `npm run test:github-pages` - Test the app as it will appear on GitHub Pages

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format:check` - Check Prettier formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts and test files

## How to Use

1. **Select Evidence**: Click on evidence types as you discover them in-game
   - First click: Mark as "Selected" (white background)
   - Second click: Mark as "Ruled Out" (gray background with strikethrough)
   - Third click: Return to "Not Selected"

2. **View Possible Ghosts**: The right panel shows ghosts ranked by likelihood based on your evidence

3. **Evidence Auto-Disable**: Evidence that becomes impossible will be grayed out automatically

4. **Reset**: Use the "Reset" button to clear all evidence and start fresh

## Technology Stack

- **Next.js 16** - React framework with static site generation
- **React 19** - UI library
- **TypeScript** - Type safety for app router files
- **ESLint** - Code quality and best practices
- **Prettier** - Automated code formatting
- **CSS** - Custom styling with CSS Grid and Flexbox
- **GitHub Pages** - Static site hosting

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── globals.css         # Global styles
│   └── [[...slug]]/        # Catch-all route for SPA behavior
│       ├── page.tsx        # Main page component
│       └── client.tsx      # Client-side wrapper
├── components/
│   ├── Ghostbook.jsx       # Main application component
│   ├── ObservationList.jsx # Evidence tracking interface
│   └── CandidateList.jsx   # Ghost filtering display
└── lib/
    ├── ghost.js            # Ghost and evidence data
    ├── ghost_data_map.json # Ghost evidence mappings
    └── evidenceState.js    # Evidence state constants
```

## Development Notes

### Migration from Create React App

This project was migrated from Create React App to Next.js to take advantage of:

- Better build optimization and tree-shaking
- Automatic code splitting
- Static site generation
- Foundation for future server-side features

The app currently runs as a Single Page Application (SPA) using Next.js static export for GitHub Pages compatibility.

### Evidence State Management

Evidence states are managed using JavaScript Maps and React class component state. Each evidence type can be in one of four states:

- `NOT_SELECTED` - Default state
- `SELECTED` - User has confirmed this evidence
- `RULED_OUT` - User has confirmed this evidence is NOT present
- `DISABLED` - Evidence is impossible based on current ghost candidates

### Ghost Scoring Algorithm

Ghosts are scored based on evidence:

- +10 points for each matching primary evidence
- +5 points for each matching fake evidence
- -10 points (elimination) for contradictory evidence

## Testing

### Unit Tests

Unit tests are written with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/). Run them with:

```bash
npm test
```

The test suite covers three areas:

- **Data integrity** — validates evidence constants, evidence state values, and the ghost data map (correct evidence counts, no overlaps between primary and fake evidence, all entries reference valid evidence names).
- **Component rendering** — verifies that Header, Ghost, ObservationList, and CandidateList render the expected elements, apply the correct CSS classes for each evidence state, and call the right callbacks on click.
- **User journeys** — exercises the full Ghostbook component: selecting evidence and verifying ghost filtering, cycling evidence through all states, ruling out evidence to eliminate ghosts, resetting to the initial state, evidence auto-disabling when only one candidate remains, and The Mimic's fake-evidence scoring.

Tests run in a jsdom environment so they don't need a browser. During development, `npm run test:watch` re-runs affected tests on file save.

### End-to-End (E2E) Tests

E2E tests are written with [Playwright](https://playwright.dev/) and verify the functionality of the deployed application in a real browser.

To run the E2E tests:

```bash
npm run test:e2e
```

The E2E test suite covers two main areas:

- **Page Rendering**: Ensures that all UI elements, such as the header, evidence buttons, and candidate list, render correctly on page load.
- **User Interactions**: Simulates user behavior, such as clicking evidence buttons, filtering ghosts, and using the reset button, to verify that the application's features work as expected.

Playwright is configured to automatically start the application server, run the tests, and then shut down the server.

## Deployment

The app is configured for static deployment to GitHub Pages:

1. Build the static site:

   ```bash
   npm run build
   ```

2. The `build/` directory contains all static files ready for deployment

3. GitHub Pages serves from the `/ghostbook` path, configured via `basePath` in `next.config.js`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Setting up your development environment
- Code style and formatting (Prettier & ESLint)
- Making changes and submitting pull requests
- Testing and build verification

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Phasmophobia](https://store.steampowered.com/app/739630/Phasmophobia/) by Kinetic Games
- Ghost data and evidence information from the Phasmophobia community
- Originally built with Create React App, migrated to Next.js

---

Happy ghost hunting! 👻
