/**
 * GemBot App Bootstrap
 *
 * Goal: provide a single, deterministic initialization path for the main UI.
 * Many legacy modules in this repo auto-init on DOMContentLoaded; this bootstrap
 * centralizes init order and prevents double-initialization.
 *
 * Usage (in GemBot_Control_AI.html):
 *   <script>
 *     window.GemBotAutoInit = false; // prevent module self-init
 *   </script>
 *   <script src="./gembot-app-bootstrap.js" defer></script>
 *   <script>window.GemBotApp?.init?.();</script>
 */

(function () {
  'use strict';

  const logPrefix = '[GemBotApp]';

  function log(...args) {
    console.log(logPrefix, ...args);
  }

  function warn(...args) {
    console.warn(logPrefix, ...args);
  }

  function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  function whenDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      } else {
        resolve();
      }
    });
  }

  function safeCall(label, fn) {
    try {
      return fn();
    } catch (err) {
      console.error(`${logPrefix} ❌ ${label} failed`, err);
      return null;
    }
  }

  async function safeCallAsync(label, fn) {
    try {
      return await fn();
    } catch (err) {
      console.error(`${logPrefix} ❌ ${label} failed`, err);
      return null;
    }
  }

  function detectDeviceType() {
    const ua = navigator.userAgent || '';
    const isMobileUA = /iphone|ipad|ipod|android|webos|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isDesktopOS = /windows nt|macintosh|linux(?!.*android)/i.test(ua);
    const isMobile = isMobileUA && hasTouch && !isDesktopOS;

    return {
      isMobile,
      isDesktop: !isMobile,
      ua
    };
  }

  // Guard: only run bootstrap once
  let initPromise = null;

  const GemBotApp = {
    version: '2025.12.13.bootstrap.001',

    async init(options = {}) {
      if (!isBrowser()) return;

      if (initPromise) return initPromise;

      initPromise = (async () => {
        const { isMobile, isDesktop } = detectDeviceType();
        const autoInitFlag = window.GemBotAutoInit === true;

        // If the page didn't explicitly set GemBotAutoInit, we still proceed,
        // but we warn because some modules may already have self-initialized.
        if (!('GemBotAutoInit' in window)) {
          warn('window.GemBotAutoInit not set. Some modules may self-init; set GemBotAutoInit=false before loading modules for deterministic init.');
        }

        await whenDOMReady();

        log('Initializing…', { isMobile, isDesktop, autoInitFlag, options });

        // Init order:
        // 1) Knowledge base (so AI can use it)
        // 2) Marketplace (used by leaderboard/AI UI)
        // 3) Game integration systems
        // 4) Sync systems (multi-device)
        // 5) 3D world (academy)

        // 1) Knowledge base
        await safeCallAsync('knowledgeBase.init', async () => {
          if (window.knowledgeBase?.loadAllKnowledge && !window.knowledgeBase.__gembotInitialized) {
            window.knowledgeBase.__gembotInitialized = true;
            await window.knowledgeBase.loadAllKnowledge();
            log('Knowledge base loaded');
          }
        });

        // 2) Marketplace
        await safeCallAsync('GemBotMarketplace.init', async () => {
          if (window.GemBotMarketplace?.init && !window.GemBotMarketplace.initialized) {
            await window.GemBotMarketplace.init();
            log('Marketplace ready');
          }
        });

        // 3) Game integration
        await safeCallAsync('GemBotGameIntegration.init', async () => {
          if (window.GemBotGameIntegration?.init && !window.GemBotGameIntegration.initialized) {
            await window.GemBotGameIntegration.init();
            log('Game integration ready');
          }
        });

        // 4) Sync systems
        await safeCallAsync('gembotSync.init', async () => {
          // gembot-sync-manager.js exposes initGembotSync() and/or global gembotSync
          if (typeof window.initGembotSync === 'function') {
            safeCall('initGembotSync', () => window.initGembotSync());
          }
          if (window.gembotSync?.init && !window.gembotSync.__gembotInitialized) {
            window.gembotSync.__gembotInitialized = true;
            window.gembotSync.init();
          }

          // UI layer
          if (window.GemBotSyncUI?.init && !window.GemBotSyncUI.initialized) {
            window.GemBotSyncUI.init();
          }
        });

        // 5) 3D World
        await safeCallAsync('GemBot3DWorld.init', async () => {
          if (window.GemBot3DWorld?.init && !window.GemBot3DWorld.initialized) {
            // Do NOT force enter world; just init.
            window.GemBot3DWorld.init();
            log('3D World initialized');
          }
        });

        // Let the main HTML know bootstrap completed
        window.dispatchEvent(new CustomEvent('gembot:bootstrapped', { detail: { version: this.version } }));
        log('Initialization complete');
      })();

      return initPromise;
    }
  };

  window.GemBotApp = GemBotApp;
})();
