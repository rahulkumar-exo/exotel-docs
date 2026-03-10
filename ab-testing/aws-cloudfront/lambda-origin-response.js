/**
 * Exotel Docs A/B Testing — AWS Lambda@Edge (Origin Response)
 *
 * This is the COMPANION function to lambda-at-edge.js (Viewer Request).
 * It runs AFTER the origin responds, and sets the sticky session cookie.
 *
 * WHY: Lambda@Edge Viewer Request can modify request headers and route
 * to different origins, but it CANNOT set response cookies. So we use
 * this Origin Response trigger to read the custom header set by the
 * Viewer Request function and translate it into a Set-Cookie header.
 *
 * DEPLOYMENT:
 * - Region: us-east-1
 * - Runtime: Node.js 20.x
 * - Trigger: CloudFront Origin Response
 * - Memory: 128 MB
 * - Timeout: 30 seconds
 */

'use strict';

const COOKIE_MAX_AGE = 2592000;  // 30 days

exports.handler = async (event) => {
  const response = event.Records[0].cf.response;
  const request = event.Records[0].cf.request;

  // Check if the Viewer Request function flagged that we need to set a cookie
  const setCookieHeader = request.headers['x-ab-set-cookie'];
  if (setCookieHeader && setCookieHeader.length > 0) {
    const cookieValue = setCookieHeader[0].value;

    // Add Set-Cookie header to the response
    const cookieString = `${cookieValue}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure; HttpOnly`;

    if (!response.headers['set-cookie']) {
      response.headers['set-cookie'] = [];
    }
    response.headers['set-cookie'].push({
      key: 'Set-Cookie',
      value: cookieString,
    });
  }

  // Pass through the variant debug headers
  const variantHeader = request.headers['x-docs-variant'];
  if (variantHeader) {
    response.headers['x-docs-variant'] = variantHeader;
  }

  const splitHeader = request.headers['x-docs-split'];
  if (splitHeader) {
    response.headers['x-docs-split'] = [{
      key: 'X-Docs-Split',
      value: `${splitHeader[0].value}%`,
    }];
  }

  return response;
};
