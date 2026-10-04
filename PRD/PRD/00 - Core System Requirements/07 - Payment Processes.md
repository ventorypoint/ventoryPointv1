Core System Requirements
Document 07 of 15 · Modern 3PL Warehouse Operating System (web application)
07. Payment Processes
Item
Detail
Purpose
How money moves through the product at MVP and later: the platform's own subscription billing, postage, and (Phase 2) 3PL collections from brand clients, including compliance, reconciliation and operations.
Parent documents
PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)
Version / Date / Status
1.0 (Draft) · September 26, 2026 · Draft for review


1. Money Flows at a Glance
Flow
Who pays whom
Mechanism
Phase
A. Platform subscription
3PL → Platform
Stripe Billing (card/ACH), Stripe Tax, invoices
MVP
B. Postage / labels
3PL → Carrier/ShipStation
The 3PL's own ShipStation/carrier accounts. The platform doesn't handle postage money in the MVP.
MVP
C. 3PL billing of brands (MVP)
Brand → 3PL
Outside the platform: the 3PL invoices from the billing export (Phase 1 · Sprint 14)
MVP
D. 3PL collections via platform
Brand → 3PL (platform fee)
Stripe Connect, auto-debit, payouts to the 3PL
Phase 2
E. Network settlement
Originating 3PL → Node 3PL (network fee)
Stripe Connect transfers
Phase 3
F. Marketplace & app fees
3PL → Platform / Platform → partners
Platform invoice lines, Connect payouts
Phase 3–4

2. Flow A — Platform Subscription Billing (MVP)

Figure 1 — 3PL subscribes and pays the platform through Stripe Billing
2.1 Requirements
Plans: public, volume-based tiers (Launch, Growth, Scale, Network) from the master PRD §9, with unlimited users and devices and flat connectors. Prices live in Stripe Products/Prices, and entitlements are enforced in the app via plan features.
Volume measurement: monthly shipped orders counted from shipment.shipped events. Tier review on a trailing 3-month average. No peak-month overage penalties (a brand promise).
Design-partner terms: free until go-live, then a guaranteed 20% below the customer's prior Extensiv invoice (price stored per customer as a Stripe coupon/custom price).
Payment methods: card and US ACH (Stripe Financial Connections). Invoices for annual contracts (Net 30).
Tax: Stripe Tax for US sales tax on SaaS (states where SaaS is taxable), with nexus monitoring.
Dunning: smart retries, emails at day 1/3/7, grace period of 14 days before feature restriction. Floor operations are never blocked mid-shift (a restriction only stops new configuration).
Webhooks: checkout.session.completed, customer.subscription.*, invoice.paid, invoice.payment_failed, verified signatures, idempotent handler.
3. Flow D — 3PL Collections from Brands (Phase 2)

Figure 2 — Brand pays the 3PL through Stripe Connect; the platform takes an application fee
Each 3PL is a Connect connected account (Stripe handles KYC/KYB and payouts). The platform never holds 3PL funds, which avoids money-transmitter licensing.
Brands save a card or ACH method through a hosted SetupIntent with a NACHA-compliant mandate. Auto-debit runs on the client's schedule (e.g. the 1st and 15th).
Application fee per payment = the platform's embedded-fintech revenue (rate per plan, shown transparently).
Reconciliation: payments applied to invoices, pushed to QuickBooks, and payout reports per 3PL.
4. Compliance & Risk
Topic
Requirement
PCI DSS
Stripe-hosted elements/Checkout only (SAQ-A). No card data in logs, DB or support tools.
ACH / NACHA
Mandate text, authorisation records, return-code handling (R01/R02/R10), and waiting for settlement before marking paid.
Money transmission
Connect with the 3PL as merchant of record for its collections. The platform takes only application fees.
Disputes & refunds
Chargeback webhooks create a task with evidence (invoice, charge drill-down, photos in Phase 2). Refunds only by Billing/Owner roles, audited.
Sales tax
Stripe Tax on the platform's subscriptions. 3PL service tax on brand invoices is the 3PL's responsibility (a tax engine option from Phase 4).
Fraud
Stripe Radar on platform payments. Verify new 3PL signups before enabling ACH.

5. Finance Operations
Revenue recognition: subscriptions recognised monthly. Annual prepayments deferred (export Stripe revenue reports to accounting).
Monthly close: reconcile Stripe payouts ↔ invoices ↔ bank. Track MRR/ARR, churn, and net revenue retention from Stripe Billing data.
Price changes: new Stripe Prices + 30-day customer notice. Existing contracts honoured until renewal.
6. MVP Payment Setup Checklist
Stripe account activated (company verification, bank account, statement descriptor).
Products/Prices created for public tiers, plus design-partner coupons.
Stripe Tax registrations for the states where nexus exists. Tax codes set for SaaS.
Checkout + Customer Portal configured (update card/ACH, invoices, cancel), with branding.
Webhook endpoint deployed with signature verification and idempotency tests.
Dunning settings and email templates finalised. Grace-period logic tested.
Terms of service and a pricing page with transparent tiers published.
Finance export process (Stripe → accounting) documented.


End of Document 07.
