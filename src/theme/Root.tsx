import React from 'react';
import AiChat from '@site/src/components/AiChat';

// Wraps the entire Docusaurus app to add the AI Chat widget globally
export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <AiChat />
    </>
  );
}
