/* ========================================
   Prepp Games — Analytics
   GA4 + custom event tracking for games
   ========================================
   TO ACTIVATE: Replace G-XXXXXXXXXX with real GA4 Measurement ID
   from https://analytics.google.com/ (Admin -> Data Streams)
   ======================================== */

(function () {
  'use strict';

  var GA_ID = 'G-D16NB8WW33'; // Prepp Games production GA4 Measurement ID

  // Don't load if placeholder still set (no analytics in dev/preview)
  if (!GA_ID || GA_ID.indexOf('XXXXX') !== -1) {
    window.gtag = function () { /* noop until real ID */ };
    window.fun5track = function () {};
    return;
  }

  // Load gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  // Custom event helper for games
  window.fun5track = function (eventName, params) {
    try {
      gtag('event', eventName, params || {});
    } catch (e) { /* ignore */ }
  };

  // Auto-track outbound clicks to fun5games.com (mobile downloads)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="fun5games.com"]');
    if (!a) return;
    var source = 'link';
    if (a.closest('.download-grid')) source = 'download_grid';
    else if (a.closest('.download-banner')) source = 'banner';
    else if (a.closest('.download-section')) source = 'download_section';
    else if (a.closest('.header-nav')) source = 'header_nav';
    window.fun5track('download_click', {
      link_url: a.href,
      link_text: (a.textContent || '').slice(0, 50).trim(),
      source: source
    });
  }, true);

  // Auto-track category filter clicks (homepage)
  document.addEventListener('click', function (e) {
    var pill = e.target.closest && e.target.closest('.cat-pill');
    if (pill) {
      window.fun5track('category_filter', {
        category: pill.dataset.cat || 'unknown'
      });
    }
  }, true);

  // Auto-track game card clicks (homepage grid AND related games on game page)
  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.game-card a[href*="game.html"]');
    if (!card) return;
    var slug = (card.href.match(/slug=([\w-]+)/) || [])[1];
    // Identify source: homepage grid vs related-games on game page
    var source = card.closest('.more-games') ? 'related_games'
               : card.closest('#gameGrid') ? 'homepage_grid'
               : 'unknown';
    window.fun5track('game_select', {
      slug: slug || 'unknown',
      source: source
    });
  }, true);

  // Auto-track PLAY GAME button (game detail page)
  document.addEventListener('click', function (e) {
    if (e.target.id === 'playGameBtn' || (e.target.closest && e.target.closest('#playGameBtn'))) {
      var slug = new URLSearchParams(window.location.search).get('slug') || 'unknown';
      window.fun5track('game_play', { slug: slug });
    }
  }, true);

  // Auto-track header nav clicks
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.header-nav a');
    if (!a) return;
    window.fun5track('nav_click', {
      link_text: (a.textContent || '').slice(0, 40).trim(),
      link_url: a.getAttribute('href') || '',
      location: 'header'
    });
  }, true);

  // Auto-track footer link clicks
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.site-footer a, .footer-links a');
    if (!a) return;
    window.fun5track('footer_link_click', {
      link_text: (a.textContent || '').slice(0, 40).trim(),
      link_url: a.getAttribute('href') || ''
    });
  }, true);

  // Scroll-depth milestones (25 / 50 / 75 / 100) — fires once per milestone per page
  (function scrollDepth() {
    var milestones = [25, 50, 75, 100];
    var hit = {};
    function calc() {
      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop;
      var height = Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight;
      if (height <= 0) return;
      var pct = Math.round((scrollTop / height) * 100);
      milestones.forEach(function (m) {
        if (pct >= m && !hit[m]) {
          hit[m] = true;
          window.fun5track('scroll_depth', { percent: m, page: window.location.pathname });
        }
      });
    }
    var t = null;
    window.addEventListener('scroll', function () {
      if (t) return;
      t = setTimeout(function () { calc(); t = null; }, 250);
    }, { passive: true });
  })();

  // Time on page — fired on visibilitychange/pagehide (uses sendBeacon-equivalent via gtag)
  (function timeOnPage() {
    var start = Date.now();
    var sent = false;
    function report() {
      if (sent) return;
      sent = true;
      var seconds = Math.round((Date.now() - start) / 1000);
      window.fun5track('time_on_page', {
        seconds: seconds,
        page: window.location.pathname
      });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') report();
    });
    window.addEventListener('pagehide', report);
  })();

})();

/* === Sticky Ad Bottom Bar Behavior === */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var sticky = document.getElementById('adStickyWrap');
    var closeBtn = document.getElementById('adStickyClose');
    if (!sticky) return;

    // Mark body so content gets bottom padding
    document.body.classList.add('has-sticky-ad');

    // Close button hides the sticky ad for the session
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        sticky.classList.add('hidden');
        document.body.classList.remove('has-sticky-ad');
        try { sessionStorage.setItem('hideStickyAd', '1'); } catch (er) {}
        if (window.fun5track) window.fun5track('ad_dismiss', { slot: 'sticky_bottom' });
      });
    }

    // Respect previous dismissal in this session
    try {
      if (sessionStorage.getItem('hideStickyAd') === '1') {
        sticky.classList.add('hidden');
        document.body.classList.remove('has-sticky-ad');
      }
    } catch (er) {}
  });
})();

