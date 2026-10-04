Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 14 of 15

Sprint 14: Demand Forecasting, Purchase Order Suggestions & Distributed Inventory Allocation

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Brand Profitability & Demand Planning (Master PRD §6.4.8)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 13: Brand Profitability Analytics: True Net Profit per SKU & per Order

Unlocks next

Phase 3 · Sprint 15: Enterprise Scale Tier (SSO, Advanced Roles, Data Residency) & Phase 3 Launch Readiness

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to help brands and 3PLs have the right stock in the right place before it's needed. Velocity forecasts per SKU and channel (7/30/90-day, seasonality, promotions) drive automated purchase-order suggestions based on vendor lead times, and recommend how to place inventory across the 3PL's facilities, network nodes and Amazon FBA to meet 1–2 day delivery at the lowest cost.

By the end of this sprint:

SKU × channel × region forecasts are produced daily with accuracy tracking.

Brands get reorder alerts and draft purchase orders (quantity, date) based on lead times, safety stock and MOQs, and can send the POs to suppliers, which creates ASNs automatically.

An inventory placement plan recommends how much stock to hold at each facility/node/FBA, and generates transfer suggestions (Sprint 8/9).

Forecasts feed seasonal pre-slotting (Sprint 3) and labour planning signals (Sprint 5).

Out of scope for this sprint: full supplier portal/collaboration, automatic PO sending without brand approval, promotional planning tools.

Dependency: Sprint 13 must be signed off (COGS for PO values). Also uses Sprint 8 (transfers), Sprint 9 (network placement) and the Sprint 1 analytics store.

2. User Stories

As a Brand, I want to be told when and how much to reorder so that I never stock out or over-buy.

As a Brand, I want my stock split across the network so that most customers get 2-day delivery.

As a 3PL Ops Manager, I want forecasted demand by SKU so that I pre-slot and staff for peaks.

3. Functional Requirements

3.1 Forecasting

Models per SKU × channel × region: baseline (exponential smoothing / gradient boosting on features: seasonality, trend, price/promo flags, stockout censoring), hierarchical reconciliation (SKU → brand). Daily refresh. Accuracy (MAPE/WAPE) tracked per SKU class.

3.2 Purchase Order Suggestions

Per SKU: vendor, lead time, MOQ, case pack, safety-stock policy (service level). Reorder point and order quantity computed. Draft POs grouped by vendor.

Brand approves → PO PDF/email to the supplier → an ASN is created automatically with expected date (supplier labels via Phase 2 · Sprint 7).

3.3 Inventory Placement Plan

Given demand by region and node costs/SLAs (own facilities, network nodes, FBA), recommend target stock per node and transfer suggestions. Show the expected % of orders within 2-day delivery and the cost impact.

3.4 Downstream Signals

Forecast feeds: seasonal pre-slotting candidates (Sprint 3), expected volume per day for labour planning (Sprint 5), capacity alerts for storage.

4. Acceptance Criteria

On 12 months of history, the forecast beats a naive last-period baseline in WAPE by ≥15% for A-class SKUs.

For a test SKU, the suggested reorder date and quantity match a hand calculation from lead time, safety stock and forecast.

An approved PO creates an ASN with the right lines and expected date.

The placement plan for a 3-node network shows the projected 2-day coverage and generates transfer suggestions that execute via Sprint 8.

5. Non-Functional & Security Requirements

Requirement

Detail

Freshness

Forecasts refreshed daily by 6 AM facility time.

Transparency

Each suggestion shows the forecast, lead time, safety stock and assumptions.

Control

No PO or transfer is created without an explicit approval.

6. Implementation Task Breakdown: Sprint 14

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Forecasting] ──> [Step 2: PO Suggestions] ──> [Step 3: Placement] ──> [Step 4: Signals]



Step 1: Demand Forecasting Models

Goal: Predict demand well enough to act on.

Task 1.1: Feature Pipeline & Models

Seasonality, promos, stockout censoring.

Task 1.2: Accuracy Tracking

WAPE by class, backtests.

Step 2: Reorder Points & Purchase Orders

Goal: Tell brands when and how much to buy.

Task 2.1: Vendor & Policy Setup

Lead time, MOQ, service level.

Task 2.2: Draft POs, Approval & ASN Creation

PDF/email, auto-ASN.

Step 3: Inventory Placement Planning

Goal: Put stock where the demand is.

Task 3.1: Placement Optimiser

Coverage vs cost across nodes/FBA.

Task 3.2: Transfer Suggestions

Execute via Sprint 8/9 flows.

Step 4: Downstream Signals & Validation

Goal: Feed forecasts into operations.

Task 4.1: Pre-Slotting, Labour & Capacity Signals

Hooks into Sprints 3 and 5.

Task 4.2: Backtests & Pilot

12-month backtest, brand pilot.

7. Sprint Delivery Milestones

Milestone 1 — Forecasting (Target: Day 3)

Forecasts beat the baseline in backtests.

Milestone 2 — PO Suggestions (Target: Day 6)

Draft POs and auto-ASNs working.

Milestone 3 — Placement (Target: Day 8)

Placement plans and transfer suggestions working.

Milestone 4 — Sign-Off (Target: Day 10)

Signals wired. Pilot started.

8. Open Questions Carried Into This Sprint

Should Amazon FBA inbound shipment creation be automated from the placement plan (SP-API Fulfillment Inbound)?

Is forecasting a brand-paid portal add-on or included for 3PLs' clients?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 15 can start.



End of Phase 3 · Sprint 14 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 14 of 15  |  Page