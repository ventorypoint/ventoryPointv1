Core System Requirements
Document 02 of 15 · Modern 3PL Warehouse Operating System (web application)
02. Technical Design Document (TDD) & Test-Driven Development Strategy
Item
Detail
Purpose
How the system is built: repository structure, module design, data and API conventions, the event catalogue, and the test-first engineering process that guarantees correctness of stock, orders and money.
Parent documents
PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)
Version / Date / Status
1.0 (Draft) · September 26, 2026 · Draft for review


Part A — Technical Design
A1. Repository Structure (monorepo)
/apps/web                  Next.js app: (admin)/, floor/, portal/ (Phase 2), api/v1/
/apps/worker               Queue consumers & schedulers (inventory, billing, channel-sync, migration)
/packages/domain           Pure TypeScript domain logic (allocation, rotation, pricing, UoM, GS1 parsing)
/packages/services         Business commands & queries (the ONLY place business logic lives); used by web + API
/packages/contracts        Shared Zod schemas + TypeScript types + OpenAPI generation (web, API, mobile)
/packages/api-client       Typed client generated from OpenAPI (for future mobile apps, SDKs, tests)
/packages/db               Supabase types, query helpers, RLS test harness
/packages/adapters         ChannelAdapter, ShippingProvider, EdiAdapter implementations
/packages/ui               Design-system components & tokens (Document 04)
/packages/floor-kit        Floor flow framework, scanner service, feedback, reconnect queue
/supabase/migrations       SQL migrations (tables, RLS, RPCs, triggers)
/supabase/functions        Edge Functions (webhooks, invites, PIN auth)
/tests                     e2e (Playwright), load (k6), reference fixtures
/docs                      ADRs, runbooks, API spec (OpenAPI), CLAUDE.md (Document 08)

A2. Module Design
Module
Owns (tables)
Public interface
Key invariants
Tenancy & Identity
organizations, facilities, client_accounts, members, invitations, devices
RLS helpers, invite RPCs
No cross-tenant access. Revoked members blocked at the DB.
Events
warehouse_events, event_type_registry, event_deliveries, audit_log
record_event(s), useFacilityEvents
Append-only. Idempotent keys.
Location & Layout
location_nodes (building → position), locations (types incl. floor cells, bulk lanes, special areas), naming_conventions, location_code_history
naming engine, path renderer, generators, resolve_location
Codes match the facility convention. Unique per facility. Old codes resolve via aliases.
Catalog & Tracking
skus (tracking_class, rotation_rule, date rules), client_tracking_defaults, sku_uoms, sku_barcodes
resolve_barcode, import pipeline
FEFO ⇒ expiry required. Unique SKUs need a serial source.
Inventory & Traceability
inventory_balances (location × container × lot × serial × status), inventory_transactions, lots (dates, expiry status), serials, containers (LPN), adjustments
move/move_container/adjust/receive_into/consume_from RPCs, where_is(), item_history()
qty ≥ 0. A serial exists in exactly one place. Balances = rebuild(events). Expired stock never allocatable.
Inbound
asns, receipts, putaway_tasks, containers
receive flow, putaway engine
Receipts post only via receive_into.
Orders & Allocation
orders, order_lines, allocations, holds
transition_order, allocate_orders
Allowed transitions only. No over-allocation.
Picking
waves, pick_tasks, tote_bindings
wave builder, claim_tasks (SKIP LOCKED)
No double claim/pick.
Pack & Ship
shipments, cartons, packaging_materials
finish_pack, ShippingProvider
Consume exactly once.
Integrations
connections, integration_messages, integration_errors, api_keys
ChannelAdapter, public API
Every message ends processed/errored/ignored.
Billing
rate_cards, billable_charges, storage_snapshots, billing_periods
billing_capture consumer, exports
Immutable charges. Priced by effective version.
Migration
migration_projects, staging_records, reconciliation_reports
extract, dry_run, commit, rollback
Dry run writes nothing to production.

