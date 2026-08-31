import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './styles.module.css';

interface SourceData {
  sourceUrlByPermalink: Record<string, string>;
}

async function fetchMarkdown(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export default function CopyPageButton(): JSX.Element | null {
  const { pathname } = useLocation();
  const data = usePluginData('docusaurus-plugin-copy-page-source') as
    | SourceData
    | undefined;
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const trimmed = pathname.replace(/\/$/, '') || '/';
  const rawUrl =
    data?.sourceUrlByPermalink?.[trimmed] ??
    data?.sourceUrlByPermalink?.[pathname] ??
    null;

  if (!rawUrl) return null;

  const handleCopy = async () => {
    const md = await fetchMarkdown(rawUrl);
    if (!md) {
      setState('failed');
      setTimeout(() => setState('idle'), 1600);
      return;
    }
    try {
      await navigator.clipboard.writeText(md);
      setState('copied');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      setState('failed');
      setTimeout(() => setState('idle'), 1600);
    }
  };

  const openInLLM = (target: 'chatgpt' | 'claude') => {
    const fullRawUrl = `${window.location.origin}${rawUrl}`;
    const prompt = `Read this Exotel docs page as markdown and be ready to answer questions: ${fullRawUrl}`;
    const url =
      target === 'chatgpt'
        ? `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
        : `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMenuOpen(false);
  };

  const label =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy';

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label="Copy this page as markdown"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {state === 'copied' ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
          <span>{label}</span>
        </button>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="More copy options"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {menuOpen && (
          <div className={styles.menu} role="menu">
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => openInLLM('chatgpt')}
            >
              Open in ChatGPT
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => openInLLM('claude')}
            >
              Open in Claude
            </button>
            <a
              role="menuitem"
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.menuItem}
            >
              View Markdown
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
