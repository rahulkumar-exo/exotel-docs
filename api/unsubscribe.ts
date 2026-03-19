/**
 * Vercel Serverless Function: Newsletter unsubscribe endpoint
 *
 * Handles one-click unsubscribe via GET request with token parameter.
 * Removes the subscriber from data/newsletter-subscribers.json via GitHub API.
 *
 * Usage: GET /api/unsubscribe?token=<uuid>
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

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

function htmlResponse(res: VercelResponse, statusCode: number, title: string, message: string) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(statusCode).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #F7F8FA; }
    .card { background: white; padding: 48px; border-radius: 12px; text-align: center; max-width: 480px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h1 { color: #111827; font-size: 24px; margin: 0 0 16px; }
    p { color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.query.token as string;

  if (!token) {
    return htmlResponse(res, 400, 'Invalid Link', 'This unsubscribe link is missing a required parameter.');
  }

  try {
    const GITHUB_TOKEN = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
    const REPO = (process.env.NEWSLETTER_REPO || DEFAULT_REPO).trim();

    if (!GITHUB_TOKEN) {
      console.error('[unsubscribe] No GitHub token configured');
      return htmlResponse(res, 500, 'Error', 'Unable to process your request. Please try again later.');
    }

    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    const getUrl = `https://api.github.com/repos/${REPO}/contents/${SUBSCRIBERS_FILE_PATH}`;

    // Fetch current subscribers
    const getRes = await fetch(getUrl, { headers: githubHeaders });

    if (!getRes.ok) {
      console.error('[unsubscribe] Failed to fetch subscribers:', getRes.status);
      return htmlResponse(res, 500, 'Error', 'Unable to process your request. Please try again later.');
    }

    const data: GitHubFileResponse = await getRes.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const subscribers: Subscriber[] = JSON.parse(content);

    // Find subscriber by token
    const subscriberIndex = subscribers.findIndex((s) => s.unsubscribeToken === token);

    if (subscriberIndex === -1) {
      return htmlResponse(
        res,
        200,
        'Already Unsubscribed',
        'This unsubscribe link is no longer valid, or you have already been unsubscribed.',
      );
    }

    const removedEmail = subscribers[subscriberIndex].email;

    // Remove subscriber
    subscribers.splice(subscriberIndex, 1);

    // Write back to GitHub
    const putBody = {
      message: `newsletter: unsubscribe ${removedEmail}`,
      content: Buffer.from(JSON.stringify(subscribers, null, 2) + '\n').toString('base64'),
      sha: data.sha,
      committer: {
        name: 'Newsletter Bot',
        email: 'newsletter-bot@exotel.com',
      },
    };

    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: githubHeaders,
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errBody = await putRes.text();
      console.error('[unsubscribe] GitHub write error:', putRes.status, errBody);
      return htmlResponse(res, 500, 'Error', 'Unable to process your request. Please try again later.');
    }

    console.log(`[unsubscribe] removed: ${removedEmail} (remaining: ${subscribers.length})`);

    return htmlResponse(
      res,
      200,
      'Unsubscribed',
      'You have been successfully unsubscribed from Exotel Developer Docs updates. You will no longer receive emails from us.',
    );
  } catch (error) {
    console.error('[unsubscribe] Unexpected error:', error);
    return htmlResponse(res, 500, 'Error', 'Something went wrong. Please try again later.');
  }
}
