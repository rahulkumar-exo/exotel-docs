import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface SwaggerUIProps {
  specUrl?: string;
  spec?: object;
}

function SwaggerUILoader({ specUrl, spec }: SwaggerUIProps) {
  const [SwaggerComponent, setSwaggerComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('swagger-ui-react').then((mod) => {
      setSwaggerComponent(() => mod.default || mod);
    });
    // Load CSS
    import('swagger-ui-react/swagger-ui.css');
  }, []);

  if (!SwaggerComponent) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#808285' }}>Loading Swagger UI...</div>;
  }

  return (
    <div style={{ margin: '0 -1rem' }}>
      <SwaggerComponent
        url={specUrl}
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={1}
        tryItOutEnabled={true}
      />
    </div>
  );
}

export default function SwaggerUIComponent({ specUrl, spec }: SwaggerUIProps) {
  return (
    <BrowserOnly fallback={<div>Loading API documentation...</div>}>
      {() => <SwaggerUILoader specUrl={specUrl} spec={spec} />}
    </BrowserOnly>
  );
}
