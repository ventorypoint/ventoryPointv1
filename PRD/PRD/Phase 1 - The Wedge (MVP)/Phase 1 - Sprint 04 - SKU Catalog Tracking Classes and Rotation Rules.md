Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 4 of 19

Sprint 4: SKU Catalog, Unique vs Non-Unique Tracking & FIFO-FEFO-LIFO Rules

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 3–5 — Inventory Core

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 3: Precise Location Hierarchy, Floor Storage & Naming Convention

Unlocks next

Phase 1 · Sprint 5: Inventory Ledger, LPNs, Expiry & 'Where Is It?' Traceability

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 4 is to build each client's product catalog: what an item is, how to recognise it by barcode, how it's packed (each/inner/case/pallet), and exactly how each unit must be identified and rotated: whether it is non-unique (tracked by quantity), lot-controlled, or unique (every unit individually identified by serial number or a system-generated ID), and whether it ships FIFO, FEFO or LIFO, with which dates it must carry. Floor scans resolve through this catalog, and storage billing and cartonization later depend on its dimensions.

By the end of this sprint:

Ops staff can create and bulk-import SKUs per client, including barcodes, UoM levels, dimensions and images.

Every SKU has a tracking class (non-unique, lot, unique/serial, lot + serial), a rotation rule (FIFO, FEFO, LIFO or customer-specified lot) and date rules (expiry, manufacture date, minimum remaining shelf life, near-expiry warning window).

Client-level defaults for tracking class and rotation, with SKU-level overrides.

Any scanned barcode resolves to exactly one SKU + UoM within the client context.

SKU aliases and kit definitions can be stored for later phases.

Out of scope for this sprint: inventory quantities (Sprint 5), channel catalog sync (Sprints 12–13), kit assembly execution (Phase 2), SKU cost/COGS (Phase 3 profitability).

Dependency: Sprint 3 must be signed off before this sprint starts. Sprint 1 (client accounts). Sprint 3 is not required but runs before it in sequence.

2. User Stories

As an Ops Manager, I want to import a new brand's full catalog from a spreadsheet so that onboarding a client takes hours, not weeks.

As a Floor Worker, I want the system to recognise whichever barcode is on the product (UPC on the unit, GTIN on the case) so that I never have to type a SKU.

As a 3PL serving supplement and cosmetics brands, I want expiry-tracked SKUs to follow FEFO so that we never ship short-dated product.

As a 3PL storing electronics, I want each phone recorded by its serial/IMEI so that I can prove exactly which unit went to which customer.

As a 3PL storing one-off or high-value items without a manufacturer serial, I want the system to generate a unique item ID label for each unit so that every piece is individually traceable.

As a Brand whose stock is non-perishable and fast-moving, I want LIFO rotation where my contract specifies it (e.g. bulk floor lanes loaded from one end).

As a Supervisor, I want a catalog completeness score per client so that I can chase brands for missing dimensions before they cause billing or shipping errors.

3. Functional Requirements

3.1 SKU Master

Fields: client, SKU code (unique per client), name, description, status (active/inactive/discontinued), images (Supabase Storage, up to 5), hazmat class, fragile, requires-temperature class, country of origin, HS code, custom attributes (JSON).

3.2 Barcodes & UoM

Multiple barcodes per SKU, each tied to a UoM level. Uniqueness per client enforced. GTIN check-digit validation.

UoM levels each/inner/case/pallet: qty per parent, L×W×H, weight, and whether each level is receivable/pickable.

3.3 Tracking Class (Unique vs Non-Unique)

Non-unique (fungible): units are interchangeable, tracked by quantity per location/container.

Lot/batch-controlled: quantity tracked per lot. Lot number required at receipt.

Unique (serialised): each unit has its own identity. Choose the identity source: manufacturer serial/IMEI (scanned) or system-generated unique item ID (label printed at receipt, format e.g. UID-{client}-{YYMM}-{seq} with check digit). Quantity per serial is always 1.

Lot + serial: both (e.g. regulated devices).

Serial capture point: at receipt (full traceability, the default for unique items), at shipment only (lower effort), or both. Serial format validation (regex/length) per SKU.

3.4 Rotation Rules

Per SKU (client default, SKU override): FIFO (oldest first-received date first), FEFO (earliest expiry first; requires expiry), LIFO (newest first-received date first), or customer-specified lot (B2B orders naming a lot).

Tie-breakers: then by location pick-path, then by smallest quantity to clear locations.

The rule is stored with its effective date, and changes are audited (a rotation change affects allocation from the next wave).

3.5 Date & Expiry Rules

Which dates must be captured at receipt: expiry/best-before (required for FEFO), manufacture date, and first-received date (automatic, per lot/LPN/serial).

Shelf-life rules: total shelf life (days, used to derive expiry from the manufacture date when only the mfg date is printed), minimum remaining shelf life at receipt (below → quarantine) and at shipment (per client and optionally per customer/channel).

Near-expiry warning window (e.g. 60 days) and expired action (auto-move to 'expired' status, not allocatable).

3.6 Aliases & Kits (Data Only)