A3. Data Conventions
Location codes follow the facility naming convention (fixed-width, zero-padded, no lookalike characters), and structured path fields are stored alongside the full code. Serial numbers are unique per client+SKU. Lot dates (received, manufactured, expiry) are stored as dates, with the received timestamp as timestamptz.
UUID v7 primary keys. created_at/updated_at timestamptz (UTC). Monetary values as numeric(14,4) + ISO currency. Quantities as integers in each-units, with UoM conversions in domain code.
Every table has RLS enabled at creation. Policies reuse get_user_role, user_has_facility, user_has_client.
Status fields are Postgres enums, with transitions enforced by functions/triggers.
Soft-delete only for configuration (deactivate), never for events, transactions or charges.
Migrations are backwards-compatible (expand/contract). No destructive change without a two-release window.
A4. Event Catalogue (MVP)
Event type
Produced by
Consumed by
Billable
receipt.line_received
Receiving flow
Inventory, billing, dashboards
Yes (per each/case/pallet)
putaway.completed
Putaway flow
Inventory, billing
Yes
inventory.moved / adjusted / status_changed
Move, adjust, status RPCs
Inventory, channel sync, audit
Adjust: configurable
container.created / moved / broken_down
LPN RPCs (receiving, putaway, moves)
Inventory, item history
Configurable (pallet moves)
serial.received / picked / packed / shipped
Receive, pick, pack flows
Item history, traceability
No
lot.expiry_status_changed
Expiry status job
Inventory (expired status), alerts
No
location.corrected
Location audit counts
Inventory, location-accuracy KPI
No
order.imported / transitioned / cancelled
Ingestion, order service
Dashboards, channel sync
No
allocation.created / released
Allocation engine
Inventory (allocated), dashboards
No
wave.released, pick.confirmed, pick.short
Wave builder, pick flow
Inventory, billing, counts, dashboards
Pick: yes
pack.item_verified, pack.carton_closed, packaging.consumed
Pack flow
Billing, dashboards
Yes
shipment.shipped
Pack/ship
Inventory (consume), channel sync, billing
Label/handling
count.submitted / approved, replenishment.completed
Count & replenishment flows
Inventory, accuracy KPI
Configurable
inventory.opening_balance
Migration commit
Inventory projection
No

