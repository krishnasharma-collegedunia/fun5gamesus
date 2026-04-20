/* ========================================
   Fun5Games - Homepage Script
   Clean play202 design | Ad ready
   ======================================== */

(function () {
  'use strict';

  var allGames = [];
  var filteredGames = [];
  var currentCat = 'all';

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    renderGames();
    setupFilters();
    console.log('[Fun5Games] Loaded ' + allGames.length + ' games.');
  }

  async function loadGames() {
    try {
      var res = await fetch('data/games.json?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allGames = await res.json();
      filteredGames = allGames.slice();
    } catch (e) {
      console.error('[Fun5Games] Failed to load games:', e);
      allGames = [];
      filteredGames = [];
    }
  }

  function renderGames() {
    var grid = document.getElementById('gameGrid');
    if (!grid) return;
    grid.innerHTML = filteredGames.map(function (game) {
      return createCard(game);
    }).join('');
  }

  function createCard(game) {
    return '<div class="game-card" data-cat="' + game.category + '">' +
      '<div class="game-card-thumb">' +
        '<img src="' + game.thumbnail + '" alt="' + esc(game.title) + '" loading="lazy" decoding="async" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'thumb-placeholder\',innerHTML:\'🎮\'}))">' +
      '</div>' +
      '<div class="game-card-body">' +
        '<div class="game-card-title">' + esc(game.title) + '</div>' +
        '<a href="game.html?slug=' + game.slug + '">' +
          '<button class="play-button">Play Game</button>' +
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
      });
    });
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

})();
