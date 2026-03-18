import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Exotel Developer Docs',
  tagline: 'Build powerful communication workflows',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://developers.exotel.com',
  baseUrl: '/',

  organizationName: 'exotel',
  projectName: 'exotel-docs',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarShortcutHint: true,
        language: ['en'],
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: [
    function swaggerWebpackPlugin() {
      return {
        name: 'swagger-webpack-plugin',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                stream: require.resolve('stream-browserify'),
              },
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: { property: 'og:type', content: 'website' },
    },
    {
      tagName: 'meta',
      attributes: { property: 'og:site_name', content: 'Exotel Developer Docs' },
    },
    {
      tagName: 'meta',
      attributes: { property: 'twitter:card', content: 'summary_large_image' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'canonical', href: 'https://developer.exotel.com' },
    },
  ],

  themeConfig: {
    metadata: [
      { name: 'keywords', content: 'Exotel API, Voice API, SMS API, WhatsApp API, cloud telephony, CPaaS, developer documentation' },
      { name: 'robots', content: 'index, follow' },
    ],
    image: 'img/exotel-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Developers',
      logo: {
        alt: 'Exotel Logo',
        src: 'img/exotel-logo.png',
      },
      items: [
        // ── API Reference ──
        {
          type: 'dropdown',
          label: 'API Reference',
          position: 'left',
          items: [
            { type: 'html', value: '<span class="dropdown-section-label">Voice</span>' },
            { type: 'docSidebar', sidebarId: 'voiceV1Sidebar', label: 'Voice v1' },
            { type: 'docSidebar', sidebarId: 'voiceApiSidebar', label: 'Voice v2' },
            { type: 'docSidebar', sidebarId: 'voiceV3Sidebar', label: 'Voice v3' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Messaging</span>' },
            { type: 'docSidebar', sidebarId: 'smsApiSidebar', label: 'SMS' },
            { type: 'docSidebar', sidebarId: 'whatsappApiSidebar', label: 'WhatsApp' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Platform</span>' },
            { type: 'docSidebar', sidebarId: 'exoverifyApiSidebar', label: 'ExoVerify' },
            { type: 'docSidebar', sidebarId: 'exophonesSidebar', label: 'ExoPhones' },
            { type: 'docSidebar', sidebarId: 'usersSidebar', label: 'Users' },
            { type: 'docSidebar', sidebarId: 'heartbeatSidebar', label: 'Heartbeat' },
            { type: 'docSidebar', sidebarId: 'legsSidebar', label: 'Legs' },
            { type: 'docSidebar', sidebarId: 'referencesSidebar', label: 'Error Codes & Webhooks' },
          ],
        },
        // ── Products ──
        {
          type: 'dropdown',
          label: 'Products',
          position: 'left',
          items: [
            { type: 'html', value: '<span class="dropdown-section-label">Campaigns</span>' },
            { type: 'docSidebar', sidebarId: 'campaignsSidebar', label: 'Call Campaigns' },
            { type: 'docSidebar', sidebarId: 'smsCampaignsSidebar', label: 'SMS Campaigns' },
            { type: 'docSidebar', sidebarId: 'campaignsContactsSidebar', label: 'Contacts' },
            { type: 'docSidebar', sidebarId: 'campaignListsSidebar', label: 'Lists' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Lead Assist</span>' },
            { type: 'docSidebar', sidebarId: 'leadAssistSidebar', label: 'GreenPin' },
            { type: 'docSidebar', sidebarId: 'leadAssistGreenVnSidebar', label: 'GreenVN' },
            { type: 'docSidebar', sidebarId: 'leadAssistSettingsSidebar', label: 'Settings' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Contact Center</span>' },
            { type: 'docSidebar', sidebarId: 'contactCenterSidebar', label: 'Contact Center v6' },
            { type: 'docSidebar', sidebarId: 'contactCenterV4Sidebar', label: 'Contact Center v4' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">AI & Advanced</span>' },
            { type: 'docSidebar', sidebarId: 'genAiSidebar', label: 'Gen AI' },
            { type: 'docSidebar', sidebarId: 'chatbotSidebar', label: 'Chatbot Platform' },
            { type: 'docSidebar', sidebarId: 'agentStreamSidebar', label: 'AgentStream' },
            { type: 'docSidebar', sidebarId: 'voicebotToolsSidebar', label: 'VoiceBot Tools' },
            { type: 'docSidebar', sidebarId: 'vsipSidebar', label: 'vSIP Trunking' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">SDKs & Integrations</span>' },
            { type: 'docSidebar', sidebarId: 'ipPstnWebrtcSidebar', label: 'WebRTC SDK' },
            { type: 'docSidebar', sidebarId: 'integrationsSidebar', label: 'Integrations' },
            { type: 'docSidebar', sidebarId: 'whatsappTemplatesSidebar', label: 'WhatsApp Templates' },
            { type: 'docSidebar', sidebarId: 'whatsappOnboardingSidebar', label: 'WhatsApp Onboarding' },
            { type: 'docSidebar', sidebarId: 'rcsOmnichannelSidebar', label: 'RCS Omnichannel' },
            { type: 'docSidebar', sidebarId: 'urlShorteningSidebar', label: 'URL Shortening' },
            { type: 'docSidebar', sidebarId: 'mcpServerSidebar', label: 'MCP Server' },
          ],
        },
        // ── Guides ──
        {
          type: 'dropdown',
          label: 'Guides',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'gettingStartedSidebar', label: 'Getting Started' },
            { type: 'docSidebar', sidebarId: 'useCasesSidebar', label: 'Use Cases' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Channel Guides</span>' },
            { type: 'docSidebar', sidebarId: 'callSupportSidebar', label: 'Cloud Telephony' },
            { type: 'docSidebar', sidebarId: 'smsSupportSidebar', label: 'SMS' },
            { type: 'docSidebar', sidebarId: 'whatsappSupportSidebar', label: 'WhatsApp' },
            { type: 'docSidebar', sidebarId: 'campaignGuidesSidebar', label: 'Campaigns' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Platform</span>' },
            { type: 'docSidebar', sidebarId: 'appBazaarSidebar', label: 'App Bazaar' },
            { type: 'docSidebar', sidebarId: 'reportingSidebar', label: 'Reporting' },
            { type: 'docSidebar', sidebarId: 'billingSidebar', label: 'Billing' },
            { type: 'docSidebar', sidebarId: 'advancedConfigSidebar', label: 'Advanced Config' },
            { type: 'html', value: '<span class="dropdown-separator"></span>' },
            { type: 'html', value: '<span class="dropdown-section-label">Help</span>' },
            { type: 'docSidebar', sidebarId: 'faqsSidebar', label: 'FAQs & Regulations' },
            { type: 'doc', docId: 'references/changelog', label: 'Changelog' },
          ],
        },
        // ── Right side ──
        {
          href: 'https://my.exotel.com',
          label: 'Dashboard',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'API Docs',
          items: [
            { label: 'Voice v1', to: '/docs/voice-v1/overview' },
            { label: 'Voice v2', to: '/docs/voice-api/getting-started/overview' },
            { label: 'Voice v3', to: '/docs/voice-v3/overview' },
            { label: 'SMS', to: '/docs/sms-api/overview' },
            { label: 'ExoPhones', to: '/docs/exophones/overview' },
            { label: 'Heartbeat', to: '/docs/heartbeat/overview' },
            { label: 'Call Campaigns', to: '/docs/campaigns/overview' },
            { label: 'SMS Campaigns', to: '/docs/sms-campaigns/overview' },
            { label: 'Lead Assist (ExoBridge - GreenPin)', to: '/docs/lead-assist/overview' },
            { label: 'Users', to: '/docs/users/overview' },
            { label: 'ExoVerify', to: '/docs/exoverify-api/overview' },
            { label: 'WhatsApp - Messaging API', to: '/docs/whatsapp-api/overview' },
            { label: 'URL Shortening', to: '/docs/sms-api/api-reference/url-shortening' },
            { label: 'Integrations', to: '/docs/integrations/overview' },
          ],
        },
        {
          title: 'Support & Guides',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started/overview' },
            { label: 'Cloud Telephony', to: '/docs/call-support/basics/cloud-telephony-overview' },
            { label: 'SMS Guide', to: '/docs/sms-support/overview' },
            { label: 'WhatsApp Guide', to: '/docs/whatsapp-support/whatsapp-overview' },
            { label: 'Campaign Guides', to: '/docs/campaign-guides/overview' },
            { label: 'App Bazaar', to: '/docs/app-bazaar/overview' },
            { label: 'Reporting', to: '/docs/reporting/overview' },
            { label: 'Billing', to: '/docs/billing/overview' },
            { label: 'FAQs', to: '/docs/faqs/overview' },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Exotel Website',
              href: 'https://exotel.com',
            },
            {
              label: 'Dashboard',
              href: 'https://my.exotel.com',
            },
            {
              label: 'Chatbot Platform',
              to: '/docs/chatbot/overview',
            },
            {
              label: 'vSIP Trunking',
              to: '/docs/vsip/overview',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Create Account',
              href: 'https://my.exotel.com/auth/register',
            },
            {
              label: 'API Status',
              href: 'https://status.exotel.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Exotel Techcom Pvt Ltd. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      additionalLanguages: ['bash', 'json', 'php', 'ruby', 'python', 'go', 'ini'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
