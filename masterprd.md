Product Requirements Document (PRD)
Modern 3PL Warehouse Operating System — Unified WMS + OMS + Billing Platform
Working title. The final product name is still open (see Section 14).
Version: 1.1 (Draft — web app delivery)   Date: September 26, 2026   Status: Draft for review   Scope: High-level, MVP → Advanced (Full Vision)
Source research: Holistic Research & Strategic Analysis (Extensiv), Extensiv Features Analysis, and Unique Value Proposition (UVP) Features — September 2026





1. Executive Summary
This PRD defines a cloud-native warehouse operating system for independent Third-Party Logistics (3PL) warehouses and omnichannel brands. It brings the Warehouse Management System (WMS), Order Management System (OMS), activity-based 3PL billing, storefront integrations and a white-label merchant portal together in one native platform on one database. It targets the underserved mid-market: digital-first 3PLs running 1–5 facilities and 15,000–300,000 orders per month for 10–60 brand clients.
Delivery model: the product is delivered as a responsive web application that runs in the browser. Every user works in the same web app: 3PL managers, billing staff, floor workers at workstations or scanner-equipped stations, and brand clients in the portal. There are no native mobile apps (see Section 13).
The category incumbent, Extensiv (formerly 3PL Central), holds an estimated 22–28% of the US independent SMB/mid-market 3PL software market. It came together through a private-equity roll-up of four acquired products (3PL Central, Skubana, CartRover and Scout/topShelf), which were rebranded but never rebuilt. The result is disparate codebases, sync latency, a 2000s-era interface, slow support, opaque pricing with Q4 overage penalties, and "AI" that is conversational only.
The platform wins on five pillars: (1) a unified event-driven core with sub-second sync, (2) a consumer-grade, web-based floor workspace that gets a temp worker productive in 15 minutes in any modern browser, (3) real autonomous operational AI (slotting, route optimisation, 3D cartonization, SLA prediction), (4) fintech-native real-time billing with photographic dispute proof and auto-debit, and (5) transparent "no-surprises" pricing with unlimited seats and devices. A 1-Click Extensiv Migration Engine, which moves a whole facility over one weekend, is the go-to-market wedge.
Delivery is phased: Phase 1 – The Wedge (M0–6) gives MVP parity on core warehouse execution plus migration. Phase 2 – The Margin Engine (M6–12) adds billing, payments, portal and retail B2B/EDI. Phase 3 – Autonomous & Network (M12–24) adds AI optimisation, the 4PL network and the fulfillment marketplace. A Phase 4 horizon (24+ months) covers robotics and enterprise-scale extensions.


2. Problem Statement
In a brand's own warehouse, the warehouse is a cost centre. In an independent 3PL it is the revenue centre: every square foot stored, every forklift touch, every box folded and every label applied is a chargeable event. 3PLs run on thin 8–15% operating margins, and today they have to stitch together fragmented tools:
Legacy 3PL WMS suites (Extensiv/3PL Central, Camelot) have deep billing but separate modules with separate data models and logins, clunky desktop UIs, 15–30 minute sync delays between OMS and WMS, and silent failures in middleware integrations.
Modern DTC-first WMS (ShipHero, Logiwa) have good UX but shallow multi-client 3PL billing, weak B2B/retail EDI and pallet compliance, high implementation cost, or a hardware lock-in (iOS-only).
Spreadsheets and manual month-end reconciliation mean 3PL owners spend 3–5 days every month auditing billables and handling client invoice disputes. Unbilled warehouse touches are the #1 source of margin loss in contract logistics.
Separate shipping tools (ShipStation, UPS WorldShip, FedEx Ship Manager) at the pack bench force swivel-chair data entry between systems.
Dated brand-facing portals make 3PLs look amateur to modern DTC brands, who live in Shopify-grade tools, and that drives client churn.
Warehouse labour turnover in the US exceeds 45% a year, and hourly wages have risen 30%+ since 2020. Every day spent training a temp worker on a complex UI is lost margin. The underlying problem is the same everywhere: there is no single source of truth connecting the physical scan → inventory → order state → billing ledger → client visibility in real time.


