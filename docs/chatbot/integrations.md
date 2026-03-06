---
title: Integrations
description: Deploy your Exo-Chatbot across Web, WhatsApp, Facebook Messenger, Instagram, Telegram, and other channels with the Integrations module.
sidebar_label: Integrations
---

# Integrations

## Overview

The Integrations module is where you connect your chatbot to the outside world, allowing it to interact with users across a wide variety of digital channels. This feature transforms your bot from a standalone application into an omnichannel communication tool, enabling you to deploy a single, centrally managed bot on your website, mobile app, and popular messaging platforms like WhatsApp, Facebook Messenger, Instagram, and more.

Each channel can be configured independently, allowing you to tailor the bot's appearance, default messages, and initial interactions to suit the specific context and user expectations of that platform. You can customize welcome messages, set up channel-specific languages, and configure UI elements like pop-up behavior and welcome banners for web-based chats.

For third-party platforms, this section is where you provide the necessary credentials, such as API keys, access tokens, and webhook URLs, to authorize the connection and enable communication between the chatbot and the channel.

## Supported Channels

| Channel | Description | Prerequisites |
|---------|-------------|---------------|
| **Web** | Embed a chat widget on any website with extensive customization (themes, logos, auto pop-ups, form assist) | Website with HTML access |
| **WhatsApp** | Engage users on WhatsApp with interactive messages, buttons, lists, and catalogue support | BSP (Business Service Provider) account, verified WhatsApp Business number |
| **Android** | Integrate the chatbot natively into your Android mobile application via SDK | Android project with Gradle |
| **iOS** | Integrate the chatbot natively into your iOS mobile application via SDK | iOS project with CocoaPods or Swift Package Manager |
| **Facebook Messenger** | Deploy the bot to handle customer conversations on your Facebook business page | Facebook Business Page, Developer App |
| **Instagram** | Connect the bot to your Instagram business account for direct messages and story replies | Instagram Business Account linked to Facebook Page |
| **Google Business Messages** | Allow customers to chat with your bot from Google Search and Maps | Google Business Profile, verified business |
| **Telegram** | Deploy the bot on Telegram for secure messaging | Telegram Bot Token from BotFather |
| **Viber** | Provide customer service and engagement on the Viber messaging app | Viber Bot Account |
| **RCS** | Rich Communication Services providing app-like messaging in native Android SMS apps | RCS agent registered with carrier |
| **Microsoft Teams** | Deploy the bot internally for employees within your MS Teams environment | Azure AD App Registration, Teams admin approval |
| **Google Home** | Create a voice-based bot for Google's smart home assistant | Actions on Google project |
| **Alexa** | Develop an Alexa Skill so users can interact with your bot through Amazon's voice assistant | Amazon Developer Account, Alexa Skill |

## How to Set Up Channel Integrations

### Navigating to Integrations

1. Log in to the Exo-Chatbot console.
2. From the main navigation panel on the left, click on **Integrations**.
3. You will see a list of all available channels. Each channel has a card or tile showing its connection status (Connected, Not Connected, or Pending).

### Setting Up the Web Channel

The Web channel is the most common deployment method. It allows you to embed a chat widget on any website by adding a small JavaScript snippet.

#### Step 1: Configure the Widget Appearance

1. Click on the **Web** channel tile.
2. In the configuration panel, customize the following:

| Setting | Description |
|---------|-------------|
| **Widget Title** | The name displayed in the chat header (e.g., "Support Chat") |
| **Widget Color** | The primary accent color for the chat widget |
| **Widget Position** | Where the chat icon appears on the page (bottom-right or bottom-left) |
| **Bot Avatar** | The image displayed next to bot messages |
| **Welcome Message** | The initial message shown when a user opens the chat |
| **Welcome Banner** | An optional promotional image displayed at the top of the chat window |
| **Auto Pop-up** | Configure whether the widget opens automatically after a set delay |
| **Auto Pop-up Delay** | The number of seconds before the widget automatically opens |

#### Step 2: Configure Chat Behavior

| Setting | Description |
|---------|-------------|
| **Persistent Chat** | When enabled, conversation history is preserved across page navigations and browser sessions |
| **Show Typing Indicator** | Display animated dots while the bot is processing a response |
| **Enable Sound Notification** | Play a sound when the bot sends a message |
| **Enable File Upload** | Allow users to upload files (images, documents) within the chat |
| **Language** | Set the default language for the web widget |

#### Step 3: Embed on Your Website

1. Click the **Get Embed Code** button.
2. Copy the generated JavaScript snippet.
3. Paste the snippet into the HTML of your website, ideally just before the closing `</body>` tag.
4. Save and publish your website. The chat widget will now appear on the configured pages.

### Setting Up WhatsApp

WhatsApp integration requires a BSP (Business Service Provider) account and a verified WhatsApp Business number.

1. Click on the **WhatsApp** channel tile in the Integrations section.
2. Select your **BSP Provider** from the dropdown (e.g., Exotel, Gupshup, Twilio).
3. Enter the required credentials:

| Field | Description |
|-------|-------------|
| **API Endpoint** | The base URL provided by your BSP for sending and receiving messages |
| **API Key / Auth Token** | The authentication credential provided by your BSP |
| **WhatsApp Business Number** | The verified phone number registered with your BSP |
| **Webhook URL** | The URL provided by the Exo-Chatbot platform to receive incoming messages (auto-generated) |

4. Copy the **Webhook URL** provided by the platform and paste it into your BSP's webhook configuration.
5. Click **Save and Verify**. The platform will attempt a test connection.
6. Once verified, the status will change to **Connected**.

### Setting Up Facebook Messenger

