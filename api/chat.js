/**
 * Vercel Serverless Function: AI Chat endpoint
 *
 * Uses Google Gemini (free tier) to answer questions about Exotel documentation.
 * The knowledge base is loaded from the static JSON file built at build time.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Simple text similarity for finding relevant chunks
function getRelevantChunks(query, documents, topK = 8) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  const scored = documents.map(doc => {
    const content = (doc.title + ' ' + doc.content + ' ' + doc.product).toLowerCase();
    let score = 0;

    for (const word of queryWords) {
      // Exact word match
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length * 2;
      }

      // Partial match
      if (content.includes(word)) {
        score += 1;
      }
    }

    // Boost title matches
    const titleLower = doc.title.toLowerCase();
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 5;
      }
    }

    // Boost product name matches
    const productLower = doc.product.toLowerCase();
    for (const word of queryWords) {
      if (productLower.includes(word)) {
        score += 3;
      }
    }

    return { ...doc, score };
  });

  return scored
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, history = [] } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'AI service not configured. Please set GEMINI_API_KEY environment variable.',
      });
    }

    // Fetch knowledge base from the static file
    const siteUrl = process.env.SITE_URL || 'https://exotel-docs.vercel.app';
    let knowledgeBase;
    try {
      const response = await fetch(`${siteUrl}/knowledge-base.json`);
      knowledgeBase = await response.json();
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load knowledge base' });
    }

    // Find relevant chunks
    const relevantChunks = getRelevantChunks(question, knowledgeBase.documents);

    const context = relevantChunks
      .map(chunk => `[${chunk.product} - ${chunk.title}](${chunk.url})\n${chunk.content}`)
      .join('\n\n---\n\n');

    // Build the prompt
    const systemPrompt = `You are an expert AI assistant for Exotel's developer documentation. Exotel is a cloud communication platform that provides Voice, SMS, WhatsApp, ExoVerify (phone verification), and Call Campaign APIs.

Your role:
- Answer developer questions about Exotel's APIs accurately and helpfully
- Always base your answers on the provided documentation context
- Include relevant API endpoints, code examples, and parameter details when applicable
- If the documentation context doesn't contain the answer, say so honestly and suggest which documentation section might help
- Keep responses concise but comprehensive
- Format responses in clean markdown with code blocks where appropriate
- When referencing documentation pages, include the URL path so users can navigate there

IMPORTANT: Only answer questions related to Exotel's APIs and developer documentation. For unrelated questions, politely redirect the user.`;

    const userMessage = context
      ? `Based on the following Exotel documentation:\n\n${context}\n\n---\n\nUser question: ${question}`
      : `The user is asking about Exotel APIs. I couldn't find specific documentation for their question, but answer based on general knowledge of Exotel if possible.\n\nUser question: ${question}`;

    // Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are an Exotel developer docs assistant. ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m ready to help developers with Exotel\'s API documentation. I\'ll provide accurate, concise answers based on the documentation, including code examples and API endpoints where relevant. How can I help you today?' }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const answer = response.text();

    // Extract source URLs from relevant chunks
    const sources = [...new Set(relevantChunks.map(c => ({
      title: c.title,
      url: c.url,
      product: c.product,
    })))].slice(0, 4);

    return res.status(200).json({
      answer,
      sources,
      model: 'gemini-2.0-flash',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      details: error.message,
    });
  }
};
