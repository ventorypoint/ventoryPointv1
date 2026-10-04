Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 7 of 15

Sprint 7: Portal Self-Service: ASNs, Vendor Packing-List Importer, Invoices & Payments

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

White-Label Merchant Command Center (Master PRD §6.3.4)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 6: Merchant Portal Foundation: Client Users, White-Label Branding & Live Visibility

Unlocks next

Phase 2 · Sprint 8: Returns (RMA): Portal Authorisations, Return Labels, Inspection & Dispositions

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to move the routine brand-to-3PL paperwork into the portal. Brands create inbound ASNs themselves, including by uploading a supplier's packing list, which generates pre-barcoded carton/pallet labels the supplier applies before shipping. Brands also see an itemised cost breakdown, their invoices, and can pay or manage their auto-debit method.

By the end of this sprint:

Brand users create, edit and cancel ASNs in the portal, and the dock sees them instantly.

Uploading a supplier packing list (CSV/XLSX; PDF parsing where feasible) creates an ASN and printable carton/pallet labels for the supplier.

Brand users see invoices, a per-order cost breakdown and payment history, and can pay open invoices or update their payment method.

Out of scope for this sprint: returns (Sprint 8), GS1-128/SSCC compliant supplier labels (Sprint 10 upgrades the label format), multi-currency invoices.

Dependency: Sprint 6 must be signed off. Also uses Sprint 3 (invoices), Sprint 4 (payments) and Phase 1 · Sprint 7 (ASN model).

2. User Stories

As a Brand client, I want to tell the 3PL what's arriving myself so that receiving is faster and I don't wait on email replies.

As a Brand client, I want to upload my factory's packing list and get labels to send them so that cartons arrive barcoded and are received in minutes.

As a Brand Finance user, I want to see exactly what each order cost me in fulfillment so that I can trust the invoice.

As a Brand Finance user, I want to pay or update my payment method in the portal so that I don't have to call anyone.

3. Functional Requirements

3.1 Self-Serve ASNs

ASN form (lines: SKU, qty, UoM, lot/expiry optional, cartons/pallets, expected date, carrier/tracking). Validation against the brand's catalog. Edit until arrival. Cancel.

3PL-configurable rules: required fields, lead time, dock appointment request (a simple slot request in Phase 2).

3.2 Vendor Packing-List Importer

Upload CSV/XLSX with column mapping (saved per supplier). PDF parsing via a document-extraction step with human confirmation. All files go through the upload service (content-type check, size limits, malware scan, private storage).

Generates the ASN + per-carton/per-pallet labels (ASN reference, SKU, qty, carton n of N, barcode) as a PDF for the supplier. Scanning a label at receiving opens the matching ASN line.

3.3 Financial Transparency

Invoice list/detail with PDF/CSV download, status, and a drill-down to charges (the same drill-down the 3PL sees, including photos).

Per-order cost view: pick/pack/packaging/postage (markup shown or hidden per the 3PL setting from Sprint 2).

Month-to-date accrued charges (optional per 3PL).

3.4 Portal Payments

Pay open invoices (card/ACH via Stripe-hosted elements), manage saved methods, auto-debit consent, payment history and receipts.

4. Acceptance Criteria

An ASN created in the portal appears on the dock's expected-arrivals list within 2 seconds.

A 40-line supplier CSV creates an ASN and a label PDF. Scanning a label on the floor opens the correct ASN line.

An order's per-order cost view equals the sum of its ledger charges.

A brand pays an open invoice by ACH in the portal, and the invoice shows 'processing' then 'paid'.

5. Non-Functional & Security Requirements

Requirement

Detail

Data isolation

Client-scoped RLS on ASNs, invoices and payments. Finance views limited to the Client Finance/Admin roles.

Security

Payments only via Stripe-hosted elements.

Usability

A first-time brand user creates an ASN without help in <5 minutes (usability test).

6. Implementation Task Breakdown: Sprint 7

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Portal ASNs] ──> [Step 2: Packing-List Import] ──> [Step 3: Cost Transparency] ──> [Step 4: Portal Payments]



Step 1: Self-Serve ASN Creation

Goal: Let brands prepare the dock themselves.

Task 1.1: ASN Form & Rules

Catalog validation, 3PL rules, edit/cancel.

Task 1.2: Dock Visibility

Realtime expected-arrivals list update.

Step 2: Vendor Packing-List Importer & Supplier Labels

Goal: Get cartons barcoded before they leave the factory.

Task 2.1: CSV/XLSX Import with Saved Mappings

Per-supplier mapping templates.

Task 2.2: PDF Extraction with Confirmation

Extraction step + review screen.

Task 2.3: Supplier Label PDF & Receiving Hook

Carton/pallet labels, scan-to-ASN-line on the floor.

Step 3: Invoices & Per-Order Cost Views

Goal: Make every charge understandable to the brand.

Task 3.1: Invoice Views & Drill-Down

List/detail/downloads/photos.

Task 3.2: Per-Order Cost & MTD Accrual

Cost breakdown, markup visibility setting.

Step 4: Portal Payments & Payment Methods

Goal: Let brands pay without contacting the 3PL.

Task 4.1: Pay Invoice & Manage Methods

Hosted elements, consent, receipts.

Task 4.2: Usability Test

5 brand users, ASN + payment tasks.

7. Sprint Delivery Milestones

Milestone 1 — Portal ASNs (Target: Day 3)

Brand-created ASNs flow to the dock.

Milestone 2 — Packing-List Import (Target: Day 6)

CSV import + supplier labels + receiving hook work.

Milestone 3 — Cost Transparency (Target: Day 8)

Invoices and per-order costs visible.

Milestone 4 — Payments & Sign-Off (Target: Day 10)

Portal payments live. Usability target met.

8. Open Questions Carried Into This Sprint

Dock appointment scheduling: a simple request in Phase 2, or a full slot calendar?

PDF packing-list extraction: build (document AI) or defer to CSV/XLSX-only for Phase 2?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 8 can start.



End of Phase 2 · Sprint 7 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 7 of 15  |  Page