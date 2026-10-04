Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 3 of 19

Sprint 3: Precise Location Hierarchy, Floor Storage & Naming Convention

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 3–5 — Inventory Core

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 02A: Internal Admin Console, Platform Billing, Notifications & Analytics

Unlocks next

Phase 1 · Sprint 4: SKU Catalog, Unique vs Non-Unique Tracking & FIFO-FEFO-LIFO Rules

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 3 is to give every place an item can be stored an exact, unique, scannable address, so the system can always say precisely where an item is: which building and wing, which area, which aisle, rack/bay, shelf level and bin, or which floor cell or bulk lane. That applies whether goods sit on shelves, in pallet racking, on the floor, in a cage, in a cold room or in a staging lane.

Every later receipt, putaway, pick, move and count is confirmed by scanning one of these addresses, so the precision defined here is what makes item-level traceability possible.

By the end of this sprint:

Each facility has a configurable location hierarchy: Building → Wing → Floor level → Area/Zone → Aisle → Bay/Rack → Shelf level → Position/Bin.

Floor storage (grid cells and bulk lanes with slot depth) and special areas (cages, cold rooms, hazmat, mezzanine, staging, docks, yard, returns, quarantine, mobile carts/totes) are addressable locations.

A naming-convention engine generates and validates codes per facility, following the standard convention (fixed-width, zero-padded, no lookalike characters).

Every location has type, capacity, temperature class, storage rules, rack side, coordinates and walk sequence, plus a printable barcode label.

Anyone can scan or type a location code and see its full human-readable path (e.g. 'Dallas 1 › Wing 2 › Area A › Aisle 04 › Bay 12 › Level 3 › Position 02').

Out of scope for this sprint: SKUs and tracking classes (Sprint 4), inventory, containers/LPNs and 'Where is it?' search (Sprint 5), thermal printing from the browser (Sprint 6 print connector; this sprint produces ZPL files and PDFs), visual 2D map editor (Phase 3 geometry model).

Dependency: Sprint 02A must be signed off before this sprint starts. Sprint 1 (facilities, RLS helpers) and Sprint 2 (audit log on configuration tables).

2. User Stories

As an Ops Manager, I want to describe my building exactly (wings, areas, aisles, racks, shelf levels and bins) so that every item's location is unambiguous.

As an Ops Manager, I want floor storage areas split into grid cells or bulk lanes with slots so that pallets on the floor are as traceable as goods on shelves.

As an Ops Manager, I want a consistent naming convention generated automatically so that codes are predictable and workers can find any location from its code alone.

As a Floor Worker, I want every location labelled with a barcode and a readable code (with an arrow to the right shelf level) so that I scan the right spot every time.

As a Supervisor, I want to look up any location code and see its full path and properties so that I can direct people and check storage rules.

3. Functional Requirements

3.1 Location Hierarchy Model

Hierarchy nodes per facility (each optional except Area and Position, configurable per facility): Building → Wing → Floor level (ground / mezzanine / level n) → Area/Zone → Aisle → Bay/Rack → Shelf level → Position/Bin.

Each node has a code, a display name and a parent. Locations are the leaf nodes, and each location stores its full path as structured fields plus a computed full code.

Rack attributes: side (left/right or odd/even numbering), bay width, shelf level height, and orientation.

Coordinates (x, y, z in metres, optional in the MVP) for future maps and route optimisation (Phase 3).

3.2 Location Types (Every Storage Method)

Shelf bin / shelf position: small parts on shelving.

Rack pallet position: selective/drive-in racking. Levels counted from the floor (level A/1 = ground beam).

Floor grid cell: floor storage divided into rows × columns (e.g. R05-C03), with a max pallet count per cell and stack height.

Bulk floor lane: marked lanes with slot depth (LN07-S01…S06). Lane rotation behaviour configurable (drive-through = FIFO-friendly, single-entry = LIFO by nature).

Special areas: cage / secure room, cold room (chilled / frozen), hazmat area, mezzanine, staging lane, dock door, yard slot (trailers), returns area, quarantine/hold area, damaged area, pack station, and mobile locations (cart, tote, forklift).

Per location: capacity (volume, weight, max pallets/units), temperature class, security level, pickable / sellable / receivable flags, mixed-SKU and mixed-lot rules, and active flag.

3.3 Naming Convention Engine

Facility-level convention template made of ordered segments with fixed width and zero-padding, a separator and optional prefixes. Default: {FAC}-{WING}-{AREA}-{AISLE}-{BAY}-{LEVEL}-{POS} → DAL1-W2-ZA-A04-B12-L3-P02.

Floor and bulk templates: {FAC}-{WING}-FLR-R{row}-C{col} → DAL1-W1-FLR-R05-C03 and {FAC}-{WING}-BLK-LN{lane}-S{slot} → DAL1-W1-BLK-LN07-S02. Special areas: {FAC}-{WING}-{AREA}-{NN} (e.g. DAL1-W1-CAGE-01, DAL1-W3-COLD-04).

Rules enforced: uppercase alphanumeric only, fixed segment widths, no ambiguous characters (O/0, I/1, S/5 excluded from letter segments), shelf levels counted bottom-up, positions left-to-right when facing the rack, odd/even sides configurable.

