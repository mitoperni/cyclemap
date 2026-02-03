# CycleMap

Explore bicycle sharing networks around the world.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Run TypeScript type checking
npm run validate         # Run type-check, lint, and tests
npm test                 # Run tests (watch mode)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

## Git Workflow

This project uses automated checks to ensure code quality:

### Pre-commit hooks (via Husky)

- **lint-staged**: Runs ESLint and Prettier on staged files
- **commitlint**: Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit message format

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

Examples:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(api): handle network timeout errors"
git commit -m "docs: update README with git workflow"
```

### CI Pipeline (GitHub Actions)

On every PR and push to main:

1. **Lint** - ESLint + Prettier check
2. **Type Check** - TypeScript compiler
3. **Test** - Vitest with coverage
4. **Build** - Next.js production build (only if all checks pass)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Zod (schema validation)
- Vitest (testing)
