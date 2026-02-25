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

  mcpServerSidebar: [
    'mcp-server/overview',
  ],

  faqsSidebar: [
    'faqs/overview',
  ],

  referencesSidebar: [
    'references/authentication',
    'references/error-codes',
    'references/webhooks',
    'references/changelog',
  ],
};

export default sidebars;
