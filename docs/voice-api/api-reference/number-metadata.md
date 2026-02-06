---
id: number-metadata
title: Number Metadata
sidebar_label: Number Metadata
sidebar_position: 6
---

# Number Metadata

Retrieve telecom information about Indian phone numbers, including the telecom circle, operator, number type, and DND (Do Not Disturb) status.

## Endpoint

```
GET https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Numbers/<phone_number>
```

Append `.json` for JSON response format.

## Path Parameters

| Parameter        | Required  | Description |
|------------------|-----------|-------------|
| `<phone_number>` | Mandatory | The Indian phone number to look up |

## Code Examples

### cURL

```bash
curl "https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Numbers/09876543210.json"
```

### Python

```python
import requests

response = requests.get(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Numbers/09876543210.json'
)

print(response.json())
```

## Response Fields

| Field          | Type   | Description |
|----------------|--------|-------------|
| `PhoneNumber`  | String | Reformatted phone number |
| `Circle`       | String | Two-character telecom circle code |
| `CircleName`   | String | Human-readable circle name |
| `Type`         | String | `Mobile` or `Landline` |
| `Operator`     | String | Telecom operator code |
| `OperatorName` | String | Full operator name |
| `DND`          | String | `Yes`, `No`, or `Unavailable` |

## Telecom Circles (India)

| Code | Circle Name |
|------|-------------|
| AP | Andhra Pradesh |
| AS | Assam |
| BR | Bihar |
| CH | Chennai |
| DL | Delhi |
| GJ | Gujarat |
| HP | Himachal Pradesh |
| HR | Haryana |
| JK | Jammu & Kashmir |
| KA | Karnataka |
| KL | Kerala |
| KO | Kolkata |
| MH | Maharashtra |
| MP | Madhya Pradesh |
| MU | Mumbai |
| NE | North East |
| OR | Orissa |
| PB | Punjab |
| RJ | Rajasthan |
| TN | Tamil Nadu |
| UE | UP (East) |
| UW | UP (West) |
| WB | West Bengal |

## Telecom Operators (India)

| Code | Operator Name |
|------|---------------|
| AC | Aircel |
| A  | Airtel |
| AL | Allianz |
| B  | BSNL |
| D  | Dishnet |
| E  | Etisalat |
| H  | HFCL |
| I  | Idea |
| LO | Loop |
| MT | MTNL |
| P  | Ping |
| R  | Reliance |
| S  | Sistema |
| ST | S Tel |
| T  | Tata |
| U  | Unitech |
| VI | Videocon |
| V  | Vodafone |

:::note
This API is currently available for **Indian phone numbers only**.
:::
