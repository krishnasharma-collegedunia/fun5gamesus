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
    if (a) {
      window.fun5track('download_click', {
        link_url: a.href,
        link_text: (a.textContent || '').slice(0, 50).trim()
      });
    }
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

  // Auto-track game card clicks (homepage)
  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.game-card a[href*="game.html"]');
    if (card) {
      var slug = (card.href.match(/slug=([\w-]+)/) || [])[1];
      window.fun5track('game_select', { slug: slug || 'unknown' });
    }
  }, true);

  // Auto-track PLAY GAME button (game detail page)
  document.addEventListener('click', function (e) {
    if (e.target.id === 'playGameBtn' || e.target.closest('#playGameBtn')) {
      var slug = new URLSearchParams(window.location.search).get('slug') || 'unknown';
      window.fun5track('game_play', { slug: slug });
    }
  }, true);

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

