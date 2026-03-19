/**
 * Email HTML Templates
 *
 * All templates include:
 * - Exotel branding
 * - {{UNSUBSCRIBE_URL}} placeholder (replaced per-recipient by sendBulkEmails)
 * - Inline CSS for email client compatibility
 */

const BRAND_COLOR = '#3366FF';
const BRAND_BG = '#F7F8FA';

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:24px 32px;">
              <h1 style="margin:0;color:#FFFFFF;font-size:20px;font-weight:600;">
                Exotel Developer Docs
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 8px;font-size:12px;color:#6B7280;">
                You received this because you subscribed to Exotel Developer Docs updates.
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;">
                <a href="{{UNSUBSCRIBE_URL}}" style="color:${BRAND_COLOR};text-decoration:underline;">Unsubscribe</a>
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

interface DocChange {
  title: string;
  url: string;
}

/**
 * Template for doc update notifications.
 */
export function docUpdateTemplate(changes: DocChange[], siteUrl: string): string {
  const listItems = changes
    .map(
      (doc) =>
        `<li style="margin-bottom:8px;">
          <a href="${siteUrl}${doc.url}" style="color:${BRAND_COLOR};text-decoration:none;font-weight:500;">${doc.title}</a>
        </li>`,
    )
    .join('\n');

  const content = `
    <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Documentation Updated</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
      The following documentation pages have been added or updated:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
      ${listItems}
    </ul>
    <p style="margin:0;font-size:14px;color:#374151;">
      <a href="${siteUrl}" style="display:inline-block;background-color:${BRAND_COLOR};color:#FFFFFF;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">
        Visit Developer Docs
      </a>
    </p>
  `;

  return baseTemplate(content);
}

/**
 * Template for manual/custom newsletters.
 */
export function manualNewsletterTemplate(bodyHtml: string): string {
  const content = `
    <div style="font-size:14px;color:#374151;line-height:1.6;">
      ${bodyHtml}
    </div>
  `;

  return baseTemplate(content);
}
