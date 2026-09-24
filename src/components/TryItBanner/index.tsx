import React from 'react';
import styles from './styles.module.css';

interface TryItBannerProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
}

function findNextConsole(banner: Element): HTMLElement | undefined {
  const article = banner.closest('article') ?? document.body;
  const consoles = Array.from(
    article.querySelectorAll<HTMLElement>('[data-try-it-console]'),
  );
  return (
    consoles.find(
      (consoleEl) =>
        !!(banner.compareDocumentPosition(consoleEl) & Node.DOCUMENT_POSITION_FOLLOWING),
    ) ?? consoles[0]
  );
}

export default function TryItBanner({ method, endpoint }: TryItBannerProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const banner =
      event.currentTarget.closest('[data-try-it-banner]') ?? event.currentTarget;
    const el = findNextConsole(banner);

    window.dispatchEvent(new CustomEvent('tryit-open', { detail: el }));

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className={styles.banner} data-try-it-banner>
      <div className={styles.bannerLeft}>
        <span className={styles.methodBadge} data-method={method}>{method}</span>
        <code className={styles.endpoint}>{endpoint}</code>
      </div>
      <button className={styles.tryBtn} onClick={handleClick}>
        ▶ Try it live
      </button>
    </div>
  );
}
