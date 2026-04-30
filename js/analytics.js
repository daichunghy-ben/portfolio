(function () {
  'use strict';

  var script = document.currentScript || document.querySelector('script[data-analytics-provider]');
  var provider = (script && script.getAttribute('data-analytics-provider') || '').toLowerCase();
  var supported = provider === 'plausible' || provider === 'ga4';

  if (!supported) return;

  var EVENT_NAME_MAP = {
    'Campaign Landing': 'campaign_landing',
    'Contact Click': 'contact_click',
    'Download Click': 'download_click',
    'Outbound Link Click': 'outbound_link_click',
    'Profile Link Click': 'profile_link_click'
  };

  var PROFILE_HOSTS = [
    'github.com',
    'linkedin.com',
    'orcid.org',
    'swinburne-vn.edu.vn'
  ];

  var DOWNLOAD_RE = /\.(?:pdf|docx?|pptx?|xlsx?|csv|zip)(?:[?#].*)?$/i;
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  var cleanValue = function (value, maxLength) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength || 100);
  };

  var currentPagePath = function () {
    return cleanValue(window.location.pathname || '/', 120);
  };

  var safeUrl = function (href) {
    try {
      return new URL(href, window.location.href);
    } catch {
      return null;
    }
  };

  var isProfileHost = function (host) {
    var normalized = String(host || '').replace(/^www\./, '').toLowerCase();
    return PROFILE_HOSTS.some(function (profileHost) {
      return normalized === profileHost || normalized.endsWith('.' + profileHost);
    });
  };

  var sendEvent = function (eventName, props) {
    var cleanProps = Object.assign({ page_path: currentPagePath() }, props || {});

    if (provider === 'plausible' && typeof window.plausible === 'function') {
      window.plausible(eventName, { props: cleanProps });
      return;
    }

    if (provider === 'ga4' && typeof window.gtag === 'function') {
      window.gtag('event', EVENT_NAME_MAP[eventName] || eventName.toLowerCase().replace(/[^a-z0-9_]+/g, '_'), cleanProps);
    }
  };

  var trackCampaignLanding = function () {
    var params = new URLSearchParams(window.location.search || '');
    var props = {};

    UTM_KEYS.forEach(function (key) {
      var value = cleanValue(params.get(key), 100);
      if (value) props[key] = value;
    });

    if (!Object.keys(props).length) return;

    var storageKey = 'portfolio_campaign_landing:' + currentPagePath() + ':' + UTM_KEYS.map(function (key) {
      return props[key] || '';
    }).join('|');

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // sessionStorage can be blocked; analytics remains best-effort.
    }

    sendEvent('Campaign Landing', props);
  };

  var classifyLink = function (link) {
    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return null;

    if (/^mailto:/i.test(href)) {
      return {
        eventName: 'Contact Click',
        props: {
          link_type: 'email',
          contact_method: 'email'
        }
      };
    }

    var url = safeUrl(href);
    if (!url) return null;

    if (DOWNLOAD_RE.test(url.pathname)) {
      return {
        eventName: 'Download Click',
        props: {
          link_type: 'download',
          target_host: cleanValue(url.hostname, 80),
          target_path: cleanValue(url.pathname, 120)
        }
      };
    }

    if (url.origin !== window.location.origin) {
      return {
        eventName: isProfileHost(url.hostname) ? 'Profile Link Click' : 'Outbound Link Click',
        props: {
          link_type: isProfileHost(url.hostname) ? 'profile' : 'external',
          target_host: cleanValue(url.hostname.replace(/^www\./, ''), 80),
          target_path: cleanValue(url.pathname, 120)
        }
      };
    }

    return null;
  };

  var onClick = function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;

    var classified = classifyLink(link);
    if (!classified) return;

    sendEvent(classified.eventName, classified.props);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackCampaignLanding, { once: true });
  } else {
    trackCampaignLanding();
  }

  document.addEventListener('click', onClick, true);
}());
