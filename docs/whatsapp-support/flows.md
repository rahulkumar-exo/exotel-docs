---
id: flows
title: WhatsApp Flows
description: "Build WhatsApp Flows with Exotel -- create forms, surveys, appointment bookings, and multi-step interactions within WhatsApp conversations."
sidebar_label: Flows
sidebar_position: 20
---

# WhatsApp Flows

WhatsApp Flows is a feature that allows businesses to build structured, multi-step interactions directly within WhatsApp. Flows can collect information through forms, enable appointment booking, run surveys, and create rich interactive experiences without requiring customers to leave the app.

## What Are WhatsApp Flows?

Flows are interactive screen-based experiences that open as an overlay within WhatsApp. They can include form inputs, dropdown menus, date pickers, and navigation between screens, providing a native app-like experience.

### Flows vs. Interactive Messages

| Feature | Interactive Messages | WhatsApp Flows |
|---------|---------------------|---------------|
| Complexity | Simple (buttons, lists) | Multi-step forms and screens |
| Input types | Button taps, list selections | Text fields, dropdowns, date pickers, checkboxes |
| Navigation | Single interaction | Multiple screens with back/forward |
| Data collection | One field at a time | Multiple fields on one screen |
| Validation | None | Client-side validation |
| Best for | Quick choices | Data collection, bookings, surveys |

## Use Cases

| Use Case | Description | Example |
|----------|-------------|---------|
| **Lead generation** | Collect customer information | Name, email, phone, company size |
| **Appointment booking** | Schedule appointments or meetings | Date picker, time slot selection |
| **Surveys** | Gather customer feedback | Rating scales, multiple choice, text input |
| **Registration** | Event or service registration | Multi-field signup forms |
| **Customer onboarding** | Guided setup process | Step-by-step configuration |
| **Order customization** | Customize products before purchase | Size, color, quantity, special instructions |
| **Support ticket creation** | Structured issue reporting | Category, description, attachments |

## Flow Components

### Screens

A flow consists of one or more screens, each containing UI elements:

| Component | Description | Use Case |
|-----------|-------------|----------|
| **TextInput** | Single or multi-line text input | Names, descriptions, comments |
| **TextArea** | Large text input area | Detailed feedback, descriptions |
| **Dropdown** | Select from a list of options | Categories, countries, sizes |
| **RadioButton** | Single selection from options | Yes/No, ratings, preferences |
| **CheckboxGroup** | Multiple selections | Interests, features, options |
| **DatePicker** | Select a date | Appointment dates, delivery dates |
| **Footer** | Action button at bottom | Submit, Continue, Book |
| **TextHeading** | Section header text | Form section labels |
| **TextSubheading** | Subsection text | Instructions, descriptions |
| **TextBody** | Body text | Explanatory content |
| **OptIn** | Consent checkbox | Terms acceptance, marketing consent |
| **Image** | Display an image | Branding, product images |

### Flow Navigation

Flows support multi-screen navigation:

```
Screen 1: Personal Information
  [Name, Email, Phone]
  → [Continue]

Screen 2: Preferences
  [Service Type, Preferred Date, Time Slot]
  → [Continue]

Screen 3: Confirmation
  [Summary of selections]
  → [Confirm Booking]

Screen 4: Success
  [Confirmation message with reference number]
  → [Done]
```

## Creating a Flow

### Step 1: Design Your Flow

Plan the screens, inputs, and navigation:

| Screen | Purpose | Fields |
|--------|---------|--------|
| Screen 1 | Collect contact info | Name (text), Email (text), Phone (text) |
| Screen 2 | Select service | Service type (dropdown), Date (date picker), Notes (textarea) |
| Screen 3 | Confirm | Summary display, Confirm button |

### Step 2: Define the Flow JSON

Flows are defined using a JSON structure:

