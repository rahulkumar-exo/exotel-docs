---
title: Functions
description: Write custom Python logic in the Exo-Chatbot Functions module for advanced data validation, calculations, and business rules within conversation flows.
sidebar_label: Functions
---

# Functions

## Overview

The Functions module is a powerful, pro-code feature within the Exo-Chatbot platform designed for developers and advanced users. It provides an integrated Python code editor, allowing you to write custom logic to handle complex scenarios that cannot be achieved with the standard no-code elements in the Flow Builder.

While the Flow Builder is excellent for visual design and standard operations, Functions are necessary when you need to perform custom data validation, complex mathematical calculations, advanced data manipulation, or implement unique business rules. A function can be called directly from your conversation flow using the **"Function"** action element, enabling a seamless blend of no-code and pro-code capabilities.

Key features of the Functions module include:

- **Integrated Python Editor** -- Write, edit, and manage Python scripts directly within the chatbot console.
- **Flow Builder Integration** -- Call any saved function from the "Actions" category in the Flow Builder, pass in data using variables, and store the output in another variable.
- **Testing and Debugging** -- A built-in tool allows you to run and test your functions with sample inputs before deploying them in a live conversation.
- **Environment Management** -- Compare and manage different versions of your functions across Development, UAT, and Production environments.

In essence, Functions provide the ultimate extensibility, giving you the freedom to build virtually any custom logic your chatbot requires.

## How to Use Functions

This guide covers creating a function in the code editor and then integrating it into a conversational flow.

### Creating a Function

1. From the main console menu, navigate to **Workflow > Functions**.
2. On the left side, you will see a list of existing functions. To create a new one, click the **+ Add Function** button.
3. Give your function a clear and descriptive name (e.g., `calculate_emi`) and save it.
4. The main area will now display the **Function Writer Board**, a code editor pre-populated with a template. Write your Python code within this editor. Your code must return a JSON object (a Python dictionary) with a specific structure.

### Writing the Function Code

- **The Editor** -- Write your Python logic in the main editor window. The system provides pre-imported libraries like `sys` and a `logger`.
- **Input** -- Functions can receive data from the chatbot flow. This data is passed in a variable, which your code can access.
- **Output** -- Your function must return a Python dictionary. A simple success response would look like this:

```python
json_response['status_code'] = '200'
json_response['print'] = 'Hello world!'  # The data you want to use
return json_response
```

- **Testing** -- Use the **Run Function** button to test your code. You can provide sample input data to see how your script behaves and check its output before using it in a flow.

### Using a Function in the Flow Builder

1. In the Flow Builder, add a new step where you want the custom logic to run.
2. Select the **Actions** category and choose the **Function** element.
3. **Select Function** -- From the dropdown menu, choose the function you previously created.
4. **Pass Input (Optional)** -- If your function needs input data, map the flow variables containing that data to the function.
5. **Select Variable to Store Response** -- Choose or create a variable where the output of your function will be saved. This is crucial for using the result in the next steps of the conversation.

## Common Use Cases

- **Complex Calculation** -- A user enters a loan amount, interest rate, and tenure. A Function is called to calculate the monthly EMI, which is then returned and displayed to the user in a text message.
- **Custom Data Validation** -- A user provides a unique internal ID number (e.g., a policy number with a specific checksum). A Function can run a validation algorithm on this number to confirm it is valid before proceeding.
- **API Response Parsing** -- An API returns a large, complex JSON object. A Function is used to parse this object, extract only the three or four key pieces of information needed, and format them into a user-friendly string.
- **Dynamic Content Generation** -- Create a function that takes multiple variables (e.g., user name, account type, last login date) and constructs a highly personalized summary message based on conditional logic within the Python script.

## Best Practices

:::tip
- **Keep Functions Focused** -- Each function should perform a single, well-defined task. This makes them easier to test, debug, and reuse across different flows.
- **Handle Errors Gracefully** -- Use `try...except` blocks in your Python code to catch potential errors (e.g., invalid input, calculation errors). In the `except` block, return a proper failure response so your flow can handle the error path.
- **Test All Scenarios** -- Use the "Run Function" feature to test not just the "happy path" but also edge cases and potential failure scenarios.
- **Comment Your Code** -- Add comments within your Python script to explain your logic. This will be invaluable for you or your colleagues when you need to update the function in the future.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Incorrect Return Format** -- The most common error is forgetting to return a dictionary or using the wrong keys. A function that does not return the expected JSON structure will cause the flow to fail.
- **Not Storing the Function's Output** -- Calling a function in the Flow Builder but failing to configure a "Variable to Store Response". The function runs, but its result is lost and cannot be used in the conversation.
- **Assuming a Variable Exists** -- Writing a function that relies on an input variable that may not have been set yet in that specific conversational path.
- **Timeout Errors** -- Writing a function that performs a very long-running task (e.g., complex loops, slow external calls). Functions should execute quickly to ensure a responsive user experience.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Actions](./actions.md)
- [API](./api.md)
- [Database](./database.md)
