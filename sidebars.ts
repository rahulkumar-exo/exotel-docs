import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  voiceApiSidebar: [
    {
      type: 'category',
      label: '🔀 Switch Voice Version',
      collapsed: false,
      items: [
        { type: 'link', label: '→ Voice v1', href: '/docs/voice-v1/overview' },
        { type: 'link', label: '→ Voice v2', href: '/docs/voice-api/getting-started/overview' },
        { type: 'link', label: '→ Voice v3', href: '/docs/voice-v3/overview' },
      ],
    },
    'voice-api/getting-started/overview',
    'voice-api/getting-started/authentication',
    'voice-api/api-reference/make-a-call',
    'voice-api/api-reference/call-details',
  ],

  voiceV1Sidebar: [
    {
      type: 'category',
      label: '🔀 Switch Voice Version',
      collapsed: false,
      items: [
        { type: 'link', label: '→ Voice v1', href: '/docs/voice-v1/overview' },
        { type: 'link', label: '→ Voice v2', href: '/docs/voice-api/getting-started/overview' },
        { type: 'link', label: '→ Voice v3', href: '/docs/voice-v3/overview' },
      ],
    },
    'voice-v1/quickstart',
    'voice-v1/overview',
    'voice-v1/api-reference/connect-two-numbers',
    'voice-v1/api-reference/connect-to-flow',
    'voice-v1/api-reference/outgoing-call-to-flow',
    'voice-v1/api-reference/call-details',
    'voice-v1/api-reference/number-metadata',
    'voice-v1/api-reference/balance',
    'voice-v1/api-reference/incoming-call',
    'voice-v1/api-reference/status-callback',
    {
      type: 'category',
      label: 'Applets',
      collapsed: false,
      items: [
        'voice-v1/applets/greeting',
        'voice-v1/applets/connect',
        'voice-v1/applets/passthru',
        'voice-v1/applets/transfer',
        'voice-v1/applets/ivr-menu',
        'voice-v1/applets/voicemail',
        'voice-v1/applets/hangup',
        'voice-v1/applets/sms',
        'voice-v1/applets/email',
      ],
    },
  ],

  voiceV3Sidebar: [
    {
      type: 'category',
      label: '🔀 Switch Voice Version',
      collapsed: false,
      items: [
        { type: 'link', label: '→ Voice v1', href: '/docs/voice-v1/overview' },
        { type: 'link', label: '→ Voice v2', href: '/docs/voice-api/getting-started/overview' },
        { type: 'link', label: '→ Voice v3', href: '/docs/voice-v3/overview' },
      ],
    },
    'voice-v3/overview',
    'voice-v3/api-reference/call-details',
    'voice-v3/api-reference/voice-log-download',
    'voice-v3/api-reference/active-stream-monitoring',
  ],

  smsApiSidebar: [
    'sms-api/quickstart',
    'sms-api/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'sms-api/api-reference/send-sms',
        'sms-api/api-reference/sms-details',
        'sms-api/api-reference/bulk-sms',
        'sms-api/api-reference/status-codes',
        'sms-api/api-reference/url-shortening',
      ],
    },
  ],

  whatsappApiSidebar: [
    'whatsapp-api/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'whatsapp-api/api-reference/send-message',
        'whatsapp-api/api-reference/receive-messages',
        'whatsapp-api/api-reference/templates',
        'whatsapp-api/api-reference/bulk-messages',
        'whatsapp-api/api-reference/payment-messages',
        'whatsapp-api/api-reference/flows',
        'whatsapp-api/api-reference/status-codes',
      ],
    },
  ],

  whatsappTemplatesSidebar: [
    'whatsapp-api/templates-api/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'whatsapp-api/templates-api/manage-templates',
      ],
    },
  ],

  exoverifyApiSidebar: [
    'exoverify-api/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'exoverify-api/api-reference/start-verification',
        'exoverify-api/api-reference/verify-otp',
      ],
    },
  ],

  campaignsSidebar: [
    'campaigns/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'campaigns/api-reference/create-campaign',
        'campaigns/api-reference/manage-campaign',
        'campaigns/api-reference/campaign-call-details',
        'campaigns/api-reference/webhooks',
      ],
    },
  ],

  smsCampaignsSidebar: [
    'sms-campaigns/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'sms-campaigns/api-reference/create-campaign',
        'sms-campaigns/api-reference/campaign-details',
        'sms-campaigns/api-reference/manage-campaign',
        'sms-campaigns/api-reference/bulk-campaign-details',
        'sms-campaigns/api-reference/sms-details',
      ],
    },
  ],

  campaignsContactsSidebar: [
    'campaigns-contacts/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'campaigns-contacts/api-reference/manage-contacts',
      ],
    },
  ],

  exophonesSidebar: [
    'exophones/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'exophones/api-reference/available-numbers',
        'exophones/api-reference/purchase-number',
        'exophones/api-reference/assign-to-flow',
        'exophones/api-reference/list-numbers',
        'exophones/api-reference/number-details',
        'exophones/api-reference/delete-number',
      ],
    },
  ],

  leadAssistSidebar: [
    'lead-assist/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'lead-assist/api-reference/create-allocation',
        'lead-assist/api-reference/get-allocation',
        'lead-assist/api-reference/update-allocation',
        'lead-assist/api-reference/delete-allocation',
      ],
    },
  ],

  leadAssistGreenVnSidebar: [
    'lead-assist-greenvn/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'lead-assist-greenvn/api-reference/manage-allocations',
      ],
    },
  ],

  leadAssistSettingsSidebar: [
    'lead-assist-settings/overview',
  ],

  usersSidebar: [
    'users/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'users/api-reference/create-user',
        'users/api-reference/update-user',
        'users/api-reference/manage-devices',
        'users/api-reference/list-users',
        'users/api-reference/delete-user',
      ],
    },
  ],

  heartbeatSidebar: [
    'heartbeat/overview',
    'heartbeat/webhook-format',
  ],

  campaignListsSidebar: [
    'campaign-lists/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'campaign-lists/api-reference/create-list',
        'campaign-lists/api-reference/manage-lists',
      ],
    },
  ],

  urlShorteningSidebar: [
    'url-shortening/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'url-shortening/api-reference/shorten-url',
      ],
    },
  ],

  contactCenterSidebar: [
    'contact-center/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'contact-center/api-reference/token-generation',
        'contact-center/api-reference/make-call',
        'contact-center/api-reference/call-details',
        'contact-center/api-reference/upload-contacts',
        'contact-center/api-reference/error-file-retrieval',
        'contact-center/api-reference/agent-presence',
        'contact-center/api-reference/get-all-processes',
        'contact-center/api-reference/get-all-campaigns',
        'contact-center/api-reference/get-campaign-leads',
        'contact-center/api-reference/assign-users-to-lead',
        'contact-center/api-reference/get-assigned-users',
      ],
    },
  ],

  contactCenterV4Sidebar: [
    'contact-center-v4/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'contact-center-v4/api-reference/login',
        'contact-center-v4/api-reference/manage-users',
        'contact-center-v4/api-reference/customer-callbacks',
        'contact-center-v4/api-reference/voicelogs',
      ],
    },
  ],

  legsSidebar: [
    'legs/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'legs/api-reference/create-leg',
        'legs/api-reference/manage-legs',
      ],
    },
  ],

  ipPstnWebrtcSidebar: [
    'ip-pstn-webrtc/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'ip-pstn-webrtc/api-reference/authentication',
        'ip-pstn-webrtc/api-reference/applications',
        'ip-pstn-webrtc/api-reference/app-settings',
        'ip-pstn-webrtc/api-reference/users',
        'ip-pstn-webrtc/api-reference/device-management',
        'ip-pstn-webrtc/api-reference/call-notifications',
        'ip-pstn-webrtc/api-reference/customer-management',
      ],
    },
  ],

  whatsappOnboardingSidebar: [
    'whatsapp-api/onboarding/overview',
  ],

  rcsOmnichannelSidebar: [
    'rcs-omnichannel/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'rcs-omnichannel/api-reference/send-message',
      ],
    },
  ],

  genAiSidebar: [
    'gen-ai/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'gen-ai/api-reference/exovoice-analyze',
        'gen-ai/api-reference/exomind-tasker',
      ],
    },
  ],

  agentStreamSidebar: [
    'agentstream/overview',
    'agentstream/getting-started',
    {
      type: 'category',
      label: 'Applets & Streaming',
      collapsed: false,
      items: [
        'agentstream/passthru-applet',
        'agentstream/stream-voicebot-applet',
        'agentstream/stream-voicebot-extension',
        'agentstream/bot-stream-legs-api',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      items: [
        'agentstream/omnidimension-integration',
        'agentstream/livekit-integration',
        'agentstream/elevenlabs-integration',
        'agentstream/manage-exotrunks',
      ],
    },
  ],

  vsipSidebar: [
    'vsip/overview',
    'vsip/master-guide',
    'vsip/flow-api-configuration',
    {
      type: 'category',
      label: 'Integration Guides',
      collapsed: false,
      items: [
        'vsip/tls-integration',
        'vsip/tcp-integration',
        'vsip/fqdn-integration',
        'vsip/flow-integration',
        'vsip/voicebot-integration',
      ],
    },
  ],

  mcpServerSidebar: [
    'mcp-server/overview',
  ],

  useCasesSidebar: [
    'use-cases/overview',
    'use-cases/business-monitoring-dashboard',
    'use-cases/call-monitoring-visualization',
    'use-cases/dynamic-caller-id-campaigns',
    'use-cases/progressive-dialer',
    'use-cases/interactive-sms',
  ],

  faqsSidebar: [
    'faqs/overview',
    {
      type: 'category',
      label: 'General',
      collapsed: false,
      items: [
        'faqs/account-setup',
        'faqs/pricing-plans',
        'faqs/number-types',
        'faqs/security-compliance',
        'faqs/billing-faqs',
        'faqs/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Product FAQs',
      collapsed: true,
      items: [
        'faqs/api-faqs',
        'faqs/voice-faqs',
        'faqs/sms-faqs',
        'faqs/whatsapp-faqs',
        'faqs/campaign-faqs',
        'faqs/integration-faqs',
      ],
    },
    {
      type: 'category',
      label: 'Regulations & Compliance',
      collapsed: true,
      items: [
        'faqs/trai-regulations',
        'faqs/ndnc-dnd',
        'faqs/dlt-compliance',
        'faqs/tcccpr-2018',
        'faqs/calling-hours',
        'faqs/international-calling',
        'faqs/data-privacy',
        'faqs/spam-prevention',
      ],
    },
  ],

  referencesSidebar: [
    'references/authentication',
    'references/error-codes',
    'references/webhooks',
    'references/changelog',
  ],

  chatbotSidebar: [
    'chatbot/overview',
    'chatbot/getting-started',
    {
      type: 'category',
      label: 'Building Your Bot',
      collapsed: false,
      items: [
        'chatbot/workflows',
        'chatbot/flow-builder',
        'chatbot/bot-messages',
        'chatbot/bot-prompts',
        'chatbot/actions',
        'chatbot/logic',
        'chatbot/database',
        'chatbot/api',
        'chatbot/functions',
        'chatbot/categories',
      ],
    },
    'chatbot/settings',
    'chatbot/integrations',
    {
      type: 'category',
      label: 'Analytics & Reporting',
      collapsed: false,
      items: [
        'chatbot/analytics',
        'chatbot/combined-analytics',
        'chatbot/conversion-analytics',
        'chatbot/download-reports',
      ],
    },
    'chatbot/ai-agents',
  ],

  callSupportSidebar: [
    {
      type: 'category',
      label: 'Cloud Telephony Basics',
      collapsed: false,
      items: [
        'call-support/basics/cloud-telephony-overview',
        'call-support/basics/how-exotel-works',
        'call-support/basics/terminologies',
        'call-support/basics/services',
        'call-support/basics/virtual-numbers',
        'call-support/basics/getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Call Features',
      collapsed: false,
      items: [
        'call-support/call-features/setting-up-call-flow',
        'call-support/call-features/make-receive-calls',
        'call-support/call-features/ivr-setup',
        'call-support/call-features/call-recording',
        'call-support/call-features/call-forwarding',
        'call-support/call-features/sticky-agent',
        'call-support/call-features/missed-call',
        'call-support/call-features/call-queue',
        'call-support/call-features/parallel-ringing',
        'call-support/call-features/business-hours',
        'call-support/call-features/outgoing-calls',
        'call-support/call-features/voicemail',
        'call-support/call-features/greeting-message',
        'call-support/call-features/call-analytics',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      collapsed: true,
      items: [
        'call-support/advanced-features/number-masking',
        'call-support/advanced-features/flow-builder',
        'call-support/advanced-features/outbound-dialer',
        'call-support/advanced-features/smart-routing',
        'call-support/advanced-features/truecaller-verified-caller-id',
        'call-support/advanced-features/multi-level-ivr',
        'call-support/advanced-features/auto-retry',
        'call-support/advanced-features/automated-calls',
      ],
    },
  ],

  smsSupportSidebar: [
    'sms-support/overview',
    {
      type: 'category',
      label: 'SMS Basics',
      collapsed: false,
      items: [
        'sms-support/how-to-send-sms',
        'sms-support/sms-templates',
        'sms-support/sender-id',
        'sms-support/transactional-sms',
        'sms-support/promotional-sms',
        'sms-support/sms-pricing',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      collapsed: true,
      items: [
        'sms-support/bulk-sms',
        'sms-support/two-way-sms',
        'sms-support/sms-webhooks',
        'sms-support/unicode-sms',
        'sms-support/long-sms',
        'sms-support/sms-delivery-reports',
        'sms-support/sms-status-codes',
        'sms-support/sms-api-errors',
      ],
    },
    {
      type: 'category',
      label: 'DLT Compliance',
      collapsed: true,
      items: [
        'sms-support/what-is-dlt',
        'sms-support/dlt-registration',
        'sms-support/dlt-guide',
        'sms-support/dlt-entity-registration',
        'sms-support/dlt-header-registration',
        'sms-support/dlt-template-registration',
        'sms-support/dlt-consent-template',
      ],
    },
  ],

  whatsappSupportSidebar: [
    'whatsapp-support/whatsapp-overview',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'whatsapp-support/getting-started',
        'whatsapp-support/business-verification',
        'whatsapp-support/number-requirements',
        'whatsapp-support/display-name-guidelines',
      ],
    },
    {
      type: 'category',
      label: 'Messaging',
      collapsed: false,
      items: [
        'whatsapp-support/message-types',
        'whatsapp-support/template-messages',
        'whatsapp-support/session-messages',
        'whatsapp-support/interactive-messages',
        'whatsapp-support/media-messages',
      ],
    },
    {
      type: 'category',
      label: 'Templates & Compliance',
      collapsed: true,
      items: [
        'whatsapp-support/creating-templates',
        'whatsapp-support/template-guidelines',
        'whatsapp-support/template-categories',
        'whatsapp-support/quality-rating',
        'whatsapp-support/messaging-limits',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: true,
      items: [
        'whatsapp-support/webhooks',
        'whatsapp-support/status-codes',
        'whatsapp-support/commerce',
        'whatsapp-support/catalog',
        'whatsapp-support/flows',
        'whatsapp-support/payments',
      ],
    },
  ],

  campaignGuidesSidebar: [
    'campaign-guides/overview',
    {
      type: 'category',
      label: 'Voice Campaigns',
      collapsed: false,
      items: [
        'campaign-guides/creating-voice-campaign',
        'campaign-guides/campaign-scheduling',
        'campaign-guides/campaign-retry-logic',
        'campaign-guides/campaign-reporting',
        'campaign-guides/campaign-contacts-management',
        'campaign-guides/campaign-best-practices',
      ],
    },
    {
      type: 'category',
      label: 'SMS Campaigns',
      collapsed: false,
      items: [
        'campaign-guides/creating-sms-campaign',
        'campaign-guides/sms-campaign-templates',
        'campaign-guides/sms-campaign-reporting',
      ],
    },
  ],

  gettingStartedSidebar: [
    'getting-started/overview',
    'getting-started/create-account',
    'getting-started/kyc-verification',
    'getting-started/trial-account',
    'getting-started/upgrade-account',
    'getting-started/dashboard-overview',
    'getting-started/exophone-setup',
    'getting-started/first-call-flow',
    'getting-started/team-management',
    'getting-started/api-credentials',
    'getting-started/testing-guide',
  ],

  billingSidebar: [
    'billing/overview',
    'billing/pricing-model',
    'billing/plans-comparison',
    'billing/add-credits',
    'billing/usage-tracking',
    'billing/invoices',
    'billing/refund-policy',
    'billing/enterprise-billing',
    'billing/international-rates',
  ],

  reportingSidebar: [
    'reporting/overview',
    'reporting/call-logs',
    'reporting/cdr-reports',
    'reporting/sms-reports',
    'reporting/real-time-dashboard',
    'reporting/scheduled-reports',
    'reporting/custom-reports',
    'reporting/analytics-dashboard',
    'reporting/recording-access',
  ],

  appBazaarSidebar: [
    'app-bazaar/overview',
    'app-bazaar/app-builder',
    'app-bazaar/flow-builder-guide',
    {
      type: 'category',
      label: 'Applet Guides',
      collapsed: false,
      items: [
        'app-bazaar/greeting-applet-guide',
        'app-bazaar/connect-applet-guide',
        'app-bazaar/ivr-applet-guide',
        'app-bazaar/passthru-applet-guide',
        'app-bazaar/sms-applet-guide',
      ],
    },
  ],

  advancedConfigSidebar: [
    'advanced-config/overview',
    'advanced-config/webhooks-setup',
    'advanced-config/ip-whitelisting',
    'advanced-config/rate-limiting',
    'advanced-config/high-availability',
    'advanced-config/number-masking-setup',
    'advanced-config/call-recording-config',
    'advanced-config/tts-config',
    'advanced-config/custom-caller-id',
    'advanced-config/concurrent-calls',
    'advanced-config/network-requirements',
  ],

  integrationsSidebar: [
    'integrations/overview',
    {
      type: 'category',
      label: 'Zoho',
      collapsed: false,
      items: [
        'integrations/zoho-desk',
        'integrations/zoho-crm',
      ],
    },
    {
      type: 'category',
      label: 'Freshworks',
      collapsed: false,
      items: [
        'integrations/freshdesk',
        'integrations/freshchat',
        'integrations/freshsales',
        'integrations/freshdesk-secure-recording',
      ],
    },
    {
      type: 'category',
      label: 'HubSpot',
      collapsed: false,
      items: [
        'integrations/hubspot',
      ],
    },
    {
      type: 'category',
      label: 'LeadSquared',
      collapsed: false,
      items: [
        'integrations/leadsquared-utc',
        'integrations/leadsquared-mobile',
        'integrations/leadsquared-ip-pstn',
        'integrations/leadsquared-whatsapp',
      ],
    },
    {
      type: 'category',
      label: 'SMS Integrations',
      collapsed: false,
      items: [
        'integrations/clevertap-generic',
        'integrations/clevertap-native',
        'integrations/webengage',
        'integrations/moengage',
      ],
    },
    {
      type: 'category',
      label: 'Salesforce',
      collapsed: false,
      items: [
        'integrations/salesforce',
        'integrations/salesforce-secure-recording',
      ],
    },
    'integrations/shopify',
    'integrations/webrtc-sdk',
  ],

  voicebotToolsSidebar: [
    'voicebot-tools/overview',
    'voicebot-tools/voicebot-api',
    'voicebot-tools/api-reference',
    'voicebot-tools/mcp-integration',
  ],
};

export default sidebars;
