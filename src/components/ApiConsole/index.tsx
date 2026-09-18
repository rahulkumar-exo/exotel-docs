import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './styles.module.css';

interface ApiParam {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  defaultValue?: string;
  options?: string[]; // for select type
  placeholder?: string;
}

interface ApiConsoleProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string; // e.g. "/v1/Accounts/{account_sid}/Calls/connect"
  params: ApiParam[];
  contentType?: 'form' | 'json'; // default: form
  host?: 'api' | 'ccm';
}

interface Credentials {
  apiKey: string;
  apiToken: string;
  accountSid: string;
  subdomain: string;
}

const STORAGE_KEY = 'exotel-api-console-creds';

function loadCredentials(): Credentials {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { apiKey: '', apiToken: '', accountSid: '', subdomain: 'api.exotel.com' };
}

function saveCredentials(creds: Credentials) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  } catch {}
}

function isMumbai(subdomain: string) {
  return subdomain.includes('.in.');
}

function hostForRegion(kind: 'api' | 'ccm', mumbai: boolean) {
  if (kind === 'ccm') {
    return mumbai ? 'ccm-api.in.exotel.com' : 'ccm-api.exotel.com';
  }
  return mumbai ? 'api.in.exotel.com' : 'api.exotel.com';
}

function filledParams(
  paramValues: Record<string, string>,
  pathParamNames: string[],
): [string, string][] {
  return Object.entries(paramValues).filter(([key, value]) => value !== '' && !pathParamNames.includes(key));
}

function queryStringFrom(pairs: [string, string][]): string {
  if (pairs.length === 0) {
    return '';
  }
  return '?' + pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}

function requestBodyFrom(
  method: string,
  contentType: 'form' | 'json',
  pairs: [string, string][],
  params: ApiParam[],
): { jsonBody?: Record<string, unknown>; bodyData?: string; bodyContentType?: string } {
  if (method === 'GET' || pairs.length === 0) {
    return {};
  }
  if (contentType === 'json') {
    const jsonBody: Record<string, unknown> = {};
    pairs.forEach(([key, value]) => {
      jsonBody[key] = coerceParamValue(params.find((param) => param.name === key), value);
    });
    return {
      jsonBody,
      bodyData: JSON.stringify(jsonBody),
      bodyContentType: 'application/json',
    };
  }
  return {
    bodyData: pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&'),
    bodyContentType: 'application/x-www-form-urlencoded',
  };
}