3. Market & Competitive Analysis
3.1 Core Challenges 3PLs Face Today (Research Synthesis)
Challenge
Evidence
Revenue leakage from unbilled touches
3PL margins are 8–15%. Missed storage, receiving, VAS and packaging charges are the #1 cause of 3PL business failure. Month-end billing takes 3–5 days of spreadsheet auditing.
Slow cash collection
Invoices take 30–45 days to collect (DSO ~38 days). Embedded payments have been shown to cut DSO by up to 11 days.
Labour turnover & training friction
US warehouse turnover is 45%+ a year. Incumbent UIs take 1–3 days of training per temp worker. ShipHero showed a consumer-style app can get a worker productive in ~15 minutes.
Fragmented, stitched-together systems
Extensiv runs WMS, OMS and middleware on separate schemas, which causes inventory drift, 15–30 minute sync lag, multiple logins and silent order failures during peak.
Opaque & punitive pricing
Extensiv doesn't publish pricing, charges $2.5k–$25k+ for mandatory implementation, and adds per-device, per-connector and $1k–$2.5k EDI mapping fees plus $0.05–$0.15/order Q4 overages. Mid-size 3PL 3-year TCO: $125k–$175k+.
Omnichannel convergence
85%+ of 3PLs now handle both DTC parcel and retail B2B pallet flows (GS1-128, EDI 850/856/810/940/945, routing-guide chargebacks).
2-day delivery expectations
Brands demand distributed networks to compete with Amazon Prime. Single-facility regional 3PLs are at a structural disadvantage without network collaboration.
Slow support at critical moments
Tiered queues with 24–48 hour SLAs leave 3PLs stranded during Black Friday outages or scanner desyncs.


3.2 Competitive Landscape
Competitor
Primary Segment
Strengths
Gaps
Extensiv (incumbent)
SMB–mid-market 3PLs
Deep 3PL billing (50+ micro-charges), 300+ CartRover connectors, 4PL network, fulfillment marketplace, retail EDI
Fragmented M&A architecture, clunky UI, slow support, opaque pricing, chatbot-only AI
ShipHero
DTC brands & DTC 3PLs
Modern iOS UI, fast pick/pack, open APIs
Weak multi-client billing, poor B2B/EDI pallet compliance, runs its own network that competes with 3PLs
Logiwa IO
High-volume DTC 3PLs
Cloud-native microservices, AI wave automation
High implementation cost, ~40 connectors, complex setup
Deposco
Mid-market–enterprise
Robust WMS + OMS, retail replenishment
$50k–$150k+ entry, 4–6 month implementations
Camelot 3PL
Traditional bulk / B2B 3PLs
Accounting engine, freight & cold storage
Legacy desktop UI, little modern eCommerce API capability
Manhattan / Körber
Tier-1 enterprise
Robotics orchestration, massive scale
Multi-million-dollar implementations, not viable for mid-market
ShipStation
Merchants / shipping
100+ storefront & carrier channels
Shipping labels only; no WMS or 3PL billing


3.3 Market Size
Total Global 3PL Market ................................ ~$1.3 Trillion
 └── North America 3PL Logistics Market ................ ~$280B – $300B
      └── N.A. WMS & OMS Software TAM .................. ~$4.8B (13.8% CAGR)
           └── Addressable SMB / Mid-Market SAM ........ ~$1.2B – $1.6B

Extensiv powers 1,500–2,000+ facilities across the US, Canada, UK and Australia, handles tens of millions of packages a month and processes $10B+ GMV a year. Its installed base is the primary displacement target.
3.4 Implications for This Product
No current product combines Extensiv-grade multi-client billing and retail compliance with modern, consumer-grade UX, a unified real-time data core and genuine operational AI. That confirms the platform's differentiators:
Unified native core, which removes the sync lag and data drift that come with Extensiv's M&A stitching.
15-minute onboarding on any device, which directly lowers the cost of 45%+ labour turnover.
Real-time, dispute-proof billing with auto-debit, which closes the leakage and DSO gap that decides whether a 3PL survives.
Autonomous operational AI in an area Extensiv explicitly says is out of scope ("predictive capabilities, anomaly detection, and intelligent order routing are not in current scope").
Frictionless migration + transparent pricing, which neutralises the switching-cost moat that keeps 3PLs on Extensiv.
Where NOT to play: Tier-1 enterprise (Manhattan, Blue Yonder, SAP), with its 10-year sales cycles and robotics depth, and one-person garage fulfillment, with its high churn and low willingness to pay.


4. Vision & Goals
Vision: Be the "Stripe + Shopify of logistics": one warehouse operating system where every physical scan on the floor instantly and accurately updates inventory, order status, the client's storefront, the billing ledger and the brand's portal. Floor workers should find it as easy as a consumer app, and 3PL founders should be able to trust it with their margins.
Primary Goals
Goal
Description
G1
Deliver a unified native core (WMS + OMS + Billing + Integrations on one schema) with sub-second real-time propagation of every warehouse event
G2
Get any new floor worker to pick their first order accurately within 15 minutes using the web app in a standard browser with a plug-and-play barcode scanner, at $0 per device
G3
Protect 3PL margins by capturing 100% of billable warehouse activity in a real-time, immutable, dispute-proof ledger with automated invoicing and payment collection
G4
Remove switching friction: migrate a full Extensiv facility (clients, SKUs, bins, lots, rate cards) over a single weekend with zero shipping downtime
G5
Give 3PLs a Shopify-grade white-label merchant portal they can use to win and keep brand clients
G6
Deliver measurable operational AI (slotting, route optimisation, cartonization, SLA prediction) that cuts floor travel by 30–45% and removes DIM-weight surcharges
G7
Keep pricing transparent and predictable: public tiers, unlimited seats/devices, flat connectors, no peak-season overages