A5. API Design Standards
REST resources in plural nouns (/v1/orders), JSON, ISO-8601 dates, cursor pagination (?cursor=&limit=), filtering by query params.
Idempotency-Key required on all POSTs that create resources. Keys retained 24h.
Error model: { error: { code, message, details[], request_id } } with stable codes (e.g. sku_unmapped, insufficient_stock). Never stack traces, SQL or internal messages.
Responses are built from explicit response schemas in packages/contracts (no whole database rows). Writes accept only allow-listed fields, so protected fields (tenant IDs, roles, prices, statuses, quantities) can't be tampered with (Doc 05 §6, controls 8 and 17).
Auth: API keys (org- or client-scoped) with scopes. Rate limits per key (headers X-RateLimit-*).
Versioning: URL major version. Additive changes only within a version. 12-month deprecation policy.
Two API surfaces from the same services: internal API (/api/v1/internal/*, user-session JWT auth, used by first-party clients such as a future mobile app) and public API (/api/v1/*, API-key auth, for partners). Both documented in OpenAPI.
A5a. API-First Service Layer Rule
The system is a modular monolith, but it's built API-first, so any new client (for example a native mobile app) can be added later using the same backend:
packages/domain + packages/services  ← all business logic (one place)
        │
        ├── server actions           → web app (thin adapters only)
        ├── /api/v1/internal routes  → first-party clients (future mobile apps)
        ├── /api/v1 public routes    → partners, integrations
        └── Postgres RPCs            → atomic stock / money operations

No business logic in server actions or route handlers. They authenticate, validate input with the shared schema, call one service function, and map the result. Code review and CI (lint rule) enforce it.
Every floor and admin command has an internal API endpoint. This includes receive, put away, move (item/LPN), pick (claim, confirm, short), pack, count, replenish, returns, 'Where is it?', item history, and record_events (batch, idempotent). It's added when the command is built, not later.
Shared contracts: request/response schemas live in packages/contracts. OpenAPI is generated from them, and the typed packages/api-client is generated from OpenAPI, so web, API and mobile can't drift apart.
Auth for any client: Supabase Auth JWTs (email, OAuth, badge + PIN) work for browsers and mobile SDKs. RLS protects data regardless of the client.
Realtime and offline for any client: facility events via Supabase Realtime (web and mobile SDKs). Offline scans are posted to record_events with client idempotency keys (IndexedDB queue on web; SQLite queue on a future mobile app).
Design tokens are portable: brand-tokens/tokens.json is the source for the web (CSS/Tailwind) and any future mobile theme.
Future mobile app readiness: a React Native/Expo app would reuse the domain logic, contracts, API client, auth, realtime and tokens, and rebuild only the UI and device layer (camera scanning, push notifications, SQLite offline queue, device registration). No backend rewrite is needed.
A5b. Location, Tracking & Rotation Design

Figure A1 — Location address anatomy and what is tracked inside each location
Location hierarchy: location_nodes tree per facility (building, wing, floor level, area, aisle, bay, level, position). locations are leaves with type (shelf bin, rack position, floor cell, bulk lane, cage, cold room, staging, dock, yard, quarantine, mobile), capacity, temperature, mixed-SKU/lot rules and coordinates.
Tracking classes: non-unique (qty), lot (qty per lot + dates), unique/serial (one record per unit; manufacturer serial or generated UID), lot + serial. Enforced in every inventory RPC.
Rotation engine (in packages/domain): ordering functions FIFO (first_received_at asc), FEFO (expiry asc), LIFO (first_received_at desc), customer lot (exact match). Shared by allocation, pick validation, replenishment and (Phase 2) kitting.
Traceability: where_is(query) resolves SKU/barcode/lot/serial/LPN/location/order to current balances with full paths. item_history(entity) reads inventory_transactions + events for a serial, lot or LPN.
A6. Floor Workspace Technical Design
Scanner service: global key listener with timing heuristics (wedge detection), per-station profile, barcode classification (location code by naming-convention pattern, LPN, SKU/UoM, lot, serial, generated unique ID, tote, order, badge), GS1 AI parser (01/10/11/17/21).
Flow framework: declarative steps (prompt, expected scan classes, validator, event builder, exceptions), with time-per-step telemetry.
Reconnect queue: IndexedDB store of pending events (client UUID idempotency key + occurred_at), ordered batch flush via record_events.
Printing: printer registry → Zebra Browser Print / QZ Tray for ZPL, with PDF fallback. Scales via WebHID (Phase 2). Webcam via getUserMedia (Phase 2).
Part B — Test-Driven Development Strategy
B1. Working Agreement
Every sprint story starts from its acceptance criteria (sprint PRD Section 4). These are written as failing tests first (unit, integration or e2e as appropriate).
Implementation is done in small increments until the tests pass (red → green → refactor). AI-generated code follows the same rule (Document 08).
No pull request merges without tests for new behaviour, the RLS test for every new table, and green CI.
Correctness-critical engines (inventory ledger, allocation, billing, EVM-style calculations, migration reconciliation) also need a reference/property-based suite before sign-off.
B2. Test Pyramid & Tooling
Layer
Tooling
What is tested
Gate
Unit
Vitest
Domain logic (UoM, pricing, allocation rules, GS1 parsing, rate-card resolution)
Every PR; ≥90% coverage on /packages/domain
Database
pgTAP + Supabase CLI
RLS policies per role, RPC behaviour, constraints, triggers, immutability
Every PR touching /supabase
Property-based
fast-check
Inventory conservation/non-negativity, allocation fairness, billing totals
Every PR in those modules
Integration
Vitest + test DB
Server actions, workers, adapters against sandboxes/mocks
Every PR
Contract
Adapter contract suite
Every ChannelAdapter/ShippingProvider
Per connector change
API parity
Generated OpenAPI + schema tests
Every service command has an internal API endpoint and schema; OpenAPI builds; the API client compiles
Every PR
End-to-end
Playwright
Critical user flows (Document 03) incl. floor flows with simulated scanner input
Merge to main + nightly
Device matrix
Manual + scripted
Handheld browsers, scanners, printers
Every sprint touching floor
Load/performance
k6
NFR targets (Doc 01 §8), 5x peak
Nightly on staging + before release
Security
Semgrep, dependency audit, ZAP baseline
SAST, vulnerable deps, common web vulnerabilities
Every PR / weekly
Accessibility
axe-core (Playwright + Storybook), eslint-plugin-jsx-a11y, manual screen-reader passes (NVDA, VoiceOver, TalkBack)
WCAG 2.2 AA rules, keyboard paths, focus order, live-region announcements, contrast, 200% zoom reflow
Every PR (automated) + every sprint touching UI (manual)

B3. Reference Suites (must pass 100%)
Inventory ledger: 50-writer contention test, 1M-event rebuild equals live balances, conservation under random operation sequences.
Allocation & rotation: competing-orders tests, FIFO/FEFO/LIFO/customer-lot ordering fixtures, expired-never-allocated, min-shelf-life fixtures, partial/backorder policies.
Tracking & traceability: serial uniqueness (no serial in two places), tracking-class enforcement per RPC, LPN move moves all contents, 'Where is it?' returns the correct full path, and item history is complete from receipt to shipment.
Naming convention: generator and validator fixtures for rack, floor-cell, lane and special-area templates, including rejected lookalike characters.
Billing: hand-calculated monthly scenarios per charge type and storage calendar, to the cent.
Migration: sandbox extraction counts, dry-run no-write check, commit/rollback/reconciliation fixtures.
RLS isolation: every role × every tenancy level × every table (automated matrix).
B4. CI/CD Gates
Stage
Checks
Blocks merge/deploy?
Pull request
Lint, typecheck, unit, DB/RLS, integration, SAST, dependency audit, migration dry-run on a branch DB
Yes
Main
Full e2e, contract tests, build, preview deploy
Yes (deploy)
Nightly
Load tests on staging, device-matrix smoke, backup restore check (weekly)
Alerts only
Release
Change log, migration review, feature-flag plan, rollback plan
Yes

B5. Test Data
Seed generator creates realistic tenants (3PL with 2 facilities, 5 clients, 10k SKUs, 5k locations, 30 days of orders) for local/preview/staging.
No production personal data in non-production environments. Anonymisation is required for any production-derived fixture.


End of Document 02.
