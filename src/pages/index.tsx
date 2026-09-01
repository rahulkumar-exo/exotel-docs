import {type FormEvent, type ReactNode, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import WebMCPTools from '@site/src/components/WebMCP';
import {openAskAi} from '@site/src/components/AiChat';

import styles from './index.module.css';

const REGISTER_URL = 'https://my.exotel.com/auth/register';

type HeroSample = {
  id: string;
  label: string;
  method: 'POST';
  href: string;
  code: string;
};

const products = [
  {
    title: 'Voicebot API',
    description: 'Build AI voicebots with natural language, manage versions, and pull conversation transcripts & insights.',
    link: '/docs/voicebot-tools/voicebot-api',
  },
  {
    title: 'AgentStream',
    description: 'Real-time bidirectional audio between live calls and your bot server over WebSocket — three connection methods, full protocol reference.',
    link: '/docs/agentstream/developer-guide',
  },
  {
    title: 'Contact Center API',
    description: 'Build custom agent interfaces with outbound calling, lead management, and campaign configuration.',
    link: '/docs/contact-center/overview',
  },
  {
    title: 'Programmable Voice',
    description: 'Make and receive calls, build IVR flows, and manage phone numbers programmatically.',
    link: '/docs/voice',
  },
  {
    title: 'SMS API',
    description: 'Send single and bulk SMS with DLT compliance, URL shortening, and delivery tracking.',
    link: '/docs/sms-api/overview',
  },
  {
    title: 'WhatsApp API',
    description: 'Send text, media, templates, and interactive messages via WhatsApp Business.',
    link: '/docs/whatsapp-api/overview',
  },
  {
    title: 'Conversational Intelligence (CQA)',
    description: 'AI-powered quality scoring for contact center interactions — Data Import API, Analysis API, and CSV file schemas.',
    link: '/docs/cqa/overview',
  },
  {
    title: 'ExoVerify',
    description: 'Verify phone numbers with SMS OTP for secure user authentication.',
    link: '/docs/exoverify-api/overview',
  },
  {
    title: 'Call Campaigns',
    description: 'Run outbound call campaigns with IVR flows, retries, scheduling, and reporting.',
    link: '/docs/campaigns/overview',
  },
  {
    title: 'SMS Campaigns',
    description: 'Create and manage bulk SMS campaigns with scheduling and personalization.',
    link: '/docs/sms-campaigns/overview',
  },
  {
    title: 'ExoPhones',
    description: 'Browse, purchase, and manage virtual phone numbers across countries.',
    link: '/docs/exophones/overview',
  },
  {
    title: 'Lead Assist',
    description: 'Privacy-protected communication with PIN verification and virtual numbers.',
    link: '/docs/lead-assist/overview',
  },
  {
    title: 'Users API',
    description: 'Manage contact center agents, devices, roles, and SIP configurations.',
    link: '/docs/users/overview',
  },
  {
    title: 'Heartbeat',
    description: 'Real-time ExoPhone health monitoring with webhook notifications.',
    link: '/docs/heartbeat/overview',
  },
];

const quickLinks = [
  {
    title: 'Send your first SMS',
    description: '5-minute quickstart guide',
    link: '/docs/sms-api/quickstart',
  },
  {
    title: 'Make your first call',
    description: '5-minute quickstart guide',
    link: '/docs/voice-v1/quickstart',
  },
  {
    title: 'Connect AI clients (MCP)',
    description: 'Use Exotel from Claude, Cursor, and VS Code',
    link: '/docs/mcp-server/overview',
  },
  {
    title: 'Authentication',
    description: 'API credentials & security',
    link: '/docs/references/authentication',
  },
  {
    title: 'Send WhatsApp Message',
    description: 'Text, media, and template messages',
    link: '/docs/whatsapp-api/api-reference/send-message',
  },
  {
    title: 'Verify Phone (OTP)',
    description: 'SMS OTP verification in 2 API calls',
    link: '/docs/exoverify-api/overview',
  },
  {
    title: 'Error Codes & Webhooks',
    description: 'Troubleshoot errors, webhook payloads',
    link: '/docs/references/error-codes',
  },
];

const useCases = [
  {
    title: 'Business Monitoring Dashboard',
    description: 'Build a real-time dashboard to monitor call volumes, agent performance, and business KPIs using Exotel APIs.',
    tags: ['Voice', 'Automation'],
    link: '/docs/use-cases/business-monitoring-dashboard',
  },
  {
    title: 'Call Monitoring & Visualization',
    description: 'Visualize call data with charts, track call quality metrics, and set up alerts for anomalies in real time.',
    tags: ['Data', 'Monitoring'],
    link: '/docs/use-cases/call-monitoring-visualization',
  },
  {
    title: 'Dynamic Caller ID Campaigns',
    description: 'Run outbound campaigns with dynamic caller IDs to improve pickup rates and localize your outreach.',
    tags: ['Campaigns', 'Sales'],
    link: '/docs/use-cases/dynamic-caller-id-campaigns',
  },
  {
    title: 'Progressive Dialer using APIs',
    description: 'Build a progressive dialer that automatically connects agents to the next lead, improving efficiency.',
    tags: ['Contact Center', 'Dialer'],
    link: '/docs/use-cases/progressive-dialer',
  },
  {
    title: 'Interactive SMS with Custom UI',
    description: 'Create rich, interactive SMS experiences with custom UI elements and two-way messaging workflows.',
    tags: ['SMS', 'Integrations'],
    link: '/docs/use-cases/interactive-sms',
  },
];

const heroSamples: HeroSample[] = [
  {
    id: 'call',
    label: 'Make a call',
    method: 'POST',
    href: '/docs/voice-v1/quickstart',
    code: `# two numbers, one request
curl -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" \\
  -X POST "https://api.exotel.com/v1/Accounts/$SID/Calls/connect" \\
  -d "From=+919876543210" \\
  -d "To=+919123456789" \\
  -d "CallerId=YOUR_EXOPHONE"`,
  },
  {
    id: 'stream',
    label: 'Stream a call',
    method: 'POST',
    href: '/docs/agentstream/developer-guide',
    code: `# send the room to your bot
curl -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" \\
  -X POST "https://api.in.exotel.com/v1/accounts/$SID/calls/connect" \\
  -F "from=+919876543210" \\
  -F "callerid=08047491899" \\
  -F "streamurl=wss://bot.example.com/media" \\
  -F "streamtype=bidirectional"`,
  },
  {
    id: 'analyze',
    label: 'Analyze a call',
    method: 'POST',
    href: '/docs/cqa/overview',
    code: `# score the conversation
curl -X POST \\
  "https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions" \\
  -H "X-API-Key: $CQA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"channel_type":"VOICE","audio_url":"https://files.example/call.wav","metadata":{"note":"I can hear you"}}'`,
  },
  {
    id: 'message',
    label: 'Send a Message',
    method: 'POST',
    href: '/docs/rcs-omnichannel/api-reference/send-message',
    code: `# 10 March 1876
curl -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" \\
  -X POST "https://api.exotel.com/v2/accounts/$SID/messages" \\
  -H "Content-Type: application/json" \\
  -d '{
    "rcs": {
      "from": "your_bot_id",
      "to": "+919888888888",
      "content": { "name": "welcome_template" },
      "fallback": {
        "sms": { "from": "ExoSMS", "content": "Watson, Come here" }
      }
    }
  }'`,
  },
];

function highlightCurl(code: string) {
  return code.split('\n').map((line, index) => {
    if (line.trimStart().startsWith('#')) {
      return (
        <span key={index} className={styles.shellComment}>
          {line}
          {'\n'}
        </span>
      );
    }

    const parts = line.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g);
    return (
      <span key={index}>
        {parts.map((part, partIndex) => {
          if (part.startsWith('"') || part.startsWith("'")) {
            return (
              <span key={partIndex} className={styles.shellString}>
                {part}
              </span>
            );
          }
          return part;
        })}
        {'\n'}
      </span>
    );
  });
}