5. Target Users & Personas
The platform is multi-sided. The 3PL is the paying customer, their warehouse staff are the daily operators, and their brand clients are the end users of the portal (and often the reason a 3PL switches).
Ideal Customer Profile (ICP)
Independent, digital-first mid-market 3PLs and hybrid omnichannel brands in North America (initial launch geography).
1–5 facilities (20,000–200,000 sq. ft.), 15,000–300,000 orders/month, 10–60 brand clients.
Outgrowing ShipHero (billing/B2B gaps) or frustrated with Extensiv (UI, add-on costs, support, fragmentation).
Persona 1: 3PL Owner / Founder — "Marcus"
Worried about thin margins, underbilling, client churn and surprise software invoices.
JTBD: "Ensure every pallet stored and carton picked is accurately invoiced automatically so profit margins are protected."
Needs: real-time billables, auto-debit collection, predictable software costs, a portal that impresses prospects.
Persona 2: Director of Warehouse Operations — "Rosa"
Deals with high labour turnover, picking errors, congestion, peak-season hiring and carrier cutoffs.
JTBD: "Implement barcode-guided pick/pack workflows an untrained temp worker can execute with zero errors."
Needs: guided web-based floor flows, wave/batch/zone picking, cycle counts, SLA alerts, labour visibility.
Persona 3: IT / Systems Lead — "Dev"
Struggles with brittle API connections, manual CSV order imports and custom integration requests.
JTBD: "Connect merchant Shopify/Amazon stores in under 10 minutes without custom code or sync troubleshooting."
Needs: turnkey connectors, self-healing errors, webhooks, OpenAPI/GraphQL docs, migration tooling.
Persona 4: Brand Client / Merchant — "Priya"
Has no inventory visibility, misses SLAs, runs into stockouts and receives inaccurate 3PL invoices.
JTBD: "Log into a sleek branded portal, see real-time order/SKU statuses, and get orders delivered within 2 days."
Needs: live fulfillment feed, self-serve ASNs & returns, cost transparency, reorder alerts.
Persona 5: Floor Worker / Temp Picker — "Luis"
Often new, seasonal and possibly non-English-speaking, working on whatever device is handed over.
JTBD: "Know exactly where to go, what to pick, and whether I got it right — without reading a manual."
Needs: product photos, bin maps, audio/visual confirmation, one-click language switch, error locks.


6. Scope — MVP to Advanced (Phased Full Vision)
The full vision is defined here but delivered in phases. Each phase releases to customers and builds on the unified core. Phase gates are driven by customer adoption goals, not just engineering completion.
6.1 Release Phasing Overview
Phase
Timeline
Theme & Goal
Headline Capabilities
Phase 1 — The Wedge (MVP)
Months 0–6
Displace Extensiv at 20–25 early-adopter mid-market 3PLs (1–2 facilities, 10k–50k orders/mo)
Unified core, core WMS, 15-min web floor workspace, top 5 connectors, billable-event capture, 1-Click Extensiv Migration
Phase 2 — The Margin Engine
Months 6–12
Lock in 3PL founders; drive net revenue retention; unlock B2B
Real-time billing ledger, photo dispute shield, auto-debit payments, white-label portal, retail EDI/GS1-128, small parcel suite, 50+ connectors, public API
Phase 3 — Autonomous & Network
Months 12–24
Category leadership and network effects
AI slotting & route optimisation, 3D cartonization, SLA prediction, anomaly cycle counts, 4PL network grid, fulfillment marketplace, profitability & forecasting
Phase 4 — Horizon
24+ months
Expand upmarket and internationally
Robotics/AMR orchestration, enterprise cross-dock, dimensioner automation, international markets, app marketplace


