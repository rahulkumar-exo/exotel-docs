---
title: Settings
description: Configure your Exo-Chatbot global behavior including bot identity, NLP thresholds, email alerts, LiveChat, CSAT surveys, and flow termination keywords.
sidebar_label: Settings
---

# Settings

## Overview

The Settings module is the central control panel for configuring your chatbot's global behavior, operational parameters, and core functionalities. While the Workflow module defines what the bot says, the Settings module defines how the bot operates as a whole. It allows you to customize everything from the bot's name and feedback mechanisms to enabling major solutions like LiveChat and Exomind.

This section is divided into four main areas, each managing a different aspect of the bot's configuration:

- **Bot Settings** -- Manage the bot's identity, language settings, and core NLP behavior, such as masking confidential information and setting the confidence threshold for recognizing intents.
- **Email Settings** -- Configure automated email notifications to keep stakeholders informed about the bot's performance, API failures, or other critical events.
- **Solution Settings** -- Acts as a switchboard to enable or disable major, high-level features like the Exomind knowledge base search, LiveChat integration, and the Ticket Management System.
- **Other Settings** -- A collection of miscellaneous but important configurations, including setting up Customer Satisfaction (CSAT) surveys, defining flow termination keywords, and managing profanity filters.

Properly configuring these settings is crucial for ensuring your chatbot is effective, secure, and aligned with your business goals.

## How to Use Settings

This guide provides a step-by-step walkthrough of the key configurations available in each section of the Settings module.

### Navigating to Settings

1. Log in to the Exo-Chatbot console.
2. From the main navigation menu on the left, click on **Settings**. You will be presented with the four sub-sections.

### Configuring Bot Settings

Navigate to **Settings > Bot Settings**.

#### Basic Information

- **Bot Name** -- In the "Bot Name" text field, enter the desired name for your chatbot.
- **Go-Live Date** -- Click on the date field next to "Go-Live Date" and select the appropriate date from the calendar.

#### Enabling Voice Response

- Locate the **Speak out bot response** toggle switch.
- Click the toggle to enable or disable the text-to-speech functionality. When enabled, a mute/unmute icon will appear in the bot interface for the end-user.

#### Advanced NLP Settings

1. Scroll down to the **Advance NLP configurations** section.
2. Enable the **Bot level advanced NLP configurations** toggle. This will reveal the "Threshold" setting.
3. **Threshold** -- This is a score between 0 and 1 that represents the bot's confidence level.
   - Use the slider or input box to set the desired value (e.g., 0.75).
   - A user's query must match an intent with a confidence score higher than this threshold for the bot to trigger a direct response. If the score is lower, the bot will likely provide suggestions or a failure message.
4. Click **Save** at the top of the page to apply all your changes.

:::note
The NLP threshold directly impacts how your bot responds to user queries. A higher threshold means the bot needs to be more confident before giving a direct answer, which reduces false positives but may increase "I don't understand" responses.
:::

### Configuring Solution Settings

Navigate to **Settings > Solution Settings**.

On this page, you will see a list of toggles for the major features:

#### Enable LiveChat Functionality

1. Click the toggle to turn this feature on.
2. Once enabled, additional options appear:
   - **AutoSuggest LiveChat for Complex Queries** -- Set a word limit. If a user's query is longer than this limit, the bot will proactively offer to connect them to an agent.
   - **Suggest/Trigger LiveChat for Profanity words** -- Configure the bot to offer or initiate a live chat session if a user uses profane language.

#### Enable PDF Searcher / Exomind

1. Click the toggle to activate the knowledge base feature.
2. Select **ExoMind (Beta)** from the dropdown model list.

:::tip
For detailed instructions on building the knowledge base, refer to the Exo-Insights documentation.
:::

#### Enable Ticket Management Functionality

- Click the toggle to allow the bot to create support tickets. This functionality needs to be used with the appropriate actions in the Flow Builder to be effective.

### Configuring Email Settings

#### Scheduled Email Reports (Profiles)

1. Enable the **Enable Email Notification** toggle.
2. Click on **Configure Notifications**. This will open the profile management interface.
3. Click **Add Profile** to create a new report configuration or click on an existing profile to edit it.
4. Configure the Profile:
   - **Trigger settings** -- Give the profile a name, select the Email Frequency (e.g., Daily, 7 days), and enter the recipient Email address(es).
   - **Table Parameters** -- Select the data you want to see in the body of the email, such as Message Analytics, Session Analytics, and User Analytics.
   - **Graphic Parameters** -- Enable this to include visual charts and graphs in the email for a quick overview.
   - **Attachment Parameters** -- Choose the detailed reports you want to attach as files. This is ideal for large data sets like Unanswered Queries, CSAT report, or Language Based Report.