Validation on every create/import: pattern match, uniqueness per facility, parent path exists. Short 'pick code' alias (e.g. A04-12-3-02) optional for floor readability.

Human-readable path renderer: code → 'Dallas 1 › Wing 2 › Area A › Aisle 04 › Bay 12 › Level 3 › Position 02'.

3.4 Bulk Generation & Import

Range generator per location type: racks (aisles × bays × levels × positions), floor grids (rows × columns), bulk lanes (lanes × slots), special areas (count). Preview with first/last codes and total, then create as a background job.

Walk sequence auto-assignment (serpentine / one-way aisle), with manual override.

CSV import/export of the hierarchy and locations with a validation report (pattern, duplicates, missing parents, bad types).

3.5 Location Labels

Templates: 2"×1" shelf bin, 4"×6" rack/pallet position (with an up/down arrow pointing to the level), floor-cell and lane signs (large-format PDF), and area signs.

Code 128 (or QR) barcode + human-readable code + short path line. PDF sheets now, ZPL for thermal printers (sent via the Sprint 6 print connector).

3.6 Location Lookup & Browser

Search/scan any code → full path, type, properties, capacity and (from Sprint 5) contents.

Tree browser (Building → … → Position) and filterable table (type, area, aisle, temperature, active).

Deactivate instead of delete once a location has ever held inventory. Code changes are versioned with a history (old code still resolves to the location for 90 days).

4. Acceptance Criteria

A facility configured with 2 wings, 3 areas, 20 aisles × 20 bays × 5 levels × 2 positions, plus a 10×8 floor grid and 12 bulk lanes × 6 slots generates exactly 4,000 + 80 + 72 unique locations, all matching the naming convention.

Scanning a label for DAL1-W2-ZA-A04-B12-L3-P02 shows the full path 'Dallas 1 › Wing 2 › Area A › Aisle 04 › Bay 12 › Level 3 › Position 02'.

Importing codes that break the convention (wrong width, lowercase, O instead of 0) or duplicate existing codes rejects exactly those rows with clear reasons.

A cold-room location can't be created in an area whose temperature class is ambient (rule validation).

A location that has held inventory can't be hard-deleted. A renamed location still resolves from its old code.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Generation of 5,000 locations <30s (background job). Code lookup/path render <30ms.

Integrity

Unique (facility_id, full_code) and (facility_id, barcode) at the database level. Naming-convention validation enforced server-side.

Data isolation

Hierarchy and locations scoped by facility. Only Ops Manager+ can write, Supervisor+ can print labels.

Usability

Codes are readable aloud and on a label at 1.5 m. Level arrows on rack labels.

6. Implementation Task Breakdown: Sprint 3

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Hierarchy Schema] ──> [Step 2: Naming Engine] ──> [Step 3: Generator & Import] ──> [Step 4: Labels & UI]



Step 1: Hierarchy, Location Types & Naming Schema

Goal: Model every storage place with a structured, validated address.

Task 1.1: Migrations

location_nodes (facility, parent, node_type [building|wing|floor_level|area|aisle|bay|level|position], code, name), locations (leaf: type, full path fields, full_code, barcode, capacity, temperature, rules, side, x/y/z, walk_sequence, active), naming_conventions (template, segments, widths, excluded chars), location_code_history.

Task 1.2: Constraints, RLS & Audit

Uniqueness, parent-path integrity, temperature-rule check, facility-scoped RLS, audit trigger.

Step 2: Naming Convention Engine & Path Renderer

Goal: Generate and validate codes that are always consistent.

Task 2.1: Template Parser & Validator

Segment widths, padding, excluded characters, per-type templates. Server-side validation function.

Task 2.2: Path Renderer & Lookup API

Code → structured path → human-readable path. Old-code resolution.

Step 3: Range Generators & CSV Import

Goal: Create racks, floor grids, lanes and areas in minutes.

Task 3.1: Generators per Location Type

Rack, floor grid, bulk lane, special area. Preview + background job.

Task 3.2: Walk Sequence & CSV Import/Export

Serpentine/one-way, manual override, import validation report.

Step 4: Labels, Signs & Location Browser

Goal: Make every address scannable and easy to browse.

Task 4.1: Label & Sign Templates

Bin, rack (level arrows), floor cell, lane, area signs. PDF + ZPL.

Task 4.2: Tree Browser, Table & Lookup

Hierarchy tree, filters, bulk actions, code lookup with full path.

7. Sprint Delivery Milestones

Milestone 1 — Hierarchy Data Layer (Target: Day 3)

Hierarchy, location types and naming tables deployed with constraints and RLS.

Milestone 2 — Naming Engine (Target: Day 5)

Codes generated and validated. Path renderer and old-code resolution working.

Milestone 3 — Generators (Target: Day 7)

Rack, floor grid, bulk lane and special-area generators produce the test layout correctly.

Milestone 4 — Labels, Browser & Sign-Off (Target: Day 10)

Labels scan back to the right location. Browser complete. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Default convention for design partners: adopt the standard template, or mirror each partner's existing Extensiv location codes during migration (Sprint 15 can map old → new)?

Are Building and Wing levels needed for single-building partners, or hidden by default?

Floor-cell labels: floor-mounted barcode labels, hanging signs, or both (depends on forklift traffic)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 4 can start.



End of Phase 1 · Sprint 3 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 3 of 19  |  Page