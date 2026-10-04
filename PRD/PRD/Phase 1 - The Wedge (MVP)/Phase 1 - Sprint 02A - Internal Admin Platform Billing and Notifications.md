Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 02A of 19

Sprint 02A: Internal Admin Console, Platform Billing, Notifications & Analytics

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Foundation — Platform Operations

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 2: Event Backbone, Realtime & Audit Log

Unlocks next

Phase 1 · Sprint 3: Precise Location Hierarchy, Floor Storage & Naming Convention

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 02A is to build the operating tools your own company needs to run the platform from day one, plus two shared services every later sprint relies on:

(1) an internal admin console for your team (tenants, plans, feature flags, usage, consented support access); (2) platform subscription billing so 3PLs pay you through Stripe Billing (Core Doc 07, Flow A); (3) a notification service (email + in-app) driven by events; (4) product analytics to measure KPIs like the 15-minute onboarding time; and (5) customer data export.

By the end of this sprint:

Platform staff can see and manage every tenant (status, plan, facilities, usage, onboarding stage) in a separate, audited admin console.

Support staff can access a customer's account only with customer consent, time-limited and read-only by default, with every action logged.

Feature flags can be set per organization without a deploy.

3PLs can subscribe to a plan via Stripe Checkout/Customer Portal. Entitlements are enforced in the app, and shipped-order volume is metered for tier reviews.

Any module can raise a notification (email/in-app) through one service with templates and user preferences.

Product analytics capture key funnels without personal data, and a customer can export all their data.

Out of scope for this sprint: 3PL-to-brand payments (Phase 2 · Sprint 4), brand-facing notifications (Sprint 11A and Phase 2 portal), marketing-site analytics.

Dependency: Sprint 2 must be signed off before this sprint starts. Sprint 02 (event backbone, devices, audit log) and Sprint 01 (tenancy, roles).

2. User Stories

As a Customer Success manager, I want one console listing every 3PL with its plan, usage and onboarding stage so that I can manage accounts proactively.

As a Support engineer, I want to view a customer's screens with their permission so that I can fix problems quickly, without standing access to their data.

As the Founder, I want 3PLs billed automatically by plan and shipped volume so that revenue collection doesn't need manual invoicing.

As an Ops Manager, I want to receive alerts (e.g. orders on hold, near-expiry stock) by email or in-app so that problems don't go unnoticed.

As the Product Owner, I want usage analytics so that I can measure onboarding time and feature adoption against our KPIs.

3. Functional Requirements

3.1 Internal Admin Console

Separate app route (/internal) for platform staff with its own roles (Platform Admin, Support, Customer Success, Finance) and enforced MFA.

Tenant list/detail: status, plan, facilities, clients, users, usage (orders shipped, scans, storage), onboarding checklist stage, notes.

Feature flags per organization (and global kill switches), with an audit trail.

Announcements/banners to tenants (maintenance windows).

3.2 Consented Support Access

The customer grants access from their settings (scope: read-only or read-write, duration e.g. 24h). The support user sees the tenant through the same RLS as a tenant user with a special 'support' role.

A visible banner in the customer's app while support is active. All support actions logged and viewable by the customer.

3.3 Platform Subscription Billing

Plans/prices in Stripe (Launch, Growth, Scale, design-partner custom prices), Checkout for signup, Customer Portal for card/ACH, invoices and cancellation.

Entitlements service: plan → features and limits, checked server-side (feature gates in UI and API).

Usage metering: monthly shipped orders from shipment.shipped events (fed from Sprint 10 onwards), a trailing 3-month average for tier review, no overage penalties.

Webhook handler (subscription/invoice events), dunning with a 14-day grace period that never blocks floor operations.

3.4 Notification Service

notify(event, recipients, template, data) API used by all modules. Channels: email (Resend) and in-app (bell + inbox). Templates versioned.

User preferences per notification type/channel, with daily digest option and quiet hours.

Initial catalogue: invites, holds needing action, integration errors, near-expiry stock, count approvals, billing period ready, subscription/dunning.

3.5 Product Analytics

PostHog (US cloud) or equivalent with an event taxonomy (onboarding steps, floor task start/complete, time per step, feature usage). No personal data or customer content in events.

KPI dashboards: time to first receipt, 15-minute rule (first accurate pick), weekly active facilities, feature adoption.

3.6 Customer Data Export

Owner-initiated export job (CSV/JSON zip) of all tenant data, with a download link that expires, and a logged export event.

4. Acceptance Criteria

A platform Support user can't see any tenant data until the tenant grants access, and loses access automatically when the grant expires.

Every support action appears in the tenant's audit view with the support user's identity.

A 3PL completes Stripe Checkout, its plan entitlements activate within 1 minute, and a gated feature is blocked on a lower plan.

A failed subscription payment triggers dunning emails, and after the grace period restricts configuration only, never floor tasks.

A hold created in orders (simulated event) sends an in-app notification and an email per the user's preferences.

Analytics events contain no email, name or address fields (automated check).

5. Non-Functional & Security Requirements

Requirement

Detail

Security

Internal console behind MFA and separate roles. Support access consent-based, time-boxed and logged. Internal staff never bypass RLS.

Reliability

Notification delivery at-least-once with de-duplication. Stripe webhooks idempotent.

Privacy

Analytics pseudonymous (org/user IDs hashed), US-hosted, opt-out respected.

6. Implementation Task Breakdown: Sprint 02A

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Admin Console] ──> [Step 2: Support Access] ──> [Step 3: Subscriptions] ──> [Step 4: Notify & Analytics]



Step 1: Internal Admin Console & Feature Flags

Goal: Give your team control over the platform.

Task 1.1: Internal Roles & Console Shell

/internal app, staff roles, MFA.

Task 1.2: Tenant Views, Flags & Announcements

Tenant list/detail, usage, flags, banners.

Step 2: Consented Support Access

Goal: Help customers without standing data access.

Task 2.1: Grant Flow, Support Role & Banner

Consent UI, RLS support role, expiry, logging.

Step 3: Platform Subscription Billing & Entitlements

Goal: Get paid by 3PLs automatically.

Task 3.1: Stripe Products, Checkout & Portal

Plans, custom prices, portal config.

Task 3.2: Entitlements, Metering & Dunning

Feature gates, shipped-order meter, grace logic.

Step 4: Notification Service, Analytics & Data Export

Goal: Shared services every module uses.

Task 4.1: Notification Service

API, channels, templates, preferences, digests.

Task 4.2: Product Analytics & KPI Dashboards

Taxonomy, PII checks, dashboards.

Task 4.3: Customer Data Export

Export job, expiring link, audit.

7. Sprint Delivery Milestones

Milestone 1 — Admin Console (Target: Day 3)

Console, staff roles and feature flags live.

Milestone 2 — Support Access (Target: Day 5)

Consent-based support access working and logged.

Milestone 3 — Subscriptions (Target: Day 8)

Checkout, entitlements and dunning working in Stripe test mode.

Milestone 4 — Shared Services & Sign-Off (Target: Day 10)

Notifications, analytics and data export live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Analytics tool: PostHog (recommended, US cloud) vs an alternative your team already uses.

Should design partners be on Stripe from day one (with a 100% coupon until go-live) to test the billing flow early? Recommended: yes.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 3 can start.



End of Phase 1 · Sprint 02A PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 02A of 19  |  Page