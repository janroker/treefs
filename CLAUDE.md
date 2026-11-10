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
pnpm start:dev     # API with watch on :3001 (the default PORT; the web dev server uses :3000)
pnpm start:debug   # API with the debugger on 9229
pnpm dev:web       # Vite on :3000, proxies /api to :3001
pnpm test          # unit tests of both packages (*.spec.ts)
pnpm test:e2e      # integration tests (*.e2e-spec.ts), need Postgres
```

## Code style

- Simplicity over abstraction. Add an interface, factory or generic helper only when its second real caller
  exists. Inheritance is a last resort: share logic with plain functions or composition first, and say why in the
  commit body when a base class is added.
- Early returns. No `else` after `return`, no nested ternaries, max nesting depth 3.
- Small units: complexity ≤ 8, cognitive complexity ≤ 10, functions ≤ 40 lines, ≤ 3 parameters (more become one
  object), files ≤ 250 lines. ESLint enforces these as errors.
- No TypeScript enums. Use an `as const` object named in camelCase with UPPER_SNAKE_CASE keys and camelCase string
  values, and derive a PascalCase type with the same name:
  ```ts
  export const itemType = { FILE: 'file', FOLDER: 'folder' } as const;
  export type ItemType = (typeof itemType)[keyof typeof itemType];
  ```
- Prefer `type` over `interface`; use an interface only when it is strictly necessary (declaration merging).
  Write arrays as `Array<string>`, not `string[]`.
- Prefer `| null` over `?:` for an absent value in our own types; use `?:` only where absent and `null` differ
  (query parameters, request bodies). `exactOptionalPropertyTypes` is on, so `x?: T` never accepts `undefined`.
- Named exports only (config files excepted).
- Relative imports have no file extension (`moduleResolution: bundler`), not `.js` as `backend/AGENTS.md` says.

## API rules

- Layers: controller (HTTP only) → service (use case, transaction) → repository. Every repository extends
  `GenericRepository` from `@app/database`; hot queries that TypeORM cannot express are raw SQL inside the
  repository.
- Errors: services throw `RuntimeException` subclasses from `@app/common` (`NotFoundException`,
  `ConflictException`, ...) with an `exceptionStatus` value such as `ITEM_NOT_FOUND = 'itemNotFound'`. Each API
  registers one filter that extends `RuntimeExceptionFilter` and answers an `ErrorDto`:
  `{ code: '<category>.<status>', message, statusCode, correlationId }`. The API's filter and the validation pipe
  are registered on the controllers (`@UseFilters`, `@UsePipes`), never globally; one global
  `RuntimeExceptionFilter` answers what never reaches a controller (unknown routes, body parser errors).
- Services return raw types (entities, `Page<T>` from `@app/common`), never DTOs. The controller turns them into
  out-DTOs with `@UseInterceptors(transformAndValidateResponse(toItemDto, itemDtoSchema))`, which also validates the result against
  the out-DTO schema; a transformer takes one argument. Cursor and
  paging helpers, and constants shared with the database (name length, depth cap), live in `@app/common`.
- A lib has no root barrel: import from its domain folder (`@app/common/pagination`), never from `@app/common`.
- Check-and-throw code in a class is a `private static assert<Something>` method. A helper used by one class is a
  private method of it, not a module-level function. Class members always carry `public`, `private` or
  `protected` (ESLint enforces it in the API) and start `private`: `public` only when another class uses the member.
- A module groups its code in folders per kind (`constants`, `types`, `services`, `repositories`, `controllers`,
  `dto`), each with an `index.ts` of named exports. Files are named `<domain>.<kind>.ts` or `<domain>-<kind>.ts`
  (`items.constants.ts`, `items-repository.types.ts`); import a folder through its barrel, a lib through its
  folder (`@app/dto/item`).
- DTOs live next to their controller: `dto/index.ts` re-exports `in` and `out`. Each of those holds one
  `<domain>-in.dto.ts` (or `-out.dto.ts`) with every zod schema and DTO type of the module, one
  `<domain>-in.transformers.ts`, and an `index.ts` with named exports for the DTOs and schemas plus `export *` of
  the transformers. In-schemas are strict (unknown keys are rejected); `src/types.ts` imports the `*.dto.ts` files
  directly, so the generated web types never reach a transformer. Transformers turn in-DTOs
  into the `Create<Entity>` and `Update<Entity>` types of the entity layer, and entities into out-DTOs. Out-DTOs
  that represent an entity live in `libs/dto` and are derived with `pick`, `omit` and `extend`.
- Each entity has a `types/<entity>.types.ts` next to it with `Create<Entity>` (and `Update<Entity>`) types.
- Each API has a `src/types.ts` that names the body, path params, query params and response of every endpoint
  (`CreateItemBody`, `CreateItemResponse`, ...). Controllers use those types, and the web app gets them
  generated.
- The database enforces invariants (unique names, parent must be a folder, depth cap). Insert first and map the
  SQLSTATE; never check-then-insert.
- The schema is defined by TypeORM entities in `libs/database/src/entities`. Generate migrations from them with
  `pnpm --filter backend migration:generate` and apply them with `pnpm db:migrate` (TypeORM CLI). Hand-write SQL
  only for what TypeORM cannot express (for example a `NULLS NOT DISTINCT` index): add it to the generated
  migration and declare the index on the entity with `synchronize: false`. Prefix every query of a new migration
  with `/* sql */` and run `pnpm exec eslint --fix` and `pnpm exec prettier --write` on it: the first turns the
  generated imports into type imports, the second formats the SQL. To drop a column, change the entity, generate, and
  do not write the migration by hand.
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
