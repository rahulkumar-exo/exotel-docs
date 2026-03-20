/**
 * Vercel Serverless Function: Send newsletter to all subscribers
 *
 * Protected endpoint for sending manual newsletters via AWS SES.
 * Requires Bearer token authentication.
 *
 * Usage:
 *   POST /api/send-newsletter
 *   Authorization: Bearer <NEWSLETTER_ADMIN_KEY>
 *   Body: { "subject": "...", "body": "<p>HTML content</p>" }
 *
 * Environment variables:
 *   NEWSLETTER_ADMIN_KEY      - Bearer token for admin authentication
 *   CMS_GITHUB_TOKEN          - GitHub PAT to read subscriber list
 *   AWS_SES_ACCESS_KEY_ID     - SES credentials
 *   AWS_SES_SECRET_ACCESS_KEY - SES credentials
 *   AWS_SES_REGION            - SES region
 *   AWS_SES_FROM_EMAIL        - Verified sender email
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendBulkEmails } from '../lib/ses';
import { manualNewsletterTemplate } from '../lib/email-templates';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate
  const adminKey = (process.env.NEWSLETTER_ADMIN_KEY || '').trim();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!adminKey || !token || token !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate request body
  const { subject, body } = req.body || {};

  if (!subject || typeof subject !== 'string') {
    return res.status(400).json({ error: 'subject is required' });
  }

  if (!body || typeof body !== 'string') {
    return res.status(400).json({ error: 'body is required (HTML string)' });
  }

  try {
    // Fetch subscribers from GitHub
    const GITHUB_TOKEN = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
    const REPO = (process.env.NEWSLETTER_REPO || DEFAULT_REPO).trim();

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' });
    }

    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    };

    const getUrl = `https://api.github.com/repos/${REPO}/contents/${SUBSCRIBERS_FILE_PATH}`;
    const getRes = await fetch(getUrl, { headers: githubHeaders });

    if (!getRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch subscriber list' });
    }

    const data: GitHubFileResponse = await getRes.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const subscribers: Subscriber[] = JSON.parse(content);

    if (subscribers.length === 0) {
      return res.status(200).json({ sent: 0, failed: 0, message: 'No subscribers to send to' });
    }

    // Build email HTML
    const htmlBody = manualNewsletterTemplate(body);

    // Determine site URL
    const siteUrl = (process.env.SITE_URL || 'https://exotel-docs.vercel.app').replace(/\/$/, '');

    // Send emails
    const result = await sendBulkEmails(
      subscribers.map((s) => ({ email: s.email, unsubscribeToken: s.unsubscribeToken })),
      subject,
      htmlBody,
      siteUrl,
    );

    console.log(`[send-newsletter] sent: ${result.sent}, failed: ${result.failed}`);

    return res.status(200).json({
      sent: result.sent,
      failed: result.failed,
      total: subscribers.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error('[send-newsletter] Unexpected error:', error);
    return res.status(500).json({ error: 'Failed to send newsletter' });
  }
}
