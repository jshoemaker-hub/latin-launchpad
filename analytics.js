(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-HLK81Y1PK3';
  const CONSENT_KEY = 'latin-launchpad-analytics-consent';
  let loaded = false;

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // The choice still applies to this page when storage is unavailable.
    }
  }

  function updateGoogleConsent(value) {
    window[`ga-disable-${MEASUREMENT_ID}`] = value !== 'granted';
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      analytics_storage: value,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function loadAnalytics() {
    if (loaded || readConsent() !== 'granted') return;
    loaded = true;
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function closeBanner() {
    const banner = document.getElementById('analyticsConsentBanner');
    if (banner) banner.hidden = true;
  }

  function setConsent(value) {
    writeConsent(value);
    updateGoogleConsent(value);
    closeBanner();
    if (value === 'granted') loadAnalytics();
  }

  function wireBanner(banner) {
    if (!banner || banner.dataset.bound === 'true') return;
    banner.dataset.bound = 'true';
    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-analytics-choice]');
      if (button) setConsent(button.dataset.analyticsChoice);
    });
  }

  function buildBanner() {
    const banner = document.createElement('aside');
    banner.id = 'analyticsConsentBanner';
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-labelledby', 'analyticsConsentTitle');
    banner.innerHTML = `
      <div>
        <strong id="analyticsConsentTitle">Optional analytics</strong>
        <p>An adult may allow anonymous usage analytics to help improve Latin Launchpad. Advertising features are off. <a href="privacy.html#analytics">Learn more about analytics</a>.</p>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" class="secondary-button" data-analytics-choice="denied">No thanks</button>
        <button type="button" class="primary-button" data-analytics-choice="granted">Allow analytics</button>
      </div>`;
    return banner;
  }

  function showConsentBanner() {
    let banner = document.getElementById('analyticsConsentBanner');
    if (!banner) {
      banner = buildBanner();
      const shell = document.querySelector('.app-shell');
      if (shell) shell.prepend(banner);
      else document.body.prepend(banner);
    }
    banner.hidden = false;
    wireBanner(banner);
  }

  function bindPreferencesButton(button) {
    if (!button || button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', showConsentBanner);
  }

  function addPreferencesButton() {
    const existing = document.querySelector('.analytics-preferences-button');
    if (existing) {
      bindPreferencesButton(existing);
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'analytics-preferences-button';
    button.textContent = 'Analytics choices';
    bindPreferencesButton(button);
    const nav = document.querySelector('.site-footer nav');
    if (nav) nav.appendChild(button);
    else (document.querySelector('.site-footer') || document.body).appendChild(button);
  }

  window.LatinLaunchpadAnalytics = {
    trackPageView(pageName) {
      if (!loaded || typeof window.gtag !== 'function') return;
      window.gtag('event', 'page_view', {
        page_title: `Latin Launchpad - ${pageName}`,
        page_location: `${window.location.origin}${window.location.pathname}#${pageName}`
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    addPreferencesButton();
    const banner = document.getElementById('analyticsConsentBanner');
    if (banner) wireBanner(banner);
    if (readConsent() === 'granted') {
      closeBanner();
      loadAnalytics();
    } else if (readConsent() === 'denied') {
      closeBanner();
    } else if (!banner) {
      showConsentBanner();
    }
  });
})();
