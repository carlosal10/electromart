# Electromart Production Readiness Workflow

This workflow turns the current Electromart application into a production-grade ecommerce system through small, verifiable phases. Each phase should end with a passing `npm run verify` run and a short release note.

## Operating Rules

- Keep `main` deployable. All work lands through reviewed pull requests.
- Treat CI as the source of truth: lint, backend tests, frontend tests, and build must pass before merge.
- Keep secrets out of git. Use `.env.example` for required keys and rotate any key that was previously committed.
- Prefer backend-owned truth for money, stock, roles, order status, and payment status.
- Ship in thin vertical slices: model, API, UI, tests, and deployment notes together.

## Phase 0: Foundation

Status: in progress.

Goals:

- Remove committed runtime secrets and generated build artifacts from git tracking.
- Make dependency installation deterministic with `npm ci`.
- Align CI with local scripts and the `.nvmrc` Node version.
- Provide a safe `.env.example`.
- Establish a single verification command.

Exit criteria:

- `npm install` updates a lockfile that allows `npm ci`.
- `npm run lint` exits successfully.
- `npm test` exits successfully.
- `npm run build` exits successfully.
- `.env`, `/build`, and `/client/build` are ignored.

## Phase 1: Auth And Admin Control

Goals:

- Add a `role` field to users with `user` and `admin` values.
- Seed or safely promote the first admin account.
- Fix JWT/admin authorization so server-side role checks work consistently.
- Fix the admin route API path mismatch in the client.
- Replace admin placeholder screens with data-backed order, product, user, banner, and category views.

Exit criteria:

- Non-admin users cannot access admin APIs or pages.
- Admin users can manage products, categories, banners, and orders.
- Auth and role tests cover success and denial paths.

## Phase 2: Catalog And Inventory Integrity

Goals:

- Align product schema fields with API filters for popular, seasonal, and best-choice products.
- Add indexes for category, brand, search, popularity, and created date.
- Validate product IDs and input bodies consistently.
- Define stock behavior: reserve on checkout, reduce on paid/confirmed order, restore on cancellation.
- Normalize API response shapes so client components receive predictable data.

Exit criteria:

- Catalog APIs are paginated, searchable, and covered by tests.
- Admin product changes are reflected correctly on the storefront.
- Stock cannot become negative through checkout races.

## Phase 3: Checkout, Orders, And Payments

Goals:

- Make the backend recalculate order totals from product records.
- Create orders as `pending`, never `paid` from client-submitted data.
- Consolidate the duplicated M-Pesa environment names and STK push code paths.
- Make M-Pesa callbacks idempotent and verify callback data before changing order status.
- Add order lifecycle states: pending, payment_requested, paid, failed, cancelled, fulfilled.

Exit criteria:

- Client totals are treated as display-only.
- Payment callbacks can be retried safely.
- Failed payment and cancelled order paths are visible to customers and admins.
- Checkout and payment flows have integration tests with mocked M-Pesa responses.

## Phase 4: Security And Compliance

Goals:

- Remove sensitive request logging, especially tokens and payment payloads.
- Add global API rate limits, stricter request size limits, and safer CORS defaults.
- Validate upload type, size, and Cloudinary destination.
- Add audit logging for admin actions and order/payment status changes.
- Add privacy policy, terms, refund/return policy, and support details.
- Resolve or explicitly accept dependency audit findings.

Exit criteria:

- Production refuses to boot without required secrets.
- Security-sensitive endpoints have rate limits and tests.
- Critical/high vulnerability findings are fixed or documented with an owner and deadline.

## Phase 5: Observability And Operations

Goals:

- Add `/health` and `/ready` endpoints.
- Add structured request logging with request IDs.
- Add uptime, error, and payment failure alerts.
- Document backup, restore, rollback, and incident response steps.
- Separate development, staging, and production environment configs.

Exit criteria:

- Staging deploys automatically from approved changes.
- Production deploys through a controlled release step.
- A failed deploy can be rolled back using documented steps.

## Phase 6: Commercial Polish

Goals:

- Improve mobile checkout, empty states, loading states, and error states.
- Add customer order history, receipts, and transactional email or SMS.
- Add SEO metadata, analytics, and conversion tracking.
- Add vendor/customer support workflows.
- Run accessibility, responsive, and performance audits.

Exit criteria:

- Core Web Vitals and accessibility issues are reviewed before launch.
- Customers can complete purchase, track order state, and contact support.
- Admins can manage daily operations without database access.

## Current Known Risks

- The client dependency tree still reports vulnerabilities, including critical findings from `npm audit --prefix client`.
- Lint currently passes with warnings in `app.js` and `client/src/components/ReviewSection.jsx`.
- Backend test coverage is only a health check.
- Frontend test coverage is only a storefront smoke test.
- Payment flow and admin authorization require functional fixes before commercial launch.
