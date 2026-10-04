Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 13 of 15

Sprint 13: Extension Platform: Third-Party Apps, OAuth, UI Extension Points & Sandbox

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

App / Partner Marketplace (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 12: Regional Market Packs: UK/EU, Australia/NZ & Canada (Carriers, Marketplaces, Payments, Compliance)

Unlocks next

Phase 4 · Sprint 14: App Marketplace Launch: Listings, Review, Billing & Partner Program

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to let partners and customers extend the platform without forking it: third-party apps installed per organization via OAuth with granular scopes, UI extension points (panels and actions in admin, portal and selected floor screens), event subscriptions (Phase 2 webhooks), and a developer sandbox with test tenants and seeded data.

By the end of this sprint:

Developers can register apps, request scopes and implement OAuth install flows.

Apps can add UI panels/actions at defined extension points (sandboxed iframes with a messaging SDK).

Apps subscribe to events and call the REST/GraphQL APIs with per-installation tokens.

Developers can spin up sandbox tenants with realistic seed data.

Out of scope for this sprint: the public listing, billing and review process (Sprint 14).

Dependency: Sprint 12 must be signed off. Also uses the Phase 2 · Sprint 13 webhooks, REST v2, GraphQL and developer portal.

2. User Stories

As a partner developer, I want to build an app that adds a panel to the order screen so that 3PLs can use my service inside the platform.

As a 3PL Admin, I want to see and control exactly what an app can access so that my data stays safe.

As a developer, I want a sandbox with realistic data so that I can build and test quickly.

3. Functional Requirements

3.1 App Registration & OAuth

App registry: name, owner, redirect URLs, scopes (read/write per resource, client-scoped vs org-wide). OAuth 2.0 authorization code + PKCE install flow. Per-installation tokens, rotation, revocation.

3.2 UI Extension Points

Defined slots: order detail panel, SKU detail panel, client detail panel, portal dashboard widget, bulk actions, and a floor-workspace 'app action' on selected steps. Rendered in sandboxed iframes with a postMessage SDK (context, actions, theming).

3.3 Events & API Access

Installation-scoped webhook subscriptions and API calls with rate limits per app. Admin audit of app activity.

3.4 Developer Sandbox

Self-serve sandbox tenants with seeded facilities, clients, SKUs, orders and a simulated floor (Phase 4 · Sprint 1 simulator). Reset on demand.

4. Acceptance Criteria

A sample app installs via OAuth with 'orders:read', renders a panel on order detail, and can't read SKUs (scope enforced).

Revoking an installation immediately invalidates its tokens and removes its UI.

A developer creates a sandbox with seeded data in <2 minutes.

5. Non-Functional & Security Requirements

Requirement

Detail

Security

Iframe sandboxing, CSP, scope enforcement server-side, app activity audit.

Performance

Extension panels don't block host page rendering (lazy, timeout).

6. Implementation Task Breakdown: Sprint 13

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: OAuth Apps] ──> [Step 2: UI Extensions] ──> [Step 3: Events & APIs] ──> [Step 4: Sandbox]



Step 1: App Registry & OAuth Installation

Goal: Let apps connect safely.

Task 1.1: Registry, Scopes & Install Flow

PKCE, tokens, revocation.

Step 2: UI Extension Points & SDK

Goal: Let apps appear inside the product.

Task 2.1: Slots, Iframe Sandbox & postMessage SDK

Context, actions, theming.

Step 3: Installation-Scoped Events & API Access

Goal: Give apps data within limits.

Task 3.1: Scoped Webhooks, Rate Limits & Audit

Per-app controls.

Step 4: Developer Sandbox Tenants

Goal: Make building apps fast.

Task 4.1: Seeded Sandbox & Reset

Simulator-backed test data.

7. Sprint Delivery Milestones

Milestone 1 — OAuth Apps (Target: Day 3)

Apps install via OAuth.

Milestone 2 — UI Extensions (Target: Day 6)

Panels render in extension points.

Milestone 3 — Events & APIs (Target: Day 8)

Scoped access enforced.

Milestone 4 — Sign-Off (Target: Day 10)

Sandbox self-serve live.

8. Open Questions Carried Into This Sprint

Which extension points matter most to early partners?

Allow apps on the floor workspace at all (performance/safety risk), or admin/portal only at first?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 14 can start.



End of Phase 4 · Sprint 13 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 13 of 15  |  Page