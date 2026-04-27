/* ========================================
   Fun5Games - Game Detail Page (play202-style)
   PLAY button click -> iframe loads
   Download Games section -> fun5games.com
   ======================================== */

(function () {
  'use strict';

  var allGames = [];
  var currentGame = null;
  var iframeLoaded = false;

  // Mobile game catalog (top 12 famous, links to fun5games.com)
  var DOWNLOAD_GAMES = [
    { name: 'Subway Surfers',  cat: 'Endless Runner', icon: 'assets/mobile-icons/subwaysurfers.svg' },
    { name: 'Candy Crush Saga',cat: 'Match-3',        icon: 'assets/mobile-icons/candycrush.svg' },
    { name: 'Free Fire',       cat: 'Battle Royale',  icon: 'assets/mobile-icons/freefire.svg' },
    { name: 'PUBG Mobile',     cat: 'Shooter',        icon: 'assets/mobile-icons/pubgmobile.svg' },
    { name: 'Clash of Clans',  cat: 'Strategy',       icon: 'assets/mobile-icons/clashofclans.svg' },
    { name: 'Among Us',        cat: 'Party',          icon: 'assets/mobile-icons/amongus.svg' },
    { name: 'Minecraft',       cat: 'Sandbox',        icon: 'assets/mobile-icons/minecraft.svg' },
    { name: 'Roblox',          cat: 'Platform',       icon: 'assets/mobile-icons/roblox.svg' },
    { name: 'Temple Run',      cat: 'Endless Runner', icon: 'assets/mobile-icons/templerun.svg' },
    { name: 'Angry Birds',     cat: 'Puzzle',         icon: 'assets/mobile-icons/angrybirds.svg' },
    { name: 'Pokémon GO',      cat: 'Adventure',      icon: 'assets/mobile-icons/pokemongo.svg' },
    { name: 'Brawl Stars',     cat: 'Action',         icon: 'assets/mobile-icons/brawlstars.svg' }
  ];

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();

    var slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) { goHome(); return; }

    currentGame = allGames.find(function (g) { return g.slug === slug; });
    if (!currentGame) { goHome(); return; }

    updateMeta();
    updateHeader();
    updateInfo();
    setupPreview();
    setupControls();
    setupPlayButton();
    renderRelated();
    renderDownloadGames();
    setupPageLeave();

    console.log('[Fun5Games] Loaded: ' + currentGame.title);
  }

  function goHome() { window.location.href = 'index.html'; }

  async function loadGames() {
    try {
      var res = await fetch('data/games.json?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      allGames = await res.json();
    } catch (e) {
      console.error('[Fun5Games] Failed to load games:', e);
      allGames = [];
    }
  }

  function updateMeta() {
    document.title = currentGame.title + ' - Play Free | Fun5Games';
    var desc = 'Play ' + currentGame.title + ' free! ' + currentGame.description;
    document.getElementById('metaDesc').content = desc;
    document.getElementById('ogTitle').content = currentGame.title + ' - Fun5Games';
    document.getElementById('ogDesc').content = desc;

    var ld = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": currentGame.title,
      "description": currentGame.description,
      "genre": cap(currentGame.category),
      "playMode": "SinglePlayer",
      "applicationCategory": "Game",
      "operatingSystem": "Web Browser"
    };
    document.getElementById('jsonLd').textContent = JSON.stringify(ld);
  }

  function updateHeader() {
    document.getElementById('breadcrumb').textContent = cap(currentGame.category) + ' > ' + currentGame.title;
    document.getElementById('gameTitle').textContent = currentGame.title.toUpperCase();

    var full = Math.floor(currentGame.rating);
    var half = currentGame.rating % 1 >= 0.5;
    var stars = '★'.repeat(full);
    if (half) stars += '½';
    stars += ' ' + currentGame.rating + '/5';
    document.getElementById('gameStars').textContent = stars;
    document.getElementById('gameBadge').textContent = cap(currentGame.category);
  }

  function updateInfo() {
    document.getElementById('gameDescription').innerHTML =
      esc(currentGame.description) + '<br><br><strong>Controls:</strong> ' + esc(currentGame.controls);

    document.getElementById('gameTags').innerHTML = currentGame.tags.map(function (t) {
      return '<span class="game-tag">' + esc(t) + '</span>';
    }).join('');
  }

  function setupPreview() {
    var img = document.getElementById('thumbPreviewImg');
    img.src = currentGame.thumbnail;
    img.alt = currentGame.title;
  }

  function setupPlayButton() {
    var playBtn = document.getElementById('playGameBtn');
    if (!playBtn) return;

    var startGame = function (e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (iframeLoaded) return;
      iframeLoaded = true;

      var container = document.getElementById('gameFrameContainer');
      var preview = document.getElementById('thumbPreview');
      var wrapper = document.getElementById('gameFrameWrapper');
      var loading = document.getElementById('gameLoading');
      var ctaWrap = document.getElementById('playCtaWrap');

      // Switch to vertical (9:16) game mode
      if (container) container.classList.add('playing');
      // Hide preview + CTA, show iframe wrapper
      if (preview) preview.classList.add('hidden');
      if (ctaWrap) ctaWrap.classList.add('hidden');
      wrapper.classList.remove('hidden');
      if (loading) loading.classList.remove('hidden');

      // Create iframe
      var iframe = document.createElement('iframe');
      iframe.src = currentGame.game_url + '?v=' + Date.now();
      iframe.id = 'gameIframe';
      iframe.title = currentGame.title;
      iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');

      iframe.addEventListener('load', function () {
        if (loading) loading.classList.add('hidden');
      });

      setTimeout(function () { if (loading) loading.classList.add('hidden'); }, 8000);

      wrapper.appendChild(iframe);

      // Scroll to game
      setTimeout(function () {
        document.getElementById('gameFrameContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };

    playBtn.addEventListener('click', startGame);

    // Also clicking thumbnail starts game
    var preview = document.getElementById('thumbPreview');
    if (preview) preview.addEventListener('click', startGame);
  }

  function setupControls() {
    var container = document.getElementById('gameFrameContainer');
    var fsBtn = document.getElementById('fullscreenBtn');
    var reloadBtn = document.getElementById('reloadBtn');

    fsBtn.addEventListener('click', function () {
      if (!iframeLoaded) {
        document.getElementById('playGameBtn').click();
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else {
        container.classList.toggle('fullscreen');
        fsBtn.textContent = container.classList.contains('fullscreen') ? '✖ Exit' : '⛶ Full Screen';
      }
    });

    document.addEventListener('fullscreenchange', function () {
      fsBtn.textContent = document.fullscreenElement ? '✖ Exit Fullscreen' : '⛶ Full Screen';
    });

    reloadBtn.addEventListener('click', function () {
      var iframe = document.getElementById('gameIframe');
      if (iframe) {
        var loading = document.getElementById('gameLoading');
        if (loading) loading.classList.remove('hidden');
        iframe.src = currentGame.game_url + '?v=' + Date.now();
        setTimeout(function () { if (loading) loading.classList.add('hidden'); }, 8000);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && container.classList.contains('fullscreen')) {
        container.classList.remove('fullscreen');
        fsBtn.textContent = '⛶ Full Screen';
      }
    });
  }

  function setupPageLeave() {
    window.addEventListener('beforeunload', destroyIframe);
    window.addEventListener('pagehide', destroyIframe);
  }

  function destroyIframe() {
    var iframe = document.getElementById('gameIframe');
    if (iframe) { iframe.src = 'about:blank'; iframe.remove(); }
  }

  function renderRelated() {
    var related = allGames
      .filter(function (g) { return g.id !== currentGame.id; })
      .map(function (g) {
        var sc = 0;
        if (g.category === currentGame.category) sc += 3;
        g.tags.forEach(function (t) { if (currentGame.tags.indexOf(t) >= 0) sc += 1; });
        return Object.assign({}, g, { rel: sc });
      })
      .filter(function (g) { return g.rel > 0; })
      .sort(function (a, b) { return b.rel - a.rel; })
      .slice(0, 6);

    if (related.length < 6) {
      // Fallback: show first 6 trending games
      related = allGames.filter(function (g) { return g.id !== currentGame.id; }).slice(0, 6);
    }

    var grid = document.getElementById('relatedGrid');
    if (!grid) return;
    grid.innerHTML = related.map(function (game) {
      return '<div class="game-card">' +
        '<div class="game-card-thumb">' +
          '<img src="' + game.thumbnail + '" alt="' + esc(game.title) + '" loading="lazy" ' +
          'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'thumb-placeholder\',innerHTML:\'🎮\'}))">' +
        '</div>' +
        '<div class="game-card-body">' +
          '<div class="game-card-title">' + esc(game.title) + '</div>' +
          '<a href="game.html?slug=' + game.slug + '">' +
            '<button class="play-button">Play Game</button>' +
          '</a>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderDownloadGames() {
    var grid = document.getElementById('downloadGrid');
    if (!grid) return;
    grid.innerHTML = DOWNLOAD_GAMES.map(function (g) {
      return '<a class="download-card" href="https://fun5games.com" target="_blank" rel="noopener">' +
        '<img class="download-icon" src="' + g.icon + '" alt="' + esc(g.name) + '" loading="lazy">' +
        '<div class="download-info">' +
          '<div class="download-name">' + esc(g.name) + '</div>' +
          '<div class="download-cat">' + esc(g.cat) + '</div>' +
        '</div>' +
        '<div class="download-arrow">↗</div>' +
      '</a>';
    }).join('');
  }

  function esc(text) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

})();
