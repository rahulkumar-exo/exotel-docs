---
id: bulk-call-details
title: Bulk Call Details (Beta)
sidebar_label: Bulk Call Details
sidebar_position: 5
---

# Bulk Call Details (Beta)

Retrieve details for multiple calls with filtering, sorting, and cursor-based pagination.

## Endpoint

```
GET https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Calls
```

## Query Parameters

| Parameter     | Required | Type   | Description |
|---------------|----------|--------|-------------|
| `Sid`         | Optional | String | One or more Call SIDs, comma-separated. Recommended limit: 20. Maximum: 100. |
| `DateCreated` | Optional | String | Filter by creation date. Supports `gte` (greater than or equal) and `lte` (less than or equal) operators. Format: `YYYY-MM-DD HH:mm:ss`. Can query up to 6 months old with a max range of 1 month. Default: last 31 days. |
| `To`          | Optional | String | Customer's phone number (E.164 format). Comma-separated, max 5 numbers. |
| `From`        | Optional | String | Calling phone number (E.164 format). Comma-separated, max 5 numbers. |
| `Status`      | Optional | String | Filter by call status: `queued`, `ringing`, `in-progress`, `completed`, `failed`, `busy`, `no-answer`. |
| `Duration`    | Optional | String | Filter by duration with operators. Format: `gte:10s;lte:45s` |
| `Price`       | Optional | String | Filter by price with operators. Format: `gte:0.10;lte:1.0` |
| `Direction`   | Optional | String | `inbound`, `outbound-dial`, or `outbound-api`. |
| `PhoneNumber` | Optional | String | ExoPhone in E.164 format. Comma-separated, max 5 numbers. |
| `PageSize`    | Optional | Integer | Records per page. Default: `50`. Max: `100`. |
| `SortBy`      | Optional | String | Sort field and order. Example: `DateCreated:asc`. Default: `DateCreated` descending. |
| `Before`      | Optional | String | Cursor from `PrevPageUri` for backward pagination. |
| `After`       | Optional | String | Cursor from `NextPageUri` for forward pagination. |

## Code Examples

### cURL

```bash
curl "https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls?Status=completed&PageSize=10"
```

### Python

```python
import requests

params = {
    'Status': 'completed',
    'DateCreated': 'gte:2024-01-01 00:00:00;lte:2024-01-31 23:59:59',
    'PageSize': 10
}

response = requests.get(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls',
    params=params
)

print(response.json())
```

## Response Format

Supports `application/json` and `application/xml`.

The response includes an array of call objects (same fields as [Call Details](/docs/voice-api/api-reference/call-details)) plus pagination metadata:

```json
{
  "Calls": [...],
  "NextPageUri": "/v1/Accounts/<sid>/Calls?After=cursor_token",
  "PrevPageUri": "/v1/Accounts/<sid>/Calls?Before=cursor_token"
}
```

## Pagination

This API uses **cursor-based pagination**:

- Use the `After` cursor from `NextPageUri` to get the next page
- Use the `Before` cursor from `PrevPageUri` to get the previous page
- Do not manually construct cursor values — always use the URIs from the response

:::caution Beta
This API is currently in beta. Parameters and behavior may change.
:::
