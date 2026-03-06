---
id: high-availability
title: High Availability Setup
description: "Configure Exotel for high availability with redundancy, failover mechanisms, multi-region deployment, and disaster recovery."
sidebar_label: High Availability
sidebar_position: 4
---

# High Availability Setup

For mission-critical communication workflows, Exotel supports high availability (HA) configurations that provide redundancy, automatic failover, and multi-region resilience. This guide covers the architecture and setup for ensuring maximum uptime.

:::info
High availability features are available on Enterprise plans. Contact your account manager to discuss HA requirements for your deployment.
:::

## Exotel Platform Availability

### Built-In Redundancy

Exotel's platform includes the following built-in redundancy features:

| Component | Redundancy | Details |
|-----------|-----------|---------|
| **API Gateway** | Active-active cluster | Multiple API servers behind load balancers |
| **Call Processing** | Active-active | Distributed call processing across multiple servers |
| **Database** | Primary-replica replication | Automatic failover to replica on primary failure |
| **Storage** | Multi-AZ replication | Call recordings replicated across availability zones |
| **Network** | Multi-carrier | Multiple telecom carrier connections for voice/SMS |

### Platform SLA

| Plan | Uptime SLA | Monthly Downtime Budget |
|------|-----------|------------------------|
| **Starter** | Best effort | Not guaranteed |
| **Growth** | 99.5% | ~3.6 hours/month |
| **Enterprise** | 99.9% | ~43 minutes/month |
| **Enterprise (custom)** | 99.95%+ | ~22 minutes/month |

## Configuring Your Integration for HA

### Webhook Failover

Configure multiple webhook endpoints so that if your primary server is down, Exotel can deliver events to a backup:

#### Primary + Failover Setup

1. Configure your **primary webhook URL** in the Exotel dashboard
2. Set up a **failover webhook URL** that points to a different server or region
3. If the primary endpoint fails (non-200 response or timeout), Exotel retries on the primary and then falls back to the failover URL

| Setting | Description |
|---------|-------------|
| **Primary URL** | `https://primary.your-server.com/exotel/callback` |
| **Failover URL** | `https://backup.your-server.com/exotel/callback` |
| **Failover after** | 2 failed attempts on primary |

### Multiple Carrier Routing

Exotel routes calls through multiple telecom carriers. In case of a carrier outage:

1. Exotel automatically detects the carrier failure
2. Calls are rerouted through an alternate carrier
3. The switch is transparent -- no action required on your end
4. Call quality and connectivity are maintained

### ExoPhone Redundancy

For critical inbound numbers, maintain backup ExoPhones:

| Strategy | Implementation |
|----------|---------------|
| **Multiple ExoPhones** | Publish multiple contact numbers; if one goes down, callers use the other |
| **Number forwarding** | Configure carrier-level forwarding from one number to another |
| **Geographic redundancy** | Use ExoPhones from different regions/circles |

## Server-Side HA Architecture

### Recommended Architecture

```
                    ┌─────────────────────┐
                    │    Exotel Platform   │
                    │  (Multi-AZ, Multi-  │
                    │   Carrier)           │
                    └─────────┬───────────┘
                              │
                    ┌─────────┴───────────┐
                    │    Load Balancer     │
                    │  (Health-checked)    │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
        │  Server 1  │  │  Server 2  │  │  Server 3  │
        │ (Region A) │  │ (Region A) │  │ (Region B) │
        └───────────┘  └───────────┘  └───────────┘
```

### Key Components

| Component | Purpose | Recommendation |
|-----------|---------|---------------|
| **Load Balancer** | Distribute API calls and webhook traffic | Use health-checked ALB/NLB with multiple targets |
| **Application Servers** | Process API calls and webhook events | Minimum 2 servers in different availability zones |
| **Database** | Store call data, CRM integration data | Primary-replica with automatic failover |
| **Queue** | Buffer webhook events for processing | Use a managed message queue (SQS, RabbitMQ) |
| **DNS** | Route traffic to healthy endpoints | Use DNS failover (Route 53, Cloudflare) |

### Webhook Processing Architecture

Use an event-driven architecture for webhook processing:

```
Exotel Webhook ──► Load Balancer ──► API Server ──► Message Queue ──► Worker
                                        │                               │
                                        └── HTTP 200 (immediate) ──────┘
                                                                  (async processing)
```

This ensures:
- Exotel always receives a 200 response quickly
- Event processing happens asynchronously
- If a worker fails, the event stays in the queue and is retried

## Disaster Recovery

### Recovery Time Objective (RTO)

| Component | Target RTO |
|-----------|-----------|
| **API access** | < 5 minutes (Exotel platform) |
| **Webhook delivery** | < 20 minutes (including retries) |
| **Your server failover** | Depends on your infrastructure |
| **Call flow recovery** | < 1 minute (automatic carrier failover) |

### Recovery Point Objective (RPO)

| Data Type | Target RPO |
|-----------|-----------|
| **Call detail records** | Zero data loss (synchronous replication) |
| **Call recordings** | < 5 minutes (async replication lag) |
| **Webhook events** | < 20 minutes (retry window) |

### DR Checklist

1. **Webhook failover URLs configured** -- Backup endpoint in a different region
2. **API client with retry logic** -- Exponential backoff with jitter
3. **Reconciliation process** -- Periodic API polling to catch missed webhooks
4. **Monitoring and alerting** -- Alerts for webhook failures, API errors, and connectivity issues
5. **Runbook documented** -- Step-by-step recovery procedures for common failure scenarios
6. **Regular DR testing** -- Test failover quarterly

## Monitoring for HA

### Key Metrics to Monitor

| Metric | Healthy Range | Alert Threshold |
|--------|--------------|-----------------|
| **Webhook success rate** | > 99% | < 95% |
| **API response time** | < 500ms | > 2000ms |
| **Concurrent call utilization** | < 80% of limit | > 90% |
| **Webhook retry rate** | < 5% | > 15% |
| **Active calls** | Within expected range | Sudden drop or spike |

### Setting Up Health Monitoring

1. Use the [Heartbeat](/docs/heartbeat/overview) feature to monitor your endpoint health
2. Configure Exotel to send periodic health checks to your webhook URL
3. Set up your own monitoring to track Exotel API availability
4. Implement alerts for degraded performance

## Best Practices

1. **Design for failure** -- Assume any component can fail and build accordingly
2. **Use multiple availability zones** -- Deploy your servers across at least 2 AZs
3. **Implement idempotent processing** -- Handle duplicate webhook events gracefully using CallSid as a key
4. **Queue webhook events** -- Never process webhooks synchronously in the request handler
5. **Test failover regularly** -- Simulate failures and verify recovery
6. **Monitor proactively** -- Set up alerts for degraded metrics before they become outages
7. **Keep runbooks updated** -- Document and rehearse recovery procedures

## Related Topics

- [Webhooks Setup](/docs/advanced-config/webhooks-setup) -- Webhook configuration and retry logic
- [Concurrent Calls](/docs/advanced-config/concurrent-calls) -- Managing call capacity
- [Network Requirements](/docs/advanced-config/network-requirements) -- Ports and protocols for connectivity
- [Heartbeat](/docs/heartbeat/overview) -- Endpoint health monitoring
