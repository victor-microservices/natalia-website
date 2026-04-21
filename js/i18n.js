/**
 * Natália Vicente — Nail Designer
 * i18n engine: loads per-language dictionaries (i18n/{lang}.json) and applies
 * translations to elements marked with data-i18n* attributes. Persists the
 * user's choice in localStorage and re-applies on toggle.
 *
 * Attributes:
 *   data-i18n="key"             → sets textContent
 *   data-i18n-html="key"        → sets innerHTML (use for entries containing markup)
 *   data-i18n-alt="key"         → sets alt attribute
 *   data-i18n-aria-label="key"  → sets aria-label attribute
 *   data-i18n-title="key"       → sets title attribute
 *   data-i18n-placeholder="key" → sets placeholder attribute
 *   data-i18n-content="key"     → sets content attribute (meta tags)
 *
 * Public API on window.NVi18n:
 *   t(key, params)  — translate a key with optional {{param}} interpolation
 *   setLang(lang)   — switch language (returns Promise)
 *   lang            — current language code
 *   ready           — Promise resolved after the initial dictionary loads
 *
 * A `nv:lang-change` CustomEvent is dispatched on `document` whenever the
 * language changes, so other scripts can re-apply dynamic strings.
 */
(function () {
  'use strict';

  const LANGS       = ['pt', 'en'];
  const DEFAULT_LANG = 'pt';
  const STORAGE_KEY  = 'nv.lang';
  const ATTR_MAP     = ['alt', 'aria-label', 'aria-roledescription', 'title', 'placeholder', 'content'];

  let dict        = {};
  let currentLang = DEFAULT_LANG;

  function t(key, params) {
    const parts = key.split('.');
    let v = dict;
    for (const p of parts) {
      if (v && typeof v === 'object' && p in v) v = v[p];
      else return key;
    }
    if (typeof v !== 'string') return key;
    if (params) {
      v = v.replace(/\{\{(\w+)\}\}/g, (_, name) => (name in params ? params[name] : `{{${name}}}`));
    }
    return v;
  }

  function applyDom(root) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    ATTR_MAP.forEach((attr) => {
      root.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
        el.setAttribute(attr, t(el.getAttribute(`data-i18n-${attr}`)));
      });
    });
  }

  // Head tags that can't carry data-* attributes cleanly are updated directly.
  function applyMeta() {
    const htmlLang = t('meta.html_lang');
    if (htmlLang && htmlLang !== 'meta.html_lang') {
      document.documentElement.setAttribute('lang', htmlLang);
    }
    const title = t('meta.title');
    if (title && title !== 'meta.title') document.title = title;
  }

  async function load(lang) {
    if (!LANGS.includes(lang)) lang = DEFAULT_LANG;
    const res = await fetch(`i18n/${lang}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`i18n load failed for ${lang}: ${res.status}`);
    dict        = await res.json();
    currentLang = lang;
  }

  async function setLang(lang) {
    await load(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* storage unavailable */ }
    applyMeta();
    applyDom(document);
    document.dispatchEvent(new CustomEvent('nv:lang-change', { detail: { lang: currentLang } }));
  }

  function detectInitial() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) { /* storage unavailable */ }
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('en')) return 'en';
    return DEFAULT_LANG;
  }

  function wireToggles() {
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLang(currentLang === 'pt' ? 'en' : 'pt').catch((err) => console.error('[i18n]', err));
      });
    });
  }

  const ready = setLang(detectInitial()).catch((err) => {
    console.error('[i18n] initial load failed:', err);
  });

  Object.defineProperty(window, 'NVi18n', {
    value: Object.freeze({
      t,
      setLang,
      ready,
      get lang() { return currentLang; }
    }),
    writable: false,
    configurable: false
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggles);
  } else {
    wireToggles();
  }
})();
