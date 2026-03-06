---
title: API
description: Connect your Exo-Chatbot to external REST APIs. Configure endpoints, test API calls, and integrate real-time data into conversation flows.
sidebar_label: API
---

# API

## Overview

The API (Application Programming Interface) integration feature is a powerful component of the Exo-Chatbot platform that allows your chatbot to connect with and exchange data with external systems, services, and applications. It acts as a bridge, enabling the bot to go beyond its pre-defined knowledge to fetch real-time information, trigger actions in other software, and deliver dynamic, personalized user experiences.

This module is designed to handle REST APIs, supporting standard HTTP methods such as GET, POST, PUT, DELETE, and PATCH. From a central API Library, you can add, configure, and test all your API endpoints without writing extensive code. Once an API is saved in the library, it can be easily inserted into any conversation flow using the "API" action element in the Flow Builder.

Key capabilities of the API module include:

- **Central API Library** -- A repository to save and manage all your API configurations for easy reuse across multiple flows.
- **Support for REST Methods** -- Configure calls to fetch data (GET), submit data (POST), update records (PUT/PATCH), and more.
- **Comprehensive Configuration** -- Set up every part of the API call, including the endpoint URL, headers, query parameters, request body, and authentication details.
- **In-Console Testing** -- A built-in testing tool allows you to run an API call and see the live response directly within the console before implementing it in a flow.
- **Flow Builder Integration** -- Seamlessly call any saved API from within a conversation, pass dynamic data to it using variables, and save the response for use in subsequent steps.

## How to Use API

This guide covers how to add and test an API in the library and then how to use it within the Flow Builder.

### Adding and Configuring an API

1. From the main console menu, navigate to **Workflow > APIs**.
2. Click the **Add** button to create a new API or **Import** to upload a collection (e.g., a Postman JSON file).
3. **Basic Configuration:**
   - Give your API a descriptive name (e.g., `Get_Order_Status`).
   - Select the appropriate **HTTP Method** from the dropdown (e.g., POST).
   - Enter the full **Endpoint URL** for the API.

4. **Detailed Configuration** (using the tabs):

| Tab | Description |
|-----|-------------|
| **Query** | Add any required query parameters (key-value pairs) appended to the URL |
| **Authorization** | Configure the authentication method (e.g., select "Bearer Token" and paste your API key) |
| **Header** | Add necessary request headers, such as `Content-Type` with a value of `application/json` |
| **Body** | For methods like POST or PUT, define the request payload. You can use variables to insert dynamic data |
| **Settings** | Configure advanced options like request timeout or retry-on-failure logic |

5. **Test the API** -- Once configured, click the **Send** button. The Response window at the bottom will display the status code and the data returned by the API, allowing you to verify that it is working correctly before you use it in a flow.

### Using an API in the Flow Builder

1. In the Flow Builder, add a new step to your flow and select the **Actions** category.
2. Choose the **API** element.
3. **Select API** -- From the dropdown, choose the API you previously saved in the library.
4. **Map Variables** -- If the API requires dynamic inputs (like a user ID in the URL or data in the body), map the flow variables containing the user's input to the corresponding API parameters.
5. **Store the Response** -- Select or create a new variable to store the data returned by the API. This is crucial for using the results.
6. **Handle Success and Failure** -- The API node will have two output connectors:
   - Connect the **Success** path to the next node that should be triggered if the API call is successful. You can use the variable containing the API response in this path.
   - Connect the **Failure** path to a different node that handles the error, for example, by showing the user a message like, "Sorry, I couldn't retrieve your details right now."

## Common Use Cases

- **Real-Time Order Tracking** -- A user provides their order number. The bot sends this number to an e-commerce platform's API via a GET request and displays the real-time shipping status returned in the API response.
- **Creating a Support Ticket** -- A bot collects the user's issue details in a form. It then uses a POST API to send this data to a helpdesk system (like Zendesk or Jira), automatically creating a new support ticket.
- **User Verification** -- A user enters their member ID. The bot sends the ID to an internal database API to verify if the user is a valid customer before proceeding with a sensitive transaction.
- **Dynamic Product Search** -- A user asks for "running shoes under $100." The bot calls a product catalog API with "running shoes" and "100" as parameters and displays the results in a carousel.

## Best Practices

:::tip
- **Test Extensively** -- Use the Send button in the API module to test with both valid and invalid data to see how the API responds to different scenarios.
- **Always Handle the Failure Path** -- Network issues and server errors happen. Always build out the "Failure" branch in your flow to provide a good user experience when an API call does not work.
- **Use Variables for Everything** -- Never hardcode sensitive information like user IDs or search queries directly in the API configuration. Always pass them dynamically using variables collected during the conversation.
- **Parse the Response** -- The entire API response (often a complex JSON object) is stored in one variable. Use the Modify Data action or a custom Function to extract the specific pieces of information you need (e.g., just the `status` field from the JSON).
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Incorrect Authentication** -- Forgetting to add an authorization header or using an expired API key is a common reason for API calls failing with a 401 Unauthorized error.
- **Wrong HTTP Method** -- Using a GET request when the external service expects a POST request (or vice-versa).
- **Improperly Formatted Body** -- Forgetting to set the `Content-Type` header to `application/json` or sending a malformed JSON body in a POST request.
- **Not Storing the Response** -- The API might work perfectly, but if you forget to save its output to a variable, the data is lost, and you cannot use it in the conversation.
- **Ignoring the API's Data Structure** -- Trying to access `response.data` when the actual data is located in `response.result.items`. Always check the response structure in the testing tool first.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Actions](./actions.md)
- [Database](./database.md)
- [Functions](./functions.md)
- [Integrations](./integrations.md)
