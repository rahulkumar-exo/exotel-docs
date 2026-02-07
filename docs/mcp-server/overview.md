---
id: overview
title: MCP Server
sidebar_label: Overview
slug: /mcp-server/overview
---

# Exotel MCP Server

The Exotel MCP (Model Context Protocol) Server enables Claude AI integration with Exotel's communication APIs for SMS and voice services.

## Key Features

- **SMS Services** — Single, bulk, and dynamic messaging with DLT compliance
- **Voice Calling** — Initiate calls, connect numbers, and integrate call flows
- **Status Tracking** — Real-time delivery and callback management
- **Audio Tools** — Playback, download, and web player access
- **Secure Authentication** — Token-based system

## Prerequisites

- Claude Desktop App (latest version)
- Node.js and npm installed
- Active Exotel account with API credentials
- MCP Remote package: `npm install -g mcp-remote`

## Setup

### 1. Install MCP Remote

```bash
npm install -g mcp-remote
```

### 2. Configure Claude Desktop

Navigate to **Claude Settings → Developer → Edit Config** and add your Exotel configuration:

**Required credentials:**
- Base64-encoded API token (`API Key:Secret` format)
- Registered phone number
- DLT template and entity IDs
- Caller ID
- Account SID and subdomain
- Dashboard base URL

### 3. Create Base64 Token

Combine your API Key and Secret as `key:secret`, then encode:

```bash
echo -n "your_api_key:your_api_secret" | base64
```

Or use an online tool like [base64encode.org](https://base64encode.org).

## Available Services

### SMS
- Send individual messages
- Bulk messaging
- Personalized bulk sends

### Voice
- Initiate calls
- Connect two numbers
- Integrate with IVR flows

### Status & Tracking
- Delivery status checks
- Call history
- Number information

### Audio Tools
- Play audio recordings
- Access web player
- Download audio files

## Usage Examples

```
"Send SMS to +919999999999 saying 'Hello'"
"Call +919999999999"
"Connect +919999999999 with +919888888888"
"Check SMS delivery status"
```
