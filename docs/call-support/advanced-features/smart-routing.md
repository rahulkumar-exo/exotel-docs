---
id: smart-routing
title: Smart Routing
description: "Implement smart call routing in Exotel with skill-based, location-based, and load-balanced strategies for optimal calls."
sidebar_label: Smart Routing
sidebar_position: 4
---

# Smart Routing

Smart routing dynamically directs incoming calls to the most appropriate agent or team based on criteria such as caller attributes, agent skills, geographic location, time of day, or workload distribution. Unlike static routing (where every call follows the same path), smart routing makes real-time decisions to optimize customer experience and operational efficiency.

## Smart Routing Strategies

| Strategy | Routes Based On | Best For |
|---|---|---|
| **Skill-based** | Agent skills matching caller needs | Technical support, multilingual teams |
| **Location-based** | Caller's geographic location | Regional support, local expertise |
| **Load-balanced** | Agent workload and availability | Even call distribution |
| **VIP / Priority** | Caller's value or tier | High-value customer retention |
| **Time-based** | Current time and schedules | Follow-the-sun support |
| **Data-driven** | CRM data, order history, etc. | Personalized routing |
| **Round-robin** | Sequential agent assignment | Fair distribution |

## How Smart Routing Works in Exotel

Smart routing in Exotel is implemented using the **Passthru** applet, which calls your server mid-flow to make routing decisions:

```
Incoming Call
    |
    v
Passthru (POST to your server with caller data)
    |
    v
Your server evaluates routing rules
    |
    v
Response: route to Team A / Agent X / Flow Y
    |
    v
Call flow routes accordingly
```

## Skill-Based Routing

Route callers to agents with the right skills (e.g., technical expertise, language proficiency, product knowledge).

### Setup

1. Define skill groups in your system:

| Skill Group | Skills | Agents |
|---|---|---|
| Tech Support L1 | Basic troubleshooting | Agent 1, 2, 3 |
| Tech Support L2 | Advanced debugging, API | Agent 4, 5 |
| Billing | Invoices, refunds | Agent 6, 7 |
| Spanish Support | Spanish language | Agent 8, 9 |

