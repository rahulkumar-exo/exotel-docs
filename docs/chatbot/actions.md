---
title: Actions
description: Use Action elements in the Exo-Chatbot Flow Builder to call APIs, query databases, transfer to live chat, execute sub-flows, and manipulate data.
sidebar_label: Actions
---

# Actions

## Overview

Actions are a powerful category of elements in the Flow Builder that serve as the "engine" of your chatbot's logic. Unlike Bot Messages or Prompts, which are user-facing, Actions work behind the scenes to perform operations, manipulate data, control the conversation's path, and integrate with external systems. They are the crucial link between the conversational interface and your business processes.

Think of Actions as the verbs of your chatbot; they are responsible for doing things. Whether you need to fetch a user's order details from your e-commerce platform, save new lead information to a database, or hand off a complex query to a human agent, you will use an Action element.

The available Action types include:

| Category | Action Types |
|----------|-------------|
| **Flow Control** | Execute Flow, Switch Flow, Delay |
| **External Integrations** | API, Transfer to Live Chat |
| **Data Management** | Database, Function, Variables, Modify Data |

## How to Use Actions

Actions are added as elements inside a node on the Flow Builder canvas.

### Adding an Action

1. On the Flow Builder canvas, click the **+** icon on a node or the **Add More** button inside a node.
2. From the element menu, select the **Actions** category.
3. Choose the specific Action you want to perform (e.g., API, Database).

### Configuration Details for Each Action Type

#### Execute Flow and Switch Flow

These actions control the user's navigation between different flows.

- **Execute Flow** -- Temporarily runs another flow (a "sub-flow") and then returns to the next step in the original flow once the sub-flow is complete. This is useful for reusable tasks like collecting an address.
- **Switch Flow** -- Permanently redirects the user to a different flow, ending the current one.
- **Configuration** -- For both, simply select the target flow from the dropdown list of all flows in your bot.

:::note
**Execute Flow** returns to the original flow after completion, while **Switch Flow** permanently ends the current flow. Choose carefully based on your use case.
:::

#### API

This action calls an external API that you have pre-configured in the [API module](./api.md).

- **Select API** -- Choose the desired API call from the dropdown list.
- **Map Variables** -- If the API requires input (e.g., a user ID), map the flow variables containing that data to the API's expected input fields.
- **Store Response** -- Select a variable where the API's response data will be stored.
- **Connect Paths** -- The API element creates two output connectors: **Success** and **Failure**. You must connect both to subsequent nodes to handle both possible outcomes.

#### Database

This action allows you to interact with a table you have created in the [Database module](./database.md).

- **Select Table** -- Choose the target database table from the dropdown.
- **Select Action** -- Choose the operation to perform: **Insert Entry**, **Update Entry**, **Search Entry**, or **Delete Entry**.
- **Map Columns** -- Map your flow variables to the corresponding columns in the table. For example, for an Insert Entry action, you would map the `{user_email}` variable to the "Email" column.

#### Transfer to Live Chat

This action initiates a handoff to a human agent.

- **Enter Message Text** -- Configure the message the user will see while they wait to be connected (e.g., "Please wait while I connect you to an agent.").
- **Map User Details** -- Select the variables that hold the user's name, phone number, and email. This information will be passed to the live chat system to give the agent context.

#### Delay

This action pauses the conversation for a set period, which can make the bot feel more natural.

- **Enter Delay** -- Specify the duration as a number.
- **Select Units** -- Choose whether the duration is in Second(s), Minute(s), or Hour(s).

#### Function, Variables, and Modify Data

These actions are for advanced data handling within the flow.

- **Function** -- Execute a custom Python script (pre-configured in the [Functions module](./functions.md)) to perform complex logic.
- **Variables** -- Explicitly set or change the value of a variable.
- **Modify Data** -- Apply built-in data transformations to a variable (e.g., convert text to uppercase, perform calculations).

## Common Use Cases

- **Checking an Order Status (API)** -- A user provides their order number, which is stored in a variable. An API action sends this variable to your logistics system and stores the response (e.g., "In Transit") in another variable, which is then displayed to the user.
- **Saving a Sales Lead (Database)** -- After a user fills out a contact form, an Insert Entry Database action saves their name, email, and query into a "leads" table.
- **Handling Escalations (Transfer to Live Chat)** -- If an API call to resolve a user's issue fails, the Failure path can lead directly to a Transfer to Live Chat action to connect them with a human agent.
- **Modular User Authentication (Execute Flow)** -- Create a single, reusable flow for user login. From other flows (like "Check Account Balance" or "Update Profile"), use Execute Flow to run the login flow. Once the user is authenticated, the conversation returns to the original flow.

## Best Practices

:::tip
- **Handle Every Outcome** -- Always connect the Success and Failure paths for actions like API and Database. A user should never be left at a dead end if an integration fails.
- **Use Execute Flow for Reusability** -- Identify common tasks (like asking for an email or authenticating a user) and build them as separate, small flows. Call them with Execute Flow to keep your main flows clean and easy to manage.
- **Provide Feedback to the User** -- Before a potentially slow action like an API call, use a Text message to inform the user (e.g., "Let me check that for you...").
- **Keep Sensitive Data Out of Variables** -- Avoid storing highly sensitive information like passwords or full credit card numbers in variables for extended periods. Process and discard them as quickly as possible.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Confusing Execute Flow and Switch Flow** -- Using Switch Flow when you intend to return to the original flow is a common error that prematurely ends the user's journey. Use Execute Flow for temporary tasks.
- **Not Storing API Responses** -- Calling an API but forgetting to configure a variable to store the response means you cannot use the data you just fetched.
- **Incorrect Variable Mapping** -- Sending the wrong variable or incorrectly formatted data to an API or Database action will cause it to fail. Double-check your mappings.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [API](./api.md)
- [Database](./database.md)
- [Functions](./functions.md)
- [Bot Messages](./bot-messages.md)
- [Bot Prompts](./bot-prompts.md)