6.2 Phase 1 — MVP: "The Extensiv Migration Wedge" (Months 0–6)
Target: 20–25 design-partner 3PLs. Offer: free weekend migration + a guaranteed 20% saving against the customer's current Extensiv invoice.
6.2.1 Unified Event-Driven Core & Platform Foundation
Single relational schema holding orders, SKUs, inventory, locations, clients, rate cards and billable events.
Event bus + WebSockets: one floor scan propagates to WMS, storefront, billing and portal in under a second.
Atomic concurrency control so pickers and channels never over-allocate the same unit.
Multi-tenant hierarchy: 3PL Organization → Facilities → Client (Brand) Accounts, with strict data isolation.
Role-based access control (Owner, Admin, Ops Manager, Supervisor, Floor Worker, Billing, Client User) and a full audit log.
Authentication (email/password, OAuth), user invites, facility & warehouse location setup.
6.2.2 Inventory & Catalog Management
Per-client SKU master: barcodes (UPC/EAN/custom), dimensions, weight, images, unit-of-measure hierarchy (each / inner / master carton / pallet).
Location hierarchy (zone → aisle → bay → shelf → bin), with location types and capacity.
Lot, serial and expiry tracking with FIFO/FEFO allocation rules.
Real-time inventory by location, lot and status (available, allocated, on hold, damaged).
Basic SKU alias mapping (channel SKU → warehouse master SKU).
Continuous blind cycle counting by location or SKU, with discrepancy approval.
6.2.3 Inbound & Receiving
ASN creation (by 3PL staff, via CSV, or via API) and receipt against the ASN.
Scan-based receiving in the web app by carton/inner/each, with discrepancy flagging (over/short/damaged).
Suggested putaway and scan-confirmed putaway to bin.
6.2.4 Outbound Fulfillment
Order ingestion from connectors, CSV and API. Allocation rules and order holds.
Single, batch, wave and zone picking, including multi-order pick-to-tote carts (up to 24 orders).
Multi-user concurrent wave picking with real-time pick-list updates across devices.
Pack-station scan verification, carton selection and packing slip printing.
Shipping label generation via ShipStation / carrier-aggregator integration, with tracking pushed back to channels.
6.2.5 "15-Minute Rule" Web Floor Workspace
A dedicated floor mode inside the web app: simplified, large-target screens built for scanning, and separate from the manager/admin views.
Runs in any modern browser on warehouse workstations, pack-bench PCs, cart-mounted tablets or laptops, and the built-in browser of handheld scanner terminals. Nothing to install.
Plug-and-play scanning: USB and Bluetooth barcode scanners act as keyboard input, so no drivers or device-specific SDKs are needed.
Visual, step-by-step flows: large product photo, bin coordinates (Aisle 04 → Bay 12 → Shelf C → Bin 02), simple 2D location map.
Audio-visual feedback: green flash + chime on a correct scan; red lock + buzzer on a wrong item or lot.
Flows covered: receive, putaway, pick, pack, move, cycle count.
Connection resilience: scans made during brief network drops are held in the browser and synced safely on reconnect, with a clear on-screen connection indicator.
$0 device fees, unlimited worker seats.
6.2.6 Integrations (Top 5) with Basic Self-Healing
Native, turnkey connectors: Shopify / Shopify Plus, Amazon Seller Central, WooCommerce, ShipStation, plus a generic CSV/SFTP and REST API channel.
Direct webhook ingestion (no external middleware hop).
Error queue with one-click resolution for invalid addresses and unmapped SKUs. Automatic address normalisation via postal/Google APIs.
Real-time inventory push to channels on every scan.
6.2.7 Billing Foundation (Billable Event Capture)
Every warehouse touch (receive, putaway, storage snapshot, pick, pack, box used, ship) writes an immutable, attributable billable event (timestamp, worker, device, transaction).
Basic per-client rate cards (receiving, storage per pallet/bin, pick fee, per-order fee).
Monthly billing summary export (CSV) and invoice draft, the bridge to the full ledger in Phase 2.
6.2.8 1-Click Extensiv Migration Engine (MVP "Killer Feature")
Authenticate to Extensiv / 3PL Central, then automatically extract and normalise client rosters, SKU catalogs, barcodes, dimensions, lots, bin locations, on-hand inventory and open ASNs/orders.
Automated rate-card re-creation from Extensiv billing setup data.
Dry-run validation report (counts, variances) before cutover.
Weekend cutover playbook: Friday 5 PM freeze → Saturday migration (<4 hours) + 15-minute staff training → Sunday live test orders → Monday 7 AM go-live.
6.2.9 Operations Dashboard & Reporting (Basic)
Live floor dashboard: orders by status, wave progress, carrier cutoffs, exceptions.
Standard reports: inventory on hand, order throughput, receiving log, picker productivity, cycle count variance.
CSV export on every report.
6.2.10 Support Experience
In-app live chat with a <15 minute first-response target during warehouse hours.

