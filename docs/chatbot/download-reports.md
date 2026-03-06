---
title: Download Reports
description: Export user-submitted form data from your Exo-Chatbot as CSV or Excel files for offline processing, lead management, and analysis.
sidebar_label: Download Reports
---

# Download Reports

## Overview

The Download Reports feature is a utility within the Analytics module that allows administrators to export data collected from users through forms in the chatbot. When a user fills out a Form Prompt or any other data-capturing widget within a conversation flow, their submissions are stored. This feature provides a centralized place to download this collected data in a structured format, typically as a CSV or Excel file.

This functionality is essential for any process that involves collecting user information for offline processing, such as lead generation, support ticket creation, event registration, or feedback collection. It bridges the gap between the conversational front-end and back-office workflows by enabling teams to easily access and utilize the data their chatbot gathers.

Key capabilities include:

- **Form-Based Export** -- Select the specific form for which you want to download submission data.
- **Date-Filtered Exports** -- Narrow your export to a specific date range so you only retrieve the data you need.
- **Structured Data Output** -- The exported file organizes the data with columns corresponding to the fields in your form, plus metadata such as timestamps and session identifiers.
- **Centralized Access** -- Provides a single location to retrieve all user-submitted form data without needing to comb through individual chat histories.
- **Session Data Export** -- In addition to form data, export raw session data for deeper analysis in external BI tools.

## How to Download a Report

### Step-by-Step Guide

1. From the main console menu, click on **Analytics** in the left navigation panel.
2. Navigate to the **Download Reports** section (this may appear as a tab or sub-section within Analytics).
3. You will see a dropdown menu or a list of all the forms you have created across your bot's flows.
4. **Select the Form** for which you want to retrieve data (e.g., "Contact_Us_Form," "Demo_Request_Form," "Feedback_Survey").
5. **Set the Date Range** using the date picker. Choose a start date and end date to filter the submissions.
6. Optionally, select the **Channel Filter** if you only want submissions from a specific channel (e.g., Web only, WhatsApp only).
7. Click the **Download** or **Export** button.
8. The system will generate and download a file containing all user submissions for the selected form and time period.

### Understanding the Exported File

The exported CSV or Excel file contains the following types of columns:

| Column Type | Description | Example |
|-------------|-------------|---------|
| **Form Fields** | Each field from your form prompt appears as a column header | Name, Email, Phone, Company |
| **Timestamp** | The date and time when the user submitted the form | 2025-03-15 14:32:00 |
| **Session ID** | A unique identifier for the user's chat session | sess_abc123xyz |
| **Channel** | The channel through which the user submitted the form | Web, WhatsApp, Facebook |
| **User ID** | The unique identifier for the user (if available) | user_789def |

### Exporting Session Data

In addition to form-specific reports, you can export raw session data for deeper analysis:

1. In the Download Reports section, locate the **Session Data** export option.
2. Select the desired **Date Range**.
3. Optionally filter by **Channel** or **Flow**.
4. Click **Download**.
5. The session data export includes:

| Field | Description |
|-------|-------------|
| **Session ID** | Unique session identifier |
| **User ID** | Unique user identifier |
| **Channel** | The channel used for the session |
| **Start Time** | When the session began |
| **End Time** | When the session ended |
| **Duration** | Total session duration in seconds |
| **Messages Exchanged** | Total number of messages in the session |
| **Intents Triggered** | List of intents (flows) triggered during the session |
| **Outcome** | Whether the session ended successfully, was escalated, or was abandoned |

## Common Use Cases

