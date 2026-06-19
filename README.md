# EWRS Web React Migration

This is the Vite React migration workspace for moving EWRS from Angular to React.

## Current Status

- Vite React TypeScript app initialized.
- Strict TypeScript enabled.
- App shell moved under `src/app`: `AppShell` composes `AppHeader` (responsive logo/title, account menu with working theme controls, role-gated primary nav) and `AppFooter` (two-tier EWRS footer). Header and footer are shell-only chrome, so they live beside `AppShell` rather than in `src/shared/components`.
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
- MSAL React provider wiring added through `src/app/AppProviders.tsx` so app-wide providers stay centralized.
- Generic API client foundation added with API base URL validation, MSAL/e2e bearer token injection, and safe non-2xx errors.
- OpenAPI type generation configured with `@hey-api/openapi-ts`; generated types live under `src/api/generated`.
- TanStack Query provider added through `src/app/AppProviders.tsx` with centralized retry defaults in `src/api/queryClient.ts`.
- AppInsights telemetry wrapper added under `src/telemetry`, initialized from `AppProviders`, with safe no-op behavior when telemetry config is absent.
- Shared alert provider and host added under `src/shared/alerts`, wired through `AppProviders` and `App`, with Figma-aligned Ontario page alert styling, target-aware rendering, explicit close behavior, and text-only message output.
- Shared loader provider and top progress overlay added under `src/shared/loader`, wired through `AppProviders` and `App`, with manual loader controls plus automatic TanStack Query fetch/mutation activity detection.
- Shared theme provider added under `src/shared/theme`, wired through `AppProviders`, with `system`/`light`/`dark` preference support, legacy `darkMode` migration, persisted `themePreference`, and root/body theme classes.
- Shared CSS theme tokens added under `src/styles/tokens.css`; light mode is sourced from the Ontario Design System UI prototyping kit colour page, and dark mode uses Carbon Gray 90 neutral surfaces only where ODS does not define a dark equivalent while preserving Ontario blue action/focus colors.
- Role constants and nav authorization helpers added under `src/auth/roles.ts`, preserving the exact Angular numeric role IDs and `authorize*` visibility rules.
- `useCurrentUser` hook added under `src/auth/useCurrentUser.ts`, loading `GET /api/User/me` through the shared API client and TanStack Query; the header reads it to gate primary nav by role.

Not implemented yet: routing (nav uses plain anchors until React Router is added), sign in/out and MSAL account-name wiring in the header, the Active-status/`/register` redirect (needs the Angular `userStatus.const` values), feature API hooks, and real CI pipeline updates. Storybook still needs Phase 2 work: global decorators (theme/router/query/alerts), auth mocks, the a11y and docs addons, and the Azure Static Web Apps deployment.

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
npm.cmd run generate:api-types
```

## API Types

Generate API types from the approved local Swagger source:

```powershell
npm.cmd run generate:api-types
```

The generated files are written to:

```text
src/api/generated/
```

Do not manually edit generated API files. Regenerate them from Swagger instead. Generated files are excluded from formatting and linting so generator output stays intact.

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
