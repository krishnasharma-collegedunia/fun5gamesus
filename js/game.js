/* ========================================
   PlayZone - Game Detail Page Script
   Handles: iFrame, Fullscreen, Pre-roll,
   Related Games, Meta/SEO
   ======================================== */

(function () {
  'use strict';

  let allGames = [];
  let currentGame = null;

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    const slug = new URLSearchParams(window.location.search).get('slug');

    if (!slug) { window.location.href = 'index.html'; return; }

    currentGame = allGames.find(g => g.slug === slug);
    if (!currentGame) { window.location.href = 'index.html'; return; }

    updatePageMeta();
    updateBreadcrumb();
    updateGameInfo();
    renderRelatedGames();
    setupControls();
    setupSearch();
    setupShowAdButton();
    saveRecentlyPlayed(currentGame);

    // Pre-roll ad then load game iframe
    triggerPrerollAd(() => loadGameIframe());
  }

  async function loadGames() {
    try {
      const res = await fetch('data/games.json');
      allGames = await res.json();
    } catch (e) {
      console.error('[PlayZone] Failed to load games:', e);
      allGames = [];
    }
  }

  // --- SEO Meta ---
  function updatePageMeta() {
    document.title = `${currentGame.title} - Play Free | PlayZone`;
    document.getElementById('metaDesc').content = currentGame.description;
    document.getElementById('ogTitle').content = `Play ${currentGame.title} - PlayZone`;
    document.getElementById('ogDesc').content = currentGame.description;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": currentGame.title,
      "description": currentGame.description,
      "genre": currentGame.category,
      "playMode": "SinglePlayer",
      "applicationCategory": "Game",
      "operatingSystem": "Web Browser",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": currentGame.rating,
        "bestRating": "5",
        "ratingCount": Math.floor(Math.random() * 500 + 100)
      }
    };
    document.getElementById('jsonLd').textContent = JSON.stringify(jsonLd);
  }

  // --- Breadcrumb ---
  function updateBreadcrumb() {
    const cat = currentGame.category;
    document.getElementById('breadcrumbCategory').textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    document.getElementById('breadcrumbTitle').textContent = currentGame.title;
  }

  // --- Game Info ---
  function updateGameInfo() {
    document.getElementById('gameTitle').textContent = currentGame.title;
    document.getElementById('gameCat').textContent = capitalize(currentGame.category) + ' Game';
    document.getElementById('gameDescription').textContent = currentGame.description + '\n\nControls: ' + currentGame.controls;

    // Tags
    const tagsEl = document.getElementById('gameTags');
    tagsEl.innerHTML = currentGame.tags.map(t =>
      `<span class="game-tag">${escapeHtml(t)}</span>`
    ).join('');

    // Meta boxes
    document.getElementById('metaCategory').textContent = capitalize(currentGame.category);
    document.getElementById('metaRating').textContent = '\u2605 ' + currentGame.rating + '/5';
    document.getElementById('metaControls').textContent = currentGame.controls;
  }

  // --- Load Game iFrame ---
  function loadGameIframe() {
    const wrapper = document.getElementById('gameFrameWrapper');
    const loading = document.getElementById('gameLoading');

    // Hide pre-roll
    document.getElementById('prerollAdContainer').style.display = 'none';

    const iframe = document.createElement('iframe');
    iframe.src = currentGame.game_url;
    iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad; microphone');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
    iframe.title = currentGame.title;
    iframe.id = 'gameIframe';

    iframe.addEventListener('load', () => {
      loading.classList.add('hidden');
      console.log(`[PlayZone] "${currentGame.title}" loaded in iframe.`);
    });

    // Fallback timeout
    setTimeout(() => loading.classList.add('hidden'), 8000);

    wrapper.appendChild(iframe);
  }

  // --- Pre-roll Ad ---
  function triggerPrerollAd(callback) {
    try {
      if (typeof adBreak === 'function') {
        adBreak({
          type: 'preroll',
          name: 'pre-game-ad',
          beforeAd: () => console.log('[PlayZone Ads] Pre-roll starting...'),
          afterAd: () => console.log('[PlayZone Ads] Pre-roll finished.'),
          adBreakDone: (info) => {
            console.log('[PlayZone Ads] Pre-roll placement:', info);
            callback();
          }
        });
      } else {
        console.log('[PlayZone Ads] adBreak unavailable. Skipping pre-roll.');
        callback();
      }
    } catch (e) {
      console.warn('[PlayZone Ads] Pre-roll error:', e);
      callback();
    }
  }

  // --- Controls ---
  function setupControls() {
    const container = document.getElementById('gameFrameContainer');
    const fsBtn = document.getElementById('fullscreenBtn');
    const reloadBtn = document.getElementById('reloadBtn');

    // Fullscreen
    fsBtn.addEventListener('click', () => {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else {
        // CSS fallback
        container.classList.toggle('fullscreen');
        fsBtn.innerHTML = container.classList.contains('fullscreen')
          ? '\u2716 Exit' : '\u26CE Full Screen';
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        container.classList.remove('fullscreen');
        fsBtn.innerHTML = '\u26CE Full Screen';
      }
    });

    // Reload
    reloadBtn.addEventListener('click', () => {
      const iframe = document.getElementById('gameIframe');
      if (iframe) {
        document.getElementById('gameLoading').classList.remove('hidden');
        iframe.src = iframe.src;
        setTimeout(() => document.getElementById('gameLoading').classList.add('hidden'), 8000);
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && container.classList.contains('fullscreen')) {
        container.classList.remove('fullscreen');
        fsBtn.innerHTML = '\u26CE Full Screen';
      }
    });
  }

  // --- Related Games ---
  function renderRelatedGames() {
    const related = allGames
      .filter(g => g.id !== currentGame.id)
      .filter(g => g.category === currentGame.category || g.tags.some(t => currentGame.tags.includes(t)))
      .slice(0, 6);

    const grid = document.getElementById('relatedGamesGrid');
    grid.innerHTML = related.map(game => `
      <div class="game-card">
        <div class="game-card-thumb">
          ${game.trending ? '<span class="trending-badge">\uD83D\uDD25 HOT</span>' : ''}
          <img src="${game.thumbnail}" alt="${escapeHtml(game.title)}" loading="lazy"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb-placeholder',innerHTML:'\uD83C\uDFAE'}))">
        </div>
        <div class="game-card-title">${escapeHtml(game.title)}</div>
        <div class="game-card-meta">
          <span class="game-card-rating">\u2605 ${game.rating}</span>
          <span class="game-card-category">${escapeHtml(game.category)}</span>
        </div>
        <a href="game.html?slug=${game.slug}">
          <button class="play-button">Play Game</button>
        </a>
      </div>
    `).join('');
  }

  // --- Recently Played ---
  function saveRecentlyPlayed(game) {
    try {
      const KEY = 'playzone_recent';
      let recent = JSON.parse(localStorage.getItem(KEY) || '[]');
      recent = recent.filter(s => s !== game.slug);
      recent.unshift(game.slug);
      localStorage.setItem(KEY, JSON.stringify(recent.slice(0, 10)));
    } catch (e) { /* ignore */ }
  }

  // --- Search (redirects to index) ---
  function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `index.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  }

  // --- On-Demand Ad ---
  function setupShowAdButton() {
    document.getElementById('showAdBtn').addEventListener('click', () => {
      try {
        if (typeof adBreak === 'function') {
          adBreak({
            type: 'reward',
            name: 'on-demand-game-page',
            beforeAd: () => console.log('[PlayZone Ads] On-demand ad starting...'),
            afterAd: () => console.log('[PlayZone Ads] On-demand ad finished.'),
            adBreakDone: (info) => console.log('[PlayZone Ads] Placement:', info)
          });
        } else {
          alert('Ad would play here.\nConnect your AdSense Publisher ID (ca-pub-XXXX) to enable real ads.');
        }
      } catch (e) {
        console.warn('[PlayZone Ads] Error:', e);
      }
    });
  }

  // --- Utility ---
  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();
