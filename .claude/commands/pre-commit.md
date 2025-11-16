---
description: Run comprehensive pre-commit checks (format, type-check, lint)
allowed-tools: [Bash]
---

Run all code quality checks before committing to ensure code meets project standards.

Steps:

1. Run `npm run format` to auto-format all code with Prettier
2. Run `npm run lint:types` to check both TypeScript types and ESLint rules
3. Report the results of each check
4. If all checks pass, confirm the code is ready to commit
5. If any checks fail, provide specific error messages and suggest fixes

This command ensures:

- Code is properly formatted (Prettier)
- TypeScript types are correct (tsc --noEmit)
- ESLint rules are satisfied
- No code quality issues before creating a commit
