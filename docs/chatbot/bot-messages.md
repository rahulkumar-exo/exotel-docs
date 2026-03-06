---
title: Bot Messages
description: Configure text, image, video, carousel, and other message types in the Exo-Chatbot Flow Builder for rich one-way communication with users.
sidebar_label: Bot Messages
---

# Bot Messages

## Overview

Bot Messages are a fundamental category of elements within the Flow Builder used for one-way communication from the chatbot to the user. Their primary purpose is to present information, provide responses, and display rich media to guide and engage users throughout a conversation. Unlike "Prompts," which are designed to collect user input, Bot Messages are purely for output.

These elements are essential for crafting a user-friendly and interactive experience. You can use them to send a simple greeting, display a product image, share a detailed brochure, or present a scrollable list of options.

The available Bot Message types are:

| Type | Purpose |
|------|---------|
| **Text** | Standard text-based communication |
| **Image** | Displaying static images |
| **File** | Sharing downloadable documents |
| **Audio** | Playing sound clips |
| **Table** | Presenting data in a structured grid |
| **Video** | Sharing video content |
| **Carousel** | Showcasing a series of interactive, scrollable cards |

By combining these elements, you can build rich, dynamic, and visually appealing bot responses that go far beyond simple text.

## How to Use Bot Messages

Bot Messages are added as elements inside a node on the Flow Builder canvas.

### Adding a Bot Message

1. On the Flow Builder canvas, either click the **+** icon on an existing node or the **Add More** button inside a node to add to the current step.
2. From the element menu, select the **Bot Messages** category.
3. Choose the specific type of message you want to send (e.g., Text, Image, Carousel).

### Configuration Details for Each Message Type

#### Text

- **Enter Message Text** -- Type your message in the text box. You can use the formatting toolbar for bold, italics, and headers.
- **Variables** -- Insert dynamic data (e.g., a user's name) by using curly braces `{}` to select a saved variable.
- **Recommendations** -- Add quick reply buttons that appear below the text message to suggest the user's next step.

#### Image

- **Upload** -- Drag and drop an image or click **Choose File(s)** to upload from your computer.
- **URL** -- Alternatively, paste a publicly accessible image URL.
- **Constraints** -- Maximum file size is 10 MB. Supported formats: jpg, jpeg, png, gif.

#### File

- **Upload/URL** -- Upload a document or provide a public link.
- **Constraints** -- Maximum file size is 50 MB. Supported formats: pdf, docx.

#### Audio

- **Upload/URL** -- Upload an audio file or provide a public link.
- **Constraints** -- Maximum file size is 50 MB. Primary supported format: mp3.

#### Table

- **Configuration** -- Click within the cells to enter values. Use the floating **+** icons that appear on hover to add new rows or columns.
- **Constraints** -- A maximum of 4 columns is allowed.

#### Video

- **Upload/URL** -- Upload a video file or provide a public link.
- **Constraints** -- Maximum file size is 50 MB. Supported formats: mp4, mov, avi, mpeg, webm, mkv.

#### Carousel

The carousel is a powerful element for displaying a list of items. It consists of multiple cards that the user can scroll through horizontally.

- **Card Setup** -- For each card, you can upload an image or file (pdf, docx, jpg, etc., up to 50 MB).
- **Enter Title & Description** -- Add a title and descriptive text for each card.
- **Add Quick Action** -- Each card can have up to two buttons. Configure each button to either:
  - **Open Link** -- Redirect the user to an external URL.
  - **Trigger Flow** -- Start a different conversation flow when the button is clicked.

## Common Use Cases

- **Product Showcase (Carousel)** -- Display a catalog of products, where each card shows a product image, its name, and a "View Details" button that triggers a specific flow for that item.
- **Sending a Ticket (File)** -- After a user books an event, send them a confirmation message with their ticket attached as a downloadable PDF file.
- **Displaying Business Hours (Table)** -- Use a table to clearly show opening and closing times for each day of the week.
- **Video Tutorial (Video)** -- When a user asks "How do I set up my account?", respond with a short, helpful video tutorial.
- **Personalized Welcome (Text)** -- Greet a returning user with, "Welcome back, \{user_name\}!" by pulling their name from a variable.

## Best Practices

:::tip
- **Use Rich Media to Enhance Experience** -- Do not rely solely on text. Use images, carousels, and videos to make the conversation more engaging and to convey information more effectively.
- **Keep Text Concise** -- Break down large blocks of information into multiple, smaller text messages to avoid overwhelming the user.
- **Provide Context for Media** -- When you send an image, file, or video, always accompany it with a text message that explains what it is and why the user is receiving it.
- **Optimize for Mobile** -- Ensure images and videos are of a reasonable file size to load quickly on mobile devices.
- **Check Your Links** -- Double-check that all URLs provided for images, videos, and files are public and not broken.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Broken Media Links** -- Using internal or private URLs for images or files will result in them not displaying for the user. Always use publicly accessible links.
- **Overly Long Carousels** -- A carousel with 15-20 cards can be frustrating to scroll through. If you have many items, consider categorizing them and using multiple, smaller carousels or a different approach.
- **Missing a Call to Action** -- Sending a carousel of products without any buttons for the user to click ("Quick Actions") is a missed opportunity. Always guide the user on what to do next.
- **Ignoring Channel Limitations** -- A rich, interactive element like a Carousel will look great on the web or Facebook Messenger but will not render on a simpler channel like SMS. Use the Channel Filter logic element to design fallback experiences for different channels.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Bot Prompts](./bot-prompts.md)
- [Actions](./actions.md)
- [Logic](./logic.md)
