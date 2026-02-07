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
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'API Docs',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'voiceApiSidebar', label: 'Voice API' },
            { type: 'docSidebar', sidebarId: 'smsApiSidebar', label: 'SMS API' },
            { type: 'docSidebar', sidebarId: 'whatsappApiSidebar', label: 'WhatsApp API' },
            { type: 'docSidebar', sidebarId: 'exoverifyApiSidebar', label: 'ExoVerify' },
            { type: 'docSidebar', sidebarId: 'campaignsSidebar', label: 'Call Campaigns' },
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
      style: 'light',
      links: [
        {
          title: 'Products',
          items: [
            { label: 'Voice API', to: '/docs/voice-api/getting-started/overview' },
            { label: 'SMS API', to: '/docs/sms-api/overview' },
            { label: 'WhatsApp API', to: '/docs/whatsapp-api/overview' },
            { label: 'ExoVerify', to: '/docs/exoverify-api/overview' },
            { label: 'Call Campaigns', to: '/docs/campaigns/overview' },
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
