---
title: Bot Prompts
description: Collect user input with text fields, forms, quick replies, calendars, file uploads, and WhatsApp-specific interactive prompts in the Exo-Chatbot Flow Builder.
sidebar_label: Bot Prompts
---

# Bot Prompts

## Overview

Bot Prompts are a core category of interactive elements in the Flow Builder designed for two-way communication, specifically to request and collect information from the user. While "Bot Messages" are for displaying information, Prompts are for gathering it. They pause the conversation flow and wait for the user to provide an input, which can then be validated and stored in a variable for later use.

These elements are critical for building any transactional or data-driven chatbot. They allow you to capture essential details like a user's name, book an appointment by asking for a date, or collect documents for a verification process.

The available Bot Prompt types include:

| Category | Prompt Types |
|----------|-------------|
| **Basic Inputs** | Text, Name, Phone, Email, PAN, Aadhaar |
| **Media Uploads** | File, Video Recording |
| **Interactive Choices** | Quick Replies, Confirmation, Choices, WhatsApp List |
| **Complex Data Collection** | Form, Calendar, Location, Range Slider |
| **Channel-Specific** | WhatsApp Catalogue, WhatsApp Flows, WhatsApp Payments |
| **Advanced** | Custom Validator |

Using Prompts effectively is the key to creating interactive, personalized, and functional conversational journeys.

## How to Use Bot Prompts

Bot Prompts are added as elements inside a node on the Flow Builder canvas. Once added, a configuration panel appears where you define the prompt's behavior.

### Adding a Bot Prompt

1. On the Flow Builder canvas, click the **+** icon on a node to add a new step.
2. From the element menu, select the **Prompts** category.
3. Choose the specific type of prompt you need (e.g., Name, Form, Calendar).

### Common Configuration Settings

Most prompts share a set of common configuration options:

- **Enter Default Response** -- The question or instruction the bot shows to the user (e.g., "Please enter your email address.").
- **Enter Response if Validation Fails** -- The error message the user sees if they provide invalid input (e.g., "That doesn't look like a valid email. Please try again.").
- **Maximum Attempts Allowed** -- The number of times a user can retry after a validation failure before the flow takes a different path.
- **Action After Maximum Failed Attempts** -- If the user fails all attempts, you can configure the flow to **End Flow**, **Restart Flow**, or **Go to Another Step**.
- **Store Response in a Variable** -- This is the most crucial step. You must select or create a Variable to save the user's input. This allows you to use the collected data later in the flow (e.g., to personalize a message or send to an API).

:::warning Important
You must always assign a variable to store the user's response. If you skip this step, the collected data will be immediately lost.
:::

### Details for Specific Prompt Types

#### Basic Input Prompts (Name, Phone, Email, PAN, Aadhaar)

These prompts are for collecting specific text-based information. They each come with pre-built validation to ensure the user's input matches the expected format. The Phone Prompt also allows you to set a default country code.

#### Media Prompts (File, Video Recording)

- **File Prompt** -- Asks the user to upload a file. You can specify the supported file types.
- **Video Recording Prompt** -- Allows the user to either record a video directly in the chat or upload an existing video file.

#### Interactive Prompts

- **Quick Replies** -- Presents the user with a set of buttons. Each button can be configured to trigger a different flow, redirect to a link, or jump to another step in the current flow. This is used for guiding the user's journey.
- **Confirmation** -- Shows a message with two configurable buttons for positive (e.g., "Yes, Confirm") and negative (e.g., "No, Cancel") responses. Each button can be linked to a different next step in the flow.
- **Choices** -- Asks the user to select from a list of options presented as Radio Buttons (single select), Checkboxes (multi-select), or a Dropdown List (single select).

#### Complex Data Collection

- **Form** -- A powerful element for creating multi-field forms. You can add multiple fields, each with its own input type (Text, Choices, Calendar, File Upload, etc.), label, and validator. This is ideal for lead generation or detailed data collection.
- **Calendar** -- Displays a date and/or timepicker for the user to select a specific date, a date range, a time, or a time range.
- **Location** -- Prompts the user to share their location. You can add validations to accept locations only from specific countries or pincodes.

## Common Use Cases

- **User Registration** -- Use a series of Name, Email, and Phone prompts to collect user details, storing each in a variable.
- **Customer Feedback Survey** -- Use a Choices prompt with radio buttons for a rating (1-5) and a Text prompt for open-ended comments.
- **Scheduling a Demo** -- Use the Calendar prompt to let the user pick a preferred date and time.
- **Document Submission** -- Use the File prompt to ask users to upload a required document, like an ID card for verification.

## Best Practices

:::tip
- **Always Validate Input** -- Use the built-in validators for prompts like Email and Phone to ensure you collect clean, usable data.
- **Provide Clear Instructions** -- In your "Default Response," be very clear about what you need from the user (e.g., "Please enter your 10-digit PAN number.").
- **Handle Errors Gracefully** -- Write helpful and friendly "Validation Fails" messages. Instead of just "Invalid input," say "Oops, that doesn't look like a valid date. Please use the MM/DD/YYYY format."
- **Use Quick Replies to Guide Users** -- Instead of open-ended text prompts, use Quick Replies or Choices whenever possible. This reduces user effort and prevents misunderstanding.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Forgetting to Store the Response** -- The most common mistake is configuring a prompt without assigning a variable to store the user's answer. If you do not store it, the data is immediately lost.
- **Not Setting a Failure Path** -- Failing to configure the "Action After Maximum Failed Attempts" can leave the user stuck in a loop if they cannot provide valid input.
- **Making Forms Too Long** -- A form with 10+ fields can be intimidating in a chat interface. Break down long data collection processes into a series of smaller, individual prompts to make it feel more conversational.
- **Using the Wrong Prompt Type** -- Do not use a Text prompt when a Choices or Quick Reply prompt would be more efficient and user-friendly. Match the prompt type to the kind of data you need.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Bot Messages](./bot-messages.md)
- [Actions](./actions.md)
- [Logic](./logic.md)
