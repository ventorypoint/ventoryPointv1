Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 16 of 19

Sprint 16: Weekend Cutover, Ops Dashboard & Launch Readiness

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 15–16 — Migration & Launch

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 15: Extensiv Migration Engine (Extract, Map, Dry Run)

Unlocks next

Phase 1 go-live, then Phase 2 — The Margin Engine, Sprint 1

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 16 is to make Phase 1 (MVP) go-live safe and repeatable. It completes the migration engine with production commit, reconciliation and a guided cutover runbook, gives supervisors a live operations dashboard and standard reports, turns on in-app support, and hardens the platform (5x load test, security review, observability) before design-partner go-lives.

By the end of this sprint:

An implementation specialist can run a scripted weekend cutover end-to-end, including rollback.

Supervisors run the day from a live ops dashboard.

Standard operational and billing reports are available with CSV export.

In-app support chat and a status page are live.

Load, security and observability gates are passed.

Out of scope for this sprint: custom report builder and scheduled report emails (Phase 2), 2-way sync with Extensiv.

Dependency: Sprint 15 must be signed off before this sprint starts. Sprint 15 (staging + dry run), all Phase 1 (MVP) modules for the dashboard/reports and the load test.

2. User Stories

As a 3PL Owner, I want a clear cutover plan with go/no-go checks so that we can switch over a weekend without missing Monday's shipments.

As a Supervisor, I want one live screen showing order flow, waves, cutoffs and exceptions so that I can steer the floor in real time.

As an Ops Manager, I want standard reports I can export so that I can review productivity and accuracy weekly.

As any user, I want to reach a human in the app within minutes during warehouse hours so that problems don't stop my operation.

3. Functional Requirements

3.1 Production Commit & Reconciliation

Commit run: final delta extraction → load via importers in dependency order (clients → SKUs → locations → opening balances as events → open ASNs → open orders).

Reconciliation report: source vs. target counts and on-hand quantities by client/SKU/lot/location, with variance sign-off by the 3PL.

Rollback: tenant-scoped removal of all records created by the commit run (tracked by run ID).

3.2 Cutover Runbook Tool

Checklist template: T-7 rehearsal, Friday 5 PM freeze (stop Extensiv receiving/shipping), final delta, commit, reconciliation, 15-minute floor training session, channel re-pointing (Shopify/Amazon/Woo connections activated, inventory push enabled), Sunday test orders, Monday 7 AM go/no-go.

Owners per step, timestamps, blockers, and a go/no-go decision record.

3.3 Live Ops Dashboard

Tiles and boards: orders by status and client, orders at risk vs. carrier cutoffs (countdown), wave progress, open exceptions (holds, short picks, integration errors), receiving in progress, inventory accuracy (7-day), connection health. Realtime via events.

3.4 Standard Reports

Inventory on hand (by client/SKU/lot/location, with full location paths and LPNs), serial register (every unique unit, current location or shipment), lot & expiry report (near-expiry, expired, received dates), rotation compliance (overrides and out-of-sequence picks), location accuracy (from location audits), location utilisation (by area/type), receiving log, order throughput (by day/client/channel), picker/packer productivity (units/hour from floor sessions), cycle count variance, billing activity. Filters + CSV export.

3.5 Support & Status

In-app chat widget (identity-verified, with org/facility context), help-center links, public status page, and a peak-season escalation path.

3.6 Privacy Request Console

3PL staff log a consumer privacy request forwarded by a brand (access, deletion, correction), search all data for that person (email, name, phone, order), export it, pseudonymise it, and track the request to completion against the controller's deadline (e.g. 45 days under CCPA). Every request and action logged.

3.7 Accessibility Launch Gate

Third-party WCAG 2.2 AA audit of the admin app, floor workspace and brand view, including screen-reader testing with blind users. Blocking issues fixed before go-live. Public accessibility statement published.

3.8 Public Surfaces & AI Search Readiness (GEO)

