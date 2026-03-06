---
id: rate-limiting
title: Rate Limiting
description: "Understand Exotel API rate limits, concurrent call limits, throttling behavior, and strategies for handling rate limit errors."
sidebar_label: Rate Limiting
sidebar_position: 3
---

# Rate Limiting

Exotel enforces rate limits on API requests and concurrent calls to ensure platform stability and fair usage across all accounts. Understanding these limits helps you design resilient integrations that handle throttling gracefully.

## API Rate Limits

### Request Limits by Endpoint

| Endpoint Category | Rate Limit | Window |
|-------------------|-----------|--------|
| **Voice API** (make call, call details) | 200 requests/minute | Per account |
| **SMS API** (send SMS, SMS details) | 200 requests/minute | Per account |
| **Bulk SMS API** | 50 requests/minute | Per account |
| **WhatsApp API** | 200 requests/minute | Per account |
| **ExoPhone API** | 50 requests/minute | Per account |
| **Campaign API** | 30 requests/minute | Per account |
| **User Management API** | 50 requests/minute | Per account |
| **General GET endpoints** | 300 requests/minute | Per account |

:::info
Rate limits shown are default values. Enterprise accounts may have custom limits. Check with your account manager for your account-specific limits.
:::

### Rate Limit Headers

Exotel includes rate limit information in API response headers:

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | Maximum requests allowed in the window | `200` |
| `X-RateLimit-Remaining` | Requests remaining in the current window | `150` |
| `X-RateLimit-Reset` | Epoch timestamp when the window resets | `1705312800` |

### Rate Limit Exceeded Response

When you exceed the rate limit, Exotel returns:

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 30

{
  "RestException": {
    "Status": 429,
    "Message": "Rate limit exceeded. Try again in 30 seconds.",
    "Code": "RATE_LIMIT_EXCEEDED"
  }
}
```

## Concurrent Call Limits

Concurrent call limits define the maximum number of simultaneous active calls on your account.

### Default Limits by Plan

| Plan | Default Concurrent Calls | Maximum (with upgrade) |
|------|--------------------------|----------------------|
| **Starter** | 10 | 25 |
| **Growth** | 50 | 200 |
| **Enterprise** | Custom (starting at 100) | 1,000+ |

### What Counts as a Concurrent Call

| Scenario | Concurrent Call Count |
|----------|---------------------|
| Single outbound call (one leg) | 1 |
| Click-to-call (two legs) | 2 |
| IVR call (caller navigating IVR) | 1 |
| Call in queue (waiting for agent) | 1 |
| Active call (parties talking) | 1 (or 2 for two-leg calls) |
| Call ringing (not yet answered) | 1 |

### Concurrent Limit Exceeded

When you hit the concurrent call limit:

- New outbound API calls are rejected with an error
- New inbound calls receive a busy signal or go to a configured fallback
- Existing calls are NOT affected -- they continue normally

See [Concurrent Calls](/docs/advanced-config/concurrent-calls) for strategies to manage and scale your limits.

## SMS Rate Limits

### Throughput Limits

| SMS Type | Default Throughput |
|----------|--------------------|
| **Transactional** | 30 SMS/second |
| **Promotional** | 10 SMS/second |
| **OTP** | 30 SMS/second |

### Bulk SMS Limits

| Parameter | Limit |
|-----------|-------|
| **Max recipients per API call** | 100 |
| **Max SMS per minute** | Based on throughput limits above |
| **Max concurrent bulk jobs** | 5 per account |

## Handling Rate Limits

### Retry Strategy with Exponential Backoff

When you receive a 429 response, implement exponential backoff:

```
Attempt 1: Wait 1 second, then retry
Attempt 2: Wait 2 seconds, then retry
Attempt 3: Wait 4 seconds, then retry
Attempt 4: Wait 8 seconds, then retry
Attempt 5: Wait 16 seconds, then retry
Max retries: 5 (then fail and log)
```

:::tip
Always check the `Retry-After` header in the 429 response. It tells you exactly how many seconds to wait before retrying.
:::

### Request Queuing

For high-volume integrations, implement a request queue:

1. Place all API requests in a queue
2. A worker processes requests from the queue at a controlled rate
3. If a 429 response is received, the worker pauses and retries
4. Failed requests are re-queued with a backoff delay

### Rate Limit Monitoring

Track your API usage to stay within limits:

| Metric | How to Monitor |
|--------|---------------|
| **Requests per minute** | Track from your application logs |
| **429 error rate** | Monitor from your error tracking system |
| **Concurrent calls** | Check via the [Real-Time Dashboard](/docs/reporting/real-time-dashboard) |
| **Remaining quota** | Read `X-RateLimit-Remaining` headers |

## Requesting Higher Limits

If your default limits are insufficient:

### For API Rate Limits

1. Contact your account manager or raise a support ticket
2. Provide details:
   - Which endpoints need higher limits
   - Expected request volume (requests per minute)
   - Business justification
3. Rate limit increases are evaluated based on your plan and usage patterns

### For Concurrent Call Limits

1. Navigate to **Settings** > **Account** > **Concurrent Calls** (or contact support)
2. Request the desired concurrent call limit
3. Provide:
   - Expected peak concurrent calls
   - Average call duration
   - Peak traffic hours

See [Concurrent Calls](/docs/advanced-config/concurrent-calls) for detailed scaling guidance.

## Best Practices

1. **Implement retries with backoff** -- Never retry immediately after a 429; always wait
2. **Read rate limit headers** -- Use `X-RateLimit-Remaining` to throttle proactively before hitting limits
3. **Batch when possible** -- Use bulk endpoints (e.g., bulk SMS) instead of individual requests
4. **Cache API responses** -- Cache call details and other read-heavy data to reduce API calls
5. **Use webhooks over polling** -- Receive events via webhooks instead of polling the API for status updates
6. **Monitor your usage** -- Set up alerts for high 429 error rates
7. **Design for limits** -- Build your integration assuming limits exist; do not assume unlimited capacity
8. **Spread traffic evenly** -- Avoid burst patterns; distribute API calls evenly over time

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Frequent 429 errors | Exceeding request rate | Implement backoff and request queuing |
| Outbound calls failing | Concurrent call limit reached | Monitor active calls; increase limit if needed |
| SMS not sending | SMS throughput limit reached | Reduce send rate; use bulk endpoint |
| API slow during peaks | Approaching rate limits | Distribute load; cache where possible |
| Inconsistent rate limits | Multiple API keys hitting same account limit | Rate limits are per-account, not per-key |

## Related Topics

- [Concurrent Calls](/docs/advanced-config/concurrent-calls) -- Managing concurrent call limits
- [IP Whitelisting](/docs/advanced-config/ip-whitelisting) -- Securing API access
- [Error Codes](/docs/references/error-codes) -- Understanding error responses
- [Voice API](/docs/voice-api/getting-started/overview) -- API usage documentation
