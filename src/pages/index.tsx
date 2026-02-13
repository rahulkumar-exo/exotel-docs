import {type ReactNode, useState, useRef} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

interface AiSource {
  title: string;
  url: string;
  product: string;
}

function formatMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, '<br />');
}

const products = [
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
    title: 'Contact Center',
    description: 'Build custom agent interfaces with outbound calling and call management.',
    link: '/docs/contact-center/overview',
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
    title: 'Authentication',
    description: 'Set up your API credentials',
    link: '/docs/voice-v1/overview',
  },
  {
    title: 'Make a Call',
    description: 'Connect two phone numbers via API',
    link: '/docs/voice-v1/api-reference/connect-two-numbers',
  },
  {
    title: 'Send SMS',
    description: 'Send single or bulk SMS messages',
    link: '/docs/sms-api/api-reference/send-sms',
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
    title: 'Create Campaign',
    description: 'Outbound call campaigns with IVR',
    link: '/docs/campaigns/api-reference/create-campaign',
  },
];

function HeroBanner() {
  const {siteConfig} = useDocusaurusContext();
  const [heroQuery, setHeroQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [sources, setSources] = useState<AiSource[]>([]);
  const [error, setError] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const askQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    setAnswer('');
    setAskedQuestion(question.trim());
    setSources([]);
    setError('');
    setHeroQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), history: [] }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      setAnswer(data.answer || '');
      if (data.sources?.length) {
        setSources(data.sources);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      askQuestion(heroQuery);
    }
  };

  const clearResponse = () => {
    setAnswer('');
    setAskedQuestion('');
    setSources([]);
    setError('');
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
              disabled={isLoading}
            />
            <button
              className={styles.heroSearchButton}
              onClick={() => askQuestion(heroQuery)}
              disabled={!heroQuery.trim() || isLoading}
            >
              {isLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>

          {/* Suggestion chips — only show when no response */}
          {!answer && !isLoading && !error && (
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
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className={styles.heroAiResponse} ref={responseRef}>
              <div className={styles.heroAiResponseHeader}>
                <span className={styles.heroAiLabel}>AI is answering...</span>
              </div>
              <div className={styles.heroAiLoading}>
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {/* AI Response */}
          {!isLoading && answer && (
            <div className={styles.heroAiResponse} ref={responseRef}>
              <div className={styles.heroAiResponseHeader}>
                <span className={styles.heroAiLabel}>AI Answer</span>
                <div className={styles.heroAiActions}>
                  <button className={styles.heroAiNewQuestion} onClick={clearResponse}>
                    Ask another question
                  </button>
                </div>
              </div>
              <div className={styles.heroAiQuestion}>
                {askedQuestion}
              </div>
              <div
                className={styles.heroAiAnswerContent}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(answer) }}
              />
              {sources.length > 0 && (
                <div className={styles.heroAiSources}>
                  <span className={styles.heroAiSourcesLabel}>Sources:</span>
                  {sources.map((source, i) => (
                    <a key={i} href={source.url} className={styles.heroAiSourceLink}>
                      {source.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className={styles.heroAiResponse} ref={responseRef}>
              <div className={styles.heroAiResponseHeader}>
                <span className={styles.heroAiLabel}>Error</span>
                <button className={styles.heroAiNewQuestion} onClick={clearResponse}>
                  Try again
                </button>
              </div>
              <p className={styles.heroAiError}>{error}</p>
            </div>
          )}
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

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Exotel Developer Documentation — Voice API, SMS API, WhatsApp API, and more.">
      <HeroBanner />
      <main>
        <ProductCards />
        <QuickLinks />
      </main>
    </Layout>
  );
}
