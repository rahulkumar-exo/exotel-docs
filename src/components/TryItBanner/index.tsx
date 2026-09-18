import React from 'react';
import styles from './styles.module.css';

interface TryItBannerProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
}

export default function TryItBanner({ method, endpoint }: TryItBannerProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const article = event.currentTarget.closest('article') ?? document;
    const el = article.querySelector<HTMLElement>('[data-try-it-console]');
    window.dispatchEvent(new CustomEvent('tryit-open', { detail: el ?? undefined }));

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className={styles.banner}>
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
