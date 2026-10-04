Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 1 of 15

Sprint 1: Automation Integration Framework & Warehouse Execution Layer

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Robotics & Automation Orchestration (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 3 · Sprint 15: Enterprise Scale Tier & Phase 3 Launch Readiness (Phase 3 GA)

Unlocks next

Phase 4 · Sprint 2: Pick-to-Light & Put Walls

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

Phase 4 takes the platform upmarket, to larger 3PLs that run warehouse automation. The objective of this first sprint is to build one automation integration framework, so every later device (pick-to-light, put walls, robots, sorters, pack lines, dimensioners) connects the same way: a vendor adapter layer, a task dispatch and confirmation protocol, device health monitoring, and a simulation mode for testing without hardware.

The platform stays the system of record (orders, inventory, billing events). Automation vendors execute physical tasks and report back as events, so everything built in Phases 1–3 keeps working.

By the end of this sprint:

A vendor adapter interface (dispatch task, cancel, status, confirm, exception, heartbeat) exists with a reference implementation and a simulator.

A warehouse execution layer (WES-lite) decides whether each task goes to a person (floor workspace) or a machine (adapter), per zone/process configuration.

Machine confirmations become normal warehouse events (same inventory RPCs, same billing capture).

An automation health dashboard shows device status, queue depths, error rates and downtime.

Out of scope for this sprint: specific vendor integrations (Sprints 2–5), physical installation services, PLC-level controls (vendors own them).

Dependency: Phase 3 · Sprint 15 must be signed off (Phase 3 GA). Also uses the Phase 1 event backbone, atomic inventory RPCs and task models.

2. User Stories

As a 3PL CTO, I want to plug automation from different vendors into one system so that I'm not locked into a single vendor's software.

As an Ops Manager, I want each zone to be run by people, machines or both, configured without code.

As a Supervisor, I want to see immediately when a device is down and what work is stuck behind it.

As an engineer, I want to test automation flows against a simulator so that go-lives don't depend on hardware access.

3. Functional Requirements

3.1 Vendor Adapter Interface

AutomationAdapter contract: dispatch(task), cancel(taskId), getStatus(), inbound confirm, exception, heartbeat. Transports: REST/webhooks, MQTT, or vendor SDK behind an edge connector.

Edge connector (small on-site service) for devices that need LAN access, with an outbound-only secure tunnel to the cloud.

3.2 Execution Layer (WES-lite)

Zone/process configuration: manual, automated or hybrid. Task router assigns tasks to people or adapters, with fallback to manual when a device is down.

Task state machine shared by humans and machines (queued → dispatched → in progress → confirmed/exception).

3.3 Event Mapping

Machine confirmations → the same record_event types (e.g. pick.confirmed with device_id = robot/station), so inventory, billing, analytics and the copilot work unchanged.

3.4 Health & Simulation

Device registry extension (vendor, model, zone, capabilities). Health dashboard: heartbeat status, queue depth, error and exception rates, downtime log, alerts.

Simulator adapter with configurable speed/failure rates for development, testing and pre-go-live rehearsal.

4. Acceptance Criteria

The simulator processes a 1,000-order wave dispatched through the adapter interface, and inventory/billing results equal the same wave picked manually.

Stopping the simulator's heartbeat triggers a device-down alert within 30 seconds, and the router falls back to manual tasks.

A hybrid zone splits tasks between people and the simulator by configured rules.

No automation confirmation bypasses the atomic inventory RPCs (verified by test).

5. Non-Functional & Security Requirements

Requirement

Detail

Reliability

At-least-once task dispatch with idempotent confirmations. The edge connector buffers during internet outages.

Latency

Dispatch <200ms cloud-side. Confirmation → event <500ms.

Security

Edge connector with mutual TLS, outbound-only, signed updates.

6. Implementation Task Breakdown: Sprint 1

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Adapter Contract] ──> [Step 2: Execution Layer] ──> [Step 3: Event Mapping] ──> [Step 4: Health & Sim]



Step 1: Adapter Interface & Edge Connector

Goal: Connect any vendor the same way.

Task 1.1: Adapter Contract & SDK

TypeScript/Python SDK, contract tests.

Task 1.2: Edge Connector

On-site service, secure tunnel, buffering.

Step 2: Task Router & Shared Task State Machine

Goal: Send each task to a person or a machine.

Task 2.1: Zone/Process Mode Configuration

Manual/automated/hybrid.

Task 2.2: Router & Fallback

Assignment rules, device-down fallback.

Step 3: Machine Events into the Event Backbone

Goal: Keep one source of truth.

Task 3.1: Confirmation → Event Mapping

Same event types, device attribution.

Step 4: Health Dashboard & Simulator

Goal: See device status and test without hardware.

Task 4.1: Device Health Dashboard & Alerts

Heartbeats, queues, downtime.

Task 4.2: Simulator Adapter & Rehearsal Harness

Speed/failure knobs, wave rehearsal.

7. Sprint Delivery Milestones

Milestone 1 — Adapter Contract (Target: Day 3)

Contract, SDK and edge connector working.

Milestone 2 — Execution Layer (Target: Day 6)

Router with manual/automated/hybrid modes.

Milestone 3 — Event Mapping (Target: Day 8)

Machine confirmations flow as events.

Milestone 4 — Health & Sign-Off (Target: Day 10)

Dashboard and simulator rehearsal pass.

8. Open Questions Carried Into This Sprint

Which automation vendors do target Scale-tier 3PLs already run (drives Sprint 2–5 priority)?

Build the edge connector in-house or use an industrial IoT gateway product?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 2 can start.



End of Phase 4 · Sprint 1 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 1 of 15  |  Page