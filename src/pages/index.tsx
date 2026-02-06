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
    description: 'Send and receive SMS messages, run campaigns, and manage templates.',
    link: '#',
    available: false,
  },
  {
    title: 'WhatsApp API',
    description: 'Send WhatsApp messages, manage templates, and handle conversations.',
    link: '#',
    available: false,
  },
  {
    title: 'ExoVerify',
    description: 'Verify phone numbers with flash calls and OTP for secure authentication.',
    link: '#',
    available: false,
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
    title: 'Call Details',
    description: 'Retrieve call status and recordings',
    link: '/docs/voice-api/api-reference/call-details',
  },
  {
    title: 'Applets',
    description: 'Build IVR flows with modular components',
    link: '/docs/voice-api/applets/greeting',
  },
  {
    title: 'StatusCallback',
    description: 'Get real-time call completion webhooks',
    link: '/docs/voice-api/api-reference/status-callback',
  },
  {
    title: 'ExoPhone',
    description: 'Manage your virtual phone numbers',
    link: '/docs/voice-api/api-reference/exophone',
  },
];

function HeroBanner() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
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
