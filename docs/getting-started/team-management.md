---
title: Team Management
description: "Manage your Exotel team with role-based access control. Add users, assign Admin, Supervisor, and Agent roles, and configure permissions."
sidebar_label: Team Management
sidebar_position: 9
---

# Team Management

Exotel supports multiple users under a single account with role-based access control (RBAC). This guide covers how to add team members, assign roles, configure permissions, and manage agent devices.

## User Roles

Exotel provides three primary roles with different access levels:

| Role | Access Level | Best For |
|------|-------------|----------|
| **Admin** | Full access to all features, settings, billing, and API credentials | Account owners, IT managers |
| **Supervisor** | Access to call logs, reports, agent management, and campaign operations | Team leads, managers |
| **Agent** | Access to call handling features only | Customer support agents, sales reps |

### Role Permissions Matrix

| Feature | Admin | Supervisor | Agent |
|---------|-------|-----------|-------|
| Dashboard home | Full | Full | Limited |
| Call logs and recordings | Full | Full | Own calls only |
| SMS logs | Full | Full | Own messages only |
| ExoPhone management | Full | View only | No access |
| Call flow builder | Full | View only | No access |
| Campaign creation | Full | Full | No access |
| Campaign management | Full | Full | No access |
| Contact lists | Full | Full | No access |
| Analytics and reports | Full | Full | Limited |
| API credentials | Full | No access | No access |
| Billing and credits | Full | No access | No access |
| User management | Full | Limited (add agents) | No access |
| Account settings | Full | No access | No access |
| KYC / Company details | Full | No access | No access |

## Adding Users

### Via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com) as an Admin
2. Navigate to **Settings > Users**
3. Click **Add User**
4. Fill in the user details:

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | User's full name |
| Email | Yes | User's email address (used for login) |
| Phone number | Yes | User's mobile number (for call routing and OTP) |
| Role | Yes | Admin, Supervisor, or Agent |

5. Click **Send Invitation**
6. The user receives an email invitation to set up their password and access the dashboard

### Via API

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/users" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Rahul",
    "last_name": "Kumar",
    "email": "rahul@company.com",
    "phone": "+919876543210",
    "role": "agent"
  }'
```

> **API Reference:** See the [Users API](/docs/users/overview) for complete user management endpoints.

:::tip
When adding agents, ensure their phone numbers match across all integrated platforms (CRM, Exotel, helpdesk). Mismatched phone numbers are the most common cause of integration issues.
:::

## Configuring Agent Devices

Agents can receive calls through different device types:

| Device Type | Description | Best For |
|------------|-------------|----------|
| **Phone** | Route calls to agent's mobile or landline | Remote agents, field staff |
| **SIP** | Route calls to a SIP softphone or PBX | Office-based agents with VoIP |
| **WebRTC** | Route calls through a web browser | Fully remote agents, no hardware needed |

### Setting Up Agent Devices

1. Go to **Settings > Users**
2. Click on the agent's name
3. Under **Device Configuration**, add the device:

**Phone device:**
```json
{
  "type": "phone",
  "number": "+919876543210"
}
```

**SIP device:**
```json
{
  "type": "sip",
  "sip_uri": "sip:agent@company.sip.exotel.com"
}
```

**WebRTC device:**
```json
{
  "type": "webrtc",
  "enabled": true
}
```

### Multiple Devices Per Agent

An agent can have multiple devices configured with fallback priority:

| Priority | Device | Behavior |
|----------|--------|----------|
| 1 | WebRTC (browser) | Try first if agent is online |
| 2 | SIP (softphone) | Fall back if WebRTC unavailable |
| 3 | Phone (mobile) | Last resort fallback |

> **API Reference:** See [Manage Devices](/docs/users/api-reference/manage-devices) for device configuration endpoints.

## Managing Users

### Updating User Details

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/users/<user_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543211",
    "role": "supervisor"
  }'
```

### Listing All Users

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/users"
```

### Deactivating a User

```bash
curl -X DELETE "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/users/<user_id>"
```

:::warning
Deactivating a user immediately revokes their dashboard access and removes them from call routing. Ensure any call flows or campaigns referencing this user are updated before deactivation.
:::

## Team Organization Best Practices

### Naming Conventions

Use consistent naming for users and devices:

| Convention | Example | Benefit |
|-----------|---------|---------|
| Full names | Rahul Kumar | Easy identification in reports |
| Department tags | Support-Rahul, Sales-Priya | Quick filtering in dashboards |
| Location prefix | BLR-Rahul, MUM-Priya | Regional team identification |

### Role Assignment Guidelines

| Scenario | Recommended Roles |
|----------|-------------------|
| Small team (< 5 people) | 1 Admin, rest as Agents |
| Medium team (5-20 people) | 1-2 Admins, 2-3 Supervisors, rest as Agents |
| Large team (20+ people) | 2+ Admins, team-specific Supervisors, Agents per team |
| Enterprise (multi-department) | Department-level Admins and Supervisors |

### Security Best Practices

1. **Limit Admin access**: Only essential personnel should have Admin role
2. **Use Supervisor for managers**: Supervisors can manage campaigns without accessing billing or API keys
3. **Review users regularly**: Audit user list quarterly; remove inactive users
4. **Enforce strong passwords**: Require password changes every 90 days
5. **SSO for enterprise**: Use SAML/OAuth SSO for centralized authentication (enterprise plans)

## Agent Status and Availability

If using Exotel's contact center solution, agents have availability states:

| Status | Meaning | Call Routing |
|--------|---------|-------------|
| **Available** | Ready to receive calls | Included in routing |
| **Busy** | On an active call | Excluded from routing |
| **Away** | Temporarily unavailable | Excluded from routing |
| **Offline** | Logged out | Excluded from routing |

Agents can set their status through the dashboard or WebRTC interface. Supervisors and Admins can view and change agent statuses.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| User cannot log in | Email or password incorrect | Reset password via login page |
| Agent not receiving calls | Phone number mismatch | Verify agent's phone in user settings |
| Supervisor cannot create campaigns | Insufficient permissions | Verify role is set to Supervisor (not Agent) |
| Invitation email not received | Email blocked or spam-filtered | Check spam folder; whitelist Exotel emails |
| WebRTC not working for agent | Browser permissions | Ensure microphone access is granted; use Chrome or Firefox |
| Agent shows as offline | WebRTC session expired | Refresh the browser; re-login to the dashboard |

## Next Steps

- [API Credentials](/docs/getting-started/api-credentials) -- Set up API access for your team
- [Dashboard Overview](/docs/getting-started/dashboard-overview) -- Navigate the Exotel dashboard
- [Users API](/docs/users/overview) -- Manage users programmatically
- [Contact Center](/docs/contact-center/overview) -- Set up a full contact center with agent management
