import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import CopyPageButton from '@site/src/components/CopyPageButton';
import styles from '@site/src/components/CopyPageButton/styles.module.css';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  return (
    <div className={styles.anchor}>
      <CopyPageButton />
      <Content {...props} />
    </div>
  );
}
