/**
 * Vercel Serverless Function: Newsletter subscription endpoint
 *
 * Accepts POST requests with { email } body to subscribe users to the newsletter.
 * Persists subscribers by committing to data/newsletter-subscribers.json in the
 * GitHub repository via the GitHub API (using the same CMS_GITHUB_TOKEN used
 * for the Decap CMS integration).
 *
 * Environment variables:
 *   CMS_GITHUB_TOKEN  - GitHub PAT with repo scope (shared with CMS auth)
 *   GITHUB_TOKEN      - Fallback token name
 *   NEWSLETTER_REPO   - Optional: override repo (default: rahulkumar-exo/exotel-docs)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_REPO = 'rahulkumar-exo/exotel-docs';
const SUBSCRIBERS_FILE_PATH = 'data/newsletter-subscribers.json';

interface Subscriber {
  email: string;
  subscribedAt: string;
  unsubscribeToken?: string;
}

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const { email } = req.body || {};

  // Validate email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  try {
    const GITHUB_TOKEN = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
    const REPO = (process.env.NEWSLETTER_REPO || DEFAULT_REPO).trim();

    if (!GITHUB_TOKEN) {
      // Fallback: log the subscription and return success
      // This allows the endpoint to work during development or before token is configured
      console.log(`[newsletter] subscription (no token configured): ${normalizedEmail} at ${new Date().toISOString()}`);
      return res.status(200).json({
        success: true,
        message: 'Thank you for subscribing! You will receive updates at ' + normalizedEmail,
      });
    }

    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // Fetch current subscribers file from GitHub
    let subscribers: Subscriber[] = [];
    let fileSha: string | undefined;

    const getUrl = `https://api.github.com/repos/${REPO}/contents/${SUBSCRIBERS_FILE_PATH}`;

    try {
      const getRes = await fetch(getUrl, { headers: githubHeaders });

      if (getRes.ok) {
        const data: GitHubFileResponse = await getRes.json();
        fileSha = data.sha;
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        subscribers = JSON.parse(content);
      }
      // If 404, the file does not exist yet -- we will create it
    } catch (parseError) {
      // If parsing fails, start with an empty list
      console.error('[newsletter] Failed to parse existing subscribers file:', parseError);
      subscribers = [];
    }

    // Check for duplicate subscription
    if (subscribers.some((s) => s.email === normalizedEmail)) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed! We will keep sending updates to ' + normalizedEmail,
      });
    }

    // Add the new subscriber with unsubscribe token
    subscribers.push({
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: crypto.randomUUID(),
    });

    // Write the updated list back to GitHub
    const putBody: Record<string, unknown> = {
      message: `newsletter: add subscriber ${normalizedEmail}`,
      content: Buffer.from(JSON.stringify(subscribers, null, 2) + '\n').toString('base64'),
      committer: {
        name: 'Newsletter Bot',
        email: 'newsletter-bot@exotel.com',
      },
    };

    if (fileSha) {
      putBody.sha = fileSha;
    }

    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: githubHeaders,
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errBody = await putRes.text();
      console.error('[newsletter] GitHub API write error:', putRes.status, errBody);

      // Still return success to the user -- the subscription was received
      // but persistence failed. Log it so it can be recovered.
      console.log(`[newsletter] subscription (GitHub write failed): ${normalizedEmail} at ${new Date().toISOString()}`);
      return res.status(200).json({
        success: true,
        message: 'Thank you for subscribing!',
      });
    }

    console.log(`[newsletter] new subscriber: ${normalizedEmail} (total: ${subscribers.length})`);

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! You will receive updates at ' + normalizedEmail,
      subscriberCount: subscribers.length,
    });
  } catch (error) {
    console.error('[newsletter] Unexpected error:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
}