6.3 Phase 2 — "The 3PL Margin Engine" (Months 6–12)
Goal: make the platform the financial system of record for the 3PL, raise net revenue retention, and open retail B2B revenue.
6.3.1 Real-Time Micro-Billing Ledger (Full 3PL Billing Engine)
Storage models: pallet variants (standard, oversize, stackable, half), cubic foot, linear foot, per-location, plus split-month, anniversary, month-end snapshot and average-daily-balance calendars.
Environmental surcharges (refrigerated, frozen, hazmat).
Inbound touches: container de-vanning (20'/40'), palletizing & sorting, master/inner/each receiving tiers, relabeling, QA sampling, stretch-wrap/banding.
Outbound & VAS: tiered pick-fee matrices, heavy/fragile/garment surcharges, packaging material decrement at cost-plus, inserts, kitting/assembly labour, returns processing.
Postage markup automation (percentage or flat handling fee) and monthly minimum adjustments.
Live accrued-billables view for 3PL owners at any point in the month; automated recurring and transactional invoices.
Two-way accounting sync: QuickBooks Online & Desktop (NetSuite and Xero as follow-ons).
6.3.2 Photographic Dispute Shield
A low-cost overhead USB camera at each pack station auto-captures a photo of the packed carton on the final scan.
Every invoice line and order links to its timestamp, worker ID, scan log and photo, so disputes can be resolved in one click.
6.3.3 Embedded Payments (Fintech Layer)
Brand clients link a card or ACH account at onboarding. Invoices auto-debit on the 1st and 15th.
Payment status, failed-payment retries, statements and receipts in the portal.
Target: bring DSO from ~38 days close to zero.
6.3.4 "Shopify-Grade" White-Label Merchant Command Center
Custom 3PL branding (logo, colours, custom subdomain, e.g. portal.3plname.com).
Live fulfillment feed: Received → Picking → Packed → Shipped → Out for Delivery, with tracking links.
Inventory analytics: SKU velocity, sell-through, reorder-point alerts, inventory burn.
Self-serve ASNs, including a vendor PDF/CSV packing-list importer that generates pre-barcoded carton/pallet labels for suppliers.
Self-serve returns (RMA): return labels, inspection status and inspection photos.
Financial transparency: itemised invoice breakdown per order, and invoice payment.
6.3.5 Returns (RMA) Processing
Return receiving, inspection grading, restock / refurbish / dispose dispositions, and billing of return fees.
6.3.6 Retail B2B & EDI Compliance
GS1-128 / UCC-128 carton and pallet labels with serialised SSCC-18.
EDI transaction sets 850, 856 (ASN), 810, 940 and 945 via SPS Commerce / TrueCommerce / Stedi, with pre-mapped trading-partner templates (Walmart, Target, Costco and others).
Pick → Stage → Load chain of custody: staging-lane scans, LPN + trailer-door verification against the BOL, and a hard lock with alarm on mismatch.
B2B order types, pallet building, BOL generation.
6.3.7 Small Parcel Suite (Native Pack-Bench Shipping)
Live multi-carrier rate shopping (USPS, UPS, FedEx, DHL, regionals) based on SLA and cost.
USB scale auto-read, with dimensioner support as a later follow-on.
Dual-label printing: 4x6 carrier label + GS1-128 retail carton label.
Amazon Buy Shipping integration for Seller Fulfilled Prime compliance.
6.3.8 Integration Expansion & Developer Platform
Grow to 50+ turnkey connectors (BigCommerce, Magento 2, Walmart, eBay, Etsy, TikTok Shop, Target+, Wayfair, Faire, Recharge and others).
Rule engine: SKU alias mapping, automatic order splitting (hazmat, availability), fraud/address holds, channel-specific inventory buffers.
Fuzzy AI SKU matching with one-click approval for new unmapped variants.
Public REST/GraphQL API (OpenAPI 3.0 documentation) and sub-second outbound webhooks (order.created, order.picked, order.packed, order.shipped, inventory.threshold_breached, and more).
6.3.9 Kitting, Bundling & Regulated Traceability
Virtual kits/bundles: availability calculated from child components and exploded at the pack bench. Physical kitting work orders with labour tracking.
Scanner-enforced FEFO/FIFO hard lock on expired or out-of-sequence lots.
Lot genealogy and a mock-recall report in under 30 minutes (FDA 21 CFR Part 11 / cGMP readiness).
6.3.10 Multilingual Floor Experience
One-click language switch in the web floor workspace (English, Spanish, Vietnamese, Haitian Creole, Mandarin, Arabic, and more).

