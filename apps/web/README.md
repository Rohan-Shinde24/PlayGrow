# PlayGrow web application

The web app uses Next.js App Router, TypeScript, PostgreSQL, Prisma, and Joi.

## Backend setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection URL.
3. Validate the Prisma schema with `npm run db:validate`.
4. Generate the Prisma client with `npm run db:generate`.
5. Create/apply a development migration with `npm run db:migrate -- --name init`.
6. Start the app with `npm run dev`.

The database schema lives in `prisma/schema.prisma`; `prisma.config.ts` loads the CLI connection URL, and `src/lib/db.ts` creates the PostgreSQL-backed Prisma client. Migrations are written to `prisma/migrations/`. Use `npm run db:migrate:deploy` to apply committed migrations in production. Review migrations before applying them to production, and never use a destructive reset against a production database.

Joi request schemas are in `src/validations/`, server-only Prisma CRUD services are in `src/modules/`, and App Router handlers are in `src/app/api/`. API routes use HTTP-only, `SameSite=Lax` session cookies backed by hashed tokens in the `Session` table. Admin handlers enforce the administrator role on the server and write audit records. Wallet changes and reward redemption are performed server-side; mission claims only award points for progress already marked complete by trusted server-side code.

The `AuthToken` model and token helpers support hashed, expiring verification and reset tokens. Email delivery is not configured yet: resend-verification and forgot-password return `503` until an email provider is integrated. Add token issuance and delivery together when configuring the provider; do not expose raw auth tokens in responses or logs.

Pagination accepts `skip` (default `0`) and `take` (default `20`, maximum `100`). Public game reads omit the configured launch URL; authenticated game launch requests are handled separately. Before deploying, apply the migrations and configure `DATABASE_URL`.
