Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 8 of 15

Sprint 8: Returns (RMA): Portal Authorisations, Return Labels, Inspection & Dispositions

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Returns (RMA) Processing (Master PRD §6.3.5)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 7: Portal Self-Service: ASNs, Vendor Packing-List Importer, Invoices & Payments

Unlocks next

Phase 2 · Sprint 9: Small Parcel Suite: Native Rate Shopping, USB Scales, Dual Labels & Amazon Buy Shipping

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to extend the Phase 1 basic returns receiving (Sprint 11A) into end-to-end returns management. Brands authorise returns in the portal and generate return labels. The warehouse receives, inspects and grades returned items with photos, then restocks, refurbishes, quarantines or disposes of them. Every step is billed and visible to the brand.

By the end of this sprint:

Brand users create RMAs (from an original order or manually) and generate/email return labels.

The floor workspace has a returns receiving + inspection flow with grading and photos.

Dispositions (restock, refurbish, quarantine, dispose, return-to-vendor) update inventory and are billed.

Brands see return status, inspection results and photos in the portal.

Out of scope for this sprint: consumer-facing branded returns portal for end shoppers (Phase 3 candidate), refunds to shoppers (stays in the brand's store platform), exchange order automation.

Dependency: Sprint 7 must be signed off. Also uses Sprint 5 (photo capture component), Sprint 2 (return fee charge types) and the Phase 1 shipping provider (return labels).

2. User Stories

As a Brand client, I want to authorise a return and send my customer a label so that returns arrive identified.

As a Floor Worker, I want the screen to guide me through inspecting a return so that grading is consistent.

As a Brand client, I want photos of damaged returns so that I can claim from my carrier or supplier.

As a 3PL Owner, I want every return inspection and restock billed so that returns aren't free labour.

3. Functional Requirements

3.1 RMA Creation

From an original order (select lines/qty, reason codes) or manually (unknown order). RMA number + barcode.

Return label via the shipping provider (Phase 1 ShipStation; Sprint 9 native). Email label to the shopper or download. Expected-return tracking.

Brand rules: auto-approve reasons, inspection level required, default disposition by reason/SKU.

3.2 Returns Receiving & Inspection (Floor)

Scan the RMA barcode/tracking number, or search by order/shopper name. Handle unexpected returns (no RMA) with a quick-create.

Per item: scan SKU → scan serial for unique items (verified against the serial originally shipped on that order; mismatches flagged as possible fraud) → confirm lot for lot-controlled items → condition grade (A new/resellable, B open box, C damaged, D unsellable) → notes → photos (Sprint 5 capture component) → suggested disposition.

3.3 Dispositions & Inventory

Restock (to an exact pickable location via putaway, keeping the unit's original lot, dates and serial so rotation and traceability continue), refurbish (VAS task), quarantine/hold, dispose (with a reason), return-to-vendor (batch).

Inventory posts via the Phase 1 atomic RPCs. Lot/serial captured where tracked.

3.4 Billing & Visibility

Charges: return receipt per package, inspection per unit, restock per unit, disposal per unit/weight, refurbishment labour.

Portal: RMA list/detail with status, grades, photos and dispositions. Webhook/event return.inspected for brand systems (fully delivered in Sprint 13).

4. Acceptance Criteria

A brand creates an RMA for 2 of 3 order lines, and a return label is generated and emailed within 10 seconds.

Scanning the return tracking number on the floor opens the RMA. Grading an item 'C' with a photo shows it in the portal within 5 seconds.

Restocking a grade-A item increases available inventory and creates a restock charge.

An unexpected return without an RMA can be received and linked to a brand in <1 minute.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

Inventory impact only via the atomic RPCs. Dispositions audited.

Usability

A returns-inspection flow run by a first-time worker completes unaided (15-Minute Rule).

Data isolation

RMAs client-scoped. Shopper PII minimised and retention-limited.

6. Implementation Task Breakdown: Sprint 8

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: RMA Schema] ──> [Step 2: Portal RMAs] ──> [Step 3: Inspection Flow] ──> [Step 4: Disposition & Billing]



Step 1: RMA, Return Line, Inspection & Disposition Schema

Goal: Model the return lifecycle with full traceability.

Task 1.1: Migrations & RLS

rmas, rma_lines, return_receipts, inspections, dispositions, reason codes, grades.

Task 1.2: Return Event Types & Charge Mapping

Return events → charge types.

Step 2: Portal RMA Creation & Return Labels

Goal: Let brands authorise and label returns themselves.

Task 2.1: RMA Create Flows

From order/manual, rules, barcode.

Task 2.2: Return Label Generation & Email

Via the shipping provider interface.

Step 3: Floor Returns Receiving & Inspection

Goal: Grade returns consistently and fast.

Task 3.1: Receive & Identify

Scan RMA/tracking, unexpected return quick-create.

Task 3.2: Grade, Photo & Suggest Disposition

Grades, photos, rules.

Step 4: Dispositions, Billing & Portal Visibility

Goal: Close the loop on inventory, money and brand visibility.

Task 4.1: Disposition Actions

Restock/refurbish/quarantine/dispose/RTV.

Task 4.2: Return Charges & Portal Views

Charges live, RMA detail with photos.

7. Sprint Delivery Milestones

Milestone 1 — RMA Data Layer (Target: Day 2)

Schema, events and charge mapping deployed.

Milestone 2 — Portal RMAs & Labels (Target: Day 4)

Brands create RMAs and labels.

Milestone 3 — Inspection Flow (Target: Day 7)

Floor receiving + grading + photos work.

Milestone 4 — Dispositions & Sign-Off (Target: Day 10)

Inventory, billing and portal visibility complete.

8. Open Questions Carried Into This Sprint

Should brands be able to sync RMAs from returns apps (Loop, Returnly/AfterShip) in Phase 2? If yes, it goes in the Sprint 12/13 connector list.

Default grading scale: A–D as proposed, or configurable per brand?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 9 can start.



End of Phase 2 · Sprint 8 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 8 of 15  |  Page