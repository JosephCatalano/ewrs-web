# EWRS Web React Migration

This is the Vite React migration workspace for moving EWRS from Angular to React.

## Current Status

- Vite React TypeScript app initialized.
- Strict TypeScript enabled.
- App shell moved under `src/app`.
- Initial migration folders created under `src/api`, `src/auth`, `src/features`, and `src/shared`.
- Public environment contract added in `.env.example`.
- Local developer override file added in `.env.local`.
- Vite dev server configured for port `4200`.
- Build mode scripts added for development, UAT, and production.
- Prettier installed with format scripts and project config.
- Husky pre-commit hook added to run lint-staged.
- Vitest and React Testing Library installed with a migration shell smoke test.
- Playwright installed with migration shell and static file e2e smoke tests.
- Storybook (React/Vite) initialized: shared `preview.tsx` loads the app root CSS, an `App` story exists with play assertions, and `npm run build-storybook` is verified.
- Angular-equivalent npm script names are present for CI migration parity: `lint`, `test`, `e2e`, `storybook`, `build-storybook`, and build modes.
- Shared environment mode files added for public browser config: `.env.development`, `.env.uat`, and `.env.production`.
- Static docs, assets, and IIS `web.config` copied into Vite `public/` and verified in `dist/`.
- Typed app config loader added to centralize and validate public `VITE_*` runtime config before auth/API work.
- MSAL browser config helpers added for the centralized public app config, preserving redirect auth, local storage cache, Graph `user.read`, and EWRS API scope requests.

Not implemented yet: routing, MSAL provider wiring, API client, generated API types, and real CI pipeline updates. Storybook still needs Phase 2 work: global decorators (theme/router/query/alerts), auth mocks, the a11y and docs addons, and the Azure Static Web Apps deployment.

## Environment Files

All `VITE_*` values are exposed to browser JavaScript. Do not put secrets, client secrets, passwords, private keys, or real e2e tokens in any Vite env file.

Use `.env.example` as the committed contract for required variables.

Use `.env.local` for local machine overrides. It should stay uncommitted.

Shared environment files exist for environment-specific public browser config:

```text
.env.development
.env.uat
.env.production
```

Do not put real e2e tokens in shared env files. Keep those in local-only e2e env files or pipeline secrets.

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
npm.cmd run storybook
npm.cmd run build-storybook
```

## Verification

Before marking migration setup work complete, run:

```powershell
npm.cmd run format:check
npm.cmd run lint
npm.cmd run test
npm.cmd run e2e
npm.cmd run build
npm.cmd run build-storybook
```

## Migration Source Of Truth

Follow the repository migration plan in:

```text
../REACT_VITE_MIGRATION.md
```
