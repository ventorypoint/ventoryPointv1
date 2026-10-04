Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 11A of 19

Sprint 11A: Brand Visibility Lite & Basic Returns (Switching Essentials)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Warehouse Execution — Switching Essentials

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 11: Cycle Counting & Replenishment

Unlocks next

Phase 1 · Sprint 12: Integration Framework, Self-Healing & Shopify

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

3PLs leaving Extensiv already give their brands a client portal and process returns every day. Without these, a 3PL can't switch without disappointing its own customers, so the objective of Sprint 11A is to deliver the minimum brand visibility and returns handling needed for a switch. Phase 2 then upgrades both to the full white-label Merchant Command Center (Phase 2 · Sprints 6–7) and portal RMAs (Phase 2 · Sprint 8).

By the end of this sprint:

Brand users (the Client User role, now switched on) can log in to a read-only brand view showing their inventory (by SKU, lot, expiry, serial), orders with status and tracking, receipts/ASN status and returns.

The brand view shows the 3PL's logo and name (no custom domain yet).

Brands and 3PL staff receive scheduled email reports (daily inventory snapshot, shipped orders, receipts, returns) as CSV.

The floor workspace has a basic returns receiving flow: identify the return, link it to the original order/serials, grade condition, and restock, quarantine or dispose, all event-backed and billable.

Out of scope for this sprint: white-label custom domains, live feed animations, self-serve ASNs, invoices/payments in the portal, RMA authorisation and return labels (Phase 2 · Sprints 6–8), retail B2B/EDI (Phase 2).

Dependency: Sprint 11 must be signed off before this sprint starts. Sprint 11 (counts & replenishment) completes warehouse execution. Also uses Sprint 1 (Client User role reserved), Sprint 5 (inventory, serials, 'Where is it?'), Sprint 10 (shipments & serials per carton), Sprint 14 charge types are extended for returns (and priced once Sprint 14 ships).

2. User Stories

As a Brand client of a 3PL switching from Extensiv, I want to keep seeing my stock and order status so that the switch doesn't hurt my business.

As a 3PL Account Manager, I want brands to get daily inventory and shipment reports automatically so that I don't field status emails.

As a Floor Worker, I want a simple guided flow to receive returns so that returned items go back into stock correctly.

As a 3PL Owner, I want returns processing billed so that return handling isn't free labour.

3. Functional Requirements

3.1 Client User Access (Read-Only)

Switch on the Client User role reserved in Sprint 1: invite brand users per client account, with client-scoped RLS (extends the isolation test suite).

Brand login page showing the 3PL's logo and name. Brand users sign in with email + password, Google, GitHub or Microsoft (same account rules as Sprint 01).

3PL staff invite brand users by email invitation, shareable link or a client-scoped invite code (only grants access to that client account). New brand users are prompted to create an account, and existing users are added to the client account.

3.2 Brand View Lite

Inventory: by SKU (available, allocated, on hold, damaged, expired), lots with received/expiry dates and near-expiry flags, and a serial register (in stock / shipped with order and tracking).

Orders: list and detail with status timeline, carrier and tracking link. Receipts/ASNs: status and discrepancies. Returns: list with grade and disposition.

CSV export on every list. Warehouse location paths hidden by default (3PL setting).

3.3 Scheduled Email Reports

Per client (and for 3PL staff): daily inventory snapshot, shipped orders, receipts and returns, sent as CSV attachments via the Sprint 02A notification service. Configurable recipients and schedule.

3.4 Basic Returns Receiving (Floor)

Identify: scan the return label tracking number or the original order number, or quick-create an unexpected return linked to a client.

Per item: scan SKU → scan serial for unique items (checked against the serial originally shipped; mismatches flagged) → confirm lot → condition grade (resellable / damaged / unsellable) → optional note/photo upload.

Disposition: restock to an exact location via putaway (keeping original lot, dates and serial), quarantine/hold, damaged area, or dispose with reason. All through the atomic inventory RPCs.

3.5 Returns Billing & Records

New charge types: return receipt (per package), return processing (per unit), restock (per unit), disposal (per unit), mapped from return events in the Sprint 14 billing capture.

Returns log for 3PL staff with filters and CSV export.

4. Acceptance Criteria

A brand user of Brand A can see only Brand A's inventory, orders and returns (automated RLS tests, including direct API calls).

A shipped order shows the correct status, carrier and tracking link in the brand view within 1 minute of shipment.

The daily inventory report arrives at the configured time with a CSV matching the inventory view.

Receiving a return for a serialised item accepts the originally shipped serial and flags a different serial as a mismatch.

Restocking a resellable return puts it at an exact location with its original lot and dates, increases available inventory, and creates return charges.

5. Non-Functional & Security Requirements

Requirement

Detail

Data isolation

Client-level RLS on every table a brand user can reach. Pen-test scope extended to the brand view.

Performance

Brand view pages <1.5s. Reports generated in <2 minutes per client.

Usability

The returns flow is completed unaided by a first-time worker (15-Minute Rule).

Accessibility

Brand view meets WCAG 2.2 AA: screen-reader navigable tables with headers, keyboard access, 400% zoom reflow, charts with data-table alternatives, accessible CSV/PDF reports.

6. Implementation Task Breakdown: Sprint 11A

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Client Access] ──> [Step 2: Brand View] ──> [Step 3: Returns Flow] ──> [Step 4: Returns Billing]



Step 1: Client User Role & Brand Login

Goal: Let brands in safely, read-only.

Task 1.1: Client Grants, Invites & RLS

Client-scoped policies, isolation tests.

Step 2: Brand View Lite & Scheduled Reports

Goal: Keep brands informed from day one.

Task 2.1: Inventory, Orders, Receipts & Returns Views

Read-only pages, CSV export, location-path setting.

Task 2.2: Scheduled Email Reports

Daily reports via the notification service.

Step 3: Basic Returns Receiving Flow

Goal: Put returned goods back into stock correctly.

Task 3.1: Identify & Grade

Tracking/order lookup, serial check, grading.

Task 3.2: Dispositions

Restock/quarantine/damaged/dispose via inventory RPCs.

Step 4: Returns Charges, Log & Sign-Off

Goal: Bill and record every return.

Task 4.1: Return Charge Types & Log

Event → charge mapping, returns log.

Task 4.2: Switching Readiness Review

Walk through with a design partner: can they switch without losing brand visibility or returns?

7. Sprint Delivery Milestones

Milestone 1 — Client Access (Target: Day 2)

Brand users log in with client-scoped access.

Milestone 2 — Brand View & Reports (Target: Day 5)

Brand view lite and scheduled reports live.

Milestone 3 — Returns Flow (Target: Day 8)

Returns receiving and dispositions working on the floor.

Milestone 4 — Billing & Sign-Off (Target: Day 10)

Return charges live. Design partner confirms switching readiness.

8. Open Questions Carried Into This Sprint

Do design partners' brands need anything else on day one that Extensiv's portal gives them today (validate in the Core Doc 12 interviews)?

Should brands see warehouse location paths, or only quantities and statuses (default: hidden)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 12 can start.



End of Phase 1 · Sprint 11A PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 11A of 19  |  Page