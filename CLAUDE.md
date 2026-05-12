# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bouquet is a flower marketplace backend API built with Express 5, TypeScript, Prisma, and PostgreSQL. Multiple flower shops list their products; end users browse and order flowers via a Telegram Mini App.

## Commands

```bash
# Development
pnpm dev                    # Start dev server with hot reload (uses tsx watch)
pnpm build                  # Compile TypeScript to dist/
pnpm start                  # Run compiled production server

# Code quality
pnpm typecheck              # Type check without emitting (tsc --noEmit)
pnpm check                  # Lint + format check with Biome
pnpm check:fix              # Lint + format and auto-fix with Biome
pnpm validate               # Run check + typecheck together

# Database
pnpm db:generate            # Generate Prisma client (outputs to generated/prisma/)
pnpm db:migrate             # Create and apply migrations (dev)
pnpm db:deploy              # Apply migrations in production
pnpm db:studio              # Open Prisma Studio (DB GUI)
pnpm db:reset               # Reset DB and re-apply migrations
pnpm db:seed                # Run prisma/seed.ts to create initial superadmin
```

## Architecture

### Route Groups

Two route groups registered in `src/api/index.routes.ts`:

- **`/client`** — End-user routes. Telegram Mini App users browse shops, flowers, categories.
- **`/dashboard`** — Admin routes. JWT Bearer auth. SuperAdmin manages all shops; ShopAdmin manages only their own shop.

### Admin Roles

- **SuperAdmin (role=1)** — Full access. Manages all shops, admins, categories, flowers.
- **ShopAdmin (role=2)** — Limited access. Manages only their own shop's flowers and data.

### Middleware Chain (order matters)

Global middlewares in `src/app.ts`:
1. CORS → Morgan logger → `responseHandler` → body parser (500kb) → cookie parser → static `/uploads` → routes → `notFoundHandler` → `errorHandler`

Per-route middlewares:
- `adminAuthMiddleware` — Verifies JWT, checks `AdminSession` status/timeout (24h), auto-extends `lastActiveAt`, populates `req.admin`
- `superAdminGuard` — Checks admin role is SuperAdmin
- `validationHandler(zodSchema)` — Validates req body/params/query against Zod schema, populates `req.validated`
- `catchAsync(fn)` — Wraps async handlers, forwards rejections to `errorHandler`

### Module Pattern

Each API module follows:
```
api/{domain}/{module}/
├── {module}.routes.ts          # Router with middleware chain
├── {module}.controller.ts      # Extracts req.validated, calls service, uses res.success()
├── {module}.service.ts         # Business logic, Prisma queries
└── utils/
    ├── {module}.dto.ts         # Zod schemas + inferred types
    ├── {module}.filter.ts      # Query building for Prisma where/orderBy
    └── {module}.transformer.ts # Response data shaping
```

Flow: route → `validationHandler(dto)` → `catchAsync(controller)` → controller reads `req.validated` → calls service → `res.success(status, data)`

**DTO pattern** — always export both the schema and the inferred type:
```ts
export const createFlowerDto = z.object({
  body: z.object({ ... }),
  params: z.object({ ... }),
  query: z.object({ ... }),
})
export type TCreateFlowerDto = z.infer<typeof createFlowerDto>
```

### Response Format

All responses use `res.success()` / `res.error()` from `responseHandler`:
```
Success: { success: true, data: ... }
Error:   { success: false, error: { code, message, data } }
```

### Error Handling

Custom errors in `src/errors/` extend `BaseError` with `errorMessage`, `errorCode`, `httpCode`:
- `ValidationError` (400), `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404)

### Audit Logging

Call `writeAuditLog()` from `src/api/shared/helper/auditLogger.ts` for all CREATE/UPDATE/DELETE operations.

### Utilities

`src/utilities/`:
- `buildPagination(query)` / `buildSort(query)` / `buildPaginationResponse(...)` — Pagination/sorting helpers
- `catchAsync(fn)` — Async handler wrapper

Reusable Zod validators live in `src/api/shared/utils/commonValidator.ts`.

## Key Conventions

- **Imports**: Always use `.ts` extensions (`import foo from './foo.ts'`)
- **Soft Deletes**: All models have `deletedAt`; always filter `deletedAt: null` in queries
- **Validation**: Zod schemas in `.dto.ts` define `{ body, params, query }` structure
- **Express Extensions**: `req.validated`, `req.admin`, `req.user` — declared in `src/types/response.types.ts`
- **Singletons**: `db`, `redis`, `env`, `JwtService`, `RedisService` — imported as pre-instantiated objects
- **Enums**: Numeric enums in `src/enums/`
- **Constants**: Error codes/messages in `src/constants/error.ts`, HTTP status in `src/constants/httpStatus.ts`
- **Translations**: User-facing content uses separate translation tables (ShopTranslation, FlowerTranslation, CategoryTranslation)

## Prisma Schema

Multi-file schema in `prisma/`. Generator outputs ESM TypeScript to `generated/prisma/`.

- `prisma/models/*.prisma` — Model definitions per domain
- Key entities: Admin (with AdminSession), Shop (with ShopTranslation), Flower (with FlowerTranslation), Category (with CategoryTranslation), User, AuditLog

## Environment Variables

Validated via Zod in `src/config/env.ts`. Required:
- **Server**: `PORT`, `BASE_URL`, `HASH_SALT`, `NODE_ENV`, `CORS_ORIGINS`
- **Database**: `DATABASE_URL`, `REDIS_URL`
- **JWT**: `ACCESS_TOKEN_KEY`, `ACCESS_TOKEN_TIME`, `REFRESH_TOKEN_KEY`, `REFRESH_TOKEN_TIME`
- **Telegram**: `TG_BOT_TOKEN`

## Git Commit Style

Format: `type: short description` (e.g., `feat: add flower listing`, `fix: null check in shop service`)

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
