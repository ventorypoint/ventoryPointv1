Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 11 of 15

Sprint 11: Cross-Border Shipping & Customs Documentation

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

International Expansion (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 10: Internationalisation Foundation: Multi-Currency, Tax/VAT, Localised UI & Units

Unlocks next

Phase 4 · Sprint 12: Regional Market Packs: UK/EU, Australia/NZ & Canada (Carriers, Marketplaces, Payments, Compliance)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to let 3PLs ship internationally from any market: customs data on SKUs (HS codes, country of origin, values), automatic customs documents (commercial invoice, CN22/CN23), duties and taxes handling (DDP/DDU, IOSS for EU low-value goods, UK VAT on low-value imports), electronic customs data submission via carriers, and landed-cost quotes.

By the end of this sprint:

SKU customs profiles are complete (HS code with validation, origin, customs description, value), with AI-suggested HS codes for review.

Cross-border shipments automatically produce commercial invoices/CN22/CN23 and send electronic customs data (paperless trade) via carriers that support it.

Incoterms (DDP/DDU/DAP) per client/channel, with duties & taxes estimation and IOSS/UK-VAT identifiers applied.

Restricted/prohibited goods screening by destination blocks non-compliant shipments.

Out of scope for this sprint: customs brokerage services, bonded warehouse operations, import clearance at the 3PL's inbound (partner brokers handle it).

Dependency: Sprint 10 must be signed off (currency, tax, addresses). Also uses the Phase 2 · Sprint 9 Small Parcel Suite and Phase 1 · Sprint 4 SKU customs fields.

2. User Stories

As a Packer, I want customs paperwork generated automatically so that international orders ship as easily as domestic ones.

As a Brand, I want DDP shipping so that my customers never pay surprise duties on delivery.

As a Compliance Lead, I want prohibited items blocked by destination so that we never ship illegal goods.

3. Functional Requirements

3.1 Customs Data

SKU customs profile with HS code validation (6–10 digit), origin, description, value (per currency), and restricted flags (lithium batteries, alcohol, etc.). AI HS-code suggestions from product data, with human approval.

3.2 Documents & Electronic Data

Generate the commercial invoice / CN22 / CN23 from order + SKU data, attached to the shipment and printed at pack. Paperless trade submission via carrier APIs where available.

3.3 Duties, Taxes & Incoterms

Incoterms per client/channel. Landed-cost estimates via a duties API. DDP billing of duties back to the brand (a charge type). IOSS number for EU B2C ≤ €150. UK VAT registration for low-value imports.

3.4 Screening

Destination rules for prohibited/restricted items and denied-party screening (via a provider), with holds routed to the Phase 1 error/hold queues.

4. Acceptance Criteria

A US → UK order produces a correct commercial invoice and electronic customs data with the DDP label, and duties are billed to the brand.

An EU B2C order under €150 includes the brand's IOSS number on customs data.

An order containing a restricted SKU to a prohibited destination is held with the reason.

5. Non-Functional & Security Requirements

Requirement

Detail

Compliance

Customs documents validated per carrier requirements. Screening decisions logged.

Latency

Customs doc generation <2s at pack.

6. Implementation Task Breakdown: Sprint 11

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Customs Data] ──> [Step 2: Documents] ──> [Step 3: Duties] ──> [Step 4: Screening]



Step 1: SKU Customs Profiles & HS Suggestions

Goal: Make product data customs-ready.

Task 1.1: Customs Fields, Validation & AI Suggestions

HS validation, approval flow.

Step 2: Customs Documents & Paperless Trade

Goal: Automate paperwork.

Task 2.1: Document Generation & Carrier Submission

CI/CN22/CN23, ETD.

Step 3: Incoterms, Duties & Taxes

Goal: No surprise duties for shoppers.

Task 3.1: Landed Cost, DDP Billing, IOSS/UK VAT

Duties API, charge type.

Step 4: Restricted Goods & Denied-Party Screening

Goal: Stay compliant.

Task 4.1: Screening Rules & Holds

Provider integration, hold queue.

7. Sprint Delivery Milestones

Milestone 1 — Customs Data (Target: Day 3)

SKU customs profiles ready.

Milestone 2 — Documents (Target: Day 5)

Customs documents generated and submitted.

Milestone 3 — Duties (Target: Day 8)

DDP and IOSS working.

Milestone 4 — Sign-Off (Target: Day 10)

Screening live.

8. Open Questions Carried Into This Sprint

Duties/landed-cost provider choice (e.g. Zonos, Avalara Cross-Border).

Should the platform offer DDP duty payment as a service (fintech margin)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 12 can start.



End of Phase 4 · Sprint 11 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 11 of 15  |  Page