Help centre, public API docs, status page and changelog server-rendered and indexable. robots.txt AI-crawler policy (public paths open; app, floor, portal, internal and API blocked), llms.txt/llms-full.txt and /product-facts.json generated from the release, XML sitemaps + IndexNow, JSON-LD (Organization, SoftwareApplication/Offers, FAQPage, HowTo, BreadcrumbList) validated in CI. Search Console and Bing Webmaster verified (Core Doc 15).

3.6 Hardening

Load test at 5x design-partner peak (orders, scans, webhooks, inventory pushes). Fix hotspots.

Security: third-party pen test, RLS audit, dependency scan, secrets review.

Observability: error tracking (Sentry), structured logs, metrics/alerts for SLAs, on-call rotation, runbooks, backups + restore drill.

4. Acceptance Criteria

A rehearsal cutover of a sandbox facility completes commit in <4 hours, and reconciliation shows 100% quantity match or signed-off variances.

Rollback of a commit run completes in <30 minutes and leaves no migrated records.

The ops dashboard reflects a pick or ship event within 1s.

The 5x peak load test passes: scan → UI <300ms p95, inventory push dispatch <200ms p95, 0 lost orders.

Pen test: no open high/critical findings. Backup restore drill succeeds.

5. Non-Functional & Security Requirements

Requirement

Detail

Availability

99.9% target from go-live. Zero-downtime deploys in place.

Performance

All Phase 1 (MVP) performance targets verified under 5x load.

Operability

Every alert has a runbook. On-call covers design-partner warehouse hours.

6. Implementation Task Breakdown: Sprint 16

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Commit & Reconcile] ──> [Step 2: Cutover Runbook] ──> [Step 3: Dashboard & Reports] ──> [Step 4: Hardening]



Step 1: Production Commit, Reconciliation & Rollback

Goal: Load migrated data safely and prove it matches the source.

Task 1.1: Ordered Commit Pipeline

Importer orchestration, opening-balance events, run tagging.

Task 1.2: Reconciliation Report & Sign-Off

Counts + quantity comparison, variance sign-off.

Task 1.3: Rollback

Run-scoped removal, tested.

Step 2: Cutover Runbook Tool & Go-Live Switches

Goal: Make the weekend cutover a guided, repeatable procedure.

Task 2.1: Checklist Tool

Template steps, owners, timestamps, go/no-go record.

Task 2.2: Go-Live Switches

Activate connections and inventory push per client, with a freeze banner.

Step 3: Live Ops Dashboard, Standard Reports & Support

Goal: Give supervisors control and users help.

Task 3.1: Ops Dashboard

Realtime tiles/boards with cutoff countdown.

Task 3.2: Standard Reports

Six reports with filters + CSV.

Task 3.3: Support Chat & Status Page

Widget with identity verification, status page.

Step 4: Load, Security & Observability Hardening

Goal: Prove the release is safe for real warehouses.

Task 4.1: 5x Load Test & Fixes

Synthetic traffic across scans, orders, webhooks.

Task 4.2: Security Review & Pen Test

RLS audit, pen test remediation.

Task 4.3: Observability, On-Call & Restore Drill

Sentry, alerts, runbooks, backup restore.

7. Sprint Delivery Milestones

Milestone 1 — Commit & Rollback (Target: Day 3)

Commit + reconciliation + rollback working on sandbox data.

Milestone 2 — Cutover Rehearsal (Target: Day 5)

Full rehearsal cutover completed within 4 hours.

Milestone 3 — Dashboard, Reports & Support (Target: Day 8)

Ops dashboard, reports and support live.

Milestone 4 — Hardening & Phase 1 Sign-Off (Target: Day 10)

Load, pen test and restore drill passed. Phase 1 (MVP) go/no-go approved.

8. Open Questions Carried Into This Sprint

Go/no-go authority: who signs off on Monday morning (3PL Owner + our implementation lead)?

How long is Extensiv kept read-only after cutover (proposal: 30 days) for lookups and disputes?

Chat tool selection and support staffing model for the first 20–25 design partners.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded. Phase 1 go/no-go decision made.



End of Phase 1 · Sprint 16 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 16 of 19  |  Page