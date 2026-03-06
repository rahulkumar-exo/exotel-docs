---
id: media-messages
title: WhatsApp Media Messages
description: "Send media messages on WhatsApp via Exotel -- images, videos, documents, audio files, and stickers with format and size guidelines."
sidebar_label: Media Messages
sidebar_position: 10
---

# WhatsApp Media Messages

Media messages allow you to share images, videos, documents, audio files, and stickers with customers on WhatsApp. This guide covers supported formats, size limits, and how to send media via the Exotel API.

## Supported Media Types

| Media Type | Supported Formats | Max Size | Notes |
|-----------|-------------------|----------|-------|
| **Image** | JPEG, PNG | 5 MB | Displayed inline with optional caption |
| **Video** | MP4, 3GPP | 16 MB | Only H.264 video codec and AAC audio codec |
| **Audio** | AAC, MP3, AMR, OGG (Opus) | 16 MB | Displayed as a playable audio message |
| **Document** | PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT | 100 MB | Shown as a downloadable file |
| **Sticker** | WebP | 100 KB (static), 500 KB (animated) | Must be 512x512 pixels |

:::tip
For the best customer experience, keep images under 1 MB and videos under 5 MB. Large files take longer to download on mobile networks and may not load on slow connections.
:::

## Sending Media via API

### Image Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "image",
      "image": {
        "link": "https://example.com/images/product-photo.jpg",
        "caption": "Check out our latest product! Available now at a 20% discount."
      }
    }
  }'
```

### Video Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "video",
      "video": {
        "link": "https://example.com/videos/how-to-guide.mp4",
        "caption": "Watch this quick tutorial on how to set up your new device."
      }
    }
  }'
```

### Document Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "document",
      "document": {
        "link": "https://example.com/docs/invoice-INV001.pdf",
        "caption": "Your invoice for order #ORD-12345",
        "filename": "Invoice-INV001.pdf"
      }
    }
  }'
```

### Audio Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "audio",
      "audio": {
        "link": "https://example.com/audio/welcome-message.mp3"
      }
    }
  }'
```

### Sticker Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "sticker",
      "sticker": {
        "link": "https://example.com/stickers/thumbs-up.webp"
      }
    }
  }'
```

## Media in Template Messages

Template messages can include media in the header component:

| Header Type | Supported Formats | Max Size |
|------------|-------------------|----------|
| Image | JPEG, PNG | 5 MB |
| Video | MP4 | 16 MB |
| Document | PDF | 100 MB |

### Template with Image Header

```json
{
  "type": "template",
  "template": {
    "name": "product_promotion",
    "language": { "code": "en", "policy": "deterministic" },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "image",
            "image": {
              "link": "https://example.com/images/sale-banner.jpg"
            }
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Rahul" },
          { "type": "text", "text": "50%" }
        ]
      }
    ]
  }
}
```

## Media URL Requirements

| Requirement | Details |
|-------------|---------|
| Protocol | HTTPS required |
| Accessibility | URL must be publicly accessible (no authentication) |
| Content-Type | Server must return correct MIME type headers |
| Availability | URL must be available at the time of sending |
| Redirect | Single redirect allowed; multiple redirects may fail |
| Expiry | URL should remain valid for at least 30 days |

:::warning
Media URLs must be publicly accessible without authentication. If your media is behind a CDN with access tokens, ensure the token does not expire before the message is delivered. WhatsApp caches media for a limited time.
:::

## Receiving Media from Customers

When a customer sends media to your WhatsApp Business number, the webhook payload includes a media object:

### Inbound Image

```json
{
  "from": "+919876543210",
  "type": "image",
  "image": {
    "id": "media_id_123",
    "mime_type": "image/jpeg",
    "sha256": "abc123...",
    "caption": "Here is the damaged product"
  }
}
```

### Downloading Inbound Media

Use the media ID to download the file via the [Media API](/docs/whatsapp-api/api-reference/media):

```bash
curl "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/media/<media_id>" \
  -o downloaded-image.jpg
```

## Media Message Use Cases

| Use Case | Media Type | Example |
|----------|-----------|---------|
| Product showcase | Image | Product photos with descriptions |
| Invoices and receipts | Document (PDF) | Invoice after purchase |
| Tutorials | Video | How-to setup guides |
| Order confirmation | Image | Order summary as an image |
| Audio support | Audio | Voice instructions or greetings |
| Brand engagement | Sticker | Custom branded stickers |
| Customer support | Document | User manuals, FAQs |

## Image Guidelines

For the best visual experience:

| Property | Recommendation |
|----------|---------------|
| Format | JPEG for photos, PNG for graphics with text |
| Resolution | 800x800 to 1200x1200 pixels |
| Aspect ratio | 1:1 (square) or 4:3 for optimal display |
| File size | Under 1 MB for fast loading |
| Caption length | Under 200 characters for readability |

## Best Practices

1. **Optimize file sizes** -- Compress images and videos before sending. Large files cause slow downloads on mobile networks.
2. **Use descriptive captions** -- Always add a caption to images, videos, and documents for context.
3. **Set meaningful filenames** -- For documents, use descriptive filenames (e.g., `Invoice-INV001.pdf`, not `doc123.pdf`).
4. **Host on reliable CDN** -- Use a CDN for media hosting to ensure fast, reliable delivery worldwide.
5. **Verify media URLs** -- Test that media URLs are accessible before sending. Broken links result in failed messages.
6. **Consider mobile viewing** -- Design images and documents for mobile screens (small screens, portrait orientation).
7. **Use the right format** -- PDF for documents, JPEG for photos, MP4 for video, and PNG for graphics with text or transparency.

## Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `MEDIA_DOWNLOAD_FAILED` | URL not accessible or returns an error | Verify the URL is publicly accessible and returns correct headers |
| `MEDIA_TYPE_NOT_SUPPORTED` | File format not allowed | Use a supported format (JPEG/PNG for images, MP4 for video, etc.) |
| `MEDIA_SIZE_EXCEEDED` | File exceeds size limit | Compress the file or use a smaller version |
| `INVALID_MEDIA_URL` | URL format is incorrect or uses HTTP | Use a valid HTTPS URL |
| `MEDIA_PROCESSING_ERROR` | File is corrupted or cannot be processed | Re-encode the file and try again |

## Next Steps

- [Message Types](/docs/whatsapp-support/message-types) -- All available message types
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Buttons and list menus
- [Template Messages](/docs/whatsapp-support/template-messages) -- Templates with media headers
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
