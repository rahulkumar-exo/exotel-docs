/**
 * Vercel Serverless Function: AI Chat endpoint
 *
 * Uses Google Gemini (free tier) to answer questions about Exotel documentation.
 * The knowledge base is loaded from the static JSON file built at build time.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ---------------------------------------------------------------------------
// Search query logging
// ---------------------------------------------------------------------------

const LOG_REPO = 'rahulkumar-exo/exotel-docs';
const LOG_FILE_PATH = 'data/ai-search-logs.json';
const MAX_QUESTION_LEN = 500; // truncate very long questions

/**
 * Append a search query to data/ai-search-logs.json via the GitHub API.
 * Fire-and-forget: caller should NOT await this to avoid adding latency
 * to the chat response.
 */
async function logSearchQuery(entry) {
  const token = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
  if (!token) return; // No token configured — skip silently

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const url = `https://api.github.com/repos/${LOG_REPO}/contents/${LOG_FILE_PATH}`;

  // Retry up to 2 times to handle SHA conflicts from concurrent writes
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Read current file
      let logs = [];
      let sha;
      const getRes = await fetch(url, { headers });
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
        try {
          logs = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
        } catch {
          logs = [];
        }
      }
      // Append the new entry
      logs.push(entry);

      // Write back
      const putBody = {
        message: `ai-search-log: ${entry.question.slice(0, 60)}${entry.question.length > 60 ? '...' : ''}`,
        content: Buffer.from(JSON.stringify(logs, null, 2) + '\n').toString('base64'),
        committer: { name: 'AI Search Logger', email: 'ai-bot@exotel.com' },
        ...(sha ? { sha } : {}),
      };

      const putRes = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(putBody),
      });

      if (putRes.ok) return; // success
      if (putRes.status === 409 || putRes.status === 422) continue; // SHA conflict, retry
      const errText = await putRes.text();
      console.error('[ai-search-log] write error:', putRes.status, errText);
      return;
    } catch (err) {
      console.error('[ai-search-log] attempt', attempt + 1, 'failed:', err.message);
    }
  }
}

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

  const startTime = Date.now();

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

    // Call Gemini — try multiple models with fallback
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    let answer = null;
    let usedModel = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: 'You are an Exotel developer docs assistant. ' + systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood! I\'m ready to help developers with Exotel\'s API documentation. I\'ll provide accurate, concise answers based on the documentation, including code examples and API endpoints where relevant. How can I help you today?' }] },
            ...chatHistory,
          ],
        });

        const result = await chat.sendMessage(userMessage);
        answer = result.response.text();
        usedModel = modelName;
        break; // Success — stop trying
      } catch (modelError) {
        console.error(`Model ${modelName} failed:`, modelError.message);
        // If it's a rate limit error, try next model
        if (modelError.message && (modelError.message.includes('429') || modelError.message.includes('quota'))) {
          continue;
        }
        // For non-rate-limit errors, throw immediately
        throw modelError;
      }
    }

    if (!answer) {
      return res.status(429).json({
        error: 'AI service is temporarily busy. Please try again in a minute.',
      });
    }

    // Extract source URLs from relevant chunks
    const sources = [...new Set(relevantChunks.map(c => ({
      title: c.title,
      url: c.url,
      product: c.product,
    })))].slice(0, 4);

    // Build log entry — log BEFORE returning so the write completes reliably.
    // Adds ~300-500ms to the request but ensures no queries are dropped.
    const logEntry = {
      timestamp: new Date().toISOString(),
      question: question.slice(0, MAX_QUESTION_LEN),
      question_length: question.length,
      has_history: Array.isArray(history) && history.length > 0,
      history_length: Array.isArray(history) ? history.length : 0,
      model_used: usedModel,
      response_time_ms: Date.now() - startTime,
      relevant_chunks_found: relevantChunks.length,
      source_pages: sources.map((s) => ({ title: s.title, product: s.product, url: s.url })),
      answer_length: answer ? answer.length : 0,
    };

    // Log (errors don't fail the user response)
    try {
      await logSearchQuery(logEntry);
    } catch (e) {
      console.error('[ai-search-log] log failed:', e.message);
    }

    return res.status(200).json({
      answer,
      sources,
      model: usedModel,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Log failed queries too so we can see what's breaking
    if (req.body && req.body.question) {
      const failEntry = {
        timestamp: new Date().toISOString(),
        question: String(req.body.question).slice(0, MAX_QUESTION_LEN),
        question_length: String(req.body.question).length,
        response_time_ms: Date.now() - startTime,
        error: error.message || 'unknown',
        failed: true,
      };
      try {
        await logSearchQuery(failEntry);
      } catch {}
    }

    return res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      details: error.message,
    });
  }
};
