Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 4 of 15

Sprint 4: Embedded Payments & Scheduled Auto-Debit (Card / ACH)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Embedded Payments (Master PRD §6.3.3)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 3: Invoicing, Credit Notes & QuickBooks Sync

Unlocks next

Phase 2 · Sprint 5: Photographic Dispute Shield at the Pack Station

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to get the 3PL paid on time. Brand clients save a card or bank account (ACH), invoices are debited automatically on the 1st and 15th (or on due date), failed payments are retried, and every payment reconciles to invoices and to QuickBooks. The target from the master PRD is to bring DSO from ~38 days close to zero.

This is also the platform's embedded-fintech revenue stream: a processing margin on the payments the 3PL collects.

By the end of this sprint:

Each 3PL is onboarded as a Stripe Connect connected account (KYC by Stripe) and receives payouts directly.

Brand clients can save a card or ACH bank account via a secure hosted flow.

Invoices are auto-debited on schedule, with retries, dunning emails and statuses synced to invoices and QuickBooks.

The 3PL sees payments, payouts, fees and DSO per client.

Out of scope for this sprint: the portal payment screens (Sprint 7 adds the client-facing view; this sprint uses a secure hosted payment-method link), multi-currency payouts beyond USD/CAD.

Dependency: Sprint 3 must be signed off (invoices + QuickBooks payment sync).

2. User Stories

As a 3PL Owner, I want clients charged automatically when an invoice is due so that I stop chasing payments.

As a Brand client, I want to pay by ACH to avoid card fees on large invoices.

As a Billing user, I want failed payments retried and the client notified automatically so that collections run without me.

As a 3PL Owner, I want payments to reconcile to invoices and QuickBooks automatically so that my books are always right.

3. Functional Requirements

3.1 3PL Onboarding (Stripe Connect)

Connect onboarding (Express/Custom), with KYC handled by Stripe. Payout schedule and bank account managed in Stripe.

Platform application fee configured per plan (the embedded-fintech margin), shown transparently to the 3PL.

3.2 Client Payment Methods

Secure hosted setup link (Stripe SetupIntent / Checkout in setup mode) sent to the client's billing contact. Card and US ACH (Financial Connections instant verification, micro-deposit fallback).

Per client: default method, auto-debit on/off, schedule (on invoice date, on due date, or 1st & 15th), and a maximum auto-debit amount requiring approval above it.

3.3 Auto-Debit & Retries

On schedule, create a PaymentIntent per invoice (or a consolidated statement). Handle ACH's pending → succeeded/failed lifecycle through webhooks.

Retry policy (e.g. day 1, 3, 7), dunning emails, and an optional service-hold flag after N failures (3PL decides; nothing automatic stops shipments).

3.4 Reconciliation

Payments applied to invoices (partial/over-payment handling, client credit balance). Refunds and disputes (chargebacks) are reflected.

Payment records pushed to QuickBooks (Sprint 3 connector). Payout reports (gross, fees, net) per payout.

3.5 Receivables Dashboard

AR aging, DSO per client and overall, upcoming auto-debits, failed payments, dispute alerts.

4. Acceptance Criteria

A client saves an ACH account via the hosted link. On the 1st, the approved invoice is debited, shows 'processing', and becomes 'paid' on the succeeded webhook.

A failing card is retried on the configured schedule, dunning emails are sent, and the invoice shows each attempt.

A paid invoice records a payment in the QuickBooks sandbox, applied to the right invoice.

Replaying the same Stripe webhook doesn't double-apply a payment.

The DSO calculation matches a manual calculation for a test client.

5. Non-Functional & Security Requirements

Requirement

Detail

Security / PCI

No card or bank data touches our servers (Stripe-hosted elements only). SAQ-A scope.

Idempotency

Idempotency keys on all PaymentIntent creation. Webhook signature verification and event de-duplication.

Compliance

ACH mandate text captured and stored with each bank payment method (NACHA).

Reliability

Auto-debit job is idempotent per invoice and schedule date.

6. Implementation Task Breakdown: Sprint 4

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Connect Setup] ──> [Step 2: Payment Methods] ──> [Step 3: Auto-Debit] ──> [Step 4: Reconcile & AR]



Step 1: Stripe Connect Onboarding & Payment Schema

Goal: Let each 3PL receive money directly, safely.

Task 1.1: Connect Onboarding Flow

Account link, status tracking, fee configuration.

Task 1.2: Payment Schema

payment_methods, payments, payment_attempts, payouts, client_credit_balances.

Step 2: Client Payment Method Setup

Goal: Get clients to authorise auto-debit with minimal friction.

Task 2.1: Hosted Setup Link

SetupIntent flow, card + ACH, mandate capture.

Task 2.2: Auto-Debit Settings

Per-client schedule, limits, default method.

Step 3: Auto-Debit Engine, Webhooks & Retries

Goal: Collect automatically and handle every outcome.

Task 3.1: Scheduled Debit Job

PaymentIntent per invoice/statement, idempotent.

Task 3.2: Webhook Handler

Succeeded/failed/pending/disputed/refunded events.

Task 3.3: Retries & Dunning

Retry schedule, emails, optional service-hold flag.

Step 4: Reconciliation, QuickBooks Payments & AR Dashboard

Goal: Keep books and cash visibility exact.

Task 4.1: Invoice Application & Credits

Partial/over-payment, credit balance.

Task 4.2: QuickBooks Payment Push & Payout Reports

Payment records, payout breakdowns.

Task 4.3: AR & DSO Dashboard

Aging, DSO, upcoming debits, failures.

7. Sprint Delivery Milestones

Milestone 1 — Connect & Schema (Target: Day 2)

A 3PL can complete Connect onboarding in test mode.

Milestone 2 — Payment Methods (Target: Day 4)

Clients save cards and ACH with mandates.

Milestone 3 — Auto-Debit Live (Target: Day 7)

Scheduled debits, webhooks and retries work end-to-end in test mode.

Milestone 4 — Reconciliation & Sign-Off (Target: Day 10)

QuickBooks payments sync. AR/DSO dashboard live.

8. Open Questions Carried Into This Sprint

Platform fee model: a fixed % on top of Stripe fees, passed to the 3PL, or absorbed into the subscription for higher tiers?

Who pays card fees: the 3PL, or a surcharge to the client (where legal)?

Canadian design partners: is PAD (pre-authorized debit) needed at launch?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 5 can start.



End of Phase 2 · Sprint 4 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 4 of 15  |  Page