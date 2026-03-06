---
title: Campaign Contact List Management
description: "Manage campaign contact lists on Exotel. Upload CSVs, deduplicate numbers, filter DND contacts, and manage lists via API and dashboard."
sidebar_label: Contact List Management
sidebar_position: 6
---

# Campaign Contact List Management

Contact lists are the foundation of every campaign. This guide covers how to prepare, upload, manage, and optimize your contact lists for both voice and SMS campaigns on Exotel.

## Contact List Types

Exotel supports two approaches for providing contacts to a campaign:

| Method | Max Contacts | Best For |
|--------|-------------|----------|
| **Inline numbers** (`from` parameter) | 5,000 | Quick one-off campaigns with small audiences |
| **CSV upload** (list SIDs via `lists` parameter) | 1,00,000 (static) / 5,00,000 (dynamic) | Production campaigns with metadata and reusability |

:::tip
For any campaign with more than a few hundred contacts, use CSV uploads. They provide deduplication, metadata for personalization, reusable lists, and better tracking.
:::

## Preparing Your CSV File

### Required Format

The CSV file must include a header row. The `number` column is mandatory; all other columns are optional metadata.

```csv
number,first_name,last_name,company_name,email,tag
+919876543210,Rahul,Kumar,Acme Corp,rahul@acme.com,premium
+919876543211,Priya,Sharma,Beta Inc,priya@beta.com,standard
+919876543212,Amit,Patel,Gamma Ltd,amit@gamma.com,premium
```

### Column Reference

| Column | Required | Description | Format |
|--------|----------|-------------|--------|
| `number` | Yes | Phone number | E.164 format (e.g., `+919876543210`) |
| `first_name` | No | Contact's first name | Text |
| `last_name` | No | Contact's last name | Text |
| `company_name` | No | Company or organization | Text |
| `email` | No | Email address | Valid email |
| `tag` | No | Custom tag for filtering/segmentation | Text |

### Phone Number Formatting

| Format | Valid? | Example |
|--------|--------|---------|
| E.164 with country code | Yes | `+919876543210` |
| Country code without `+` | Yes | `919876543210` |
| Local format (10 digits, India) | Yes | `9876543210` |
| With spaces or dashes | No | `+91 98765-43210` |
| With parentheses | No | `(091) 9876543210` |

:::warning
Remove all spaces, dashes, parentheses, and special characters from phone numbers before upload. Numbers that do not match the expected format will be rejected during processing.
:::

### CSV File Constraints

| Constraint | Limit |
|------------|-------|
| Maximum file size | 60 MB |
| Maximum rows (static campaign) | 1,00,000 |
| Maximum rows (dynamic campaign) | 5,00,000 |
| Encoding | UTF-8 |
| Delimiter | Comma (`,`) |
| Header row | Required |

### Custom Columns for Dynamic Campaigns

Dynamic campaigns use column values for message personalization. You can add any custom columns to your CSV:

```csv
number,first_name,appointment_date,amount_due,branch
+919876543210,Rahul,2024-02-15,5000,Mumbai Central
+919876543211,Priya,2024-02-16,3200,Bangalore HSR
```

These columns can be referenced in greeting messages or SMS templates using the `@@column_header` syntax:

```
Hello @@first_name, your appointment is on @@appointment_date at our @@branch branch.
```

## Uploading Contact Lists

### Upload via API

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contacts/csv-upload" \
  -F "list_name=February_Promo_List" \
  -F "file_name=@contacts.csv" \
  -F "type=static"
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `list_name` | Yes | A descriptive name for the list (e.g., `February_Promo_List`) |
| `file_name` | Yes | Path to the CSV file |
| `type` | Yes | `static` (fixed list) or `dynamic` (for personalized campaigns) |

**Response:**

```json
{
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "upload_id": "upload_xyz789",
      "list_sid": "list_abc123",
      "status": "processing"
    }
  }]
}
```

### Check Upload Status

