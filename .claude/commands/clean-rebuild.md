---
description: Clean all build artifacts and rebuild from scratch
allowed-tools: [Bash]
---

Perform a complete clean and rebuild of the project.

Steps:

1. Run `npm run clean` to remove all build artifacts (build/, .next/, test-deploy/)
2. Run `npm run build` to create a fresh production build
3. Report the build status and any warnings/errors
4. Confirm the build directory is ready for deployment
