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
      },
    ],
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

  themeConfig: {
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
        {
          type: 'dropdown',
          label: 'Voice',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'voiceV1Sidebar', label: 'Voice v1' },
            { type: 'docSidebar', sidebarId: 'voiceApiSidebar', label: 'Voice v2 (Deprecated)' },
            { type: 'docSidebar', sidebarId: 'voiceV3Sidebar', label: 'Voice v3' },
            { type: 'docSidebar', sidebarId: 'ipPstnWebrtcSidebar', label: 'IP-PSTN intermix: WebRTC SDK integration' },
            { type: 'docSidebar', sidebarId: 'legsSidebar', label: 'Legs' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Messaging',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'smsApiSidebar', label: 'SMS' },
            { type: 'docSidebar', sidebarId: 'whatsappApiSidebar', label: 'WhatsApp - Messaging API' },
            { type: 'docSidebar', sidebarId: 'whatsappTemplatesSidebar', label: 'WhatsApp - Template Management APIs' },
            { type: 'docSidebar', sidebarId: 'whatsappOnboardingSidebar', label: 'WhatsApp - Onboarding APIs' },
            { type: 'docSidebar', sidebarId: 'rcsOmnichannelSidebar', label: 'RCS - Omnichannel APIs' },
            { type: 'docSidebar', sidebarId: 'urlShorteningSidebar', label: 'URL Shortening' },
          ],
        },
        { type: 'docSidebar', sidebarId: 'exophonesSidebar', label: 'ExoPhones', position: 'left' },
        { type: 'docSidebar', sidebarId: 'heartbeatSidebar', label: 'Heartbeat', position: 'left' },
        {
          type: 'dropdown',
          label: 'Campaigns',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'campaignsSidebar', label: 'Call Campaigns' },
            { type: 'docSidebar', sidebarId: 'smsCampaignsSidebar', label: 'SMS Campaigns' },
            { type: 'docSidebar', sidebarId: 'campaignsContactsSidebar', label: 'Campaigns - Contacts' },
            { type: 'docSidebar', sidebarId: 'campaignListsSidebar', label: 'Campaigns - Lists' },
          ],
        },
        {
          type: 'dropdown',
          label: 'More',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'leadAssistSidebar', label: 'Lead Assist (ExoBridge - GreenPin)' },
            { type: 'docSidebar', sidebarId: 'leadAssistGreenVnSidebar', label: 'Lead Assist (ExoBridge - GreenVN)' },
            { type: 'docSidebar', sidebarId: 'leadAssistSettingsSidebar', label: 'Lead Assist (ExoBridge - Settings)' },
            { type: 'docSidebar', sidebarId: 'usersSidebar', label: 'Users' },
            { type: 'docSidebar', sidebarId: 'exoverifyApiSidebar', label: 'ExoVerify' },
            { type: 'docSidebar', sidebarId: 'contactCenterSidebar', label: 'Contact Center APIs v6' },
            { type: 'docSidebar', sidebarId: 'contactCenterV4Sidebar', label: 'Contact Center APIs v4' },
            { type: 'docSidebar', sidebarId: 'genAiSidebar', label: 'Gen AI' },
            { type: 'docSidebar', sidebarId: 'mcpServerSidebar', label: 'Exotel MCP Server' },
            { type: 'docSidebar', sidebarId: 'faqsSidebar', label: 'FAQs' },
          ],
        },
        {
          href: 'https://my.exotel.com/auth/register',
          label: 'Create Account',
          position: 'right',
        },
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
              label: 'Support',
              href: 'https://support.exotel.com',
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
      additionalLanguages: ['bash', 'json', 'php', 'ruby', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
