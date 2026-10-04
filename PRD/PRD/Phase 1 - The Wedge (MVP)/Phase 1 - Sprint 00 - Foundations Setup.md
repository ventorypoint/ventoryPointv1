Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 00 of 19

Sprint 00: Foundations Setup (Repo, CI/CD, Environments, Design Library, Specs)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Foundations & Setup

Duration

2 weeks (10 working days)

Must be complete before starting

The pre-implementation validation gate (Core Doc 12) and Phase 1 decisions in the decision log (Core Doc 14).

Unlocks next

Phase 1 · Sprint 1: Auth, Tenant Hierarchy & Roles

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 00 is to set up everything the build depends on, so that Sprint 01 starts on day one with a working pipeline instead of scaffolding. This covers the monorepo and tooling, CI/CD gates, local/preview/staging/production environments, observability, seed data, the AI-agent working rules (CLAUDE.md), the Figma design library built on the brand tokens, and the first versions of the full data model (ERD) and API specification.

This sprint starts only after the pre-implementation validation gate (Core Doc 12) says 'go': 3PL interviews done, Extensiv API feasibility confirmed, design partners selected, and Phase 1 decisions in the decision log (Core Doc 14) answered.

By the end of this sprint:

The monorepo from Core Doc 02 exists with lint, typecheck, unit/DB/e2e test runners and a hello-world vertical slice deployed to preview, staging and production.

CI blocks merges on failing tests, RLS tests, SAST, dependency audit and migration dry-runs.

Security baseline groundwork (Core Doc 05 §6): full Git-history secret scan done (anything found is rotated), pre-commit secret hook, a lint rule and bundle scan that fail if the service-role key or any secret reaches client code, security headers and HTTPS enforced, and the safe-export and upload-service packages scaffolded.

Supabase projects (local, preview branches, staging, production in US-East) exist, with backups/PITR enabled and a restore tested.

Sentry, logging/metrics, uptime checks and an on-call alert route are live.

The seed-data generator creates a realistic demo tenant (2 facilities, 5 clients, 10k SKUs, locations, 30 days of orders).

CLAUDE.md, PR templates and review checklists are in place (Core Doc 08).

The Figma library (tokens, core components, floor components) and ERD v1 + OpenAPI skeleton are reviewed and signed off.

Out of scope for this sprint: any product feature (tenancy starts in Sprint 01), production data, customer onboarding.

Dependency: Pre-implementation validation gate passed (Core Doc 12). Phase 1 decisions answered in the decision log (Core Doc 14).

2. User Stories

As an engineer, I want the repository, CI and environments ready so that I can ship Sprint 01 features from day one.

As the tech lead, I want every merge gated by tests and security checks so that quality doesn't depend on individual discipline.

As a designer, I want a Figma library built on the brand tokens so that every screen is consistent and fast to design.

As an AI coding agent, I want clear repository rules (CLAUDE.md) so that generated code follows the architecture and security rules.

3. Functional Requirements

3.1 Repository & Tooling

Monorepo (pnpm workspaces + Turborepo): apps/web, apps/worker, packages/domain, services, contracts, api-client, db, adapters, ui, floor-kit; supabase/migrations & functions; tests; docs.

API-first skeleton (Core Doc 02 §A5a): one example command implemented in packages/services, exposed via a thin server action AND an /api/v1/internal endpoint, with its schema in packages/contracts, generated OpenAPI and a generated typed API client. A lint rule flags business logic in server actions/route handlers.

TypeScript strict, ESLint, Prettier, commit conventions, PR template linking the sprint PRD and acceptance criteria.

3.2 CI/CD

GitHub Actions: lint, typecheck, Vitest, pgTAP (RLS), Playwright smoke, Semgrep, dependency audit, secret scan, migration dry-run on a branch database.

Preview deploy per PR (Vercel + Supabase branch). Trunk-based releases with feature flags. Deployment to staging on merge, production by tagged release.

3.3 Environments & Infrastructure

Supabase: local (CLI/Docker), preview branches, staging, production (US-East), with PITR enabled, daily backups and a restore drill run once.

Vercel projects (US region), worker service host, environment secrets per environment, domain + TLS for app/api.

3.4 Observability & Operations

Sentry (web + worker), structured logging, metrics dashboards (API latency, queue depth placeholder), uptime checks, alert routing to on-call, a first runbook template.

3.5 Seed Data & Test Harness

