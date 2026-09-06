---
id: template-flows
title: Template Messages with Flows
description: Send WhatsApp template messages that include a Flow button using the Exotel API.
sidebar_label: Template + Flows
sidebar_position: 6
---

# Send Template Message with Flow

Send a pre-approved WhatsApp template that contains an embedded Flow button. Unlike plain Flow messages (which work in active user conversations), Template + Flow messages can be sent as business-initiated outbound messages.

:::note Beta
This feature is in Beta. Reports and Analytics are not yet available on the dashboard.
:::

:::info Prerequisites
Template creation with a Flow button is **not** supported via API or the Exotel dashboard. Create the template in the **WhatsApp Manager on the Meta dashboard** (Marketing category → Form sub-category → Add button → Meta Flow Form Builder). Once approved, send it via this API.
:::

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/messages
```

## Request Structure

The outer wrapper is identical to other WhatsApp template sends. The difference is in the `components` array — the Flow button uses `sub_type: "flow"` and a `type: "action"` parameter.

### Component Object (Flow button)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | String | Yes | `"button"` |
| `sub_type` | String | Yes | `"flow"` |
| `index` | String | Yes | Button position index (`"0"`, `"1"`, `"2"`) |
| `parameters` | Array | Yes | Array containing one action parameter object |

### Parameter Object (Action)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | String | Yes | `"action"` |
| `action.flow_token` | String | Optional | Pass `"0000"` for templates created via Meta dashboard (no token generated) |
| `action.flow_action_data` | Object | Optional | Initial data payload for the first Flow screen |

## Example — No template variables

```bash
curl --location 'https://{{AuthKey}}:{{AuthToken}}@{{SubDomain}}/v2/accounts/{{AccountSid}}/messages' \
--header 'Content-Type: application/json' \
--data '{
  "custom_data": "ORD123",
  "status_callback": "https://your-server.com/callback",
  "whatsapp": {
    "messages": [
      {
        "from": "+918047109880",
        "to": "+919876543210",
        "content": {
          "type": "template",
          "template": {
            "name": "flow_template",
            "language": { "code": "en_US" },
            "components": [
              {
                "type": "button",
                "sub_type": "flow",
                "index": "0",
                "parameters": [
                  {
                    "type": "action",
                    "action": {
                      "flow_token": "0000",
                      "flow_action_data": {
                        "product_name": "Premium Plan",
                        "product_description": "Monthly subscription",
                        "product_price": 999
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}'
```

## Example — With header and body variables

```bash
curl --location 'https://{{AuthKey}}:{{AuthToken}}@{{SubDomain}}/v2/accounts/{{AccountSid}}/messages' \
--header 'Content-Type: application/json' \
--data '{
  "custom_data": "ORD456",
  "status_callback": "https://your-server.com/callback",
  "whatsapp": {
    "messages": [
      {
        "from": "+918047109880",
        "to": "+919876543210",
        "content": {
          "type": "template",
          "template": {
            "name": "flow_template_with_vars",
            "language": { "code": "en" },
            "components": [
              {
                "type": "header",
                "parameters": [{ "type": "text", "text": "Exotel" }]
              },
              {
                "type": "body",
                "parameters": [{ "type": "text", "text": "Rahul" }]
              },
              {
                "type": "button",
                "sub_type": "flow",
                "index": "0",
                "parameters": [
                  {
                    "type": "action",
                    "action": {
                      "flow_token": "0000",
                      "flow_action_data": {
                        "product_name": "Premium Plan",
                        "product_description": "Monthly subscription",
                        "product_price": 999
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}'
```

## Example — With image header

```bash
curl --location 'https://{{AuthKey}}:{{AuthToken}}@{{SubDomain}}/v2/accounts/{{AccountSid}}/messages' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "messages": [
      {
        "from": "+918047109880",
        "to": "+919876543210",
        "content": {
          "type": "template",
          "template": {
            "name": "flow_template_image_header",
            "language": { "code": "en" },
            "components": [
              {
                "type": "header",
                "parameters": [{ "type": "image", "image": { "link": "https://example.com/banner.jpg" } }]
              },
              {
                "type": "body",
                "parameters": [{ "type": "text", "text": "Rahul" }]
              },
              {
                "type": "button",
                "sub_type": "flow",
                "index": "0",
                "parameters": [
                  {
                    "type": "action",
                    "action": { "flow_token": "0000" }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}'
```

## Response

HTTP 202. Same structure as other WhatsApp message sends.

```json
{
  "request_id": "b434e927a5844175b23059cd96feea3d",
  "method": "POST",
  "http_code": 202,
  "metadata": { "failed": 0, "total": 1, "success": 1 },
  "response": {
    "whatsapp": {
      "messages": [
        {
          "code": 202,
          "error_data": null,
          "status": "success",
          "data": { "sid": "2FdiiEQUosckPhpZfuVwfjxiSlc16a4" }
        }
      ]
    }
  }
}
```

## Status Callbacks

Delivery callbacks follow the same structure as other WhatsApp messages (`callback_type: "dlr"`). The Flow submission response is received as an incoming message — see [Receive Flow Messages](./receive-messages.md) for the `nfm_reply` callback structure.

## Key Differences from Plain Flow Messages

| | [Send Flow Message](./flows.md) | Template + Flow (this page) |
|---|---|---|
| Initiation | User-initiated / active conversation | Business-initiated (outbound) |
| Content type | `type: "interactive"`, `interactive.type: "flow"` | `type: "template"`, button `sub_type: "flow"` |
| Template required | No | Yes (must be Meta-approved) |
| Template creation | N/A | Meta dashboard only (API not supported) |
| `flow_token` | From Meta Dashboard Flows section | `"0000"` (no token for template flows) |
