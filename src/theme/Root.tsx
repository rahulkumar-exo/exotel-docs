import React from 'react';
import AiChat from '@site/src/components/AiChat';
import { Analytics } from '@vercel/analytics/react';

// Wraps the entire Docusaurus app to add the AI Chat widget and analytics globally
export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <AiChat />
      <Analytics />
    </>
  );
}
