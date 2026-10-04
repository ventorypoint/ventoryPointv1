Core System Requirements

Document 10 of 15 · Modern 3PL Warehouse Operating System (web application)

10. Enterprise Product Readiness Criteria

Item

Detail

Purpose

The criteria the product and company must meet to sell to enterprise-grade 3PLs (multi-facility, Scale tier) and pass their security, procurement and operational reviews, with the target phase and evidence for each.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Readiness Levels

Level

Target customer

When

L1 — MVP ready

Design-partner mid-market 3PLs (1–2 facilities)

End of Phase 1

L2 — Growth ready

Mid-market 3PLs at scale, brand portals, payments

End of Phase 2

L3 — Enterprise ready

Multi-facility / network 3PLs, IT-led procurement

End of Phase 3

L4 — Enterprise+ (global)

Automation-heavy, multi-region, 1M+ orders/month

End of Phase 4

2. Criteria Matrix

Domain

Criterion

Level

Evidence

Security

Tenant isolation enforced by RLS with an automated test matrix

L1

CI reports, pen-test report

Security

Annual third-party penetration test; critical/high fixed within SLA

L1

Pen-test report + remediation log

Security

MFA for privileged roles; audit log of security events

L1

Configuration, audit export

Security

SSO (SAML/OIDC) + SCIM provisioning

L3

IdP integration tests (Okta, Entra ID)

Security

Custom roles / permission sets; access reviews

L3

Role builder, quarterly review records

Compliance

SOC 2 Type I

L2

Auditor report

Compliance

SOC 2 Type II (12-month observation for renewals)

L3

Auditor report

Compliance

Standard security questionnaires pre-filled (SIG Lite, CAIQ), trust centre page

L2

Trust centre, questionnaire library

Compliance

DPA, sub-processor list, privacy program (CCPA/CPRA), GDPR for non-US

L1 (US) / L4 (global)

Legal documents, DSAR logs

Reliability

99.9% SLA with service credits; public status page and uptime history

L1

SLA terms, status page history

Reliability

99.95% premium SLA; RPO ≤5 min / RTO ≤1 h; failover drills

L4

DR test reports

Scalability

Proven at 300k orders/month per tenant, 5x peak

L1

Load test reports

Scalability

Proven at 1M+ orders/month; automation event rates

L4

Load test reports

Data

US data residency statement; encryption at rest/in transit; retention schedule

L1

Document 06, provider attestations

Data

Regional residency options (EU/UK/Canada)

L3

Regional deployment docs

Data

Full data export (API + bulk) and documented offboarding

L2

Export tooling, runbook

Product

Audit trail on configuration, inventory, billing and approvals

L1

Audit viewer

Product

Item-level traceability: exact location path, LPN, lot/dates and serial history for every unit; rotation compliance reporting

L1

'Where is it?' demo, traceability & rotation reports

Product

Full lot genealogy and mock recall <30 min (cGMP customers)

L2

Mock recall report

Product

Multi-facility DOM, network features, advanced reporting

L3

Feature documentation

Product

Public API with versioning policy, webhooks, developer portal

L2

API docs, changelog

Product

Accessibility: WCAG 2.2 AA with screen-reader support and a public accessibility statement

L1

Audit report, statement

Product

Accessibility conformance report (VPAT/ACR) and annual third-party audit

L2

VPAT/ACR document

Compliance

US privacy program: DPA with state-law terms, privacy request console, WISP, 50-state breach playbook

L1

Documents, request logs

Support

In-app chat, <15 min first response in warehouse hours

L1

Support metrics

Support

24/7 support tier, named TAM, severity-based SLAs, escalation paths

L4

Support policy

Operations

Change management, release notes, customer-facing maintenance policy

L2

Change log, policy

Operations

Incident response with customer notification commitments

L1

IR plan, post-mortems

Commercial

Transparent price book, annual contracts, order forms, invoicing via Stripe

L1

Price book, MSA

Commercial

Enterprise MSA terms (liability caps, indemnities, insurance certificates)

L3

Legal templates, COI

Vendor mgmt

Sub-processor due diligence (SOC 2 reports, DPAs) for every vendor

L2

Vendor register

3. Enterprise Procurement Pack (what buyers will ask for)

Security overview/whitepaper (architecture, isolation, encryption, access control): derived from Documents 01, 05 and 06.

SOC 2 report (Type I at L2, Type II at L3) and bridge letters.

Latest pen-test summary letter.

Completed SIG Lite / CAIQ questionnaire.

DPA, sub-processor list, privacy policy, data residency statement.

SLA, support policy, status page link, uptime history.

Business continuity & disaster recovery summary (RPO/RTO, last drill date).

Insurance certificates (cyber, E&O, general liability).

Accessibility VPAT (from L3).

Reference customers and case studies with measured results.

4. Readiness Review Cadence

End of each phase: a readiness review against this matrix, with gaps entered as next-phase sprint items.

Quarterly: security metrics, uptime, incident trends and vendor reviews presented to leadership.



End of Document 10.

Core System Requirements  |  10 Enterprise Readiness  |  Page