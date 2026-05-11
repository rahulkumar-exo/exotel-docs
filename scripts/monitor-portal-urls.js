#!/usr/bin/env node
/**
 * Portal URL uptime monitor.
 *
 * Probes a curated list of "must-work" URLs on developer.exotel.com.
 * For each URL, sends N fresh requests (no cookie, cache-busted) so we
 * sample across the CloudFront 85/15 origin split.
 *
 * Two outputs:
 *   1. data/uptime-monitor.json  — append-only log of (timestamp, summary)
 *      so the daily QA report and trend graphs can use it.
 *   2. stdout summary, plus exit code 1 if any URL had >40% failure in the
 *      probe — useful for CI/cron alerting.
 *
 * Usage:
 *   node scripts/monitor-portal-urls.js              # run with defaults (5 probes per URL)
 *   node scripts/monitor-portal-urls.js --probes 10  # bump probe count
 *   node scripts/monitor-portal-urls.js --quiet      # suppress per-URL output
 *
 * Why this exists: while CloudFront still routes ~15% of traffic to the
 * legacy Apache/WordPress origin, URLs that exist only on the new Vercel
 * portal will randomly 404 for users. This script surfaces which URLs
 * are affected so we can either (a) chase the infra cutover, or
 * (b) add origin-pinning redirects.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────

// "Must-work" URLs. Add new product launches here so they get monitored
// from day one. Keep this list short and surgical — every URL costs N
// requests per run.
const URLS_TO_MONITOR = [
  // Homepage & critical surfaces
  { url: '/', label: 'Homepage' },
  { url: '/admin/', label: 'CMS admin' },

  // Top-of-navbar product overviews (one per main product)
  { url: '/docs/getting-started/overview', label: 'Getting Started' },
  { url: '/docs/voice-v1/overview', label: 'Voice v1 overview' },
  { url: '/docs/voice-v3/overview', label: 'Voice v3 overview' },
  { url: '/docs/sms-api/overview', label: 'SMS overview' },
  { url: '/docs/whatsapp-api/overview', label: 'WhatsApp overview' },
  { url: '/docs/exoverify-api/overview', label: 'ExoVerify overview' },
  { url: '/docs/exophones/overview', label: 'ExoPhones overview' },
  { url: '/docs/voicebot-tools/voicebot-api', label: 'Voicebot API' },
  { url: '/docs/contact-center/overview', label: 'Contact Center v6 overview' },

  // Recently-shipped or new products that are most at-risk during the
  // CloudFront migration window (legacy WP doesn't have these).
  { url: '/docs/cqa/overview', label: 'CQA overview' },
  { url: '/docs/voice-v1/api-reference/balance', label: 'Balance API' },
  { url: '/docs/contact-center/api-reference/get-all-processes', label: 'CC v6 Get Processes' },
  { url: '/docs/contact-center/api-reference/assign-users-to-lead', label: 'CC v6 Assign Users to Lead' },
  { url: '/docs/rcs-omnichannel/api-reference/send-message', label: 'RCS Send Message' },
  { url: '/docs/gen-ai/api-reference/exomind-tasker', label: 'Exomind Tasker' },

  // API endpoints
  { url: '/api/chat', label: 'AI chat endpoint', method: 'POST', body: { question: 'health check probe' }, expectedStatus: 200 },
];

const PROBES_PER_URL = 5;
const FAILURE_THRESHOLD_PCT = 40; // a URL is "broken" if >40% of probes fail
const REPO_ROOT = path.resolve(__dirname, '..');
// Log lives OUTSIDE the repo so 30-min runs don't pollute git history.
// The daily QA report reads from here when summarising uptime.
const LOG_DIR = path.join(require('os').homedir(), '.claude', 'data');
const LOG_PATH = path.join(LOG_DIR, 'exotel-uptime-monitor.json');

// Two hosts to probe:
//   1. developer.exotel.com — public CloudFront entry point (production traffic path)
//   2. exotel-docs-tau.vercel.app — direct Vercel alias for the new Exotel-team project
// Probing both lets us distinguish CloudFront-routing failures from Vercel project
// failures. If exotel-docs-tau is failing but developer.exotel.com is fine, the issue
// is with the Vercel project. If developer.exotel.com fails but exotel-docs-tau works,
// it's CloudFront / Apache routing.
const HOSTS = ['developer.exotel.com', 'exotel-docs-tau.vercel.app'];
const HOST = HOSTS[0]; // primary — used in legacy single-host paths below

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const probesArg = args.indexOf('--probes');
const probesPerUrl = probesArg >= 0 ? parseInt(args[probesArg + 1], 10) : PROBES_PER_URL;

// ─────────────────────────────────────────────────────────────────────────
// HTTP probe
// ─────────────────────────────────────────────────────────────────────────

function probeOnce(urlPath, method = 'GET', body = null, hostname = HOST) {
  return new Promise((resolve) => {
    const cb = `cb=${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    const sep = urlPath.includes('?') ? '&' : '?';
    const fullPath = urlPath + sep + cb;

    const start = Date.now();
    const opts = {
      hostname,
      port: 443,
      path: fullPath,
      method,
      headers: {
        // No Cookie header so each request gets a fresh CloudFront bucket
        Cookie: '',
        'User-Agent': 'exotel-docs-uptime-monitor/1.0',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      timeout: 10000,
    };

    const req = https.request(opts, (res) => {
      // Drain the response (we only need status + headers)
      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          server: res.headers.server || '?',
          ms: Date.now() - start,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, server: 'error', ms: Date.now() - start, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, server: 'timeout', ms: Date.now() - start, error: 'timeout' });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────

(async () => {
  const startTimestamp = new Date().toISOString();
  const results = [];
  let anyBroken = false;

  for (const target of URLS_TO_MONITOR) {
    const expectedStatus = target.expectedStatus || 200;
    const probes = [];
    // Probe both hosts (CloudFront entry + direct Vercel alias) so we can
    // distinguish where failures live. Half the probes go to each host.
    const half = Math.max(1, Math.floor(probesPerUrl / 2));
    for (let i = 0; i < half; i++) {
      probes.push(await probeOnce(target.url, target.method || 'GET', target.body, HOSTS[0]));
    }
    for (let i = 0; i < probesPerUrl - half; i++) {
      probes.push(await probeOnce(target.url, target.method || 'GET', target.body, HOSTS[1]));
    }

    const successes = probes.filter((p) => p.status === expectedStatus).length;
    const failures = probesPerUrl - successes;
    const failurePct = (failures / probesPerUrl) * 100;
    const apacheCount = probes.filter((p) => /apache/i.test(p.server)).length;
    const vercelCount = probes.filter((p) => /vercel/i.test(p.server)).length;
    const broken = failurePct > FAILURE_THRESHOLD_PCT;

    if (broken) anyBroken = true;

    const summary = {
      label: target.label,
      url: target.url,
      probes: probesPerUrl,
      successes,
      failures,
      failure_pct: Math.round(failurePct * 10) / 10,
      apache_hits: apacheCount,
      vercel_hits: vercelCount,
      avg_ms: Math.round(probes.reduce((s, p) => s + p.ms, 0) / probesPerUrl),
      broken,
      // Failed probe details (status + server) for debugging
      failed_probes: probes
        .filter((p) => p.status !== expectedStatus)
        .map((p) => ({ status: p.status, server: p.server, error: p.error })),
    };

    results.push(summary);

    if (!quiet) {
      const icon = broken ? '🔴' : failures > 0 ? '🟡' : '🟢';
      console.log(
        `${icon} ${target.label.padEnd(30)} ${successes}/${probesPerUrl} ok ` +
          `(${apacheCount} Apache, ${vercelCount} Vercel, ${summary.avg_ms}ms avg)` +
          (broken ? '  ⚠️ BROKEN' : '')
      );
    }
  }

  // Write to log (append)
  const logEntry = {
    timestamp: startTimestamp,
    duration_ms: Date.now() - new Date(startTimestamp).getTime(),
    probes_per_url: probesPerUrl,
    total_urls: URLS_TO_MONITOR.length,
    broken_count: results.filter((r) => r.broken).length,
    results,
  };

  // Ensure log directory exists
  fs.mkdirSync(LOG_DIR, { recursive: true });

  let existing = [];
  if (fs.existsSync(LOG_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
    } catch {
      existing = [];
    }
  }
  // Keep only last 1000 entries (~3 weeks at one run per 30 min) to bound file size
  existing.push(logEntry);
  if (existing.length > 1000) existing = existing.slice(-1000);
  fs.writeFileSync(LOG_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf-8');

  console.log('');
  console.log(`Run complete — ${logEntry.broken_count}/${URLS_TO_MONITOR.length} URLs broken at >${FAILURE_THRESHOLD_PCT}% failure rate.`);
  console.log(`Log: ${LOG_PATH}`);

  // Exit code 1 if anything is broken — useful for CI/cron alerting
  process.exit(anyBroken ? 1 : 0);
})();
