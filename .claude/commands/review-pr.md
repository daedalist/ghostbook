---
description: Review code changes with focus on React/Next.js best practices
allowed-tools: [Bash, Read, Grep]
argument-hint: [pr-number or branch-name]
---

Review code changes for a pull request or branch, focusing on React and Next.js best practices.

Steps:
1. Get the diff of changes (use git diff or compare against main branch)
2. Review the changes for:
   - React 19 and Next.js 16 compatibility
   - Proper use of 'use client' directive for client components
   - Code style consistency (2-space indentation, naming conventions)
   - Potential bugs or logic errors
   - Performance considerations
   - Static export compatibility (no server-side features)
3. Check if changes affect:
   - Ghost scoring algorithm
   - Evidence state management
   - GitHub Pages deployment configuration
4. Provide a summary of findings with specific file:line references
5. Suggest improvements or approve the changes
