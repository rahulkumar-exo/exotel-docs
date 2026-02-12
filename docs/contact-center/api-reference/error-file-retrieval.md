---
id: error-file-retrieval
title: Error File Retrieval
sidebar_label: Error File Retrieval
---

# Error File Retrieval

Retrieve error details for failed contact uploads. When a CSV upload has failed records, use this API to download the error file containing details about which records failed and why.

## HTTP Request

```
GET /v2/accounts/<account_sid>/contacts/upload/<upload_id>/errors
```

### Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://ccm-api.exotel.com` |
| Mumbai | `https://ccm-api.in.exotel.com` |

## Request Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <access_token>` or Basic Auth |

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_sid` | String | Your Exotel account SID |
| `upload_id` | String | The upload ID from the upload response |

## Example Request

```bash
curl -X GET \
  'https://ccm-api.exotel.com/v2/accounts/<account_sid>/contacts/upload/upload_abc123/errors' \
  -H 'Authorization: Bearer <access_token>'
```

## Response

```json
{
  "request_id": "req_error_001",
  "method": "GET",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "upload_id": "upload_abc123",
      "error_count": 2,
      "errors": [
        {
          "row_number": 5,
          "phone_number": "invalid_number",
          "error_code": "INVALID_PHONE",
          "error_message": "Phone number is not in valid E.164 format"
        },
        {
          "row_number": 12,
          "phone_number": "+919876543210",
          "error_code": "DUPLICATE_ENTRY",
          "error_message": "Contact with this phone number already exists"
        }
      ],
      "error_file_url": "https://s3-ap-southeast-1.amazonaws.com/.../errors_upload_abc123.csv"
    }
  }
}
```

## Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_PHONE` | Phone number is not in valid E.164 format |
| `DUPLICATE_ENTRY` | Contact already exists (when `duplicate_action=skip`) |
| `MISSING_REQUIRED` | Required field (phone_number) is missing |
| `INVALID_FORMAT` | Field value is in incorrect format |
| `QUOTA_EXCEEDED` | Account contact limit reached |
| `INVALID_EMAIL` | Email address format is invalid |

## Error File CSV Format

The downloadable error CSV file contains:

```csv
row_number,phone_number,first_name,last_name,error_code,error_message
5,invalid_number,Bob,Jones,INVALID_PHONE,"Phone number is not in valid E.164 format"
12,+919876543210,Alice,Brown,DUPLICATE_ENTRY,"Contact with this phone number already exists"
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success — Error details returned |
| `401` | Unauthorized |
| `404` | Not Found — Upload ID doesn't exist |
| `410` | Gone — Error file has expired |
