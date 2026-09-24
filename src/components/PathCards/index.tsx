import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

export type PathCardItem = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

type PathCardsProps = {
  items: PathCardItem[];
};

export default function PathCards({items}: PathCardsProps): React.ReactElement {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Link
          key={item.href}
          className={clsx(styles.card)}
          to={item.href}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{item.title}</span>
            {item.badge ? (
              <span className={styles.badge}>{item.badge}</span>
            ) : null}
          </div>
          <p className={styles.cardDescription}>{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
