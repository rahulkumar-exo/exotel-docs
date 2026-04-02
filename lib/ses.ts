/**
 * AWS SES Email Utility
 *
 * Shared module for sending emails via AWS SES.
 * Used by:
 *   - api/send-newsletter.ts (manual newsletters)
 *   - scripts/send-doc-update-emails.js (auto-notifications)
 *
 * Environment variables:
 *   AWS_SES_ACCESS_KEY_ID     - IAM access key with ses:SendEmail permission
 *   AWS_SES_SECRET_ACCESS_KEY - IAM secret key
 *   AWS_SES_REGION            - SES region (default: ap-south-1)
 *   AWS_SES_FROM_EMAIL        - Verified sender (e.g. developer@exotel.com)
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const UNSUBSCRIBE_PLACEHOLDER = '{{UNSUBSCRIBE_URL}}';

let _client: SESClient | null = null;

function getClient(): SESClient {
  if (!_client) {
    _client = new SESClient({
      region: process.env.AWS_SES_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return _client;
}

function getFromEmail(): string {
  return process.env.AWS_SES_FROM_EMAIL || 'noreply@exotel.com';
}

/**
 * Send a single email via SES.
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<void> {
  const client = getClient();

  const command = new SendEmailCommand({
    Source: getFromEmail(),
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: htmlBody, Charset: 'UTF-8' },
      },
    },
  });

  await client.send(command);
}

interface BulkRecipient {
  email: string;
  unsubscribeToken?: string;
}

interface BulkSendResult {
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

/**
 * Send an email to multiple recipients, injecting per-recipient unsubscribe links.
 *
 * The htmlBody should contain {{UNSUBSCRIBE_URL}} which gets replaced with
 * the recipient-specific unsubscribe link.
 *
 * Sends sequentially with a small delay to respect SES rate limits.
 */
export async function sendBulkEmails(
  recipients: BulkRecipient[],
  subject: string,
  htmlBody: string,
  siteUrl: string = 'https://exotel-docs.vercel.app',
): Promise<BulkSendResult> {
  const result: BulkSendResult = { sent: 0, failed: 0, errors: [] };

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];

    // Build per-recipient unsubscribe URL
    const unsubscribeUrl = recipient.unsubscribeToken
      ? `${siteUrl}/api/unsubscribe?token=${recipient.unsubscribeToken}`
      : `${siteUrl}`;

    // Replace placeholder with actual unsubscribe link
    const personalizedHtml = htmlBody.replace(
      new RegExp(UNSUBSCRIBE_PLACEHOLDER.replace(/[{}]/g, '\\$&'), 'g'),
      unsubscribeUrl,
    );

    try {
      await sendEmail(recipient.email, subject, personalizedHtml);
      result.sent++;
      console.log(`[ses] sent to ${recipient.email} (${i + 1}/${recipients.length})`);
    } catch (err: unknown) {
      result.failed++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      result.errors.push({ email: recipient.email, error: errorMessage });
      console.error(`[ses] failed for ${recipient.email}:`, errorMessage);
    }

    // Small delay between sends to respect SES rate limits (14/sec default)
    if (i < recipients.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return result;
}
