/* ========================================
   PlayZone - Game Detail Page Script
   Loads games from funhtml5games.com
   via responsive iFrame
   Pre-roll Ads, Fullscreen, Related Games
   ======================================== */

(function () {
  'use strict';

  let allGames = [];
  let currentGame = null;

  // --- Init ---
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();

    const slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) { goHome(); return; }

    currentGame = allGames.find(g => g.slug === slug);
    if (!currentGame) { goHome(); return; }

    updatePageMeta();
    updateBreadcrumb();
    updateGameHeader();
    updateGameInfo();
    renderRelatedGames();
    setupControls();
    setupSearch();
    setupShowAdButton();
    saveRecentlyPlayed(currentGame);

    // Trigger pre-roll ad, then load game in iframe
    triggerPrerollAd(() => {
      loadGameIframe();
    });

    // FIX: Stop game audio when user leaves the page
    setupPageLeaveCleanup();

    console.log(`[PlayZone] Playing: "${currentGame.title}" from ${currentGame.game_url}`);
  }

  // --- CRITICAL: Kill iframe audio/video when leaving page ---
  function setupPageLeaveCleanup() {
    // When user navigates away (click link, back button, etc.)
    window.addEventListener('beforeunload', destroyGameIframe);

    // Also intercept all navigation links on the page
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && !link.href.includes('javascript:')) {
        destroyGameIframe();
      }
    });

    // Handle browser back/forward
    window.addEventListener('pagehide', destroyGameIframe);
  }

  function destroyGameIframe() {
    const iframe = document.getElementById('gameIframe');
    if (iframe) {
      iframe.src = 'about:blank'; // Stops all audio/video immediately
      iframe.remove();
      console.log('[PlayZone] Game iframe destroyed - audio stopped.');
    }
  }

  function goHome() {
    window.location.href = 'index.html';
  }

  // --- Load Games ---
  async function loadGames() {
    try {
      const res = await fetch('data/games.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allGames = await res.json();
    } catch (e) {
      console.error('[PlayZone] Failed to load games:', e);
      allGames = [];
    }
  }

  // --- SEO: Page Meta & JSON-LD ---
  function updatePageMeta() {
    document.title = `${currentGame.title} - Play Free Online | PlayZone`;

    const desc = `Play ${currentGame.title} for free in your browser! ${currentGame.description}`;
    document.getElementById('metaDesc').content = desc;
    document.getElementById('ogTitle').content = `Play ${currentGame.title} - PlayZone`;
    document.getElementById('ogDesc').content = desc;

    // Structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": currentGame.title,
      "description": currentGame.description,
      "genre": capitalize(currentGame.category),
      "playMode": "SinglePlayer",
      "applicationCategory": "Game",
      "operatingSystem": "Web Browser",
      "gamePlatform": "HTML5",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": currentGame.rating,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": Math.floor(currentGame.rating * 80 + currentGame.id * 17)
      }
    };
    document.getElementById('jsonLd').textContent = JSON.stringify(jsonLd);
  }

  // --- Breadcrumb ---
  function updateBreadcrumb() {
    document.getElementById('breadcrumbCategory').textContent = capitalize(currentGame.category);
    document.getElementById('breadcrumbTitle').textContent = currentGame.title;
  }

  // --- Game Header (title + rating + category) ---
  function updateGameHeader() {
    document.getElementById('gameTitle').textContent = currentGame.title;

    // Stars
    const fullStars = Math.floor(currentGame.rating);
    const half = currentGame.rating % 1 >= 0.5;
    let starsHtml = '\u2605'.repeat(fullStars);
    if (half) starsHtml += '\u00BD';
    starsHtml += ` ${currentGame.rating}/5`;
    document.getElementById('gameStars').innerHTML = starsHtml;

    // Category badge
    document.getElementById('gameCatBadge').textContent = capitalize(currentGame.category);
  }

  // --- Game Info Section ---
  function updateGameInfo() {
    // Description + controls
    document.getElementById('gameDescription').innerHTML =
      escapeHtml(currentGame.description) +
      '<br><br><strong>Controls:</strong> ' +
      escapeHtml(currentGame.controls);

    // Tags
    document.getElementById('gameTags').innerHTML = currentGame.tags.map(t =>
      `<span class="game-tag">${escapeHtml(t)}</span>`
    ).join('');

    // Meta boxes
    document.getElementById('metaCategory').textContent = capitalize(currentGame.category);
    document.getElementById('metaRating').textContent = '\u2605 ' + currentGame.rating + '/5';
    document.getElementById('metaControls').textContent = currentGame.controls;
  }

  // --- Load Game iFrame (from funhtml5games.com) ---
  function loadGameIframe() {
    const wrapper = document.getElementById('gameFrameWrapper');
    const loading = document.getElementById('gameLoading');

    // Hide pre-roll ad
    const preroll = document.getElementById('prerollAdContainer');
    if (preroll) preroll.style.display = 'none';

    // Create iframe - NO sandbox attribute (breaks game audio/input/canvas)
    const iframe = document.createElement('iframe');
    iframe.src = currentGame.game_url;
    iframe.id = 'gameIframe';
    iframe.title = currentGame.title;
    iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad; microphone');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.cssText = 'width:100%;height:100%;border:none;';

    // When iframe loads, hide spinner
    iframe.addEventListener('load', () => {
      loading.classList.add('hidden');
      console.log(`[PlayZone] Game iframe loaded: ${currentGame.title}`);
    });

    // Safety fallback: hide loading after 10 seconds no matter what
    setTimeout(() => loading.classList.add('hidden'), 10000);

    wrapper.appendChild(iframe);
  }

  // --- Pre-roll Ad (H5 Games API) ---
  function triggerPrerollAd(callback) {
    try {
      if (typeof adBreak === 'function') {
        console.log('[PlayZone Ads] Requesting pre-roll ad...');
        adBreak({
          type: 'preroll',
          name: 'pre-game-' + currentGame.slug,
          beforeAd: () => {
            console.log('[PlayZone Ads] Pre-roll ad is playing...');
          },
          afterAd: () => {
            console.log('[PlayZone Ads] Pre-roll ad completed.');
          },
          adBreakDone: (placementInfo) => {
            console.log('[PlayZone Ads] Pre-roll result:', placementInfo);
            // Load game regardless of ad result
            callback();
          }
        });
      } else {
        console.log('[PlayZone Ads] adBreak not available. Loading game directly.');
        callback();
      }
    } catch (e) {
      console.warn('[PlayZone Ads] Pre-roll error:', e);
      callback();
    }
  }

  // --- Fullscreen & Reload Controls ---
  function setupControls() {
    const container = document.getElementById('gameFrameContainer');
    const fsBtn = document.getElementById('fullscreenBtn');
    const reloadBtn = document.getElementById('reloadBtn');

    // Fullscreen
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else {
        // CSS fallback for browsers without Fullscreen API
        container.classList.toggle('fullscreen');
        updateFsButtonText(container.classList.contains('fullscreen'));
      }
    });

    document.addEventListener('fullscreenchange', () => {
      updateFsButtonText(!!document.fullscreenElement);
    });

    // Reload game
    reloadBtn.addEventListener('click', () => {
      const iframe = document.getElementById('gameIframe');
      if (iframe) {
        const loading = document.getElementById('gameLoading');
        loading.classList.remove('hidden');
        iframe.src = currentGame.game_url; // reload from source
        setTimeout(() => loading.classList.add('hidden'), 10000);
      }
    });

    // Escape key exits CSS fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && container.classList.contains('fullscreen')) {
        container.classList.remove('fullscreen');
        updateFsButtonText(false);
      }
    });

    function updateFsButtonText(isFullscreen) {
      fsBtn.innerHTML = isFullscreen ? '\u2716 Exit Fullscreen' : '\u26CE Full Screen';
    }
  }

  // --- Related Games ---
  function renderRelatedGames() {
    // Priority: same category, then shared tags
    const related = allGames
      .filter(g => g.id !== currentGame.id)
      .map(g => {
        let score = 0;
        if (g.category === currentGame.category) score += 3;
        g.tags.forEach(t => { if (currentGame.tags.includes(t)) score += 1; });
        return { ...g, relevance: score };
      })
      .filter(g => g.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);

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
          <span class="game-card-category">${capitalize(game.category)}</span>
        </div>
        <a href="game.html?slug=${game.slug}">
          <button class="play-button">Play Game</button>
        </a>
      </div>
    `).join('');
  }

  // --- Recently Played (localStorage) ---
  function saveRecentlyPlayed(game) {
    try {
      const KEY = 'playzone_recent';
      let recent = JSON.parse(localStorage.getItem(KEY) || '[]');
      recent = recent.filter(s => s !== game.slug);
      recent.unshift(game.slug);
      localStorage.setItem(KEY, JSON.stringify(recent.slice(0, 15)));
    } catch (e) { /* localStorage unavailable */ }
  }

  // --- Search (redirects to index with query) ---
  function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `index.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  }

  // --- On-Demand Ad Button ---
  function setupShowAdButton() {
    const btn = document.getElementById('showAdBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      try {
        if (typeof adBreak === 'function') {
          adBreak({
            type: 'reward',
            name: 'on-demand-' + currentGame.slug,
            beforeAd: () => console.log('[PlayZone Ads] Reward ad starting...'),
            afterAd: () => console.log('[PlayZone Ads] Reward ad finished.'),
            adBreakDone: (info) => {
              console.log('[PlayZone Ads] Result:', info);
              if (info.breakStatus === 'viewed') {
                alert('Thanks for watching!');
              }
            }
          });
        } else {
          alert('Rewarded Ad would play here.\n\nTo enable real ads:\n1. Replace ca-pub-XXXX with your AdSense ID\n2. Remove data-adbreak-test="on"');
        }
      } catch (e) {
        console.warn('[PlayZone Ads] Error:', e);
      }
    });
  }

  // --- Utilities ---
  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();
