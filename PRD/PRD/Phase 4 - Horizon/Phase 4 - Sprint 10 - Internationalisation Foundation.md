Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 10 of 15

Sprint 10: Internationalisation Foundation: Multi-Currency, Tax/VAT, Localised UI & Units

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

Phase 4 · Sprint 9: Incentive Pay, Gamification & Workforce Integrations

Unlocks next

Phase 4 · Sprint 11: Cross-Border Shipping & Customs Documentation

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to make the platform ready for 3PLs outside the US and Canada: multi-currency rate cards, invoices and payments, VAT/GST handling on 3PL invoices, a localised admin and portal UI (the floor workspace is already multilingual), metric units, and local date/number/address formats. Sprints 11–12 then add market-specific carriers, marketplaces and customs.

By the end of this sprint:

Organizations have a base currency. Rate cards, invoices and payments support other currencies, with FX handling rules.

3PL invoices apply VAT/GST correctly (rates by country, reverse charge for B2B cross-border in the EU/UK, tax IDs on invoices).

Admin and portal UI are available in English (US/UK), French, German, Spanish and Portuguese, with a language switch.

Metric/imperial units, date/number formats and international address formats are supported everywhere.

Out of scope for this sprint: market-specific carriers/marketplaces/customs (Sprints 11–12), local e-invoicing mandates (e.g. country-specific e-invoice networks, handled per market later).

Dependency: Sprint 9 must be signed off. Also uses the Phase 2 ledger/invoicing/payments and the Phase 3 · Sprint 15 regional deployments.

2. User Stories

As a UK 3PL, I want to bill clients in GBP with VAT so that my invoices are legally correct.

As a German brand user, I want the portal in German so that my team can use it.

As a European warehouse, I want dimensions in centimetres and weights in kilograms so that the data matches my operation.

3. Functional Requirements

3.1 Multi-Currency

Base currency per organization. Rate card and invoice currency per client. FX rates from a provider with a daily lock rule (charges converted at event date or invoice date, configurable). Payments in the invoice currency via Stripe (supported currencies).

3.2 Tax / VAT / GST

Tax engine integration (e.g. Stripe Tax, Avalara) or rule tables: tax rates by 3PL country and client location, reverse charge, exemptions, tax IDs (VAT numbers validated via VIES/HMRC). Tax shown on invoices, credit notes and accounting sync.

3.3 UI Localisation

i18n of admin and portal message catalogs with professional translation. Locale-aware formatting. The language switch is remembered per user.

3.4 Units & Formats

Unit system per organization and per user display preference. Internal storage in canonical units with exact conversions. International address schemas and validation providers per country.

4. Acceptance Criteria

A UK 3PL invoice to a UK client shows 20% VAT, and an EU B2B client gets reverse charge with both VAT numbers shown.

A EUR-billed client's charges convert per the configured FX rule, and totals reconcile to the ledger.

The portal fully renders in German with no untranslated strings (automated check).

SKU dims entered in cm convert exactly for cartonization and cubic billing.

5. Non-Functional & Security Requirements

Requirement

Detail

Correctness

Tax calculations validated with a tax adviser for the launch countries.

Localisation quality

Native review for every language. Automated missing-string checks in CI.

6. Implementation Task Breakdown: Sprint 10

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Currency] ──> [Step 2: Tax] ──> [Step 3: UI Locale] ──> [Step 4: Units]



Step 1: Multi-Currency Billing & Payments

Goal: Bill and collect in local currency.

Task 1.1: Currency Model, FX Rules & Payments

Base/client currency, FX lock, Stripe currencies.

Step 2: VAT/GST Engine

Goal: Produce legally correct invoices.

Task 2.1: Tax Engine Integration & Invoice Changes

Rates, reverse charge, tax IDs, accounting sync.

Step 3: Admin & Portal Localisation

Goal: Speak the customer's language.

Task 3.1: Translation & Locale Formatting

Five languages, CI checks.

Step 4: Units, Formats & International Addresses

Goal: Fit local data conventions.

Task 4.1: Unit Conversion & Address Schemas

Canonical storage, validation per country.

7. Sprint Delivery Milestones

Milestone 1 — Currency (Target: Day 3)

Multi-currency invoices and payments.

Milestone 2 — Tax (Target: Day 6)

VAT/GST invoices validated.

Milestone 3 — UI Locale (Target: Day 8)

Five languages live.

Milestone 4 — Sign-Off (Target: Day 10)

Units and addresses complete.

8. Open Questions Carried Into This Sprint

Launch-market order after this sprint: UK/EU first or Australia/Canada first?

Build tax rules in-house or use a tax engine (cost vs accuracy)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 11 can start.



End of Phase 4 · Sprint 10 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 10 of 15  |  Page