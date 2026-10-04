Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 15 of 15

Sprint 15: Multilingual Floor Workspace, SOC 2 Readiness & Phase 2 Launch Readiness

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Multilingual Floor Experience (Master PRD §6.3.10) & Phase 2 Launch

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 14: Kitting & Bundling, FEFO Hard-Lock and Lot Genealogy with 30-Minute Mock Recall

Unlocks next

Phase 3 — Autonomous Operations & Collaborative Network, Sprint 1

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this final Phase 2 sprint is to remove language barriers on the warehouse floor with a one-click language switch, close the security and compliance items needed as 3PLs start moving money and client data through the platform (SOC 2 Type II readiness), and roll out all Phase 2 capabilities to design partners safely.

By the end of this sprint:

Floor workers can switch the floor workspace to Spanish, Vietnamese, Haitian Creole, Mandarin or Arabic (right-to-left layout) with one click. SOP notes and packing instructions can be translated automatically.

SOC 2 Type II readiness controls are in place and the observation period has started.

Phase 2 features pass a 5x peak load test and are enabled for design partners through feature flags with a migration of their billing into the new ledger.

Out of scope for this sprint: portal/admin UI translation (English only in Phase 2), the SOC 2 audit report itself (issued after the observation period).

Dependency: Sprint 14 must be signed off. All Phase 2 sprints are inputs to the launch-readiness gate.

2. User Stories

As a Floor Worker whose first language is Spanish, I want the scanner screens in Spanish so that I work confidently from day one.

As an Ops Manager, I want packing instructions translated automatically so that special client requirements are understood by everyone.

As a 3PL Owner, I want the platform to be SOC 2-ready so that enterprise brands accept us as their 3PL's system.

As a design-partner 3PL, I want the new billing and portal features turned on without disrupting daily operations.

3. Functional Requirements

3.1 Floor Language Packs

Professionally reviewed translations of all floor message catalogs (from the Phase 1 i18n foundation): es, vi, ht, zh-Hans, ar (RTL). The language switch is on the floor header and remembered per worker.

Icon-first prompts and number formats localised. Audio cues unchanged.

3.2 Instruction Translation

Client/SKU/order-level instructions (packing notes, gift messages excluded) machine-translated on display into the worker's language, with the original available. Translation cache and a glossary per organization.

3.3 SOC 2 Readiness

Controls: access reviews, MFA for all staff roles, audit log coverage, change management, vendor management (Stripe, Supabase, providers), incident response, backups/DR tests, vulnerability management, security training. Compliance automation tool (e.g. Vanta/Drata) connected, with policies published.

3.4 Phase 2 Launch Readiness

Feature flags per organization for billing ledger, invoicing, payments, portal, RMA, native shipping, B2B/EDI and kitting.

Billing cutover: move each design partner from the Phase 1 export process to the ledger at a period boundary, with a parallel run and reconciliation.

5x peak load test including portal traffic, webhooks and payment webhooks. Pen test of the portal, payments and the developer API.

Enablement: 3PL admin guides, brand portal onboarding kit (email templates the 3PL sends to its clients).

4. Acceptance Criteria

4 of 5 Spanish-first test users complete a pick flow unaided in Spanish. Arabic renders correctly right-to-left on handhelds.

A packing instruction written in English appears in Vietnamese for a Vietnamese-language worker, with the original one tap away.

The SOC 2 readiness tool shows all in-scope controls passing and the observation period has started.

The 5x load test passes all Phase 1 and Phase 2 performance targets. Pen test has no open high/critical findings.

At least 3 design partners run a full billing period on the ledger with invoices, auto-debit and portal access.

5. Non-Functional & Security Requirements

Requirement

Detail

Localisation quality

Native-speaker review of every floor string. No truncation on 360px-wide screens.

Security

MFA enforced for staff roles. Quarterly access reviews scheduled.

Operability

Feature flags can be turned off per organization without a deploy.

6. Implementation Task Breakdown: Sprint 15

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Languages] ──> [Step 2: Instructions] ──> [Step 3: SOC 2] ──> [Step 4: Launch]



Step 1: Floor Language Packs & RTL

Goal: Make the floor workspace native in five more languages.

Task 1.1: Translation & Review

Professional translation + native review of all floor catalogs.

Task 1.2: RTL Layout & Worker Preference

Arabic RTL, per-worker language memory.

Step 2: Instruction Translation

Goal: Make client-specific instructions understood by everyone.

Task 2.1: Machine Translation Service & Glossary

On-display translation, cache, org glossary.

Step 3: SOC 2 Type II Readiness

Goal: Meet enterprise security expectations.

Task 3.1: Controls Implementation

MFA, access reviews, change management, DR test.

Task 3.2: Compliance Automation & Policies

Tool connected, policies published, observation start.

Step 4: Phase 2 Launch Readiness & Rollout

Goal: Turn Phase 2 on for design partners safely.

Task 4.1: Feature Flags & Billing Cutover

Per-org flags, parallel run, reconciliation.

Task 4.2: Load Test, Pen Test & Enablement

5x test, pen test, admin and brand onboarding kits.

7. Sprint Delivery Milestones

Milestone 1 — Language Packs (Target: Day 3)

Five languages + RTL live in staging.

Milestone 2 — Instruction Translation (Target: Day 5)

Instructions translated on display.

Milestone 3 — SOC 2 Readiness (Target: Day 8)

Controls passing. Observation started.

Milestone 4 — Phase 2 Launch Sign-Off (Target: Day 10)

Load and pen tests passed. Design partners live on Phase 2 features.

8. Open Questions Carried Into This Sprint

Language priority beyond the five: which languages do design-partner workforces actually need?

Compliance tool choice (Vanta vs Drata) and SOC 2 auditor selection.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded. Phase 2 go/no-go decision made, so Phase 3 can start.



End of Phase 2 · Sprint 15 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 15 of 15  |  Page