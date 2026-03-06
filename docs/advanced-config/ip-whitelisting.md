---
id: ip-whitelisting
title: IP Whitelisting
description: "Secure your Exotel API access and webhook endpoints with IP whitelisting to restrict access to authorized servers only."
sidebar_label: IP Whitelisting
sidebar_position: 2
---

# IP Whitelisting

IP whitelisting restricts access to your Exotel account's API to requests originating from specific, pre-approved IP addresses. This adds an extra layer of security beyond API key authentication, ensuring only your authorized servers can interact with Exotel's APIs.

:::tip
IP whitelisting is available on Growth and Enterprise plans. Starter plan users can secure their integrations using API key authentication and HTTPS.
:::

## How IP Whitelisting Works

When IP whitelisting is enabled:

1. Your server sends an API request to Exotel
2. Exotel checks the source IP address of the request
3. If the IP is in your whitelist, the request proceeds normally
4. If the IP is NOT in your whitelist, the request is rejected with HTTP 403

```
Your Server (IP: 203.0.113.10) ──► Exotel API
   │
   ├── IP in whitelist? ──► Yes ──► Request processed
   │
   └── IP not in whitelist? ──► No ──► HTTP 403 Forbidden
```

## Configuring IP Whitelisting

### Via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings** > **Security** > **IP Whitelisting**
3. Toggle **Enable IP Whitelisting** to ON
4. Add your server IP addresses (see below)
5. Click **Save**

### Adding IP Addresses

| Format | Example | Description |
|--------|---------|-------------|
| **Single IP** | `203.0.113.10` | One specific IP address |
| **CIDR range** | `203.0.113.0/24` | A range of 256 IP addresses |
| **Multiple IPs** | Add one per line | List all your server IPs |

### Recommended IPs to Whitelist

| Server | IP to Whitelist |
|--------|----------------|
| **Production API server** | Your production server's public IP |
| **Staging/test server** | Your staging environment's public IP |
| **CI/CD pipeline** | Your build server's IP (if it runs API tests) |
| **Developer machines** | Individual developer IPs (for development only) |
| **Load balancer / NAT gateway** | The outbound IP of your NAT or load balancer |

:::warning
If your servers use dynamic IPs (e.g., auto-scaling cloud instances behind a NAT gateway), whitelist the **NAT gateway's IP** or the **Elastic IP** associated with your VPC, not individual instance IPs.
:::

## Whitelisting Exotel's IPs (Incoming Webhooks)

To secure your webhook endpoints, accept requests only from Exotel's IP addresses. Whitelist the following ranges in your server's firewall or application-level security:

### Exotel IP Ranges

| Region | IP Ranges | Purpose |
|--------|-----------|---------|
| **India (Primary)** | Contact Exotel support for current ranges | API callbacks, webhooks |
| **Singapore** | Contact Exotel support for current ranges | APAC region callbacks |

:::info
Exotel's IP ranges may change over time. Subscribe to the [Changelog](/docs/references/changelog) or contact your account manager to receive notifications about IP range changes.
:::

### Firewall Configuration

Configure your firewall to:

1. **Allow inbound** HTTPS (port 443) from Exotel's IP ranges to your webhook endpoint
2. **Allow outbound** HTTPS (port 443) from your server to Exotel's API endpoints
3. **Block all other** inbound traffic to your webhook endpoint

## Dual-Direction Whitelisting

For maximum security, implement whitelisting in both directions:

| Direction | What to Whitelist | Where to Configure |
|-----------|------------------|-------------------|
| **Outbound (your API calls)** | Your server IPs in Exotel | Exotel Dashboard > IP Whitelisting |
| **Inbound (Exotel webhooks)** | Exotel's IPs in your firewall | Your server/cloud firewall rules |

## Managing IP Whitelists

### Adding an IP

1. Navigate to **Settings** > **Security** > **IP Whitelisting**
2. Click **Add IP**
3. Enter the IP address or CIDR range
4. Add a label for identification (e.g., "Production Server")
5. Click **Save**

### Removing an IP

1. Navigate to the IP Whitelisting page
2. Find the IP you want to remove
3. Click the **Remove** icon
4. Confirm the removal
5. Click **Save**

:::warning
Removing an IP immediately blocks API requests from that address. Ensure you have updated your server to use a whitelisted IP before removing the old one.
:::

### Disabling IP Whitelisting

To disable IP whitelisting entirely:

1. Navigate to **Settings** > **Security** > **IP Whitelisting**
2. Toggle **Enable IP Whitelisting** to OFF
3. Confirm the change
4. All API requests will be accepted regardless of source IP (standard API key auth still applies)

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| API returns 403 after enabling | Server IP not whitelisted | Add your server's public IP to the whitelist |
| 403 error intermittent | Server behind a load balancer with multiple outbound IPs | Whitelist all outbound IPs or use a static NAT IP |
| Webhooks not received | Your firewall blocking Exotel's IPs | Whitelist Exotel's IP ranges in your firewall |
| Cannot determine server IP | Cloud infrastructure with dynamic IPs | Use a NAT gateway with a static Elastic IP |
| Locked out after misconfiguration | All IPs removed or wrong IPs added | Contact Exotel support to reset IP whitelisting |

### Finding Your Server's Public IP

If you are unsure of your server's outbound public IP, run this command from your server:

```bash
curl -s https://api.ipify.org
```

This returns the public IP address that Exotel sees when your server makes API requests.

## Best Practices

1. **Use CIDR ranges for cloud environments** -- If your servers share a subnet, whitelist the entire CIDR block
2. **Always whitelist before enabling** -- Add all your IPs first, then enable whitelisting to avoid lockouts
3. **Keep the list minimal** -- Only whitelist IPs that genuinely need API access
4. **Label your IPs** -- Add descriptive labels to each IP for easy management
5. **Review regularly** -- Audit your whitelist quarterly and remove IPs that are no longer in use
6. **Use dual-direction whitelisting** -- Protect both your API calls and webhook endpoints
7. **Plan for failover** -- If you have disaster recovery servers, whitelist their IPs proactively

## Related Topics

- [Webhooks Setup](/docs/advanced-config/webhooks-setup) -- Configure webhook URLs and retry logic
- [Rate Limiting](/docs/advanced-config/rate-limiting) -- API throttling and limits
- [Authentication Reference](/docs/references/authentication) -- API key authentication
- [Network Requirements](/docs/advanced-config/network-requirements) -- Ports and protocols