- **Lead Generation** -- A "Request a Demo" form in your bot collects a user's name, email, and company. At the end of each day, the sales team navigates to Download Reports, selects the "Demo_Request_Form," and exports the list of new leads to import into their CRM.
- **Customer Feedback Collection** -- A bot flow includes a survey form asking users to rate a service and provide comments. The product team downloads this report weekly to analyze user feedback and identify areas for improvement.
- **Event Registration** -- A chatbot flow allows users to register for a webinar by submitting their details through a form. The event organizer can download the complete list of attendees right before the event to manage logistics and send confirmation emails.
- **Support Ticket Triage** -- Users who cannot find an answer can fill out a "Create a Support Ticket" form. The support team downloads the report of new tickets every hour to manually create and assign them in their external helpdesk system.
- **Compliance and Audit** -- For regulated industries, downloading session data provides a record of all bot interactions that can be archived for compliance purposes.

## Configuration Options

### Setting Up Forms for Reporting

For form data to appear in the Download Reports section, the form must be properly configured in your flows:

| Requirement | Description |
|-------------|-------------|
| **Use Form Prompts** | The data must be collected using a Form Prompt element in the Flow Builder. Simple text prompts that store responses in variables do not automatically appear in Download Reports. |
| **Unique Form Names** | Each form should have a unique, descriptive name. This name is what appears in the dropdown when selecting a form to export. |
| **Field Labels** | Each field in the form should have a clear label. These labels become the column headers in the exported file. |
| **Published Flows** | Only forms within published flows collect data. Forms in draft or unpublished flows are not active. |

### Export Format Options

| Format | Best For | Details |
|--------|----------|---------|
| **CSV** | Large datasets, CRM imports, programmatic processing | Comma-separated values; compatible with Excel, Google Sheets, and most data tools |
| **Excel (.xlsx)** | Business users, formatted reports, pivot table analysis | Native Excel format with proper data typing |

## Best Practices

:::tip
- **Establish a Regular Download Cadence** -- Set a consistent schedule for downloading reports (e.g., daily for lead generation, weekly for surveys). This ensures no data is missed and your back-office teams always have fresh data.
- **Use Descriptive Form Names** -- When creating forms in the Flow Builder, give them clear, unique names like "Webinar_Registration_March2025" rather than "Form1." This makes it easy to identify the correct form in the Download Reports dropdown.
- **Combine with Date Filters for Incremental Exports** -- If you download data daily, use the date filter to export only the previous day's submissions. This avoids processing duplicate records in your external systems.
- **Archive Exports for Compliance** -- For industries with data retention requirements, save each export file with the date range in the filename and store it in a secure location as part of your audit trail.
- **Cross-Reference with Analytics** -- After downloading form data, compare the number of submissions with the Flow Completion Rate in Conversion Analytics. If many users start a form-based flow but few submissions appear in the export, users are dropping off before completing the form.
- **Automate with Email Reports** -- For recurring export needs, consider setting up scheduled email reports in the Settings module instead of manually downloading. This ensures stakeholders receive the data automatically.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Forgetting to Set a Date Range** -- Downloading reports without a date filter can result in extremely large files containing all historical submissions. This is slow and may include data you have already processed.
- **Using Variables Instead of Form Prompts** -- Data collected through simple text prompts and stored in variables does not automatically appear in Download Reports. If you need exportable data, use a Form Prompt element.
- **Not Checking for Duplicate Submissions** -- If a user submits the same form multiple times (e.g., by refreshing or retrying), each submission will appear in the export. Build deduplication logic into your downstream processing.
- **Ignoring Channel Context** -- A form submission from Web might contain different data than one from WhatsApp (e.g., file uploads may not be supported on all channels). Always consider channel-specific behaviors when processing exported data.
- **Leaving Exported Data Unprocessed** -- The value of Download Reports is in acting on the data. Downloading reports but not importing them into your CRM, helpdesk, or analytics tool defeats the purpose of data collection.
- **Not Naming Forms Distinctly** -- If multiple flows use forms with the same or similar names, it becomes difficult to identify which form's data you are downloading. Use unique, flow-specific names for every form.
:::

## Related

- [Analytics Overview](./analytics.md)
- [Combined Analytics](./combined-analytics.md)
- [Conversion Analytics](./conversion-analytics.md)
- [Bot Prompts](./bot-prompts.md)
- [Settings](./settings.md)