Seed generator for a realistic demo tenant. RLS test harness that runs every policy as every role. Load-test scaffold (k6).

3.6 AI-Assisted Engineering Setup

CLAUDE.md (Core Doc 08 §3), prompt templates, review subagent configuration, MCP servers for GitHub and local Supabase only.

3.7 Design & Specification Baseline

Figma library from brand tokens (Core Doc 04/11): typography, colour, buttons, inputs, tables, cards, floor components (scan prompt, location card, feedback states).

Storybook with tokens package wired to Tailwind (brand-tokens/tailwind.brand.js).

ERD v1 covering all Phase 1 tables, and an OpenAPI 3.0 skeleton for the public API, reviewed against the sprint PRDs.

4. Acceptance Criteria

A trivial change goes from PR → green CI → preview URL → staging → production with no manual steps except approvals.

The example command works identically from the web (server action) and from the internal API using the generated client, and CI fails if a service command has no API endpoint or schema.

A PR that introduces a table without RLS, or fails a test, is blocked by CI.

A test commit containing a fake secret is blocked by the pre-commit hook and CI. A client component importing the service-role key fails the lint rule. The staging header scan passes (CSP, HSTS, frame-ancestors, Referrer-Policy, Permissions-Policy).

A staging database restore from PITR completes and is documented.

A test error in the web app appears in Sentry and triggers the on-call alert route.

The Figma library, Storybook, ERD v1 and OpenAPI skeleton are signed off by the tech lead, designer and product owner.

5. Non-Functional & Security Requirements

Requirement

Detail

CI speed

PR pipeline <10 minutes (parallel jobs, caching).

Security

Secrets only in environment stores. Production access limited to named on-call engineers. MFA on GitHub, Vercel, Supabase and Stripe.

Reproducibility

Any engineer can run the full stack locally with one command and seed data.

Accessibility tooling

eslint-plugin-jsx-a11y and axe-core checks (Storybook + Playwright) in CI from day one; Storybook components documented with keyboard and screen-reader behaviour; design library uses accessible text tokens (Core Doc 04 §2.3, §8).

6. Implementation Task Breakdown: Sprint 00

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Repo & CI] ──> [Step 2: Environments] ──> [Step 3: Harness & AI] ──> [Step 4: Design & Specs]



Step 1: Repository, Tooling & CI/CD

Goal: Make quality gates automatic from the first commit.

Task 1.1: Monorepo Scaffold

Workspaces, packages, TS config, lint/format, commit rules.

Task 1.2: CI Pipeline & Preview Deploys

All gates, Vercel + Supabase branch previews.

Step 2: Environments, Backups & Observability

Goal: Have safe places to run code and see problems.

Task 2.1: Supabase & Vercel Environments

Local, preview, staging, production (US). PITR + restore drill.

Task 2.2: Observability & Alerts

Sentry, logs, metrics, uptime, alert routing, runbook template.

Step 3: Seed Data, Test Harness & AI Rules

Goal: Make testing and AI-assisted work fast and safe.

Task 3.1: Seed Generator & RLS Harness

Demo tenant, role-matrix RLS runner, k6 scaffold.

Task 3.2: CLAUDE.md & Review Agents

Rules, templates, subagents, MCP config.

Step 4: Design Library, ERD & API Skeleton

Goal: Agree the shape of the product before building it.

Task 4.1: Figma Library & Storybook

Tokens → components → floor kit.

Task 4.2: ERD v1 & OpenAPI Skeleton

All Phase 1 entities, API resources, review session.

7. Sprint Delivery Milestones

Milestone 1 — Repo & CI Green (Target: Day 3)

Monorepo and CI gates working with preview deploys.

Milestone 2 — Environments & Observability (Target: Day 6)

All environments live, restore drill done, alerts firing.

Milestone 3 — Harness & AI Rules (Target: Day 8)

Seed tenant, RLS harness and CLAUDE.md in place.

Milestone 4 — Design & Specs Sign-Off (Target: Day 10)

Figma library, Storybook, ERD v1 and OpenAPI skeleton approved.

8. Open Questions Carried Into This Sprint

Worker host choice (Fly.io vs Render) and logging provider (decided in the decision log before this sprint).

Monorepo tool preference (Turborepo recommended) if the team has an existing standard.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 1 can start.



End of Phase 1 · Sprint 00 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 00 of 19  |  Page