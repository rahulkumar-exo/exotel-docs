/**
 * Vercel Serverless Function: AI Chat endpoint
 *
 * Uses Google Gemini (free tier) to answer questions about Exotel documentation.
 * The knowledge base is loaded from the static JSON file built at build time.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Search query logging
// ---------------------------------------------------------------------------

const LOG_REPO = 'rahulkumar-exo/exotel-docs';
const LOG_FILE_PATH = 'data/ai-search-logs.json';
const FEEDBACK_FILE_PATH = 'data/ai-chat-feedback.json';
const MAX_QUESTION_LEN = 500; // truncate very long questions
const MAX_COMMENT_LEN = 1000; // truncate very long feedback comments

/**
 * Generic helper: append a JSON object to a JSON-array file in GitHub.
 * Used by both search-query logging and chat feedback logging.
 *
 * @param {string} filePath  GitHub repo path, e.g. 'data/ai-search-logs.json'
 * @param {object} entry     The object to push onto the array
 * @param {string} commitMsg Commit message for the GitHub write
 * @param {string} botName   Committer name (shows up in git log)
 */
async function appendToGitHubFile(filePath, entry, commitMsg, botName) {
  const token = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
  if (!token) return; // No token configured — skip silently

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const url = `https://api.github.com/repos/${LOG_REPO}/contents/${filePath}`;

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
        message: commitMsg,
        content: Buffer.from(JSON.stringify(logs, null, 2) + '\n').toString('base64'),
        committer: { name: botName, email: 'ai-bot@exotel.com' },
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
      console.error(`[${botName}] write error:`, putRes.status, errText);
      return;
    } catch (err) {
      console.error(`[${botName}] attempt`, attempt + 1, 'failed:', err.message);
    }
  }
}

/**
 * Append a search query to data/ai-search-logs.json via the GitHub API.
 */
async function logSearchQuery(entry) {
  const msg = `ai-search-log: ${entry.question.slice(0, 60)}${entry.question.length > 60 ? '...' : ''}`;
  return appendToGitHubFile(LOG_FILE_PATH, entry, msg, 'AI Search Logger');
}

/**
 * Append a chat feedback entry (👍/👎 + optional comment) to
 * data/ai-chat-feedback.json via the GitHub API.
 */
async function logFeedback(entry) {
  const msg = `ai-chat-feedback: ${entry.vote} on "${(entry.question || '').slice(0, 50)}"`;
  return appendToGitHubFile(FEEDBACK_FILE_PATH, entry, msg, 'AI Feedback Logger');
}

// API-developer keywords — when present in query, boost API reference docs
// over end-customer support docs. Devs hitting the AI from the dev portal
// almost always want API/code answers, not general "how does Exotel work" content.
const DEV_INTENT_KEYWORDS = [
  'api', 'endpoint', 'request', 'response', 'curl', 'header', 'param',
  'parameter', 'body', 'json', 'xml', 'auth', 'token', 'sid', 'webhook',
  'callback', 'sdk', 'integration', 'integrate', 'code', 'example',
  'http', 'post', 'get', 'put', 'delete', 'method', 'status code',
  'rate limit', 'webrtc', 'voicebot', 'applet', 'exoml',
];

function isDevIntent(query) {
  const q = query.toLowerCase();
  return DEV_INTENT_KEYWORDS.some((kw) => q.includes(kw));
}

function isApiReferenceDoc(doc) {
  const url = (doc.url || '').toLowerCase();
  return (
    url.includes('/api-reference/') ||
    url.includes('/api/') ||
    url.endsWith('/quickstart') ||
    url.endsWith('/quickstart.mdx')
  );
}

function isEndCustomerSupportDoc(doc) {
  const url = (doc.url || '').toLowerCase();
  // /docs/call-support, /docs/sms-support, /docs/whatsapp-support are written
  // for end-customers (dashboard users), not for API developers
  return (
    url.includes('/call-support/') ||
    url.includes('/sms-support/') ||
    url.includes('/whatsapp-support/') ||
    url.includes('/faqs/')
  );
}