Large files may take several minutes to process. Poll the upload status:

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/csv-status/<upload_id>"
```

**Response:**

```json
{
  "response": [{
    "code": 200,
    "data": {
      "upload_id": "upload_xyz789",
      "status": "completed",
      "total_records": 5000,
      "success_count": 4850,
      "duplicate_count": 120,
      "failure_count": 30
    }
  }]
}
```

| Status Field | Description |
|-------------|-------------|
| `total_records` | Total rows in the CSV (excluding header) |
| `success_count` | Rows successfully processed and added to the list |
| `duplicate_count` | Rows skipped because the number already exists in the list |
| `failure_count` | Rows that failed validation (invalid number format, missing required fields) |

:::tip
Always check the upload status before creating a campaign. If the upload is still processing, the campaign will not have the full contact list and may produce incomplete results.
:::

### Upload via Dashboard

1. Navigate to **Campaigns > Contact Lists** in the Exotel dashboard
2. Click **Upload New List**
3. Enter a list name and select the list type (static or dynamic)
4. Drag and drop your CSV file or click to browse
5. Review the column mapping preview
6. Click **Upload** to begin processing

> **API Reference:** See the [Campaign Lists API](/docs/campaign-lists/overview) for complete list management endpoints.

## Deduplication

Exotel automatically deduplicates phone numbers during CSV upload. When duplicate numbers are detected:

1. **Within a single CSV**: The first occurrence is kept; subsequent duplicates are counted in `duplicate_count`
2. **Across multiple lists in a campaign**: If the same number appears in multiple lists attached to a single campaign, it is called only once (unless `call_duplicate_numbers` is set to `true`)

### Controlling Duplicate Behavior

| Setting | Default | Behavior |
|---------|---------|----------|
| CSV upload dedup | Always on | Duplicates within the same CSV are removed automatically |
| Campaign-level dedup | On (`call_duplicate_numbers: false`) | Same number across lists is called once |
| Allow duplicates | Off | Set `call_duplicate_numbers: true` to call the same number for each list entry |

### When to Allow Duplicates

Set `call_duplicate_numbers: true` when:

- A shared phone number (e.g., office reception) represents multiple contacts who each need a personalized call
- You are running a dynamic campaign where the same number should receive different messages based on different list entries

```json
"call_duplicate_numbers": true
```

## DND / NDNC Filtering

In India, the National Do Not Call (NDNC) registry restricts commercial communication to registered numbers. Exotel integrates with the NDNC database to filter contacts.

### How DND Filtering Works

1. **At upload time**: When a contact list is uploaded, Exotel can check numbers against the NDNC registry
2. **At call time**: Numbers flagged as DND are automatically skipped during campaign execution
3. **Reporting**: DND-filtered contacts appear as `failed` with a DND-related status code

### DND Categories

| Category | Meaning | Impact on Campaigns |
|----------|---------|-------------------|
| **Fully blocked** | Number is registered for complete DND | Cannot be called for any commercial purpose |
| **Partially blocked** | Number has category-specific preferences | Can be called only for allowed categories |
| **Not registered** | Number is not on the NDNC list | Can be called for commercial purposes |

### Transactional vs. Promotional

| Campaign Type | DND Impact |
|--------------|------------|
| Transactional (`type: "trans"`) | DND filtering may be less restrictive; consented transactional calls are generally permitted |
| Promotional (`type: "promo"`) | Strict DND filtering applies; numbers on the NDNC list are blocked |

:::warning
Calling DND-registered numbers for promotional purposes can result in penalties from TRAI (up to INR 1,000 per violation per day). Always ensure your campaign type is correctly set and DND filtering is active.
:::

For detailed NDNC compliance information, see [NDNC/DND Compliance](/docs/faqs/ndnc-dnd).

## Managing Existing Lists

### List All Contact Lists

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contact-lists"
```

### Get List Details

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contact-lists/<list_sid>"
```

### Delete a Contact List

```bash
curl -X DELETE "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contact-lists/<list_sid>"
```

:::warning
Deleting a contact list is permanent. Lists that are currently attached to an active or paused campaign cannot be deleted. Complete or archive the campaign first.
:::

## Using Multiple Lists in a Campaign

Static campaigns support up to 5 contact lists. Dynamic campaigns support 1 list.

```json
{
  "lists": ["list_sid_1", "list_sid_2", "list_sid_3"],
  "campaign_type": "static"
}
```

| Campaign Type | Max Lists | Notes |
|--------------|-----------|-------|
| Static | 5 | All lists are merged; cross-list dedup applies |
| Dynamic | 1 | Must use a single list with personalization columns |

### Multi-List Strategy

Using multiple lists is useful when you want to:

- Combine different segments (e.g., premium customers + standard customers) into one campaign
- Add supplementary contacts to an existing campaign without re-uploading the original list
- Maintain separate lists for different sources (CRM export, manual list, event registrations)

## Contact List Best Practices

### Before Upload

1. **Validate phone numbers**: Use E.164 format; remove invalid or incomplete numbers
2. **Remove known bad numbers**: Filter out numbers that consistently fail in previous campaigns
3. **Deduplicate your source**: Remove duplicates in your CRM or source system before export
4. **Check for DND**: If you have access to DND lookup, pre-filter to reduce rejected contacts
5. **Verify CSV encoding**: Save as UTF-8 to avoid character encoding issues

### During Campaign

1. **Monitor upload status**: Confirm the upload is complete before creating the campaign
2. **Review duplicate and failure counts**: High duplicate counts may indicate a data quality issue
3. **Start with a test batch**: Upload a small test list (50-100 contacts) first to validate your CSV format

### After Campaign

1. **Export failed contacts**: Download the list of contacts that could not be reached
2. **Update your CRM**: Mark permanently unreachable numbers (disconnected, invalid) in your database
3. **Analyze patterns**: Identify common failure reasons to improve future list quality

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Upload stuck in "processing" | Large file or server load | Wait up to 15 minutes; contact support if it persists beyond 30 minutes |
| High failure_count | Invalid phone number formats | Check for spaces, dashes, or missing country codes |
| All contacts showing as duplicates | Re-uploading the same file | Use a new list name or upload only new contacts |
| Dynamic campaign variables not working | Column headers contain spaces or special characters | Use underscore-separated headers (e.g., `first_name`, not `First Name`) |
| CSV encoding errors | Non-UTF-8 encoding | Re-save your CSV as UTF-8 from your spreadsheet application |

## Next Steps

- [Creating a Voice Campaign](./creating-voice-campaign) -- Use your contact list in a voice campaign
- [Creating an SMS Campaign](./creating-sms-campaign) -- Use contact lists with SMS templates
- [Campaign Reports](./campaign-reporting) -- Analyze per-contact outcomes
- [Campaign Lists API](/docs/campaign-lists/overview) -- Full API reference for list management
