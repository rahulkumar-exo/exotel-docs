import React from 'react';
import styles from './styles.module.css';

interface TryItBannerProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
}

export default function TryItBanner({ method, endpoint }: TryItBannerProps) {
  const handleClick = () => {
    // Dispatch event to tell ApiConsole to open itself
    window.dispatchEvent(new CustomEvent('tryit-open'));

    const el = document.getElementById('try-it');
    if (el) {
      // Small delay so the panel renders before we scroll
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