1. Click on the **Facebook Messenger** channel tile.
2. Click **Connect with Facebook**. You will be redirected to Facebook to authorize the connection.
3. Log in to your Facebook account and select the **Facebook Business Page** you want to connect.
4. Grant the required permissions (manage pages, send and receive messages).
5. After authorization, you will be redirected back to the Exo-Chatbot console.
6. Configure the channel-specific settings:

| Field | Description |
|-------|-------------|
| **Welcome Message** | The greeting text displayed when a user starts a conversation |
| **Get Started Button** | Enable a "Get Started" button that triggers an initial flow |
| **Persistent Menu** | Configure quick-access menu items visible throughout the conversation |

7. Click **Save**. The bot is now live on your Facebook Page.

### Setting Up Instagram

1. Ensure your Instagram account is a **Business Account** linked to a Facebook Page.
2. Click on the **Instagram** channel tile.
3. Click **Connect with Instagram**. You will be redirected to authorize via Facebook.
4. Select the Instagram Business Account to connect.
5. Grant the required permissions for messaging.
6. Configure channel settings such as the **Welcome Message** and **Ice Breakers** (suggested questions shown to new users).
7. Click **Save**.

### Setting Up Telegram

1. Create a Telegram bot by messaging **@BotFather** on Telegram and using the `/newbot` command. BotFather will provide a **Bot Token**.
2. In the Exo-Chatbot console, click on the **Telegram** channel tile.
3. Paste the **Bot Token** into the provided field.
4. Click **Save and Verify**.
5. Once connected, any messages sent to your Telegram bot will be handled by the chatbot.

### Setting Up Microsoft Teams

1. Register an application in **Azure Active Directory** and note the Application ID and Secret.
2. In the Exo-Chatbot console, click on the **Microsoft Teams** channel tile.
3. Enter the required credentials:

| Field | Description |
|-------|-------------|
| **Application ID** | The Azure AD App Registration ID |
| **Application Secret** | The client secret generated in Azure AD |
| **Tenant ID** | Your Azure AD Tenant ID |

4. Click **Save and Verify**.
5. A Teams app manifest will be generated. Download it and upload it to your Microsoft Teams Admin Center for distribution to your organization.

### Setting Up Mobile SDKs (Android / iOS)

For Android and iOS, the integration is done through SDKs that you add to your native mobile application.

1. Click on the **Android** or **iOS** channel tile.
2. Copy the **Bot ID** and **API Key** provided.
3. Follow the platform-specific SDK integration guide:
   - **Android**: Add the SDK dependency to your `build.gradle` file, initialize it in your `Application` class with the Bot ID and API Key, and launch the chat activity.
   - **iOS**: Add the SDK via CocoaPods or Swift Package Manager, initialize it in your `AppDelegate` with the Bot ID and API Key, and present the chat view controller.
4. Build and test your mobile application. The chatbot will be available as an in-app chat.

## Managing Connected Channels

Once a channel is connected, you can manage it from the Integrations page:

- **Edit Configuration** -- Click on a connected channel to modify its settings (welcome messages, appearance, credentials).
- **Disconnect** -- Remove the channel connection. This stops the bot from responding on that channel.
- **Test Connection** -- Re-verify the connection to ensure credentials are still valid.

## Best Practices

:::tip
- **Start with One Channel, Then Expand** -- Deploy and thoroughly test on the Web channel first before rolling out to WhatsApp, Messenger, or other platforms. This lets you identify and fix issues in a controlled environment.
- **Customize Messages Per Channel** -- User expectations differ across platforms. A formal tone may work for Web, while WhatsApp users expect a more conversational style. Customize welcome messages and response styles accordingly.
- **Use Channel Filters in Your Flows** -- Use the Channel Filter logic node in the Flow Builder to deliver channel-specific content. For example, you can send carousels on Web but use list messages on WhatsApp.
- **Keep Webhook URLs Secure** -- The webhook URLs connecting third-party platforms to your bot should be treated as sensitive. Do not share them publicly or commit them to version control.
- **Enable Persistent Chat for Web** -- For most use cases, enabling persistent chat improves the user experience by preserving conversation history across page navigations and return visits.
- **Test on Actual Devices** -- After setting up mobile or messaging channels, always test the end-to-end experience on actual devices, not just the preview within the console.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Deploying to All Channels Simultaneously** -- Launching on every channel at once increases the risk of issues going unnoticed. Deploy incrementally and monitor each channel's performance before adding the next.
- **Using the Same Welcome Message Everywhere** -- A welcome message designed for a website chat widget may not work well on WhatsApp or Telegram. Tailor messages to each channel's conventions and character limits.
- **Forgetting to Configure Webhooks** -- For WhatsApp and other BSP-based channels, forgetting to paste the webhook URL in the BSP's dashboard means incoming messages will never reach your bot.
- **Not Testing After Credential Updates** -- If you rotate API keys or tokens with your BSP, you must update them in the Integrations settings and re-verify the connection. Stale credentials will silently break the channel.
- **Ignoring Channel-Specific Limitations** -- Each platform has its own rules. For example, WhatsApp restricts the use of template messages outside a 24-hour window, and Facebook requires page-level messaging permissions. Not accounting for these constraints leads to delivery failures.
- **Embedding the Web Widget on Every Page** -- For some use cases, having the chat widget on every page (including checkout or payment pages) can be distracting. Use conditional loading to show the widget only where it adds value.
:::

## Related

- [Chatbot Platform Overview](./overview.md)
- [Settings](./settings.md)
- [Workflows](./workflows.md)
- [Analytics](./analytics.md)
- [Logic](./logic.md)
