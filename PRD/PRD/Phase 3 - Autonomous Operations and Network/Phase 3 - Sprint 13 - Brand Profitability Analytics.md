Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 13 of 15

Sprint 13: Brand Profitability Analytics: True Net Profit per SKU & per Order

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Brand Profitability & Demand Planning (Master PRD §6.4.8)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 12: Marketplace RFPs, Matching, Lead Routing & Brand Onboarding Handoff

Unlocks next

Phase 3 · Sprint 14: Demand Forecasting, Purchase Order Suggestions & Distributed Inventory Allocation

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to show brands whether each order and SKU actually makes money, not just how many units are in a bin. Revenue from the channel, minus landed cost of goods, marketplace fees, the 3PL's fulfillment charges (exact, from the ledger) and actual postage, gives true net profit per SKU and per order, live in the brand portal. For 3PLs it's a strong retention feature: they become the brand's source of financial truth.

By the end of this sprint:

Brands can enter or import landed COGS per SKU (manufacturing + inbound freight + duty), with effective dates.

Channel revenue, discounts, marketplace fees (Amazon referral/FBA, Walmart, Shopify payments) are ingested from connectors.

Each order is allocated its exact 3PL charges (pick/pack/packaging/postage + share of storage).

The portal shows net profit and margin per order, SKU, channel and period, with drill-down and export.

Out of scope for this sprint: full brand accounting (P&L, ad spend attribution; ad platforms are a later integration candidate), tax.

Dependency: Sprint 12 must be signed off. Also uses the Phase 2 ledger (per-order charges), Phase 1/2 connectors (order financials) and the Phase 2 · Sprint 6 portal.

2. User Stories

As a Brand founder, I want to see profit per order after every fee so that I know which products and channels to push.

As a Brand Finance user, I want storage costs allocated to SKUs so that slow movers show their true cost.

As a 3PL Owner, I want my brands to rely on my portal for profitability so that they never want to leave.

3. Functional Requirements

3.1 Landed COGS

COGS per SKU with effective dates (manual, CSV, or computed from PO costs + freight/duty allocation per inbound shipment). Currency support.

3.2 Channel Financials

Per order: gross revenue, discounts, shipping charged, taxes (excluded from profit), refunds. Marketplace fees from connector financial APIs (e.g. Amazon settlement/fee reports, Walmart, Shopify payouts) or configured fee rules when APIs lack detail.

3.3 Fulfillment Cost Allocation

Exact per-order charges from the Phase 2 ledger (pick, pack, packaging, postage incl. markup, returns). Storage and non-order charges allocated to SKUs by cube × days (configurable).

3.4 Profitability Views

Net profit = revenue − discounts − refunds − COGS − marketplace fees − 3PL fulfillment − postage − allocated storage. Views by order, SKU, channel, period, with margin %, trends, top/bottom lists, export and a copilot integration ('which SKUs lose money on Amazon?').

4. Acceptance Criteria

For a reference order, net profit equals a hand calculation (revenue, COGS, Amazon referral fee, pick/pack charges, postage) to the cent.

Amazon fees for a test month reconcile to the settlement report within 0.5%.

Allocated storage per SKU sums to the client's storage charges for the period.

The SKU profitability view for 10k SKUs × 90 days loads in <2s.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

3PL costs come from the immutable ledger. Fee and COGS sources are shown per figure.

Privacy

Brand financials visible only to the brand's Client Admin/Finance roles, and to the 3PL only with the brand's consent.

Performance

Pre-aggregated in the analytics store. Views <2s.

6. Implementation Task Breakdown: Sprint 13

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: COGS] ──> [Step 2: Channel Fees] ──> [Step 3: Allocation] ──> [Step 4: Views]



Step 1: Landed COGS Management

Goal: Know what each unit really cost.

Task 1.1: COGS Entry, Import & PO-Based Allocation

Effective dates, freight/duty allocation.

Step 2: Channel Revenue & Fee Ingestion

Goal: Capture every marketplace deduction.

Task 2.1: Order Financials from Connectors

Revenue, discounts, refunds.

Task 2.2: Marketplace Fee Reports & Rules

Amazon/Walmart/Shopify fees, fallback rules.

Step 3: Fulfillment Cost Allocation

Goal: Attach exact 3PL costs to orders and SKUs.

Task 3.1: Per-Order Ledger Allocation

Direct charges.

Task 3.2: Storage Allocation by Cube × Days

Configurable allocation.

Step 4: Profitability Views & Copilot

Goal: Make profit visible and actionable.

Task 4.1: Portal Profitability Dashboards

Order/SKU/channel/period views, export.

Task 4.2: Copilot Tools & Reconciliation Tests

Profit queries, reference calculations.

7. Sprint Delivery Milestones

Milestone 1 — COGS (Target: Day 2)

COGS captured with effective dates.

Milestone 2 — Channel Fees (Target: Day 5)

Fees reconciled to settlement reports.

Milestone 3 — Allocation (Target: Day 7)

Order and storage allocation correct.

Milestone 4 — Views & Sign-Off (Target: Day 10)

Profitability views live. Reference checks pass.

8. Open Questions Carried Into This Sprint

Should 3PLs see their brands' profitability (with consent) to advise them, or never?

Include ad spend (Meta/Google/Amazon Ads) in a later sprint for contribution margin?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 14 can start.



End of Phase 3 · Sprint 13 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 13 of 15  |  Page