6.4 Phase 3 — "Autonomous Operations & Collaborative Network" (Months 12–24)
Goal: create a lead Extensiv can't match through genuine operational AI and network effects.
6.4.1 Dynamic Slotting & Route Optimisation (TSP)
Continuously analyses SKU velocity and affinity (items bought together) and recommends re-slotting high-velocity SKUs near pack benches, with moves scheduled in slow hours.
Shortest-path pick routing without aisle backtracking (a travelling salesperson problem, or TSP). Target: 30–45% less walking distance.
6.4.2 Predictive 3D Cartonization
Before picking, a 3D bin-packing algorithm picks the optimal box and void-fill for multi-item orders.
Removes DIM-weight surcharges (estimated $1.50–$4.00 per package saved).
6.4.3 Predictive SLA Breach Alerts & Labour Balancing
Models pick velocity against carrier cutoffs and alerts early (e.g. 10:30 AM: "48 FedEx orders will miss the 2:00 PM cutoff — move 2 operators from Receiving to Zone B").
6.4.4 Anomaly-Driven Cycle Counting
Short picks, long search times (>45s) or unusual variances automatically trigger background blind counts.
6.4.5 AI Operations Copilot (Parity+)
Natural-language queries over live operational data ("Where is order #8921?") and SOP/knowledge search in 50+ languages. This matches Extensiv AI, but sits alongside the autonomous engines above rather than replacing them.
6.4.6 Collaborative 4PL Network Grid
3PLs on the platform share capacity. Distributed order management (DOM) routes each order to the partner node nearest the buyer, for 1–2 day ground delivery.
A unified merchant view (one order feed, aggregate inventory, one invoice), with automated split settlement to each node based on its rate card.
6.4.7 Two-Sided Fulfillment Marketplace
A directory where brands find 3PLs on the platform by location, capabilities (cold chain, hazmat, FDA), size and volume. Pre-qualified RFP leads are routed to platform 3PLs.
Positioned as a retention moat: the platform sends 3PLs revenue and never competes with them.
6.4.8 Brand Profitability & Demand Planning (OMS Depth)
True net profit per SKU/order: revenue − landed COGS − marketplace fees − 3PL fees − actual postage.
Velocity forecasting (7/30/90-day, seasonality, lead times) and automated purchase-order suggestions.
Distributed inventory allocation across warehouses, FBA and 3PL partners.

6.5 Phase 4 — Horizon (24+ Months, Directional)
Robotics & automation orchestration (AMRs, pick-to-light, put walls, sortation) through vendor APIs.
Enterprise-scale cross-dock and multi-hub yard/dock scheduling.
3D dimensioner and automated pack-line integrations.
International expansion (UK, Australia, and other markets), with multi-currency, multi-language, regional carriers and data residency.
App/partner marketplace for third-party extensions built on the public API.
Labour management: engineered standards, incentive pay, and gamified productivity leaderboards.


7. Non-Functional Requirements
Category
Requirement
Real-time performance
Scan → bin/inventory update <50ms. Scan → channel inventory sync <200ms. Scan → portal status <100ms. Web floor-workspace scan-to-next-step UI response <300ms.
Throughput & scale
Support tenants up to 300,000+ orders/month and 50+ brand clients. Sustain 5x normal volume during Q4 peak (Black Friday/Cyber Monday) with no degradation.
Availability
99.9% platform uptime SLA for paid tiers. 99.99% target for order-ingestion endpoints. Zero-downtime deployments.
Reliability & data integrity
Atomic inventory transactions (no over-allocation). Idempotent webhook ingestion with automatic retries. No silently dropped orders: every failure surfaces in an actionable queue.
Connection resilience
The web floor workspace survives brief Wi-Fi drops: scans are held in the browser and synced safely on reconnect, with no duplicates or lost scans.
Security
Encryption at rest and in transit. Strict multi-tenant isolation (database-enforced). RBAC. SSO for larger tenants. SOC 2 Type II readiness by end of Phase 2.
Payments compliance
PCI-DSS scope minimised by using a payment processor (e.g. Stripe). No raw card data stored.
Auditability
Immutable, append-only billing ledger and inventory transaction log. Every event attributable to user, device and timestamp. Photo evidence retained per a configurable policy.
Regulated traceability
Lot genealogy supports FDA 21 CFR Part 11 / cGMP audit needs. Mock-recall report in <30 minutes.
Platform & browser support
Web application only. Latest 2 versions of Chrome, Edge, Firefox, Safari. Responsive layouts for desktop, laptop and tablet screens. Works in the built-in browser of handheld scanner terminals (Zebra, Honeywell).
Hardware support (via browser)
USB/Bluetooth barcode scanners (keyboard-input mode). Zebra/TSC/Citizen thermal printers (ZPL) via browser print or a lightweight print connector. USB scales and pack-station webcams via browser APIs or a print/device connector.
Usability
New floor worker completes first accurate pick in ≤15 minutes with no classroom training. WCAG 2.1 AA on web surfaces.
Localization
Web floor workspace multilingual from Phase 2. i18n-ready architecture. Multi-currency ready for international expansion.
Support
In-app live chat, <15 minute first response during warehouse operating hours. Peak-season war-room coverage.



