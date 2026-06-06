# EWRS Web React Migration

This is the Vite React scaffold for migrating EWRS from Angular to React.

## Current Status

- Vite React TypeScript app scaffolded.
- Strict TypeScript enabled.
- App shell moved under `src/app`.
- Initial migration folders created under `src/api`, `src/auth`, `src/features`, and `src/shared`.
- Public environment contract added in `.env.example`.
- Local developer override file added in `.env.local`.
- Vite dev server configured for port `4200`.
- Build mode scripts added for development, UAT, and production.
- Prettier installed with format scripts and project config.
- Husky pre-commit hook added to run lint-staged.
- Vitest and React Testing Library installed with a scaffold smoke test.
- Playwright installed with a scaffold e2e smoke test.

Not implemented yet: routing, MSAL auth, API client, generated API types, Storybook, shared environment mode files, static docs/assets migration, and CI pipeline updates.

## Environment Files

All `VITE_*` values are exposed to browser JavaScript. Do not put secrets, client secrets, passwords, private keys, or real e2e tokens in any Vite env file.

Use `.env.example` as the committed contract for required variables.

Use `.env.local` for local machine overrides. It should stay uncommitted.

Later shared environment files can be added as needed:

```text
.env.development
.env.uat
.env.production
```

## Local Development

From this folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:4200/
```

Use `npm.cmd` in PowerShell if `npm.ps1` is blocked by local execution policy.

## Available Scripts

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run test
npm.cmd run test:watch
npm.cmd run e2e
npm.cmd run e2e:ui
npm.cmd run format
npm.cmd run format:check
npm.cmd run build
npm.cmd run build:dev
npm.cmd run build:uat
npm.cmd run build:prod
npm.cmd run preview
```

## Verification

Before marking migration setup work complete, run:

```powershell
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test
npm.cmd run e2e
npm.cmd run build
```

## Migration Source Of Truth

Follow the repository migration plan in:

```text
../REACT_VITE_MIGRATION.md
```
