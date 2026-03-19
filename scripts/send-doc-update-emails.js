/**
 * Script: Send doc update notification emails via AWS SES
 *
 * Used by GitHub Actions workflow (.github/workflows/newsletter-notify.yml)
 * when documentation files are updated.
 *
 * Reads changed doc file paths from CHANGED_FILES env var,
 * extracts titles from frontmatter, and sends notification emails
 * to all subscribers in data/newsletter-subscribers.json.
 *
 * Environment variables:
 *   CHANGED_FILES             - Newline-separated list of changed doc paths
 *   AWS_SES_ACCESS_KEY_ID     - SES credentials
 *   AWS_SES_SECRET_ACCESS_KEY - SES credentials
 *   AWS_SES_REGION            - SES region
 *   AWS_SES_FROM_EMAIL        - Verified sender email
 *   SITE_URL                  - Site URL (default: https://exotel-docs.vercel.app)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://exotel-docs.vercel.app';
const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || 'developer@exotel.com';
const BRAND_COLOR = '#3366FF';

// Initialize SES client
const ses = new SESClient({
  region: process.env.AWS_SES_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Extract title from markdown frontmatter.
 * Falls back to filename if no title found.
 */
function extractTitle(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) return titleMatch[1];

      const sidebarMatch = frontmatterMatch[1].match(/^sidebar_label:\s*["']?(.+?)["']?\s*$/m);
      if (sidebarMatch) return sidebarMatch[1];
    }

    // Fallback: use filename
    return path.basename(filePath, path.extname(filePath))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return path.basename(filePath, path.extname(filePath));
  }
}

/**
 * Convert doc file path to URL path.
 * e.g., docs/voice-v1/overview.md → /docs/voice-v1/overview
 */
function docPathToUrl(filePath) {
  return '/' + filePath.replace(/\.mdx?$/, '').replace(/\/index$/, '');
}

/**
 * Build HTML email for doc updates.
 */
function buildEmailHtml(changes, unsubscribeUrl) {
  const listItems = changes
    .map(
      (doc) =>
        `<li style="margin-bottom:8px;">
          <a href="${SITE_URL}${doc.url}" style="color:${BRAND_COLOR};text-decoration:none;font-weight:500;">${doc.title}</a>
        </li>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F7F8FA;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F8FA;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:24px 32px;">
              <h1 style="margin:0;color:#FFFFFF;font-size:20px;font-weight:600;">Exotel Developer Docs</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Documentation Updated</h2>
              <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
                The following documentation pages have been added or updated:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
                ${listItems}
              </ul>
              <p style="margin:0;font-size:14px;color:#374151;">
                <a href="${SITE_URL}" style="display:inline-block;background-color:${BRAND_COLOR};color:#FFFFFF;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">
                  Visit Developer Docs
                </a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 8px;font-size:12px;color:#6B7280;">
                You received this because you subscribed to Exotel Developer Docs updates.
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;">
                <a href="${unsubscribeUrl}" style="color:${BRAND_COLOR};text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail(to, subject, html) {
  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } },
    },
  });
  await ses.send(command);
}

async function main() {
  const changedFiles = (process.env.CHANGED_FILES || '').trim();

  if (!changedFiles) {
    console.log('[notify] No changed files. Skipping.');
    process.exit(0);
  }

  const files = changedFiles.split('\n').filter(Boolean);
  console.log(`[notify] ${files.length} doc file(s) changed`);

  // Extract titles and URLs
  const changes = files.map((file) => ({
    title: extractTitle(file),
    url: docPathToUrl(file),
  }));

  console.log('[notify] Changes:', changes.map((c) => c.title).join(', '));

  // Read subscribers
  const subscribersPath = path.resolve('data/newsletter-subscribers.json');
  if (!fs.existsSync(subscribersPath)) {
    console.log('[notify] No subscribers file found. Skipping.');
    process.exit(0);
  }

  const subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf-8'));

  if (subscribers.length === 0) {
    console.log('[notify] No subscribers. Skipping.');
    process.exit(0);
  }

  console.log(`[notify] Sending to ${subscribers.length} subscriber(s)`);

  const subject = `Exotel Docs Updated: ${changes.map((c) => c.title).slice(0, 3).join(', ')}`;
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const unsubscribeUrl = subscriber.unsubscribeToken
      ? `${SITE_URL}/api/unsubscribe?token=${subscriber.unsubscribeToken}`
      : SITE_URL;

    const html = buildEmailHtml(changes, unsubscribeUrl);

    try {
      await sendEmail(subscriber.email, subject, html);
      sent++;
      console.log(`[notify] Sent to ${subscriber.email}`);
    } catch (err) {
      failed++;
      console.error(`[notify] Failed for ${subscriber.email}:`, err.message);
    }

    // Small delay between sends
    if (subscribers.indexOf(subscriber) < subscribers.length - 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log(`[notify] Done. Sent: ${sent}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error('[notify] Fatal error:', err);
  process.exit(1);
});
