---
sidebar_label: Overview
title: "Use Cases & Implementation Guides"
sidebar_position: 0
---

# Use Cases & Implementation Guides

Practical, end-to-end implementation guides that show you how to build real solutions with Exotel APIs. Each guide includes working code examples in Node.js and Python, architecture diagrams, and links to the relevant API references.

Pick a use case below to get started.

---

## Voice & Monitoring

### [Business Monitoring Dashboard](/docs/use-cases/business-monitoring-dashboard)

Build a real-time dashboard using the Bulk Call Details API and Heartbeat API to monitor business performance, track ExoPhone health, and analyze call metrics like answer rate, average duration, and peak hours.

**APIs used:** Bulk Call Details, Heartbeat Webhooks

**Tags:** `Voice` `Automation`

---

### [Call Monitoring & Visualization](/docs/use-cases/call-monitoring-visualization)

A plug-and-play reporting solution for monitoring sales, support, and campaign call performance. Fetch call details with filters, parse call dispositions, build chart-ready data, and receive real-time status callback updates.

**APIs used:** Bulk Call Details, Status Callbacks

**Tags:** `Data` `Call Monitoring`

---

## Campaigns & Outbound

### [Dynamic Caller ID Campaigns](/docs/use-cases/dynamic-caller-id-campaigns)

Run outbound call campaigns with region-specific caller IDs for higher answer rates. Includes intelligent pacing logic that adjusts call rate based on completion percentage, plus full campaign lifecycle management.

**APIs used:** Campaigns v2 API

**Tags:** `Blended APIs` `Automation` `Collections` `Sales`

---

### [Progressive Dialer using APIs](/docs/use-cases/progressive-dialer)

Build a progressive dialer that checks agent availability before each call, connects agents to customers via the Connect Two Numbers API, and handles call outcomes with automatic retry logic.

**APIs used:** Connect Two Numbers, Contact Center

**Tags:** `Contact Center v6` `Auto Dialer`

---

## Messaging

### [Interactive SMS with Custom UI](/docs/use-cases/interactive-sms)

Build interactive SMS workflows with two-way customer communication. Send DLT-compliant messages, track delivery status, handle incoming replies via webhooks, and manage conversations through a simple web UI.

**APIs used:** SMS API, Status Callbacks

**Tags:** `SMS` `Integrations`
