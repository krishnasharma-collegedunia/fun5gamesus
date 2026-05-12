/* ========================================
   Prepp Games - Homepage Script
   ======================================== */

(function () {
  'use strict';

  var allGames = [];
  var filteredGames = [];
  var currentCat = 'all';

  var CAT_LABELS = {
    'all':    'All Games',
    'action': 'Action Games',
    'casual': 'Casual Games',
    'arcade': 'Arcade Games',
    'brain':  'Brain Games'
  };

  var interstitialActive = false;

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    renderGames();
    setupFilters();
    setupCardClickInterstitial();
    updateSectionHeading('all');
    console.log('[Prepp Games] Loaded ' + allGames.length + ' games.');
  }

  async function loadGames() {
    try {
      var res = await fetch('data/games.json?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allGames = await res.json();
      filteredGames = allGames.slice();
    } catch (e) {
      console.error('[Prepp Games] Failed to load games:', e);
      allGames = [];
      filteredGames = [];
    }
  }

  function renderGames() {
    var grid = document.getElementById('gameGrid');
    if (!grid) return;
    grid.innerHTML = filteredGames.map(function (game, idx) {
      var card = createCard(game, idx);
      // Vertoz Slot B: inject in-grid 728x90 ad after 6th card (between row 1 and row 2 on desktop)
      if (idx === 5 && filteredGames.length > 7) {
        card += createInGridAd();
      }
      return card;
    }).join('');
  }

  function createInGridAd() {
    return '<div class="ad-slot ad-in-grid ad-vertoz ad-728x90" id="adInGrid" data-ad-slot="in_grid_1" data-ad-size="728x90,320x100">' +
      '<div class="ad-inner">' +
        '<span class="ad-size-label">728x90</span>' +
        '<span class="ad-text">Advertisement</span>' +
      '</div>' +
    '</div>';
  }

  function createCard(game, idx) {
    // First 8 cards eager-load (visible on first scroll)
    var loadingAttr = idx < 8 ? 'eager' : 'lazy';
    return '<div class="game-card" data-cat="' + game.category + '">' +
      '<div class="game-card-thumb">' +
        '<img src="' + game.thumbnail + '" alt="' + esc(game.title) + '" loading="' + loadingAttr + '" decoding="async" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'thumb-placeholder\',innerHTML:\'🎮\'}))">' +
      '</div>' +
      '<div class="game-card-body">' +
        '<div class="game-card-title">' + esc(game.title) + '</div>' +
        '<a href="game.html?slug=' + game.slug + '">' +
          '<button class="play-button">▶ Play Game</button>' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  function setupFilters() {
    var btns = document.querySelectorAll('.cat-pill');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCat = btn.dataset.cat;
        btns.forEach(function (b) {
          b.classList.toggle('active', b.dataset.cat === currentCat);
        });
        applyFilter();
        updateSectionHeading(currentCat);
      });
    });
  }

  function updateSectionHeading(cat) {
    var headEl = document.querySelector('.section-head h2');
    var badge = document.querySelector('.section-head .badge-hot');
    if (headEl) {
      var label = CAT_LABELS[cat] || 'Games';
      headEl.innerHTML = '<span class="accent-bar"></span>' + label;
    }
    if (badge) {
      badge.style.display = cat === 'all' ? '' : 'none';
    }
  }

  function applyFilter() {
    if (currentCat === 'all') {
      filteredGames = allGames.slice();
    } else {
      filteredGames = allGames.filter(function (g) {
        return g.category === currentCat;
      });
    }
    renderGames();
  }

  function esc(text) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  /**
   * VERTOZ SLOT H — Interstitial 320x480 on homepage card click.
   * Intercepts <a href="game.html?slug=..."> clicks inside game cards,
   * shows 5s interstitial, then navigates to the game page.
   */
  function setupCardClickInterstitial() {
    var grid = document.getElementById('gameGrid');
    if (!grid) return;

    // Event delegation — cards are re-rendered on filter change
    grid.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="game.html?slug="]');
      if (!link) return;
      if (interstitialActive) { e.preventDefault(); return; }

      e.preventDefault();
      var url = link.getAttribute('href');
      var slug = (url.match(/slug=([^&]+)/) || [])[1] || '';

      showInterstitial(slug, function () {
        window.location.href = url;
      });
    });
  }

  function showInterstitial(slug, onDismiss) {
    var overlay = document.getElementById('interstitialOverlay');
    var countdownEl = document.getElementById('interstitialCountdown');
    var closeBtn = document.getElementById('interstitialClose');

    // Safety fallback: if interstitial DOM is missing, skip straight to game
    if (!overlay) { onDismiss(); return; }

    interstitialActive = true;
    var seconds = 5;
    var startTime = Date.now();

    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    if (closeBtn) closeBtn.classList.add('hidden');
    if (countdownEl) {
      countdownEl.style.display = '';
      countdownEl.textContent = 'Game starts in ' + seconds + 's';
    }

    if (window.fun5track) {
      window.fun5track('interstitial_shown', {
        game_slug: slug,
        trigger: 'homepage_card_click'
      });
    }

    var tick = setInterval(function () {
      seconds--;
      if (seconds > 0) {
        if (countdownEl) countdownEl.textContent = 'Game starts in ' + seconds + 's';
      } else {
        clearInterval(tick);
        if (countdownEl) countdownEl.style.display = 'none';
        if (closeBtn) closeBtn.classList.remove('hidden');
      }
    }, 1000);

    var dismiss = function () {
      clearInterval(tick);
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      interstitialActive = false;
      var elapsed = Math.round((Date.now() - startTime) / 1000);
      if (window.fun5track) {
        window.fun5track('interstitial_dismiss', {
          game_slug: slug,
          seconds_viewed: elapsed
        });
      }
      onDismiss();
    };

    if (closeBtn) {
      closeBtn.onclick = dismiss;
    }
  }

})();
