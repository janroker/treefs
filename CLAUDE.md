@backend/AGENTS.md

# Project

A file tree metadata service: a NestJS API (`backend/apps/api`), a Vite and React SPA (`web`), PostgreSQL as the
source of truth. It is a time-boxed take-home: build every feature, cut expensive proof
and polish, and record each cut in the README's "Trade-offs and what I skipped" section.

The repository is a pnpm workspace of two packages. `backend` is a Nest CLI workspace in monorepo mode (see
https://docs.nestjs.com/cli/monorepo) with its own `package.json`, `tsconfig.json`, `nest-cli.json` and ESLint
config; each Nest app has its own `tsconfig.app.json`. `web` is a Vite project with its own configs. The root
holds what covers both: `tsconfig.base.json`, `eslint.base.js`, Prettier, commitlint, husky, knip, Docker
Compose and the fan-out scripts. Put a setting at the narrowest level that needs it.

## Rules that override defaults

- Never add `Co-Authored-By` or any other attribution line to a commit message or PR description.
- Never write the project's old codename into the codebase, package names, container names or docs. The name is
  `treefs`.
- Follow the documented Nest approach. Do not delete or replace generated files, scripts or dependencies
  (`backend/AGENTS.md`, `README.md`, `backend/nest-cli.json`, the generated scripts) without asking first.
- Avoid code comments. Make names self-explanatory and extract anything complex into a named function. A comment
  is allowed only when the reason cannot be expressed in code, and `eslint-disable` always needs a description.
- Return types live in a types file in the same domain, for example `items/types/items.types.ts`, never inline as
  an object literal. ESLint enforces this.
- Schemas (zod) and DTOs live next to their domain in the API. The web app gets types generated from the API at
  build time; it never imports schemas.
- Keep `strictPropertyInitialization` on. Declare framework-assigned properties with `!` (`email!: string`).
- The whole API sits behind the `/api` base path.

## Commands

```sh
pnpm check         # prettier, eslint, typecheck, knip, unit and e2e tests: must pass before every commit
PORT=3001 pnpm start:dev   # API with watch; port 3001 so it does not clash with the web dev server
pnpm start:debug   # API with the debugger on 9229
pnpm dev:web       # Vite on :3000, proxies /api to :3001
pnpm test          # unit tests (*.spec.ts)
pnpm test:e2e      # integration tests (*.e2e-spec.ts), need Postgres
```

## Code style

- Simplicity over abstraction. Add an interface, factory or generic helper only when its second real caller
  exists. Inheritance is a last resort: share logic with plain functions or composition first, and say why in the
  commit body when a base class is added.
- Early returns. No `else` after `return`, no nested ternaries, max nesting depth 3.
- Small units: complexity ≤ 8, cognitive complexity ≤ 10, functions ≤ 40 lines, ≤ 3 parameters (more become one
  object), files ≤ 250 lines. ESLint enforces these as errors.
- No TypeScript enums. Use an `as const` object named in camelCase with camelCase keys and values, and derive a PascalCase type from it:
  ```ts
  export const itemType = { file: 'file', folder: 'folder' } as const;
  export type ItemType = (typeof itemType)[keyof typeof itemType];
  ```
- Named exports only (config files excepted).
- Relative imports have no file extension (`moduleResolution: bundler`), not `.js` as `backend/AGENTS.md` says.

## API rules

- Layers: controller (HTTP only) → service (use case, transaction) → repository (SQL). Services throw domain
  errors; one exception filter maps them to RFC 9457 problem+json.
- The database enforces invariants (unique names, parent must be a folder, depth cap). Insert first and map the
  SQLSTATE; never check-then-insert.
- Migrations are hand-written SQL in TypeORM migration classes.
- Delete is one `DELETE`; `ON DELETE CASCADE` removes the subtree. No ORM cascades, no `.remove()`.
- No `eager` or `lazy` relations: load relations explicitly in the query.
- Transactions only through `runInTransaction`; nothing but database work inside it (it may retry).
- Connections are borrowed per query or transaction, never held for a request.
- `process.env` is read only in the config module.
- Validation: zod schemas passed as `schema` to `@Body()`, `@Query()` and `@Param()` through
  `StandardSchemaValidationPipe`.

## Tests

- Specs live in a `__spec__` folder inside the module they cover.
- Integration tests by default (`*.e2e-spec.ts`): boot the Nest app and call it over HTTP with supertest, against
  the real Postgres. Unit tests (`*.spec.ts`) only for pure functions. Never mock repositories or the DataSource.
- Each suite declares the tables it touches and cleans up with the shared helpers: `truncateTables` in
  `afterEach`, `truncateAll` in `afterAll`.
- Write the failing test first.

## Commits

Conventional commits (commitlint), scopes: api, web, db, tooling, docker, docs, test, deps. One phase of the
plan per commit, about 300 changed lines; the body says why. Hooks need Node: on a host without it, run
`pnpm check` in the dev container and commit with `HUSKY=0`.

## Skills

Third-party Claude skills are installed locally into `.claude/skills/`, which is git-ignored. Never commit them.