// Simple text similarity for finding relevant chunks
function getRelevantChunks(query, documents, topK = 8) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const devIntent = isDevIntent(query);

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

    // ---- Dev-intent re-ranking ----
    // When the query has dev keywords (api, endpoint, curl, ...), strongly
    // prefer API reference docs and de-emphasise end-customer support docs.
    if (devIntent) {
      if (isApiReferenceDoc(doc)) {
        score += 15; // strong boost for API ref pages
      }
      if (isEndCustomerSupportDoc(doc)) {
        score = Math.max(0, score - 8); // demote support/faq pages
      }
    } else {
      // Even without explicit dev keywords, mildly prefer API ref pages on
      // the dev portal since that's the audience.
      if (isApiReferenceDoc(doc)) {
        score += 4;
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

  // -----------------------------------------------------------------------
  // Kill switch — used to disable AI chat without removing the endpoint.
  // Set CHAT_TEMPORARILY_DISABLED=1 in Vercel env to activate.
  // Does NOT block /api/chat?action=feedback so users can still vote on
  // existing answers in their session history.
  // -----------------------------------------------------------------------
  const isFeedback =
    (req.query && req.query.action === 'feedback') ||
    (req.body && req.body.action === 'feedback');
  if ((process.env.CHAT_TEMPORARILY_DISABLED || '').trim() === '1' && !isFeedback) {
    return res.status(200).json({
      answer:
        'The AI assistant is temporarily unavailable. Please use the **search bar** at the top of the page, which works for keyword-based queries.',
      sources: [],
      model: 'disabled',
      response_id: null,
    });
  }

  // -----------------------------------------------------------------------
  // Feedback action — POST /api/chat?action=feedback
  // Body: { response_id, vote: "up"|"down", comment?, question?, answer_excerpt? }
  // -----------------------------------------------------------------------
  const action = (req.query && req.query.action) || (req.body && req.body.action);
  if (action === 'feedback') {
    const {
      response_id,
      vote,
      comment,
      question: feedbackQuestion,
      answer_excerpt,
    } = req.body || {};

    if (!response_id || typeof response_id !== 'string') {
      return res.status(400).json({ error: 'response_id is required' });
    }
    if (vote !== 'up' && vote !== 'down') {
      return res.status(400).json({ error: 'vote must be "up" or "down"' });
    }

    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      response_id,
      vote,
      question: feedbackQuestion ? String(feedbackQuestion).slice(0, MAX_QUESTION_LEN) : null,
      answer_excerpt: answer_excerpt ? String(answer_excerpt).slice(0, MAX_COMMENT_LEN) : null,
      comment: comment ? String(comment).slice(0, MAX_COMMENT_LEN) : null,
      user_agent: req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 200) : null,
    };

    try {
      await logFeedback(feedbackEntry);
    } catch (e) {
      console.error('[ai-chat-feedback] log failed:', e.message);
    }

    return res.status(200).json({ ok: true, message: 'Thanks for the feedback!' });
  }

  const startTime = Date.now();

  try {
    const { question, history = [] } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // ---------------------------------------------------------------------
    // Input gating — reject junk before hitting Gemini.
    // Saves quota, cleans the search log, and gives users a useful nudge.
    // ---------------------------------------------------------------------
    const trimmed = question.trim();
    const lower = trimmed.toLowerCase();

    // Pure-greeting / placeholder inputs
    const greetings = new Set([
      'hi', 'hii', 'hiii', 'hiiii', 'hiiiii', 'hello', 'hey', 'heyy',
      'yo', 'hola', 'sup', 'test', 'testing', 'ok', 'okay', 'thanks',
      'thank you', 'ty', 'bye', 'goodbye',
    ]);

    // Too short to be a real question
    if (trimmed.length < 5) {
      return res.status(400).json({
        error: 'Please ask a more detailed question',
        hint: 'Try: "How do I make an outbound call?" or "How to send WhatsApp templates?"',
        gated: 'too_short',
      });
    }

    // Greeting / placeholder
    if (greetings.has(lower)) {
      return res.status(200).json({
        answer: "Hi! I'm the Exotel docs assistant. Ask me anything about Voice, SMS, WhatsApp, Voicebot, Contact Center, or any other Exotel API. For example: \"How do I make an outbound call?\" or \"How to send WhatsApp template messages?\"",
        sources: [],
        model: 'gated',
        gated: 'greeting',
      });
    }

    // Gibberish detection — letters with no vowels are very unlikely to be English
    // (heuristic: words 5+ chars with zero vowels = junk like "hjhfdjhgkj")
    const longWords = lower.match(/\b[a-z]{5,}\b/g) || [];
    const realWords = longWords.filter((w) => /[aeiou]/i.test(w));
    if (longWords.length > 0 && realWords.length === 0) {
      return res.status(400).json({
        error: 'I couldn\'t parse your question — please rephrase it',
        hint: 'Try a clear, specific question like "How do I integrate WebRTC?" or "Status callback parameters"',
        gated: 'gibberish',
      });
    }

    // Excessive repeated chars (e.g. "asdfasdfasdfasdfasdf")
    if (/(.)\1{6,}/.test(trimmed) || /(.{3,})\1{3,}/.test(trimmed)) {
      return res.status(400).json({
        error: 'I couldn\'t parse your question — please rephrase it',
        gated: 'repeated_chars',
      });
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

PRICING AND SUPPORT REQUESTS: For the following two types of questions, respond with exactly this message — "This looks like something our team can help you with directly. Please write to **hello@exotel.com** with your question and one of our team members will get back to you shortly."

1. PRICING questions — any question asking about cost, price, rates, plans, billing amounts, pulse rates, or plan comparisons. Examples: "what is the pricing?", "how much does it cost?", "what is the pulse rate for outbound calls?", "which plan should I buy?", "what is the charge for number masking?", "pricing for starter vs growth plan".

2. HUMAN SUPPORT requests — user is explicitly asking for a person to help them, or has an account-specific issue that docs cannot solve. Examples: "can you assign someone to help me?", "please complete my KYC", "I need someone from Exotel to call me", "my account is suspended".

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

    // Generate a unique response_id so the frontend can later submit
    // 👍/👎 feedback that maps back to this exact answer.
    const response_id = crypto.randomUUID();

    // Build log entry — log BEFORE returning so the write completes reliably.
    // Adds ~300-500ms to the request but ensures no queries are dropped.
    const logEntry = {
      timestamp: new Date().toISOString(),
      response_id,
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
      response_id,
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