```json
{
  "version": "3.0",
  "screens": [
    {
      "id": "CONTACT_INFO",
      "title": "Contact Information",
      "data": {},
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextInput",
            "name": "full_name",
            "label": "Full Name",
            "required": true,
            "input-type": "text"
          },
          {
            "type": "TextInput",
            "name": "email",
            "label": "Email Address",
            "required": true,
            "input-type": "email"
          },
          {
            "type": "TextInput",
            "name": "phone",
            "label": "Phone Number",
            "required": true,
            "input-type": "phone"
          },
          {
            "type": "Footer",
            "label": "Continue",
            "on-click-action": {
              "name": "navigate",
              "next": {
                "type": "screen",
                "name": "SERVICE_SELECTION"
              },
              "payload": {
                "full_name": "${form.full_name}",
                "email": "${form.email}",
                "phone": "${form.phone}"
              }
            }
          }
        ]
      }
    },
    {
      "id": "SERVICE_SELECTION",
      "title": "Select Service",
      "data": {},
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Dropdown",
            "name": "service_type",
            "label": "Service Type",
            "required": true,
            "data-source": [
              { "id": "consultation", "title": "Consultation" },
              { "id": "installation", "title": "Installation" },
              { "id": "repair", "title": "Repair" },
              { "id": "maintenance", "title": "Maintenance" }
            ]
          },
          {
            "type": "DatePicker",
            "name": "preferred_date",
            "label": "Preferred Date",
            "required": true
          },
          {
            "type": "TextArea",
            "name": "notes",
            "label": "Additional Notes",
            "required": false
          },
          {
            "type": "Footer",
            "label": "Confirm Booking",
            "on-click-action": {
              "name": "complete",
              "payload": {
                "service_type": "${form.service_type}",
                "preferred_date": "${form.preferred_date}",
                "notes": "${form.notes}"
              }
            }
          }
        ]
      }
    }
  ]
}
```

### Step 3: Register the Flow

Register your flow using the WhatsApp Flows API or Meta Business Manager:

1. Go to **WhatsApp Account** > **Flows** in Meta Business Manager.
2. Click **Create Flow**.
3. Enter the flow name and categories.
4. Upload or build the flow JSON.
5. Test the flow in preview mode.
6. Publish the flow.

### Step 4: Send a Flow Message

Trigger a flow by sending a flow message to the customer:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "flow",
        "header": {
          "type": "text",
          "text": "Book an Appointment"
        },
        "body": {
          "text": "Schedule a service appointment with us. Tap the button below to get started."
        },
        "footer": {
          "text": "Takes less than 2 minutes"
        },
        "action": {
          "name": "flow",
          "parameters": {
            "flow_message_version": "3",
            "flow_id": "your_flow_id",
            "flow_cta": "Book Now",
            "flow_action": "navigate",
            "flow_action_payload": {
              "screen": "CONTACT_INFO"
            }
          }
        }
      }
    }
  }'
```

## Handling Flow Responses

When a customer completes a flow, you receive the collected data via webhook:

```json
{
  "type": "inbound_message",
  "data": {
    "from": "+919876543210",
    "message": {
      "type": "interactive",
      "interactive": {
        "type": "nfm_reply",
        "nfm_reply": {
          "response_json": "{\"full_name\":\"Rahul Kumar\",\"email\":\"rahul@example.com\",\"phone\":\"+919876543210\",\"service_type\":\"consultation\",\"preferred_date\":\"2025-02-01\",\"notes\":\"Morning preferred\"}",
          "body": "Sent",
          "name": "flow"
        }
      }
    }
  }
}
```

### Processing Flow Data

```javascript
function handleFlowResponse(data) {
  const responseJson = JSON.parse(data.message.interactive.nfm_reply.response_json);

  const booking = {
    name: responseJson.full_name,
    email: responseJson.email,
    phone: responseJson.phone,
    service: responseJson.service_type,
    date: responseJson.preferred_date,
    notes: responseJson.notes
  };

  // Create booking in your system
  const confirmation = createBooking(booking);

  // Send confirmation via template
  sendTemplateMessage(data.from, 'booking_confirmed', {
    name: booking.name,
    service: booking.service,
    date: booking.date,
    refId: confirmation.id
  });
}
```

## Flow Design Best Practices

1. **Keep flows short** -- 2-4 screens maximum. Long flows have higher abandonment rates.
2. **Minimize required fields** -- Only ask for essential information.
3. **Use appropriate input types** -- Date pickers for dates, dropdowns for fixed options, text for open-ended fields.
4. **Provide clear labels** -- Every field should have a descriptive label.
5. **Add validation** -- Use input validation to catch errors early.
6. **Test thoroughly** -- Test the flow on multiple devices before publishing.
7. **Confirm completion** -- Always send a confirmation message after flow completion.

:::warning
Flows are currently available on WhatsApp mobile apps only. WhatsApp Web and desktop users may not be able to interact with flows. Provide an alternative interaction method for these users.
:::

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Flow not displaying | Flow not published or flow ID incorrect | Verify flow is published and ID matches |
| Form validation errors | Input does not match validation rules | Review validation rules in flow JSON |
| Missing response data | Optional fields not included in payload | Handle missing fields gracefully in your code |
| Flow abandoned | Customer closed the flow without completing | Send a follow-up message encouraging completion |

## Next Steps

- [WhatsApp Commerce](/docs/whatsapp-support/commerce) -- Product-based commerce
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Simpler interactive options
- [WhatsApp Webhooks](/docs/whatsapp-support/webhooks) -- Handle flow responses
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
