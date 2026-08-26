import React, {useState} from 'react';
import styles from './styles.module.css';

type HostKind = 'api' | 'ccm';

const HOSTS: Record<HostKind, {id: string; label: string; host: string}[]> = {
  api: [
    {id: 'singapore', label: 'Singapore', host: 'api.exotel.com'},
    {id: 'mumbai', label: 'Mumbai', host: 'api.in.exotel.com'},
  ],
  ccm: [
    {id: 'singapore', label: 'Singapore', host: 'ccm-api.exotel.com'},
    {id: 'mumbai', label: 'Mumbai', host: 'ccm-api.in.exotel.com'},
  ],
};

interface RegionalUrlsProps {
  path: string;
  host?: HostKind;
}

export default function RegionalUrls({path, host = 'api'}: RegionalUrlsProps) {
  const regions = HOSTS[host];
  const [regionId, setRegionId] = useState(regions[0].id);
  const [copied, setCopied] = useState(false);
  const region = regions.find((item) => item.id === regionId) ?? regions[0];
  const url = `https://<api_key>:<api_token>@${region.host}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.label}>Regional URL</div>
      <div className={styles.regions} role="tablist" aria-label="Region">
        {regions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === regionId}
            className={item.id === regionId ? styles.regionOn : styles.region}
            onClick={() => setRegionId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.urlRow}>
        <code className={styles.url}>{url}</code>
        <button type="button" className={styles.copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