function HeroDeck() {
  const [activeId, setActiveId] = useState(heroSamples[0].id);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number>();
  const sample = heroSamples.find((item) => item.id === activeId) ?? heroSamples[0];

  useEffect(() => {
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  async function copySample() {
    try {
      await navigator.clipboard.writeText(sample.code);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.heroDeck}>
      <div className={styles.deckList}>
        <p className={styles.deckListLabel}>Start here</p>
        <div className={styles.deckListItems} role="tablist" aria-label="Sample requests">
          {heroSamples.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === sample.id}
              className={`${styles.deckItem} ${item.id === sample.id ? styles.deckItemActive : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Link className={styles.deckListFoot} href={REGISTER_URL}>
          Create an account to load your API keys
        </Link>
      </div>
      <div className={styles.heroShell}>
        <div className={styles.shellBar}>
          <span className={styles.shellMethod}>{sample.method}</span>
          <span className={styles.shellTitle}>{sample.label}</span>
          <button type="button" className={styles.shellCopy} onClick={copySample}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className={styles.shellBody}>
          {heroSamples.map((item) => {
            const isActive = item.id === sample.id;
            return (
              <pre
                key={item.id}
                className={`${styles.shellCode} ${isActive ? styles.shellCodeActive : ''}`}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
              >
                <code>{highlightCurl(item.code)}</code>
              </pre>
            );
          })}
        </div>
        <Link className={styles.shellDocs} to={sample.href}>
          Open docs →
        </Link>
      </div>
    </div>
  );
}

function HeroBanner() {
  return (
    <header className={styles.heroBanner}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <Heading as="h1" className={styles.heroTitle}>
            Developer Docs
          </Heading>
          <p className={styles.heroSubtitle}>
            Learn how to get up and running with Exotel through tutorials, API
            references, code samples and use-case docs. Happy building.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.heroPrimary} href={REGISTER_URL}>
              Start Building
            </Link>
            <button
              type="button"
              className={styles.heroAsk}
              onClick={() => openAskAi()}
            >
              Ask AI
            </button>
          </div>
        </div>
        <HeroDeck />
      </div>
    </header>
  );
}

function ProductCards() {
  return (
    <section className={styles.products}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Products</Heading>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.title} className={styles.productCard}>
              <Heading as="h3" className={styles.productCardTitle}>{product.title}</Heading>
              <p className={styles.productCardDescription}>{product.description}</p>
              {product.available && (
                <Link className={styles.productCardLink} to={product.link}>
                  Explore docs &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Quick Links</Heading>
        <div className={styles.quickLinksGrid}>
          {quickLinks.map((item) => (
            <Link key={item.title} className={styles.quickLinkCard} to={item.link}>
              <Heading as="h4" className={styles.quickLinkTitle}>{item.title}</Heading>
              <p className={styles.quickLinkDescription}>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className={styles.useCases}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Use Cases</Heading>
        <div className={styles.useCasesGrid}>
          {useCases.map((uc) => (
            <div key={uc.title} className={styles.useCaseCard}>
              <div className={styles.useCaseTags}>
                {uc.tags.map((tag) => (
                  <span key={tag} className={styles.useCaseTag}>{tag}</span>
                ))}
              </div>
              <Heading as="h3" className={styles.useCaseTitle}>{uc.title}</Heading>
              <p className={styles.useCaseDescription}>{uc.description}</p>
              <Link className={styles.useCaseLink} to={uc.link}>
                Read guide &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Newsletter service is temporarily unavailable. Please try again.');
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }
      setStatus('success');
      setMessage(data.message || 'Thanks for subscribing! You\'ll receive developer updates and API announcements.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className={styles.newsletter}>
      <div className="container">
        <Heading as="h2" className={styles.newsletterTitle}>Subscribe to Developer Newsletter</Heading>
        <p className={styles.newsletterSubtitle}>
          Get API updates, developer tools, platform announcements, and implementation guides.
        </p>
        {status !== 'success' ? (
          <form
            className={styles.newsletterForm}
            onSubmit={handleSubmit}
            action="/api/newsletter"
            method="POST"
            {...{
              'toolname': 'subscribe_newsletter',
              'tooldescription': 'Subscribe to Exotel Developer Docs newsletter to receive API updates, platform announcements, and implementation guides',
            } as any}
          >
            <input
              type="email"
              name="email"
              className={styles.newsletterInput}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              {...{
                'toolparamdescription': 'Email address to subscribe for developer updates',
              } as any}
            />
            <button
              type="submit"
              className={styles.newsletterButton}
              disabled={!email.trim() || status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        ) : null}
        {status === 'success' && (
          <p className={styles.newsletterSuccess}>{message}</p>
        )}
        {status === 'error' && (
          <p className={styles.newsletterError}>{message}</p>
        )}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Exotel Developer Documentation — Voice API, SMS API, WhatsApp API, and more.">
      <WebMCPTools />
      <HeroBanner />
      <main>
        <ProductCards />
        <QuickLinks />
        <UseCasesSection />
        <NewsletterSignup />
      </main>
    </Layout>
  );
}
