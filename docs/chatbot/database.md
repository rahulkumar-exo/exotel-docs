---
title: Database
description: Create and manage persistent data tables in the Exo-Chatbot platform to store, search, update, and export user data collected during conversations.
sidebar_label: Database
---

# Database

## Overview

The Database is an integrated feature within the Exo-Chatbot platform that allows you to create, manage, and utilize custom tables to store and retrieve persistent information. It acts as the chatbot's memory, enabling you to save data collected from users during a conversation and use it in subsequent interactions or for offline analysis.

This feature is essential for building dynamic, data-driven conversational flows. Instead of losing information once a conversation ends, you can store it in a structured way. The Database is directly accessible from the Flow Builder through the "Database" action element, allowing you to perform common database operations like inserting, updating, searching for, and deleting records as part of a user journey.

Key capabilities of the Database module include:

- **Custom Table Creation** -- Define your own tables with custom columns and data types (e.g., String, Integer, Boolean).
- **Manual and Bulk Data Entry** -- Add records one by one through the console or upload data in bulk using a CSV file.
- **Flow Builder Integration** -- Seamlessly connect your conversation flows to your tables to read and write data in real-time.
- **Data Management** -- Search, edit, delete, and export table data directly from the user-friendly console interface.

## How to Use Database

This guide details how to create and manage tables within the Database module and how to connect them to your conversation flows.

### Creating a Database Table

1. From the main console menu, navigate to **Workflow > Database**.
2. If no tables exist, click the **+ Add Table** button. This will open the "Add Table" configuration panel.
3. Define the Table Structure:
   - **Table Name** -- Enter a name for your table (e.g., `customer_leads`). Use lowercase letters and underscores instead of spaces.
   - **Field Name** -- Enter the name for your first column (e.g., `user_name`).
   - **Field Type** -- Select the appropriate data type from the dropdown (e.g., String, Integer, Date).
   - **Searchable** -- Check this box if you want to be able to search the contents of this column from the database interface.
4. Click **Add Another Field** to add more columns as needed.
5. Click **Create Table** once all columns are defined.

:::tip Alternative: Import from CSV
You can also create a table by clicking **Import CSV**, which allows you to upload a CSV file. The system will create a table with columns matching the headers in your file.
:::

### Managing Table Data

Once a table is created, you can manage its content directly.

1. Navigate to **Workflow > Database** and select the table you wish to view from the list on the left.
2. **Add a Record** -- Click the **+ Add New Records** button to manually add a new row to the table.
3. **Edit/Delete a Record** -- In the table view, use the pencil (Edit) or trashcan (Delete) icons in the Actions column for each row.
4. **Search** -- Use the Search bar to find records. This only works for columns that were marked as "Searchable" during creation.
5. **Export** -- Click the Export sheet icon to download the entire table's contents as a CSV file.

### Using the Database in the Flow Builder

1. In the Flow Builder, add a new step and select the **Actions** category.
2. Choose the **Database** element.
3. **Select Table** -- From the dropdown, choose the table you want to interact with.
4. **Select Action** -- Choose the operation you want to perform:

| Action | Description |
|--------|-------------|
| **Insert Entry** | Add a new row. Map the table columns to the variables where you stored the user's input. |
| **Update Entry** | Modify an existing row (requires a search condition). |
| **Search Entry** | Look up a record based on column values. |
| **Delete Entry** | Remove a row from the table. |

For example, for an Insert Entry action, you would map the `user_name` column to the `{name_variable}`.

## Common Use Cases

- **Lead Generation** -- A flow asks a user for their name, email, and phone number using Prompts. An Insert Entry action then saves this information into a `leads` table.
- **Saving User Preferences** -- A user specifies their communication preference (e.g., "Email"). This choice is saved to a `user_profiles` table and can be retrieved in future conversations.
- **Checking Application Status** -- A flow asks a user for their application ID. A Search Entry action looks up that ID in a pre-populated `applications` table and returns the status to the user.
- **Product Information Lookup** -- Create a table with product details (name, price, features). A bot can search this table to answer specific user questions about a product.

## Best Practices

:::tip
- **Plan Your Schema** -- Before creating a table, plan the columns and their data types. Mismatched data types (e.g., trying to save text in an Integer column) will cause errors.
- **Use Descriptive Names** -- Use clear and logical names for your tables and columns (e.g., `user_email` instead of `ue`). This makes them easier to manage in the Flow Builder.
- **Make Necessary Fields Searchable** -- Only enable the "Searchable" option for columns you will genuinely need to search frequently, like `user_id` or `email`, to maintain good performance.
- **Use Variables** -- Always store user input in variables first, and then use those variables to perform database actions. This keeps your logic clean and easy to debug.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Incorrect Naming** -- Using a table or column name in the Flow Builder that does not exactly match the name in the Database will result in an error. Names are case-sensitive.
- **Forgetting to Create the Table First** -- Trying to use the Database action in a flow before the table has been created in the Database module will fail.
- **Data Type Mismatch** -- Attempting to insert a value of the wrong type into a column (e.g., saving the text "five" into a column defined as an Integer).
- **Assuming All Columns are Searchable** -- Trying to search a column that was not marked as "Searchable" during creation will yield no results.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Actions](./actions.md)
- [API](./api.md)
- [Functions](./functions.md)
