import {type ReactNode, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import WebMCPTools from '@site/src/components/WebMCP';

import styles from './index.module.css';

const products = [
  {
    title: 'Voicebot API',
    description: 'Build AI voicebots with natural language, manage versions, and pull conversation transcripts & insights.',
    link: '/docs/voicebot-tools/voicebot-api',
    available: true,
  },
  {
    title: 'AgentStream',
    description: 'Real-time bidirectional audio between live calls and your bot server over WebSocket — three connection methods, full protocol reference.',
    link: '/docs/agentstream/developer-guide',
    available: true,
  },
  {
    title: 'Contact Center API',
    description: 'Build custom agent interfaces with outbound calling, lead management, and campaign configuration.',
    link: '/docs/contact-center/overview',
    available: true,
  },
  {
    title: 'Programmable Voice',
    description: 'Make and receive calls, build IVR flows, and manage phone numbers programmatically.',
    link: '/docs/voice',
    available: true,
  },
  {
    title: 'SMS API',
    description: 'Send single and bulk SMS with DLT compliance, URL shortening, and delivery tracking.',
    link: '/docs/sms-api/overview',
    available: true,
  },
  {
    title: 'WhatsApp API',
    description: 'Send text, media, templates, and interactive messages via WhatsApp Business.',
    link: '/docs/whatsapp-api/overview',
    available: true,
  },
  {
    title: 'Conversation Quality Analysis',
    description: 'AI-powered quality scoring for contact center interactions — Data Import API, Analysis API, and CSV file schemas.',
    link: '/docs/cqa/overview',
    available: true,
  },
  {
    title: 'ExoVerify',
    description: 'Verify phone numbers with SMS OTP for secure user authentication.',
    link: '/docs/exoverify-api/overview',
    available: true,
  },
  {
    title: 'Call Campaigns',
    description: 'Run outbound call campaigns with IVR flows, retries, scheduling, and reporting.',
    link: '/docs/campaigns/overview',
    available: true,
  },
  {
    title: 'SMS Campaigns',
    description: 'Create and manage bulk SMS campaigns with scheduling and personalization.',
    link: '/docs/sms-campaigns/overview',
    available: true,
  },
  {
    title: 'ExoPhones',
    description: 'Browse, purchase, and manage virtual phone numbers across countries.',
    link: '/docs/exophones/overview',
    available: true,
  },
  {
    title: 'Lead Assist',
    description: 'Privacy-protected communication with PIN verification and virtual numbers.',
    link: '/docs/lead-assist/overview',
    available: true,
  },
  {
    title: 'Users API',
    description: 'Manage contact center agents, devices, roles, and SIP configurations.',
    link: '/docs/users/overview',
    available: true,
  },
  {
    title: 'Heartbeat',
    description: 'Real-time ExoPhone health monitoring with webhook notifications.',
    link: '/docs/heartbeat/overview',
    available: true,
  },
];

const quickLinks = [
  {
    title: '🚀 Send Your First SMS',
    description: '5-minute quickstart guide',
    link: '/docs/sms-api/quickstart',
  },
  {
    title: '📞 Make Your First Call',
    description: '5-minute quickstart guide',
    link: '/docs/voice-v1/quickstart',
  },
  {
    title: '🤖 Connect AI Clients (MCP)',
    description: 'Use Exotel from Claude, Cursor, and VS Code',
    link: '/docs/mcp-server/overview',
  },
  {
    title: '🔐 Authentication',
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

function HeroBanner() {
  const [heroQuery, setHeroQuery] = useState('');

  const askQuestion = (question: string) => {
    if (!question.trim()) return;
    setHeroQuery('');
    window.dispatchEvent(new CustomEvent('open-ai-chat', {
      detail: { question: question.trim() },
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      askQuestion(heroQuery);
    }
  };

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Exotel for Developers
        </Heading>
        <p className={styles.heroSubtitle}>
          Learn how to get up and running with Exotel through tutorials, APIs, and use-case docs. Happy building.
        </p>
        <div className={styles.heroSearchContainer}>
          <div className={styles.heroSearchBox}>
            <svg className={styles.heroSearchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <input
              type="text"
              className={styles.heroSearchInput}
              placeholder="Ask AI anything about Exotel APIs..."
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={styles.heroSearchButton}
              onClick={() => askQuestion(heroQuery)}
              disabled={!heroQuery.trim()}
            >
              Ask AI
            </button>
          </div>

          <div className={styles.heroSearchHints}>
            {['How do I make a call?', 'Send SMS via API', 'WhatsApp templates'].map((hint) => (
              <button
                key={hint}
                className={styles.heroSearchHint}
                onClick={() => askQuestion(hint)}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
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
            <div key={product.title} className={`${styles.productCard} ${!product.available ? styles.productCardDisabled : ''}`}>
              {!product.available && <span className={styles.comingSoon}>Coming Soon</span>}
              {product.available && (product as any).badge && <span className={styles.comingSoon}>{(product as any).badge}</span>}
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

  const handleSubmit = async (e: React.FormEvent) => {
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
