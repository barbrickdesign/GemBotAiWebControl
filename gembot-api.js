/**
 * GemBot API + Logger
 *
 * Goal:
 * - Centralize all fetch() calls (timeout, retries, base URL)
 * - Provide consistent error objects and safe logging
 * - Persist an Implementation Log so broken API calls can be traced quickly
 *
 * Non-breaking design:
 * - Exposes window.GemBotLogger and window.GemBotAPI
 * - Does not require any build tooling
 */

(function () {
  'use strict';

  const DEFAULT_TIMEOUT_MS = 4000;
  const DEFAULT_RETRIES = 1;

  function nowISO() {
    return new Date().toISOString();
  }

  function safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      return null;
    }
  }

  function toErrorMessage(err) {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    return err.message || String(err);
  }

  const GemBotLogger = {
    storageKey: 'gembot_implementation_log_v1',
    maxEntries: 300,

    /**
     * @param {string} level 'info'|'warn'|'error'
     * @param {string} message
     * @param {any} [data]
     */
    log(level, message, data) {
      const entry = {
        ts: nowISO(),
        level,
        message,
        data: data ?? null
      };

      // Console
      const prefix = '[GemBotLog]';
      try {
        if (level === 'error') console.error(prefix, message, data ?? '');
        else if (level === 'warn') console.warn(prefix, message, data ?? '');
        else console.log(prefix, message, data ?? '');
      } catch (_) {}

      // Persist
      try {
        const existing = safeJsonParse(localStorage.getItem(this.storageKey) || '[]') || [];
        existing.unshift(entry);
        if (existing.length > this.maxEntries) existing.length = this.maxEntries;
        localStorage.setItem(this.storageKey, JSON.stringify(existing));
      } catch (_) {}

      // UI hook (if panel exists)
      try {
        const evt = new CustomEvent('gembot:log', { detail: entry });
        window.dispatchEvent(evt);
      } catch (_) {}

      return entry;
    },

    info(message, data) {
      return this.log('info', message, data);
    },

    warn(message, data) {
      return this.log('warn', message, data);
    },

    error(message, data) {
      return this.log('error', message, data);
    },

    list() {
      try {
        return safeJsonParse(localStorage.getItem(this.storageKey) || '[]') || [];
      } catch (_) {
        return [];
      }
    },

    clear() {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (_) {}
      this.info('Implementation log cleared');
    }
  };

  function detectApiBaseUrl() {
    // Prefer explicit global override
    if (window.GEMBOT_API_BASE_URL) return window.GEMBOT_API_BASE_URL;

    // If hosted on Render (or any remote host), local USB bridge is still localhost.
    // Keep default relative URLs working, but allow modules to opt into localhost bridge.
    return '';
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error('timeout')), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function classifyNetworkError(err) {
    const msg = toErrorMessage(err).toLowerCase();
    if (msg.includes('abort') || msg.includes('timeout')) return 'timeout';
    if (msg.includes('failed to fetch')) return 'network';
    if (msg.includes('cors')) return 'cors';
    return 'unknown';
  }

  const GemBotAPI = {
    baseUrl: detectApiBaseUrl(),

    /**
     * Core request wrapper.
     * @param {string} pathOrUrl
     * @param {RequestInit & { timeoutMs?: number, retries?: number, expectJson?: boolean, label?: string }} [options]
     */
    async request(pathOrUrl, options = {}) {
      const {
        timeoutMs = DEFAULT_TIMEOUT_MS,
        retries = DEFAULT_RETRIES,
        expectJson = true,
        label,
        ...fetchOptions
      } = options;

      const url = pathOrUrl.startsWith('http') ? pathOrUrl : (this.baseUrl + pathOrUrl);
      const reqId = 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

      const meta = {
        reqId,
        label: label || pathOrUrl,
        url,
        method: (fetchOptions.method || 'GET').toUpperCase()
      };

      GemBotLogger.info('API request', meta);

      let lastErr = null;
      for (let attempt = 0; attempt <= retries; attempt++) {
        const attemptMeta = { ...meta, attempt: attempt + 1, maxAttempts: retries + 1 };
        try {
          const res = await fetchWithTimeout(url, fetchOptions, timeoutMs);

          const contentType = res.headers.get('content-type') || '';
          const isJson = contentType.includes('application/json');

          let bodyText = '';
          let body = null;

          // Only read body on demand; if expectJson, parse json when possible
          if (expectJson || !res.ok) {
            bodyText = await res.text();
            body = isJson ? safeJsonParse(bodyText) : bodyText;
          }

          if (!res.ok) {
            const apiError = {
              kind: 'http',
              status: res.status,
              statusText: res.statusText,
              body,
              ...attemptMeta
            };
            GemBotLogger.warn('API non-OK response', apiError);
            lastErr = apiError;

            // Retry on 5xx
            if (res.status >= 500 && attempt < retries) {
              await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
              continue;
            }

            throw apiError;
          }

          // Success
          GemBotLogger.info('API response OK', { ...attemptMeta, status: res.status });

          // If not reading body, return raw response
          if (!expectJson) return res;

          // If we didn't read the body above because res.ok and expectJson false, read now
          if (body === null) {
            const txt = await res.text();
            body = isJson ? safeJsonParse(txt) : txt;
          }

          return body;
        } catch (err) {
          const kind = err && err.kind ? err.kind : classifyNetworkError(err);
          const errorObj = {
            kind,
            message: toErrorMessage(err),
            error: err,
            ...attemptMeta
          };

          GemBotLogger.warn('API request failed', errorObj);
          lastErr = errorObj;

          if (attempt < retries && (kind === 'timeout' || kind === 'network' || kind === 'unknown')) {
            await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
            continue;
          }

          throw errorObj;
        }
      }

      throw lastErr || { kind: 'unknown', message: 'Request failed' };
    },

    get(path, options) {
      return this.request(path, { ...(options || {}), method: 'GET' });
    },

    post(path, body, options) {
      const headers = { 'Content-Type': 'application/json', ...(options?.headers || {}) };
      return this.request(path, { ...(options || {}), method: 'POST', headers, body: JSON.stringify(body) });
    }
  };

  // Expose
  window.GemBotLogger = window.GemBotLogger || GemBotLogger;
  window.GemBotAPI = window.GemBotAPI || GemBotAPI;

  // Convenience: hook up a minimal in-DOM log panel if present
  function attachLogPanel() {
    const panel = document.getElementById('gembotImplementationLog');
    if (!panel) return;

    function renderEntry(entry) {
      const el = document.createElement('div');
      el.style.cssText = 'padding:6px 8px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;line-height:1.4;';
      const color = entry.level === 'error' ? '#ff6b6b' : entry.level === 'warn' ? '#ffaa00' : '#4affff';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;">
          <div style="color:${color};font-weight:700;">${entry.level.toUpperCase()}</div>
          <div style="color:#888;">${entry.ts}</div>
        </div>
        <div style="color:#e0e6ed;margin-top:2px;">${entry.message}</div>
      `;
      return el;
    }

    // Initial render
    try {
      const entries = GemBotLogger.list();
      panel.innerHTML = '';
      entries.slice(0, 50).forEach((e) => panel.appendChild(renderEntry(e)));
    } catch (_) {}

    window.addEventListener('gembot:log', (ev) => {
      try {
        const entry = ev.detail;
        panel.insertBefore(renderEntry(entry), panel.firstChild);
        while (panel.children.length > 50) panel.removeChild(panel.lastChild);
      } catch (_) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLogPanel, { once: true });
  } else {
    attachLogPanel();
  }
})();
