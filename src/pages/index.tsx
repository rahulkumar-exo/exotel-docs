import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const products = [
  {
    title: 'Voice API',
    description: 'Make and receive calls, build IVR flows, and manage phone numbers programmatically.',
    link: '/docs/voice-api/getting-started/overview',
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
    link: '/docs/voice-api/getting-started/authentication',
  },
  {
    title: 'Make a Call',
    description: 'Connect two phone numbers via API',
    link: '/docs/voice-api/api-reference/make-a-call',
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
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/voice-api/getting-started/overview">
            Get Started with Voice API
          </Link>
          <Link className={styles.secondaryButton} to="/docs/voice-api/api-reference/make-a-call">
            API Reference
          </Link>
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