8. Information Architecture — Core Data Model (High-Level)
3PL Organization (Tenant)
 ├── Users & Roles (Owner, Admin, Ops Manager, Supervisor, Floor Worker, Billing)
 ├── Facilities (Warehouses)
 │    ├── Locations (Zone → Aisle → Bay → Shelf → Bin; staging lanes; dock doors)
 │    ├── Devices & Stations (scanners, pack benches, printers, scales, cameras)
 │    └── Labour (workers, shifts, productivity events)
 ├── Client Accounts (Brands / Merchants)
 │    ├── Portal Users & Branding
 │    ├── SKU Catalog (master SKU, aliases, UoM, dims, images, lot/serial/expiry rules, kits)
 │    ├── Inventory Ledger (qty × location × lot/serial × status)
 │    ├── Sales Channels / Connectors (Shopify, Amazon, EDI partners, API)
 │    ├── Inbound: ASNs → Receipts → Putaways
 │    ├── Outbound: Orders → Allocations → Waves → Picks → Cartons → Shipments / Loads
 │    ├── Returns (RMA) → Inspections → Dispositions
 │    ├── Contract & Rate Card
 │    └── Billing: Billable Events → Invoice Lines → Invoices → Payments
 ├── Integrations Hub (connector configs, error queue, webhooks, API keys)
 └── Network (Phase 3): partner nodes, routing rules, settlements, marketplace listing

Key principle: the warehouse event is the spine. Every physical scan is written once as a single immutable event, and that event updates inventory, order state, the billing ledger, channel inventory and the merchant portal together. No module keeps its own copy of the truth. This is the architectural answer to Extensiv's stitched-together data models.


9. Pricing, Tiering & Business Model
The research recommends a transparent, "no-surprises" model as a core differentiator: public pricing on the website, tiers based on monthly shipment volume, unlimited user and device seats, flat-rate connectors, no punitive peak overages, and free or low-cost implementation. Tier prices below are illustrative planning anchors, set at least 20% below Extensiv's equivalent benchmark, and need validation with design partners.
Tier
Target Profile
Illustrative Price
Feature Gating (Planning)
Launch
Startup 3PL, 1 facility, ≤10k orders/mo, 1–10 brands
~$400–$950/mo (vs. Extensiv $500–$1,200)
Core WMS, web floor workspace, top connectors, basic billing capture, standard reports
Growth
Mid-market 3PL, 1–2 facilities, 10k–50k orders/mo, 10–25 brands
~$2,000–$4,400/mo (vs. Extensiv $2,500–$5,500)
+ Full billing ledger, auto-debit payments, white-label portal, small parcel suite, EDI, API/webhooks
Scale
Multi-facility 3PL, 50k–300k orders/mo, 25–60+ brands
~$5,200+/mo (vs. Extensiv $6,500–$15,000+)
+ Autonomous AI modules, multi-facility, SSO, advanced analytics, dedicated CSM
Network
3PLs joining the 4PL grid / marketplace
Subscription + network transaction fees
+ 4PL routing & split settlement, marketplace listing & lead flow


Pricing Principles
Unlimited administrative and floor user seats; $0 per scanning device.
Flat-rate connectors; no per-store or per-marketplace fees.
Volume discounts as the 3PL grows. Peak months never trigger penalty overages (tier review happens on trailing averages).
Implementation: self-serve onboarding, or ~$1,500 white-glove setup. Free migration for Extensiv switchers.
Launch guarantee: 20% lower annual software spend than the customer's previous Extensiv invoices.
Revenue Streams
Stream
Description
Phase
SaaS subscription
Tiered by monthly shipment volume
Phase 1
Implementation (optional)
White-glove setup, EDI partner onboarding
Phase 1–2
Embedded payments
Processing margin on client card/ACH auto-debit
Phase 2
Network fees
Per-order routing / settlement fees on the 4PL grid
Phase 3
Marketplace
Lead or success fees on brand ↔ 3PL matches
Phase 3



10. Success Metrics (KPIs)
Metric
Target (illustrative)
Phase
Design-partner 3PLs live (displaced from Extensiv)
20–25 by Month 6
1
Extensiv migration cutover time
<4 hours, over one weekend, zero missed shipments
1
New floor worker time-to-first-accurate-pick
≤15 minutes
1
Pick accuracy / inventory accuracy
≥99.8% / ≥99.5%
1
Scan → channel inventory sync latency (p95)
<200ms
1
Orders silently lost or stuck in integrations
0 (all failures surfaced & actionable)
1
Support first-response time (warehouse hours)
<15 minutes
1
Billable event capture rate
~100% of physical touches billed
2
Month-end billing effort for 3PL
From 3–5 days to <2 hours
2
Client DSO
From ~38 days to near 0 with auto-debit
2
Invoice dispute rate
Near zero (photo-verified line items)
2
Net revenue retention
>110%
2–3
Picker travel distance reduction
30–45%
3
DIM-weight surcharge savings per package
$1.50–$4.00 on affected orders
3
Network / marketplace activation
% of 3PLs receiving routed orders or leads
3