5. **Save and Test** -- After saving the profile, you can use the **Send Sample Mail** feature to send a test email and verify its content and formatting.

#### Critical Alerts

The Email Settings page also allows you to configure instant alerts for specific events:

- **For API Failures** -- Enable the **Enable Email for API Failure** toggle and add the email addresses that should be notified immediately when a configured API call fails.
- **For Bot Breaks** -- Enable the **Enable Email for Bot Break** toggle. This will send an alert if the bot fails to provide an expected response. You can configure the time interval and recipient email addresses.

### Configuring Other Settings

Navigate to **Settings > Other Settings**.

#### Customer Satisfaction (CSAT)

1. Locate the **Enable CSAT** toggle and turn it on.
2. Click the **Configure CSAT Form** button.
3. In the configuration panel, choose your preferred **CSAT Scale Rating** (e.g., 4-star or 5-star).
4. Customize the feedback questions and options. You can also configure the bot to ask for a reason if a user provides a low rating.
5. For channels like WhatsApp, you can set a timer to determine when the CSAT survey is sent after an interaction.

#### Managing Flow Termination

- **Flow termination keywords** -- Enter a comma-separated list of words that should immediately end any active flow (e.g., `stop, exit, cancel, bye`).
- **Flow termination bot response** -- Customize the message the bot will display when a flow is ended by one of the keywords (e.g., "Okay, I've cancelled that for you. How else can I help?").
- **Enable Abort Flow** -- This toggle controls the confirmation step:
  - **When enabled** -- If a user tries to start a new topic while in the middle of a flow, the bot will show the "Flow Termination Display Message."
  - **Flow Termination Display Message** -- Customize this confirmation prompt (e.g., "It looks like you're in the middle of something. Are you sure you want to cancel?").
  - **When disabled** -- The bot will immediately switch to the new topic without asking for confirmation.

#### Stop Words Dictionary

- Locate the **Stop Words Dictionary** section.
- In the input field, add common words that you want the NLP engine to disregard when trying to understand a user's intent. This typically includes articles, prepositions, and conjunctions.

## Best Practices

:::tip
- **Start with a Higher NLP Threshold** -- Begin with a threshold of 0.70 or higher and lower it only if you notice the bot frequently failing to match legitimate user queries. This minimizes false positives where the bot triggers an incorrect flow.
- **Set Up Email Alerts Before Going Live** -- Configure at least the API Failure and Bot Break alerts before publishing your bot. These notifications provide a critical early-warning system for catching production issues quickly.
- **Use a Descriptive Bot Name** -- A clear, branded bot name (e.g., "Acme Support Bot") makes the experience more professional and builds trust. Avoid generic names like "Bot" or "Test Bot."
- **Enable Solutions Incrementally** -- Do not turn on all Solution Toggles at once. Start with core features (Workflows, Analytics) and add LiveChat, Exomind, or Ticket Management only when your team is ready to operate them.
- **Define Flow Termination Keywords Early** -- Decide on a consistent set of termination keywords (e.g., `stop, cancel, exit, quit`) before building your flows, so the user always has a clear way to end a conversation.
- **Test Email Reports with "Send Sample Mail"** -- Always use the test feature after creating or updating an email profile to verify that the content, formatting, and recipients are correct.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Setting the Confidence Threshold Too Low** -- A threshold below 0.50 will cause the bot to trigger incorrect flows frequently, leading to a poor user experience. Users will feel the bot does not understand them.
- **Setting the Confidence Threshold Too High** -- A threshold above 0.95 means only near-exact matches will trigger flows. Users who phrase questions slightly differently from your training data will always receive the failure message.
- **Enabling LiveChat Without Agent Setup** -- Turning on the LiveChat toggle without first configuring agent groups, availability schedules, or routing rules means users will be transferred but never connected to anyone, creating a frustrating dead end.
- **Forgetting to Save Changes** -- Settings changes are not auto-saved. Always click the **Save** button after modifications. Navigating away without saving will discard all changes.
- **Not Configuring Email Alerts for Production** -- Running a live bot without email notifications for API failures or bot breaks means you may not learn about critical errors until users complain.
- **Leaving Default Bot Identity** -- Going live with a placeholder bot name or no avatar makes the bot feel unfinished and reduces user trust.
- **Ignoring the Stop Words Dictionary** -- Not configuring stop words can lead to the NLP engine being confused by common filler words, reducing intent matching accuracy.
- **Not Enabling the Abort Flow Confirmation** -- Without the abort flow confirmation, users who accidentally trigger a new intent mid-conversation will lose their progress in the current flow without warning.
:::

## Related

- [Chatbot Platform Overview](./overview.md)
- [Getting Started](./getting-started.md)
- [Integrations](./integrations.md)
- [Analytics](./analytics.md)
- [Actions](./actions.md)
