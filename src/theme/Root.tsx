import React from 'react';
import AiChat from '@site/src/components/AiChat';
import DocsSearch from '@site/src/components/DocsSearch';
import { Analytics } from '@vercel/analytics/react';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <DocsSearch />
      <AiChat />
      <Analytics />
    </>
  );
}
