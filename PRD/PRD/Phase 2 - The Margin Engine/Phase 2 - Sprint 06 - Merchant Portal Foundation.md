Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 6 of 15

Sprint 6: Merchant Portal Foundation: Client Users, White-Label Branding & Live Visibility

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

White-Label Merchant Command Center (Master PRD §6.3.4)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 5: Photographic Dispute Shield at the Pack Station

Unlocks next

Phase 2 · Sprint 7: Portal Self-Service: ASNs, Vendor Packing-List Importer, Invoices & Payments

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to upgrade the Phase 1 brand view lite (Sprint 11A) into a Shopify-grade, white-label merchant portal. It carries the 3PL's logo, colours and its own subdomain, and shows each brand its live orders, fulfillment progress, tracking and inventory. The master PRD treats this portal as a sales weapon: brands push their 3PLs to switch because it makes the incumbent's portal look outdated.

By the end of this sprint:

The brand access introduced in Phase 1 · Sprint 11A (read-only brand view lite) is extended: brand users get roles (Client Admin, Operations, Finance) and the full portal experience.

Each 3PL can white-label the portal (logo, colours, custom subdomain like portal.3plname.com with automatic TLS).

Brand users see a live fulfillment feed (Received → Picking → Packed → Shipped → Out for Delivery) with tracking links.

Brand users see inventory by SKU/lot/status, sell-through velocity and reorder-point alerts.

Out of scope for this sprint: self-serve ASNs, invoices and payments in the portal (Sprint 7), returns (Sprint 8), portal-side order editing (order creation stays via channels/API in Phase 2).

Dependency: Sprint 5 must be signed off (packed-carton photos become visible to clients here). Also uses the Phase 1 · Sprint 1 reserved Client User role and RLS shape.

2. User Stories

As a 3PL Owner, I want my clients to log into a portal with my brand and domain so that my service looks world-class.

As a Brand client, I want to see where every order is in real time so that I can answer my customers without emailing the 3PL.

As a Brand client, I want to see how fast each SKU sells and when I'll run out so that I can reorder in time.

As a 3PL Account Manager, I want clients to self-serve status questions so that I get far fewer 'where is my order' emails.

3. Functional Requirements

3.1 Client User Access

Invite brand users per client account (roles: Client Admin, Client Operations, Client Finance). A user may access several client accounts of the same 3PL.

RLS: Client Users see only rows where client_account_id ∈ their grants. The existing isolation test suite is extended to the new role.

Separate portal auth experience with 3PL-branded login pages: email + password, magic link, Google, GitHub and Microsoft, plus client-scoped invite codes (from Phase 1 · Sprint 11A).

3.2 White-Label Branding

Branding settings: logo, favicon, primary/accent colours, support email/phone, portal name.

Custom domain: the 3PL adds a CNAME, the platform verifies it and provisions TLS automatically (e.g. via the hosting provider's domains API). Fallback subdomain {3pl}.portal.<platform-domain>.

Branded transactional emails (invites, notifications) with the 3PL's sender name.

3.3 Live Fulfillment Feed

Order list/detail for the brand: status timeline from events, tracking links and carrier status, packed-carton photos (Sprint 5), exceptions shown in brand-friendly language (e.g. 'Address being verified').

Realtime updates via the event backbone, filtered to the client.

3.4 Inventory Intelligence

Inventory by SKU (available, allocated, on hold, damaged, expired), by lot with received/manufacture/expiry dates and near-expiry flags, by serial (serial register with current status and shipment), and inbound expected (open ASNs).

Brand-safe traceability: brands can search a serial or lot and see its status and history (in stock / shipped to order X with tracking). Warehouse location paths are shown or hidden per 3PL setting.

Velocity (7/30/90-day units shipped), days of cover, reorder-point alerts (brand-set thresholds) by email/in-app.

CSV export on every view.

4. Acceptance Criteria

A Client User of Brand A can't access any Brand B record through the UI or the API (automated tests).

A 3PL connects portal.example3pl.com, and it serves the branded portal over HTTPS within 15 minutes of DNS propagating.

An order's portal status changes within 2 seconds of the pick/pack/ship event on the floor.

A reorder alert is sent when available stock drops below the brand's threshold.

5. Non-Functional & Security Requirements

Requirement

Detail

Data isolation

Client-level RLS on every table a Client User can reach. Penetration test of the new role.

Performance

Portal pages render <1.5s. Realtime feed latency <2s.

Branding

No platform branding visible on custom domains except an optional 'Powered by' footer (3PL setting).

Accessibility

Portal meets WCAG 2.2 AA: screen readers, keyboard, 400% zoom reflow, charts with data tables, accessible PDFs. White-label colours are contrast-checked and adjusted to pass.

6. Implementation Task Breakdown: Sprint 6

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Client Role] ──> [Step 2: White-Label] ──> [Step 3: Fulfillment Feed] ──> [Step 4: Inventory Intel]



Step 1: Client User Role, Grants & RLS

Goal: Let brand users in with strict client-level isolation.

Task 1.1: Grants Schema & Invites

client_user_grants, invite flow, client roles.

Task 1.2: RLS Extension & Tests

Client-scope policies on all reachable tables. Extended isolation suite.

Step 2: Branding & Custom Domains

Goal: Make the portal look like the 3PL's own product.

Task 2.1: Branding Settings & Theming

Logo/colour tokens applied at runtime.

Task 2.2: Custom Domain Provisioning

CNAME verification, automatic TLS, host-based tenant resolution.

Task 2.3: Branded Emails

Sender name, templates.

Step 3: Live Fulfillment Feed

Goal: Answer 'where is my order' before it's asked.

Task 3.1: Order List & Timeline

Brand-friendly statuses, tracking, photos.

Task 3.2: Realtime Client Channel

Client-filtered event subscription.

Step 4: Inventory Views, Velocity & Reorder Alerts

Goal: Give brands the inventory insight they expect.

Task 4.1: Inventory Views

By SKU/lot/status + inbound expected.

Task 4.2: Velocity & Alerts

Rolling velocity, days of cover, threshold alerts.

7. Sprint Delivery Milestones

Milestone 1 — Client Access (Target: Day 3)

Client Users invited. RLS suite passes.

Milestone 2 — White-Label (Target: Day 5)

Branding + custom domain working.

Milestone 3 — Fulfillment Feed (Target: Day 8)

Live order feed with tracking and photos.

Milestone 4 — Inventory Intel & Sign-Off (Target: Day 10)

Inventory views and alerts live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Should brand users be able to create manual orders in the portal (for B2B/wholesale) in Phase 2, or only via channels/API?

Is the 'Powered by' footer on by default (a platform acquisition channel) or off?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 7 can start.



End of Phase 2 · Sprint 6 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 6 of 15  |  Page