SKU aliases: channel type + channel SKU → master SKU (used by Sprints 12–13 ingestion).

Kit/bundle definitions: parent SKU + components + qty. Execution is in Phase 2.

3.7 Import/Export & Completeness

CSV/XLSX import with mapping templates, a row-level error report and upsert mode. Export per client.

Security: imports and images go through the shared upload service (type checked by content, size limits, malware scan, private storage). All CSV/XLSX exports use the safe-export utility that neutralises formula injection (cells starting with =, +, -, @).

Completeness score: % of SKUs with barcode, dimensions, weight and image. Shown on client and catalog pages.

3.8 Barcode Resolution Service

resolve_barcode(client_id?, barcode) → SKU + UoM + tracking class + rotation + date rules. Also resolves system-generated unique item IDs and (from Sprint 5) LPNs. Returns ambiguity candidates if a client isn't selected (multi-client facilities).

4. Acceptance Criteria

A 10,000-row catalog imports in <60s with correct UoM levels, and 50 intentionally bad rows are reported individually.

Scanning a case GTIN resolves to the SKU at case level with the correct each-quantity.

The same barcode can't be assigned to two SKUs of one client. Two different clients may share a barcode, and resolution then asks which client.

The completeness score updates immediately when dimensions are added.

A SKU set to unique/serial with system-generated IDs can't be saved without a UID format, and a lot-controlled FEFO SKU can't be saved without 'expiry required'.

Changing a client default rotation from FIFO to LIFO applies to all SKUs without an override, and the change is recorded in the audit log.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Barcode resolution p95 <30ms. Catalog list <1s for 50k SKUs (server pagination + search index).

Data isolation

SKUs strictly scoped by client account + organization. Floor roles have read-only access.

Integrity

Unique (client_account_id, code). Unique (client_account_id, barcode). Check-digit validation server-side.

Storage

Images resized to thumbnail + display sizes on upload. Max 5MB per image.

Upload & export security

Allow-listed types by magic bytes (JPEG/PNG/WebP, CSV, XLSX), malware scan, re-encoded images, signed expiring URLs. Formula-injection-safe exports (Core Doc 05 §6, controls 15–16).

6. Implementation Task Breakdown: Sprint 4

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Catalog Schema] ──> [Step 2: Catalog UI] ──> [Step 3: Import & Completeness] ──> [Step 4: Barcode Service]



Step 1: SKU, UoM, Barcode & Tracking Schema

Goal: Model catalog data with strict per-client uniqueness.

Task 1.1: Migrations

skus (+ tracking_class enum [non_unique|lot|serial|lot_serial], serial_source [manufacturer|generated], serial_capture_point, rotation_rule enum [fifo|fefo|lifo|customer_lot], expiry_required, mfg_date_required, shelf_life_days, min_shelf_life_receipt_days, min_shelf_life_ship_days, near_expiry_days), client_tracking_defaults, sku_uoms, sku_barcodes, sku_aliases, kit_components, with enums and consistency constraints (e.g. FEFO ⇒ expiry_required).

Task 1.2: RLS & Audit

Client-scoped policies and audit trigger.

Step 2: SKU Management UI

Goal: Let staff create and maintain SKUs quickly.

Task 2.1: SKU List & Search

Per-client and all-clients views, full-text search over code/name/barcode.

Task 2.2: SKU Detail Editor

Tabs: General, Barcodes & UoM, Tracking, Images, Aliases, Kit. Zod validation.

Step 3: Bulk Import/Export & Completeness Scoring

Goal: Make client onboarding fast and expose data gaps.

Task 3.1: Import Pipeline

Upload → map → validate → background commit → error report download. Reusable by the Sprints 15–16 migration engine.

Task 3.2: Completeness Score

SQL view + badge on client/catalog pages.

Step 4: Barcode Resolution Service & Tests

Goal: Give every floor flow one fast, correct lookup.

Task 4.1: resolve_barcode RPC

UoM-aware resolution, multi-client ambiguity handling, GS1 AI parsing hook (lot/expiry in GS1-128 barcodes).

Task 4.2: Test Suite

Uniqueness, check-digit, ambiguity and UoM conversion tests.

7. Sprint Delivery Milestones

Milestone 1 — Catalog Data Layer (Target: Day 3)

Schema, constraints and RLS deployed.

Milestone 2 — SKU Editor (Target: Day 6)

SKUs with barcodes, UoM and tracking rules can be created and edited.

Milestone 3 — Bulk Import (Target: Day 8)

10k-row import passes with error reporting. Completeness score live.

Milestone 4 — Barcode Service & Sign-Off (Target: Day 10)

Resolution service passes its test suite. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

GS1-128 parsing (AI 10 lot, AI 17 expiry, AI 21 serial) on inbound: in Phase 1 (MVP) or Phase 2? Recommend Phase 1 (MVP) because supplement/cosmetics design partners need it.

Are SKU dimensions mandatory for all clients, or only for clients billed by cubic volume?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 5 can start.



End of Phase 1 · Sprint 4 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 4 of 19  |  Page