2. Add a **Passthru** applet to your call flow.
3. Your server determines the required skill based on:
   - IVR selection (caller pressed "1" for technical support)
   - CRM data (caller's open ticket is technical)
   - Caller's language preference
4. Return the appropriate agent group or number.

### Example Server Logic

```python
def route_call(request):
    caller_number = request.POST['From']
    ivr_selection = request.POST.get('digits', '')

    if ivr_selection == '1':
        # Technical support - check ticket severity
        ticket = crm.get_open_ticket(caller_number)
        if ticket and ticket.severity == 'critical':
            return {'agents': TECH_L2_AGENTS}
        return {'agents': TECH_L1_AGENTS}

    elif ivr_selection == '2':
        return {'agents': BILLING_AGENTS}

    return {'agents': GENERAL_AGENTS}
```

## Location-Based Routing

Route callers to agents or teams based on the caller's geographic location.

### Using Caller Number Prefix

Indian phone numbers carry geographic information:

| Number Prefix | Region | Route To |
|---|---|---|
| +91-80-... | Bangalore | Bangalore support team |
| +91-22-... | Mumbai | Mumbai support team |
| +91-11-... | Delhi | Delhi support team |
| +91-44-... | Chennai | Chennai support team |
| +91-98... | Mobile (various) | Route by mobile circle |

### Setup

1. Add a **Passthru** applet to your flow.
2. Your server extracts the caller's location from their phone number or CRM data.
3. Return the appropriate regional team.

```python
def route_by_location(request):
    caller_number = request.POST['From']

    # Determine region from phone number prefix
    region = get_region_from_number(caller_number)

    routing_map = {
        'bangalore': BANGALORE_TEAM,
        'mumbai': MUMBAI_TEAM,
        'delhi': DELHI_TEAM,
        'default': NATIONAL_TEAM
    }

    agents = routing_map.get(region, routing_map['default'])
    return {'agents': agents}
```

:::tip
For mobile numbers where the geographic origin is less clear, use your CRM data (shipping address, registration city) instead of the phone number prefix for more accurate location-based routing.
:::

## Load-Balanced Routing

Distribute calls evenly across agents to prevent burnout and ensure fair workload.

### Strategies

| Strategy | How It Works | Pros | Cons |
|---|---|---|---|
| **Round-robin** | Rotate through agents sequentially | Simple, fair | Does not account for agent busy status |
| **Least calls** | Route to agent with fewest calls today | Balances load | May route to slower agents |
| **Longest idle** | Route to agent who has been free the longest | Quick answer | May not balance total load |
| **Weighted** | Assign weights based on agent capacity | Flexible | More complex to configure |

### Setup (Longest Idle)

1. Track agent activity in your database (last call end time, current status).
2. Use a Passthru applet to query your server.
3. Return the agent who has been idle the longest.

```python
def route_load_balanced(request):
    available_agents = db.get_agents(status='available')

    if not available_agents:
        return {'action': 'queue'}

    # Sort by last call end time (longest idle first)
    sorted_agents = sorted(available_agents, key=lambda a: a.last_call_ended)
    return {'agents': [sorted_agents[0].phone_number]}
```

## VIP / Priority Routing

Route high-value customers to senior agents, skip the IVR, or provide priority queue access.

### Setup

1. Maintain a VIP customer list in your CRM (based on account value, plan tier, etc.).
2. Use a Passthru applet at the start of your flow.
3. If the caller is a VIP, skip the IVR and connect directly to their account manager.

```
Passthru (Check VIP status)
    |
    ├── VIP → Connect (Account Manager / Senior Agent)
    |
    └── Standard → IVR Menu → Connect (General Team)
```

### VIP Routing Criteria

| Criteria | Example |
|---|---|
| **Account value** | Customers spending over Rs. 1 lakh/month |
| **Plan tier** | Enterprise or Premium plan holders |
| **Relationship** | Accounts with dedicated account managers |
| **Escalation status** | Customers with open escalated tickets |
| **Lifetime value** | Top 10% of customers by LTV |

## Data-Driven Routing

Route calls based on real-time data from your CRM, helpdesk, or business systems.

### Common Data Sources

| Data Source | Routing Decision |
|---|---|
| **Open tickets** | Route to the agent assigned to the open ticket |
| **Last interaction** | Route to the last agent who handled this caller (sticky agent) |
| **Order status** | Route order-related calls to the fulfillment team |
| **Payment status** | Route overdue accounts to the collections team |
| **Product owned** | Route to the product-specific support team |
| **Language preference** | Route to an agent who speaks the caller's language |

### Implementation

```python
def route_data_driven(request):
    caller_number = request.POST['From']

    # Check for open ticket
    ticket = helpdesk.get_open_ticket(caller_number)
    if ticket:
        return {'agents': [ticket.assigned_agent.phone]}

    # Check customer tier
    customer = crm.get_customer(caller_number)
    if customer and customer.tier == 'enterprise':
        return {'agents': ENTERPRISE_TEAM}

    # Default routing
    return {'agents': GENERAL_TEAM}
```

## Combining Multiple Strategies

For the most effective routing, combine strategies in priority order:

```
1. Check VIP status → VIP? Route to account manager
2. Check open ticket → Has ticket? Route to assigned agent (sticky)
3. Check IVR selection → Route to skill-based team
4. Within team → Use load-balanced (longest idle) distribution
5. All busy → Queue with priority based on customer tier
```

## Configuration via Passthru

The Passthru applet is the primary tool for implementing smart routing in Exotel:

### Request (from Exotel to your server)

```bash
POST https://your-app.com/smart-route
Content-Type: application/x-www-form-urlencoded

CallSid=<call_sid>&From=<caller_number>&To=<exophone>&Direction=incoming&digits=<ivr_input>
```

### Response (from your server to Exotel)

Your server returns routing instructions that the flow uses to determine the next step. The exact response format depends on your flow design and Passthru configuration.

## Performance Considerations

| Factor | Impact | Recommendation |
|---|---|---|
| **Server response time** | Adds latency to call routing | Keep under 2 seconds |
| **Database queries** | Slow queries delay routing | Use indexes and caching |
| **Fallback handling** | Server down = no routing | Always configure a fallback route |
| **Caching** | Reduce repeated lookups | Cache customer data for 5-10 minutes |

:::warning
Your smart routing server must respond within 2-3 seconds. If the Passthru applet times out waiting for your server, the call will follow the timeout path. Always configure a timeout fallback that routes to a general agent group.
:::

## Best Practices

- **Start simple, iterate** -- Begin with one routing strategy and add complexity based on data and feedback.
- **Always have a fallback** -- If your routing server is unreachable, route to a general queue.
- **Monitor routing outcomes** -- Track which strategy was applied and the result (connected, dropped, transferred) to measure effectiveness.
- **Keep server response fast** -- Optimize database queries and use caching to keep Passthru response times under 2 seconds.
- **Test edge cases** -- What happens for unknown callers? New numbers? Numbers not in your CRM? Define default behavior for every scenario.
- **Log routing decisions** -- Record why each call was routed the way it was for debugging and optimization.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| All calls go to default team | Passthru server returning errors | Check server logs and response format |
| Routing too slow | Server response time high | Optimize queries, add caching |
| VIP not getting priority | CRM lookup failing | Verify CRM integration and data |
| Agent overloaded | Load balancing not working | Check agent status tracking |
| Wrong team connected | Routing logic error | Debug server-side routing code |

## Related

- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Sticky Agent](/docs/call-support/call-features/sticky-agent)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Parallel Ringing](/docs/call-support/call-features/parallel-ringing)
- [Flow Builder](/docs/call-support/advanced-features/flow-builder)
- [Voice v1 API -- Passthru](/docs/voice-v1/applets/passthru)
