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
};

export default sidebars;
