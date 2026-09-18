/**
 * Puts Singapore / Mumbai on each language sample card
 * and rewrites api / ccm hosts in the code when the region changes.
 */

const STORAGE_KEY = 'exotel-docs-region';
const EVENT = 'exotel-region-change';

const REGIONS = [
  {id: 'singapore', label: 'Singapore'},
  {id: 'mumbai', label: 'Mumbai'},
];

function readRegion() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'mumbai' || saved === 'singapore') {
      return saved;
    }
  } catch {
    /* ignore */
  }
  return 'singapore';
}

function applyRegion(text, regionId) {
  if (regionId === 'mumbai') {
    return text
      .replaceAll('ccm-api.exotel.com', 'ccm-api.in.exotel.com')
      .replaceAll('api.exotel.com', 'api.in.exotel.com');
  }
  return text
    .replaceAll('ccm-api.in.exotel.com', 'ccm-api.exotel.com')
    .replaceAll('api.in.exotel.com', 'api.exotel.com');
}

function rewriteTree(root, regionId) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  for (const node of nodes) {
    const next = applyRegion(node.nodeValue, regionId);
    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  }
}

function sampleRoots() {
  return document.querySelectorAll(
    '.tabs-container:has(.theme-code-block), .theme-code-block',
  );
}

function rewriteSamples(regionId) {
  sampleRoots().forEach((root) => rewriteTree(root, regionId));
}

function mountToggle(container, regionId) {
  if (container.querySelector('.exotel-region-bar')) {
    return;
  }
  const tabs = container.querySelector(':scope > .tabs');
  if (!tabs) {
    return;
  }

  const bar = document.createElement('div');
  bar.className = 'exotel-region-bar';

  const label = document.createElement('span');
  label.className = 'exotel-region-bar__label';
  label.textContent = 'Region';

  const group = document.createElement('div');
  group.className = 'exotel-region__group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Region');

  for (const region of REGIONS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'exotel-region__btn';
    button.dataset.region = region.id;
    button.textContent = region.label;
    button.setAttribute('aria-pressed', String(region.id === regionId));
    button.addEventListener('click', () => setRegion(region.id));
    group.appendChild(button);
  }

  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'exotel-region-bar__copy';
  copy.setAttribute('aria-label', 'Copy sample');
  copy.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  copy.addEventListener('click', () => copyActiveSample(container, copy));

  bar.appendChild(label);
  bar.appendChild(group);
  bar.appendChild(copy);
  tabs.after(bar);
}

function copyActiveSample(card, button) {
  const panel =
    card.querySelector('[role="tabpanel"]:not([hidden])') ||
    card.querySelector('.margin-top--md') ||
    card;
  const text = panel.querySelector('pre')?.innerText?.trim();
  if (!text) {
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    button.setAttribute('aria-label', 'Copied');
    window.setTimeout(() => button.setAttribute('aria-label', 'Copy sample'), 1200);
  }).catch(() => {
    /* ignore */
  });
}

function syncToggles(regionId) {
  document.querySelectorAll('.exotel-region__btn').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.region === regionId));
  });
}

function mountAll(regionId) {
  document.querySelectorAll('.tabs-container:has(.theme-code-block)').forEach((card) => {
    const text = card.textContent || '';
    if (
      !text.includes('api.exotel.com') &&
      !text.includes('api.in.exotel.com') &&
      !text.includes('ccm-api.exotel.com') &&
      !text.includes('ccm-api.in.exotel.com')
    ) {
      return;
    }
    mountToggle(card, regionId);
  });
  syncToggles(regionId);
}

function setRegion(regionId) {
  try {
    localStorage.setItem(STORAGE_KEY, regionId);
  } catch {
    /* ignore */
  }
  rewriteSamples(regionId);
  syncToggles(regionId);
  window.dispatchEvent(new CustomEvent(EVENT, {detail: {regionId}}));
}

function syncPage(dispatch = false) {
  const regionId = readRegion();
  mountAll(regionId);
  rewriteSamples(regionId);
  syncToggles(regionId);
  if (dispatch) {
    window.dispatchEvent(new CustomEvent(EVENT, {detail: {regionId}}));
  }
}

function start() {
  if (typeof document === 'undefined') {
    return;
  }

  const run = () => syncPage(true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  if (!document.body) {
    return;
  }

  let timer = 0;
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => syncPage(false), 50);
  });
  observer.observe(document.body, {childList: true, subtree: true});
}

if (typeof window !== 'undefined') {
  window.addEventListener(EVENT, (event) => {
    const regionId = event.detail?.regionId;
    if (regionId !== 'mumbai' && regionId !== 'singapore') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, regionId);
    } catch {
      /* ignore */
    }
    rewriteSamples(regionId);
    syncToggles(regionId);
  });
  start();
}

export function onRouteDidUpdate() {
  if (typeof document === 'undefined') {
    return;
  }
  syncPage(true);
}
