import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface SwaggerUIProps {
  specUrl?: string;
  spec?: object;
}

export default function SwaggerUIComponent({ specUrl, spec }: SwaggerUIProps) {
  return (
    <BrowserOnly fallback={<div>Loading API documentation...</div>}>
      {() => {
        const SwaggerUI = require('swagger-ui-react');
        require('swagger-ui-react/swagger-ui.css');
        return (
          <div style={{ margin: '0 -1rem' }}>
            <SwaggerUI
              url={specUrl}
              spec={spec}
              docExpansion="list"
              defaultModelsExpandDepth={1}
              tryItOutEnabled={true}
            />
          </div>
        );
      }}
    </BrowserOnly>
  );
}
