Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 2 of 15

Sprint 2: Inbound, Outbound & VAS Charge Engine, Postage Markup & Monthly Minimums

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Real-Time Micro-Billing Ledger (Master PRD §6.3.1)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 1: Advanced Storage Billing Models & Environmental Surcharges

Unlocks next

Phase 2 · Sprint 3: Invoicing, Credit Notes & QuickBooks Sync

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to price every physical touch the way 3PL contracts actually do: container de-vanning, receiving by carton vs. each, relabelling, QA, tiered pick fees, heavy/fragile surcharges, packaging at cost-plus, kitting labour, postage markups and monthly minimums. It also turns billing into a live ledger: the 3PL can see every client's accrued billables at any moment.

By the end of this sprint:

Inbound touches (de-vanning 20'/40', palletizing & sorting, master/inner/each receiving tiers, non-barcoded relabelling, QA sampling, stretch-wrap/banding) are captured and priced.

Outbound uses tiered pick matrices (first unit, additional unit of the same SKU, additional distinct SKU) plus attribute surcharges (heavy >25 lb, fragile, garment-on-hanger).

Packaging materials bill at cost + markup. Postage is marked up by % or a flat handling fee.

Monthly minimums automatically create a 'Minimum adjustment' line.

A real-time ledger view shows every client's accrued charges month-to-date, down to the event.

Out of scope for this sprint: invoice documents and accounting sync (Sprint 3), payments (Sprint 4), returns fees (Sprint 8), kitting work orders (Sprint 14; this sprint only defines the labour charge type).

Dependency: Sprint 1 must be signed off. Also uses Phase 1 · Sprint 7 (receipt UoM data), Sprints 9–10 (pick/pack events, packaging), Sprint 13 (label costs).

2. User Stories

As a Billing user, I want an ocean container unload charged as a flat fee by container size so that dock labour is always billed.

As a 3PL Owner, I want picks priced as $2.75 for the first unit, $0.50 per additional unit and $0.85 per additional SKU so that the system matches my contracts.

As a 3PL Owner, I want a markup added to every shipping label automatically so that postage margin is never forgotten.

As a Billing user, I want clients below their contract minimum topped up automatically so that small clients still cover their cost to serve.

As a 3PL Owner, I want to see what each client owes right now, not at month-end.

3. Functional Requirements

3.1 Inbound Touch Charges

Dock events: container arrival type (20', 40', 40' HC, floor-loaded vs palletized) recorded at check-in, which triggers a de-vanning charge.

Receiving tiers by the scanned UoM (master carton / inner / each), plus palletizing & sorting per pallet built.

Floor-worker task buttons for relabel (per label), QA sample (per sample or per hour) and stretch-wrap/banding (per pallet). Each produces an event → a charge.

3.2 Outbound & VAS Charges

Tiered pick matrix per client: base per order, first unit, additional unit of the same SKU, additional distinct SKU, and per-line caps.

Attribute surcharges from SKU flags/weight: heavy, fragile (bubble-wrap), garment-on-hanger, oversize.

Packaging decrement at cost + markup % (Phase 1 packaging consumption events). Inserts/flyers per order.

VAS labour charge types (per unit or per hour) for kitting, gift wrap and special projects, recorded by task timer or manual entry.

3.3 Postage Markup

Per client: pass-through + % markup, pass-through + flat handling fee per label, or a fixed rate table by service/zone/weight.

Label cost pulled from the shipping provider response. Markup shown as its own line (hidden or visible on invoices per client setting).

3.4 Monthly Minimums

Minimum per client (total, or per category: storage/fulfillment). At month close, if activity < minimum, generate a 'Monthly minimum adjustment' charge for the difference.

3.5 Live Ledger View

Per-client ledger: month-to-date totals by category, a live feed of new charges (realtime), and filters by charge type/date. Drill-down to the source event, worker, device and timestamp.

Unpriced-event queue (charges with no matching rate line) for quick rate fixes, with a re-price action for the open period.

4. Acceptance Criteria

An order of 3 units across 2 SKUs (2+1) is priced $2.75 + $0.50 + $0.85 under the reference matrix.

A 40' floor-loaded container check-in creates exactly one de-vanning charge at the 40' rate.

A $7.20 label with a 15% markup produces $7.20 pass-through + $1.08 markup lines.

A client with $620 of activity and a $1,000 minimum gets a $380 adjustment at month close, and none when activity exceeds the minimum.

A new pick charge appears in the live ledger within 2 seconds of the pick event.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

The reference-scenario suite extends Sprint 1's suite. Rounding per line, half-up.

Latency

Event → priced charge visible in the ledger <2s p95.

Re-pricing safety

Re-pricing applies only to the open, un-invoiced period, and every re-price is audited.

6. Implementation Task Breakdown: Sprint 2

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Charge Catalog] ──> [Step 2: Capture Points] ──> [Step 3: Pricing Engines] ──> [Step 4: Live Ledger]



Step 1: Charge Catalog & Mapping Extensions

Goal: Model every touch type and how events map to it.

Task 1.1: New Charge Types & Rules

Inbound, outbound, VAS, postage, minimum charge types. Mapping rules and quantity expressions.

Task 1.2: Pick Matrix & Surcharge Configuration

Rate card editor sections for matrices and attribute surcharges.

Step 2: New Capture Points on the Floor & Dock

Goal: Make sure every billable touch creates an event.

Task 2.1: Dock Container Type Capture

Extend Phase 1 check-in.

Task 2.2: Floor Task Buttons & Timers

Relabel, QA, wrap and VAS task events in the floor workspace.

Step 3: Pick Matrix, Postage Markup & Minimums

Goal: Price complex contract rules exactly.

Task 3.1: Order-Level Pick Pricing

Price at pack-close from the order's picked lines.

Task 3.2: Postage Markup Engine

Three markup modes, provider cost capture.

Task 3.3: Monthly Minimum Adjustment

Month-close rule.

Step 4: Live Ledger View & Unpriced Queue

Goal: Make billing visible in real time.

Task 4.1: Realtime Ledger Screen

MTD totals, live feed, drill-down.

Task 4.2: Unpriced Queue & Re-price

Fix rate → re-price open period, audited.

Task 4.3: Reference Suite & Partner Replay

Extend fixtures. Replay one partner month.

7. Sprint Delivery Milestones

Milestone 1 — Charge Catalog (Target: Day 2)

Charge types and editor sections deployed.

Milestone 2 — Capture Points (Target: Day 4)

Dock and floor capture events flowing.

Milestone 3 — Pricing Engines (Target: Day 7)

Pick matrix, postage markup and minimums pass fixtures.

Milestone 4 — Live Ledger & Sign-Off (Target: Day 10)

Live ledger with <2s latency. Partner replay matches.

8. Open Questions Carried Into This Sprint

Pick matrix timing: price at pick confirmation (real-time) or at pack close (knows the final order shape)? The draft uses pack close.

Should postage markup be visible to brand clients in the portal (Sprint 7), or hidden by default?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 3 can start.



End of Phase 2 · Sprint 2 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 2 of 15  |  Page