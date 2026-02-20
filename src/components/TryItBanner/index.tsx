import React from 'react';
import styles from './styles.module.css';

interface TryItBannerProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
}

export default function TryItBanner({ method, endpoint }: TryItBannerProps) {
  const handleClick = () => {
    const el = document.getElementById('try-it');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Auto-expand the console after scrolling
      setTimeout(() => {
        const btn = el.querySelector('button');
        if (btn && !el.querySelector('[class*="panel"]')) {
          btn.click();
        }
      }, 500);
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