11. Assumptions, Constraints & Key Risks
Assumptions & Constraints
Initial market is North American independent mid-market 3PLs, per the research. International comes later (Phase 4).
3PLs can't operate without billing. The MVP captures every billable event from day one so no revenue data is lost, and the full ledger follows in Phase 2 (design partners may use a CSV export in the meantime).
Inventory and billing calculations must be exact and defensible. They are the technical core and can't be "roughly right."
Multi-tenant isolation (3PL → client accounts) is a hard requirement from day one.
Hardware-agnostic by design: the platform must not rely on proprietary scanners.
Build vs. partner: carrier rate shopping (e.g. EasyPost/Shippo), EDI (e.g. Stedi/SPS) and payments (e.g. Stripe) are integrated rather than built from scratch.
Key Risks & Mitigations
Risk
Mitigation
Extensiv API access / terms restrict automated extraction
Legal review early. Fallback to customer-initiated exports (CSV/report) plus an automated normaliser.
Billing accuracy errors erode 3PL trust
Parallel-run billing against the prior system during the first month. Reconciliation reports. Immutable ledger.
Integration breadth gap vs. 300+ CartRover connectors
Focus on the top channels covering most volume. Generic CSV/SFTP/API channel. Expand to 50+ in Phase 2.
Peak-season (Q4) scale failure
Load testing at 5x volume before first Q4. Peak war-room support.
AI claims not delivering measured savings
Ship AI modules with measurable before/after dashboards. Pilot with design partners first.
Incumbent price response
Differentiate on UX, real-time core and migration, not only price.



12. Suggested Engineering Build Sequence (Internal Planning)
Suggested internal order within and across phases (not a customer-facing release plan):
Foundation: auth, multi-tenant org → facility → client hierarchy, RBAC, audit log, event bus & WebSocket layer.
Inventory core: SKU catalog, UoM, locations, lot/serial/expiry, inventory transaction ledger.
Web floor workspace shell: browser scanning input handling, label printing/scale/webcam connectors, reconnect queue, guided-flow UI kit.
Inbound & outbound execution: ASN/receiving/putaway → allocation → wave/batch/zone picking → pack → ship.
Integrations v1: Shopify, Amazon, WooCommerce, ShipStation, CSV/API. Error queue & self-healing basics.
Billable event capture + basic rate cards (running alongside steps 4–5).
Extensiv Migration Engine + cutover tooling → MVP / Phase 1 release.
Full billing ledger → invoicing → accounting sync → embedded payments → photo dispute shield.
White-label merchant portal, RMA/returns, kitting & traceability.
Retail B2B: GS1-128/SSCC, EDI sets, Pick-Stage-Load. Small Parcel Suite. Integrations to 50+ and public API/webhooks → Phase 2 release.
Autonomous AI engines: slotting, route optimisation, cartonization, SLA prediction, anomaly counts. AI copilot.
4PL network grid & settlement → fulfillment marketplace → profitability & forecasting → Phase 3 release.


13. Out of Scope (Initial Releases, Phases 1–2)
Native mobile apps (iOS/Android). The product is a web application only; floor, manager and client-portal experiences all run in the browser.
Tier-1 enterprise / Fortune 500 supply chains (Manhattan, Blue Yonder, SAP territory).
One-person garage / micro-merchant fulfillment.
Robotics hardware orchestration and AMR integrations (Phase 4).
Transportation management / freight brokerage (LTL/FTL tendering beyond BOL and load verification).
Replacing the 3PL's accounting/ERP (we sync to QuickBooks/NetSuite; we don't replace them).
Running our own fulfillment network that competes with our 3PL customers (a deliberate contrast with ShipHero).
Payroll/HR systems and full labour management (Phase 4 consideration).
AI-driven autonomous optimisation (Phase 3). Phase 1–2 only lay the data foundation for it.


14. Open Questions for Stakeholder Decision
Product name & brand: what is the final product name and positioning line (e.g. "the 3PL Operating System")?
Launch geography: North America first (per research), or also launch in another home market (e.g. Nigeria/Africa), which would change carriers, channels, currency and payment rails?
Extensiv migration feasibility: what API access and contractual/legal constraints apply to automated extraction from Extensiv / 3PL Central?
Billing in MVP: is the event capture + CSV export bridge acceptable to design partners, or does full invoicing need to move into Phase 1?
Warehouse hardware: which barcode scanners, label printers and scales will design partners standardise on, and is a small print/device connector needed alongside the browser for direct thermal printing and scale reading?
Build vs. partner: which providers for rate shopping, EDI and payments, and what effect do their fees have on the transparent-pricing promise?
Pricing validation: confirm tier boundaries and price points with design partners, and decide whether AI modules are included or a premium add-on.
Photo evidence: retention period, storage cost model and privacy policy for pack-station images.
Phase 3 network model: fee structure and governance for the 4PL grid and marketplace (lead fees vs. success fees).


End of Draft PRD. We recommend a stakeholder review of Section 14 (Open Questions) and Section 9 (Pricing & Business Model) before this is finalised and handed to engineering for detailed sprint-level specs.
