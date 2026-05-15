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

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    renderGames();
    setupFilters();
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
      // Vertoz Slot B: in-grid 728x90 ad after 6th card (between row 1 and row 2 on desktop)
      if (idx === 5 && filteredGames.length > 7) {
        card += createInGridAd();
      }
      return card;
    }).join('');
    // Scripts set via innerHTML don't execute — inject the Vertoz tag via DOM
    injectInGridAd();
  }

  function createInGridAd() {
    return '<div class="ad-slot ad-in-grid ad-live ad-728x90" id="adInGrid" data-ad-slot="in_grid_1" data-ad-size="728x90,320x100">' +
      '<div class="ad-inner"></div>' +
    '</div>';
  }

  function injectInGridAd() {
    var holder = document.querySelector('#adInGrid .ad-inner');
    if (!holder || holder.getAttribute('data-loaded')) return;
    holder.setAttribute('data-loaded', '1');
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '//banner.incrementxserv.com/scripts/pageads.js?vzId=IXK716502V4595E6&vzR=';
    holder.appendChild(s);
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

  // NOTE: Interstitial is now handled by Vertoz overlayads.js (loaded in
  // index.html) which self-manages its own overlay, timing, and close
  // button. The previous custom modal + card-click interception was
  // removed — game cards now navigate normally via their <a href>.

})();
