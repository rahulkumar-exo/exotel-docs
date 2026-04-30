import {type ReactNode, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
    title: 'Contact Center API',
    description: 'Build custom agent interfaces with outbound calling, lead management, and campaign configuration.',
    link: '/docs/contact-center/overview',
    available: true,
  },
  {
    title: 'Voice API',
    description: 'Make and receive calls, build IVR flows, and manage phone numbers programmatically.',
    link: '/docs/voice-v1/overview',
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
    title: 'Gen AI',
    description: 'AI-powered call analysis — transcription, sentiment, summarization.',
    link: '/docs/gen-ai/overview',
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

const platformStats = [
  { number: '577M+', label: 'Calls powered monthly' },
  { number: '21.2M+', label: 'Calls in a single day' },
  { number: '287M+', label: 'SMSes powered monthly' },
  { number: '6,000+', label: 'Businesses trust Exotel' },
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
  const {siteConfig} = useDocusaurusContext();
  const [heroQuery, setHeroQuery] = useState('');

  const askQuestion = (question: string) => {
    if (!question.trim()) return;
    setHeroQuery('');
    // Open the conversational AI chat panel with this question
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
        <div className={styles.heroLogo}>
          <img src="/img/exotel-logo.png" alt="Exotel" className={styles.heroLogoImg} />
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          Developer Documentation
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
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

function PlatformStats() {
  return (
    <section className={styles.platformStats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {platformStats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function SocialShare() {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://developer.exotel.com';
  const shareText = 'Check out Exotel Developer Documentation';

  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <section className={styles.socialShare}>
      <div className="container">
        <div className={styles.socialShareLabel}>Share this page</div>
        <div className={styles.socialShareButtons}>
          {/* LinkedIn */}
          <a
            className={styles.socialShareBtn}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          {/* Twitter/X */}
          <a
            className={styles.socialShareBtn}
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          {/* WhatsApp */}
          <a
            className={styles.socialShareBtn}
            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          {/* Email */}
          <a
            className={styles.socialShareBtn}
            href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(pageUrl)}`}
            aria-label="Share via Email"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
          {/* Copy URL */}
          <button
            className={styles.socialShareBtn}
            onClick={handleCopyUrl}
            aria-label="Copy URL"
          >
            {copied && <span className={styles.copyTooltip}>Copied!</span>}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
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
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Exotel Developer Documentation — Voice API, SMS API, WhatsApp API, and more.">
      <WebMCPTools />
      <HeroBanner />
      <main>
        <PlatformStats />
        <ProductCards />
        <QuickLinks />
        <UseCasesSection />
        <NewsletterSignup />
        <SocialShare />
      </main>
    </Layout>
  );
}