function coerceParamValue(paramDef: ApiParam | undefined, value: string): unknown {
  if (paramDef?.type === 'number') return Number(value);
  if (paramDef?.type === 'boolean') return value === 'true';
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

export default function ApiConsole(props: ApiConsoleProps) {
  return <ApiConsoleInner key={`${props.host}-${props.method}-${props.path}`} {...props} />;
}

function ApiConsoleInner({ method, path, params = [], contentType = 'form', host = 'api' }: ApiConsoleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [creds, setCreds] = useState<Credentials>(loadCredentials);
  const [showCreds, setShowCreds] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curlCommand, setCurlCommand] = useState('');
  const [activeTab, setActiveTab] = useState<'response' | 'curl'>('response');
  const [copied, setCopied] = useState(false);

  // Check if creds need to be shown on first open
  useEffect(() => {
    if (isOpen && (!creds.apiKey || !creds.apiToken || !creds.accountSid)) {
      setShowCreds(true);
    }
  }, [isOpen]);

  // Open only the console on this page, not a leftover from the last page.
  useEffect(() => {
    const handleTryItOpen = (event: Event) => {
      const target = (event as CustomEvent<HTMLElement | undefined>).detail;
      if (target && target !== rootRef.current) {
        return;
      }
      setIsOpen(true);
    };
    window.addEventListener('tryit-open', handleTryItOpen);
    return () => window.removeEventListener('tryit-open', handleTryItOpen);
  }, []);

  const paramsKey = JSON.stringify(params.map((p) => [p.name, p.defaultValue]));
  useEffect(() => {
    const defaults: Record<string, string> = {};
    params.forEach((p) => {
      if (p.defaultValue) defaults[p.name] = p.defaultValue;
    });
    setParamValues(defaults);
    setResponse('');
    setStatusCode(null);
  }, [paramsKey]);

  const updateCreds = useCallback((field: keyof Credentials, value: string) => {
    setCreds((prev) => {
      const next = { ...prev, [field]: value };
      saveCredentials(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onRegion = (event: Event) => {
      const regionId = (event as CustomEvent<{regionId?: string}>).detail?.regionId;
      if (regionId !== 'mumbai' && regionId !== 'singapore') {
        return;
      }
      const nextHost = hostForRegion(host, regionId === 'mumbai');
      setCreds((prev) => {
        if (hostForRegion(host, isMumbai(prev.subdomain)) === nextHost) {
          return prev;
        }
        const next = { ...prev, subdomain: nextHost };
        saveCredentials(next);
        return next;
      });
    };
    window.addEventListener('exotel-region-change', onRegion);
    return () => window.removeEventListener('exotel-region-change', onRegion);
  }, [host]);

  // Detect which params are URL path params (appear as {param_name} in the path)
  const pathParamNames = (path.match(/\{(\w+)\}/g) || [])
    .map((m) => m.slice(1, -1))
    .filter((n) => n !== 'account_sid');

  const resolvePathParams = useCallback((p: string, vals: Record<string, string>) => {
    let resolved = p.replace('{account_sid}', creds.accountSid || '{account_sid}');
    pathParamNames.forEach((name) => {
      resolved = resolved.replace(`{${name}}`, vals[name] || `{${name}}`);
    });
    return resolved;
  }, [path, creds.accountSid, pathParamNames.join(',')]);

  const requestHost = hostForRegion(host, isMumbai(creds.subdomain));

  const buildUrl = useCallback(() => {
    return `https://${requestHost}${resolvePathParams(path, paramValues)}`;
  }, [path, requestHost, paramValues, resolvePathParams]);

  const buildCurl = useCallback(() => {
    const url = buildUrl();
    const authPart = creds.apiKey && creds.apiToken
      ? ` \\\n  -u "${creds.apiKey}:${creds.apiToken}"`
      : '';

    const pairs = filledParams(paramValues, pathParamNames);
    const queryString = method === 'GET' ? queryStringFrom(pairs) : '';
    const { jsonBody, bodyContentType } = requestBodyFrom(method, contentType, pairs, params);

    let body = '';
    if (bodyContentType === 'application/json' && jsonBody) {
      body = ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(jsonBody, null, 2)}'`;
    } else if (bodyContentType === 'application/x-www-form-urlencoded') {
      body = pairs.map(([key, value]) => ` \\\n  -d '${key}=${value}'`).join('');
    }

    return `curl -X ${method} '${url}${queryString}'${authPart}${body}`;
  }, [method, buildUrl, paramValues, contentType, params, creds]);

  useEffect(() => {
    if (isOpen) setCurlCommand(buildCurl());
  }, [isOpen, paramValues, creds, buildCurl]);

  const handleTry = async () => {
    if (!creds.apiKey || !creds.apiToken || !creds.accountSid) {
      setShowCreds(true);
      return;
    }

    setIsLoading(true);
    setResponse('');
    setStatusCode(null);
    setActiveTab('response');

    try {
      const pairs = filledParams(paramValues, pathParamNames);
      const resolvedPath = resolvePathParams(path, paramValues);
      const queryString = method === 'GET' ? queryStringFrom(pairs) : '';
      const { bodyData, bodyContentType } = requestBodyFrom(method, contentType, pairs, params);

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          subdomain: requestHost,
          path: resolvedPath + queryString,
          apiKey: creds.apiKey,
          apiToken: creds.apiToken,
          body: bodyData,
          bodyContentType,
        }),
      });

      const raw = await res.text();
      let data: { status?: number; body?: string; error?: string };
      try {
        data = JSON.parse(raw);
      } catch {
        setStatusCode(res.status);
        setResponse(
          'The Try It proxy is not available on this page load. Restart the local docs server, or try again on the deployed site.',
        );
        return;
      }
      if (data.error && data.body === undefined) {
        setStatusCode(res.status);
        setResponse(data.error);
        return;
      }
      setStatusCode(data.status || res.status);
      try {
        setResponse(JSON.stringify(JSON.parse(data.body || ''), null, 2));
      } catch {
        setResponse(data.body || JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setStatusCode(0);
      setResponse(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const hasRequiredCreds = creds.apiKey && creds.apiToken && creds.accountSid;

  return (
    <div
      ref={rootRef}
      className={styles.console}
      id={`try-it-${method}-${path.replace(/[^a-zA-Z0-9]+/g, '-')}`}
      data-try-it-console=""
    >
      <button
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleBtnOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.toggleIcon}>{isOpen ? '▾' : '▸'}</span>
        <span className={styles.methodBadge} data-method={method}>{method}</span>
        Try it
      </button>

      {isOpen && (
        <div className={styles.panel}>
          {/* Credentials */}
          <div className={styles.credsSection}>
            <button
              className={styles.credsToggle}
              onClick={() => setShowCreds(!showCreds)}
            >
              {hasRequiredCreds ? '✓ Credentials configured' : '⚠ Set credentials'}
              <span className={styles.credsChevron}>{showCreds ? '▴' : '▾'}</span>
            </button>

            {showCreds && (
              <div className={styles.credsForm}>
                <div className={styles.credsRow}>
                  <div className={styles.credsField}>
                    <label>API Key</label>
                    <input
                      type="text"
                      value={creds.apiKey}
                      onChange={(e) => updateCreds('apiKey', e.target.value)}
                      placeholder="Your API Key"
                    />
                  </div>
                  <div className={styles.credsField}>
                    <label>API Token</label>
                    <input
                      type="password"
                      value={creds.apiToken}
                      onChange={(e) => updateCreds('apiToken', e.target.value)}
                      placeholder="Your API Token"
                    />
                  </div>
                </div>
                <div className={styles.credsRow}>
                  <div className={styles.credsField}>
                    <label>Account SID</label>
                    <input
                      type="text"
                      value={creds.accountSid}
                      onChange={(e) => updateCreds('accountSid', e.target.value)}
                      placeholder="Your Account SID"
                    />
                  </div>
                  <div className={styles.credsField}>
                    <label>Subdomain</label>
                    <select
                      value={requestHost}
                      onChange={(e) => {
                        updateCreds('subdomain', e.target.value);
                        window.dispatchEvent(
                          new CustomEvent('exotel-region-change', {
                            detail: { regionId: isMumbai(e.target.value) ? 'mumbai' : 'singapore' },
                          }),
                        );
                      }}
                    >
                      <option value={hostForRegion(host, false)}>
                        {hostForRegion(host, false)} (Singapore)
                      </option>
                      <option value={hostForRegion(host, true)}>
                        {hostForRegion(host, true)} (Mumbai)
                      </option>
                    </select>
                  </div>
                </div>
                <p className={styles.credsHint}>
                  Find these in your <a href="https://my.exotel.com" target="_blank" rel="noopener noreferrer">Exotel Dashboard</a> &rarr; Settings &rarr; API Settings. Saved locally in your browser.
                </p>
              </div>
            )}
          </div>

          {/* Parameters */}
          {params.length > 0 && (
            <div className={styles.paramsSection}>
              <h4 className={styles.sectionLabel}>Parameters</h4>
              <div className={styles.paramsGrid}>
                {params.map((param) => (
                  <div key={param.name} className={styles.paramRow}>
                    <div className={styles.paramHeader}>
                      <code className={styles.paramName}>{param.name}</code>
                      {param.required && <span className={styles.requiredBadge}>required</span>}
                      <span className={styles.paramType}>{param.type}</span>
                    </div>
                    <p className={styles.paramDesc}>{param.description}</p>
                    {param.type === 'boolean' ? (
                      <select
                        className={styles.paramInput}
                        value={paramValues[param.name] || ''}
                        onChange={(e) => setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
                      >
                        <option value="">— Select —</option>
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : param.type === 'select' ? (
                      <select
                        className={styles.paramInput}
                        value={paramValues[param.name] || ''}
                        onChange={(e) => setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
                      >
                        <option value="">— Select —</option>
                        {param.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={styles.paramInput}
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={paramValues[param.name] || ''}
                        onChange={(e) => setParamValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
                        placeholder={param.placeholder || `Enter ${param.name}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.tryBtn}
              onClick={handleTry}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
            <button
              className={styles.clearBtn}
              onClick={() => {
                setParamValues({});
                setResponse('');
                setStatusCode(null);
              }}
            >
              Clear
            </button>
          </div>

          {/* Response */}
          {(response || isLoading) && (
            <div className={styles.responseSection}>
              <div className={styles.responseTabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'response' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('response')}
                >
                  Response
                  {statusCode !== null && (
                    <span
                      className={styles.statusBadge}
                      data-status={statusCode >= 200 && statusCode < 300 ? 'success' : 'error'}
                    >
                      {statusCode}
                    </span>
                  )}
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'curl' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('curl')}
                >
                  cURL
                </button>
                <button
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(activeTab === 'curl' ? curlCommand : response)}
                  title="Copy to clipboard"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className={styles.responseBody}>
                {isLoading ? (
                  <span className={styles.loadingDots}>Waiting for response<span>...</span></span>
                ) : activeTab === 'curl' ? curlCommand : response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
