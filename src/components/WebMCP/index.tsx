/**
 * WebMCP Imperative Tools Registration
 *
 * Registers structured tools via navigator.modelContext for AI agents
 * to interact with the Exotel Developer Docs programmatically.
 *
 * Tools registered:
 * 1. search_docs - Search documentation by keyword
 * 2. ask_question - Ask a natural language question about Exotel APIs
 *
 * Requires Chrome 146+ with WebMCP flag enabled.
 * Gracefully no-ops on unsupported browsers.
 *
 * @see https://developer.chrome.com/blog/webmcp-epp
 * @see https://webmachinelearning.github.io/webmcp/
 */

import { useEffect } from 'react';

declare global {
  interface Navigator {
    modelContext?: {
      registerTool: (config: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
        execute: (params: Record<string, unknown>) => Promise<unknown>;
      }) => void;
    };
  }
}

export default function WebMCPTools(): null {
  useEffect(() => {
    // Only register if browser supports WebMCP
    if (!navigator.modelContext?.registerTool) {
      return;
    }

    // Tool 1: Search documentation
    navigator.modelContext.registerTool({
      name: 'search_exotel_docs',
      description:
        'Search Exotel developer documentation for API references, integration guides, SDKs, and how-to articles. Covers Voice API, SMS API, WhatsApp API, ExoVerify, Contact Center, Campaigns, and more.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Search query — e.g. "how to make outbound call", "SMS API rate limits", "WhatsApp template message"',
          },
        },
        required: ['query'],
      },
      execute: async (params: Record<string, unknown>) => {
        const query = params.query as string;

        // Use the existing AI chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query }),
        });

        if (!response.ok) {
          return { error: 'Search failed. Please try again.' };
        }

        const data = await response.json();
        return {
          answer: data.response || data.answer,
          sources: data.sources || [],
        };
      },
    });

    // Tool 2: Get API endpoint details
    navigator.modelContext.registerTool({
      name: 'get_exotel_api_info',
      description:
        'Get detailed information about a specific Exotel API endpoint including request/response format, authentication, parameters, and code examples. Use this when the user needs specific API integration details.',
      parameters: {
        type: 'object',
        properties: {
          api_name: {
            type: 'string',
            description:
              'Name of the API — e.g. "Voice API", "SMS API", "WhatsApp API", "ExoVerify", "Contact Center API"',
          },
          question: {
            type: 'string',
            description:
              'Specific question about the API — e.g. "what are the required parameters for making a call", "how to authenticate"',
          },
        },
        required: ['api_name', 'question'],
      },
      execute: async (params: Record<string, unknown>) => {
        const apiName = params.api_name as string;
        const question = params.question as string;

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `About the Exotel ${apiName}: ${question}`,
          }),
        });

        if (!response.ok) {
          return { error: 'Unable to fetch API information.' };
        }

        const data = await response.json();
        return {
          answer: data.response || data.answer,
          sources: data.sources || [],
        };
      },
    });

    console.log('[WebMCP] Registered 2 tools: search_exotel_docs, get_exotel_api_info');
  }, []);

  return null;
}
