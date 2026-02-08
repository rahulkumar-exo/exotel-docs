import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  voiceApiSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'voice-api/getting-started/overview',
        'voice-api/getting-started/authentication',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'voice-api/api-reference/make-a-call',
        'voice-api/api-reference/outgoing-call-to-flow',
        'voice-api/api-reference/incoming-call',
        'voice-api/api-reference/call-details',
        'voice-api/api-reference/bulk-call-details',
        'voice-api/api-reference/number-metadata',
        'voice-api/api-reference/status-callback',
        'voice-api/api-reference/exophone',
      ],
    },
    {
      type: 'category',
      label: 'Applets',
      collapsed: false,
      items: [
        'voice-api/applets/greeting',
        'voice-api/applets/connect',
        'voice-api/applets/passthru',
        'voice-api/applets/transfer',
        'voice-api/applets/ivr-menu',
        'voice-api/applets/voicemail',
        'voice-api/applets/hangup',
        'voice-api/applets/sms',
        'voice-api/applets/email',
      ],
    },
  ],

  voiceV1Sidebar: [
    'voice-v1/overview',
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'voice-v1/api-reference/connect-two-numbers',
        'voice-v1/api-reference/connect-to-flow',
        'voice-v1/api-reference/call-details',
      ],
    },
  ],

  smsApiSidebar: [
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
        'whatsapp-api/api-reference/templates',
        'whatsapp-api/api-reference/bulk-messages',
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
        'contact-center/api-reference/make-call',
        'contact-center/api-reference/call-details',
      ],
    },
  ],

  contactCenterV4Sidebar: [
    'contact-center-v4/overview',
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
};

export default sidebars;
