import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type OpenSearchDetail = {
  query?: string;
};

type SearchHit = {
  title: string;
  url: string;
  path?: string;
};

const SUGGESTED_DOCS: SearchHit[] = [
  {title: 'Programmable Voice', url: '/docs/voice', path: 'API Reference'},
  {title: 'SMS API', url: '/docs/sms-api/overview', path: 'Messaging'},
  {title: 'WhatsApp API', url: '/docs/whatsapp-api/overview', path: 'Messaging'},
  {title: 'Lead Assist', url: '/docs/lead-assist/overview', path: 'Products'},
];

const RECENT_KEY = 'exotel-docs-recent';
const RESULT_LIMIT = 8;

function readRecent(): SearchHit[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as SearchHit[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function writeRecent(hit: SearchHit): void {
  const next = [hit, ...readRecent().filter((item) => item.url !== hit.url)].slice(0, 6);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function toHit(item: {
  document?: {t?: string; s?: string; u?: string; h?: string};
  page?: {t?: string};
  type?: number;
}): SearchHit | null {
  const doc = item.document;
  if (!doc?.u || item.type === 5) {
    return null;
  }
  return {
    title: doc.t || doc.s || 'Untitled',
    url: `${doc.u}${doc.h || ''}`,
    path: item.page?.t,
  };
}

async function runSearch(baseUrl: string, query: string): Promise<SearchHit[]> {
  try {
    const worker = await import(
      '@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker'
    );
    await worker.fetchIndexesByWorker(baseUrl, '');
    const raw = await worker.searchByWorker(baseUrl, '', query, RESULT_LIMIT);
    return (raw || []).map(toHit).filter((hit): hit is SearchHit => Boolean(hit));
  } catch {
    return [];
  }
}

export default function DocsSearch(): JSX.Element | null {
  const history = useHistory();
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [recent, setRecent] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback((nextQuery?: string) => {
    setRecent(readRecent());
    if (typeof nextQuery === 'string') {
      setQuery(nextQuery);
    }
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenSearchDetail>).detail;
      open(detail?.query ?? '');
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
        return;
      }
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        open();
      }
    };
    const onNavbarClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.navbar__search-launch')) {
        open();
      }
    };
    window.addEventListener('open-docs-search', onOpen);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onNavbarClick);
    return () => {
      window.removeEventListener('open-docs-search', onOpen);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onNavbarClick);
    };
  }, [close, isOpen, open]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  useEffect(() => {
    const value = query.trim();
    if (!isOpen || !value) {
      setHits([]);
      setActive(0);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void runSearch(baseUrl, value).then((next) => {
        if (!cancelled) {
          setHits(next);
          setActive(0);
        }
      });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [baseUrl, isOpen, query]);

  const goTo = (hit: SearchHit) => {
    writeRecent(hit);
    close();
    history.push(hit.url);
  };

  const activate = () => {
    const hit = hits[active];
    if (hit) {
      goTo(hit);
    }
  };

  const onModalKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, Math.max(hits.length - 1, 0)));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      activate();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={close} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-label="Search the docs"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onModalKey}
      >
        <div className={styles.inputRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the docs"
            aria-label="Search the docs"
          />
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {!query.trim() ? (
            <>
              {recent.length > 0 && (
                <section>
                  <div className={styles.sectionLabel}>Recently viewed</div>
                  {recent.map((hit) => (
                    <button key={hit.url} type="button" className={styles.row} onClick={() => goTo(hit)}>
                      <span className={styles.rowTitle}>{hit.title}</span>
                      {hit.path && <span className={styles.rowPath}>{hit.path}</span>}
                    </button>
                  ))}
                </section>
              )}
              <section>
                <div className={styles.sectionLabel}>Suggested</div>
                {SUGGESTED_DOCS.map((hit) => (
                  <button key={hit.url} type="button" className={styles.row} onClick={() => goTo(hit)}>
                    <span className={styles.rowTitle}>{hit.title}</span>
                    {hit.path && <span className={styles.rowPath}>{hit.path}</span>}
                  </button>
                ))}
              </section>
            </>
          ) : hits.length > 0 ? (
            <section>
              <div className={styles.sectionLabel}>Docs</div>
              {hits.map((hit, index) => (
                <button
                  key={`${hit.url}-${index}`}
                  type="button"
                  className={`${styles.row} ${active === index ? styles.rowActive : ''}`}
                  onClick={() => goTo(hit)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span className={styles.rowTitle}>{hit.title}</span>
                  {hit.path && <span className={styles.rowPath}>{hit.path}</span>}
                </button>
              ))}
            </section>
          ) : (
            <p className={styles.empty}>No matching pages.</p>
          )}
        </div>
      </div>
    </div>
  );
}
