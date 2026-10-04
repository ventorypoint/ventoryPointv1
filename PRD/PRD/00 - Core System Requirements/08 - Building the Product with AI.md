Core System Requirements

Document 08 of 15 · Modern 3PL Warehouse Operating System (web application)

08. Building the Product with AI (AI-Assisted Engineering Playbook)

Item

Detail

Purpose

How to use AI coding agents to build the entire product quickly and safely: team model, tooling, the spec → test → code workflow driven by the sprint PRDs, guardrails, and quality controls.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Operating Model

AI agents (Claude Code with current Claude models) write most of the code, tests, migrations and documentation. Humans own the decisions, reviews and anything that touches tenant isolation, stock or money. The sprint PRDs (Phase 1–4 folders) are the specification the agents work from.

Role

Responsibility with AI

Product owner

Owns the sprint PRDs, answers open questions, accepts demos against acceptance criteria

Tech lead / architect

Owns Documents 01–02 and ADRs, reviews every migration, RLS policy and RPC, and approves architecture changes

Engineers (2–4 per squad)

Drive the agents task by task, review all diffs, run device tests, and own production quality

Designer

Owns the Figma library and floor usability tests. The AI implements from tokens/components (Document 04)

QA / SDET

Owns reference suites, e2e flows and the device matrix. The AI drafts tests, and QA verifies coverage

Security lead (part-time/fractional)

Reviews security-sensitive PRs and runs the pen test and SOC 2 programme

2. Tooling

Tool

Use

Claude Code (CLI/IDE)

Primary coding agent: implements tasks, writes tests, runs them, fixes failures, drafts PR descriptions

Claude models

A larger model (e.g. Claude Opus) for architecture, complex engines (allocation, billing, migration) and reviews. A faster model (e.g. Claude Sonnet/Haiku) for routine CRUD, UI and test scaffolding

MCP servers

GitHub (issues/PRs), Supabase (schema inspection on local/preview only; never production data), Playwright (browser testing), docs search

Subagents / review agents

Separate review passes: code-review, security-review (RLS, auth, secrets), test-coverage review, before human review

CI (GitHub Actions)

The same gates for AI and human code (Document 02 §B4)

3. Repository Guidance for Agents (CLAUDE.md)

Every repository has a CLAUDE.md that agents read on every task. Minimum contents:

# Project rules for AI agents

- Architecture: read docs/architecture (Doc 01) and docs/tdd (Doc 02) before changing modules.

- API-first: business logic ONLY in packages/services (+ domain, RPCs). Server actions and

  route handlers are thin adapters. Every new command also gets an /api/v1/internal endpoint,

  a schema in packages/contracts and an OpenAPI entry.

- Tenancy: every new table has organization_id (+ facility_id/client_account_id) and RLS enabled,

  using get_user_role / user_has_facility / user_has_client. Add a pgTAP RLS test for each role.

- Stock & money: never UPDATE balances or charges directly. Use the atomic RPCs.

- Tracking: respect each SKU's tracking class (non-unique / lot / serial); a serial exists in one place only.

- Rotation: order stock only via packages/domain rotation functions (FIFO/FEFO/LIFO/customer lot).

- Locations: generate/validate codes with the naming-convention engine; never hand-build codes.

- Events: every physical action calls record_event with an idempotency key.

- Floor UI: build flows with packages/floor-kit only. Scan → response < 300 ms.

- Brand/UI: use tokens from brand-tokens/ (Doc 04 + Doc 11, Rillet-inspired). Never hard-code colours or fonts.

- Tests first: write failing tests from the sprint acceptance criteria, then implement.

- Security baseline (Doc 05 §6): only the public Supabase key in client code; service key server-only;

  allow-list writable fields; explicit response schemas; escape CSV exports; uploads via the upload service.

- Never: read production data, print secrets, disable RLS, skip tests, or add dependencies

  without noting them in the PR.

- Commands: pnpm test | pnpm test:db | pnpm e2e | supabase db reset



4. The Sprint Workflow with AI

Load the spec: give the agent the sprint PRD (e.g. Phase 1 - Sprint 05 - Inventory Ledger and Balances.docx as Markdown), plus Documents 01, 02 and 04.

Plan: the agent proposes a plan per task in Section 6 of the sprint PRD (files, migrations, tests). The tech lead approves or edits it.

Tests first: the agent writes failing tests for each acceptance criterion and the RLS tests for new tables. A human checks the tests really express the criteria.

Implement: the agent implements in small commits until the tests pass, running the full local suite.

Self-review: code-review and security-review subagents run. The agent fixes the findings.

Human review: an engineer reviews the diff. The tech lead also reviews migrations/RLS/RPCs. The security lead reviews auth/payments/integrations.

Verify in the real app: preview deploy, device-matrix check for floor changes, demo against the acceptance criteria.

Definition of Done: the sprint PRD Section 9 checklist plus the AI-specific checks below.

5. Guardrails (Non-Negotiable)

Area

Rule

Human review required

All SQL migrations, RLS policies, security-definer functions, auth, payments/Stripe, billing pricing logic, migration commit/rollback, and anything that deletes data

Data access

Agents work only on local/preview databases with seeded data. No production credentials in agent environments. No customer data in prompts.

Secrets

Agents never see real secrets. Local .env holds sandbox keys only. Secret scanning in CI.

Dependencies

New packages need justification in the PR, a licence check and a vulnerability scan.

Correctness engines

Inventory, allocation, billing and migration changes must pass their reference suites. Agents can't edit reference fixtures without tech-lead approval.

Traceability

PR descriptions link the sprint PRD, task number and acceptance criteria covered.

6. Prompt Templates

6.1 Task implementation

Context: <sprint PRD section 3 + 4 for this task>, Docs 01/02/04 conventions.

Task: Implement Task <n.m> '<title>'.

Steps: 1) propose a plan (files, migrations, tests) and wait for approval;

2) write failing tests for acceptance criteria <list> + RLS tests for new tables;

3) implement until green; 4) run pnpm test && pnpm test:db; 5) summarise changes and risks.

Constraints: follow CLAUDE.md; no direct balance/charge updates; idempotent events.



6.2 Security review

Review this diff for: cross-tenant access, missing RLS or policies, security-definer misuse,

missing idempotency, secrets/PII in logs, injection/XSS, unsafe webhooks, missing rate limits.

Report findings with file:line, severity, and a concrete fix. Do not change code.



7. Measuring AI-Assisted Delivery

Lead time per task, PR review time, escaped defects per sprint, test coverage in domain packages, and the share of AI-generated diffs that need rework.

Monthly review of agent guidance (CLAUDE.md) based on recurring review findings.

8. AI Inside the Product (Reminder)

Product AI features (AI SKU matching, document extraction, copilot, autonomous optimisation) are specified in the Phase 2–3 sprint PRDs. They follow the same principles: tools run as the user, numbers come only from data, and every feature ships behind off/shadow/assist/auto modes with an evaluation suite.



End of Document 08.

Core System Requirements  |  08 Building with AI  |  Page