/* ========================================
   PlayZone - Homepage Script
   40+ games from funhtml5games.com
   Search, Filter, Lazy Load, Ads
   ======================================== */

(function () {
  'use strict';

  // --- State ---
  let allGames = [];
  let filteredGames = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let displayedCount = 0;
  const GAMES_PER_PAGE = 12;

  const categoryEmoji = {
    action: '\u2694\uFE0F',
    puzzle: '\uD83E\uDDE9',
    arcade: '\uD83C\uDFAE',
    snake: '\uD83D\uDC0D',
    all: '\uD83C\uDF1F'
  };

  // --- Init ---
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    handleURLParams();
    renderTrendingGames();
    renderAllGames();
    setupSearch();
    setupCategoryFilters();
    setupLoadMore();
    setupShowAdButton();
    setupStickyAd();
    setupLazyLoading();
    console.log(`[PlayZone] Loaded ${allGames.length} games. Ready!`);
  }

  // --- Load Games from JSON ---
  async function loadGames() {
    try {
      // Cache-bust so stale CDN / browser caches never lock the game list
      const res = await fetch('data/games.json?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allGames = await res.json();
      filteredGames = [...allGames];
    } catch (e) {
      console.error('[PlayZone] Failed to load games:', e);
      allGames = [];
      filteredGames = [];
    }
  }

  // --- URL Params (for redirects from game page) ---
  function handleURLParams() {
    const params = new URLSearchParams(window.location.search);

    const search = params.get('search');
    if (search) {
      document.getElementById('searchInput').value = search;
      searchQuery = search.toLowerCase();
    }

    const cat = params.get('category');
    if (cat && cat !== 'all') {
      currentCategory = cat;
      document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === cat);
      });
    }

    if (search || cat) applyFilters();
  }

  // --- Trending Games ---
  function renderTrendingGames() {
    const trending = allGames.filter(g => g.trending);
    const grid = document.getElementById('trendingGrid');
    grid.innerHTML = trending.map(game => createGameCard(game)).join('');
    observeLazyImages(grid);
  }

  // --- All Games Grid ---
  function renderAllGames() {
    displayedCount = 0;
    const grid = document.getElementById('allGamesGrid');
    grid.innerHTML = '';

    // Update section label
    const label = document.getElementById('allGamesLabel');
    if (currentCategory !== 'all') {
      const name = capitalize(currentCategory);
      label.innerHTML = `${categoryEmoji[currentCategory] || '\uD83C\uDFAE'} ${name} Games`;
    } else if (searchQuery) {
      label.innerHTML = `\uD83D\uDD0D Results for "${escapeHtml(searchQuery)}"`;
    } else {
      label.innerHTML = '\uD83C\uDF1F All Games';
    }

    // Show/hide trending when filtering
    const trendingSection = document.getElementById('trendingSection');
    trendingSection.style.display = (currentCategory !== 'all' || searchQuery) ? 'none' : '';

    loadMoreGames();
  }

  function loadMoreGames() {
    const grid = document.getElementById('allGamesGrid');
    const batch = filteredGames.slice(displayedCount, displayedCount + GAMES_PER_PAGE);

    batch.forEach((game, i) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = createGameCard(game);
      const el = wrapper.firstElementChild;
      el.style.animationDelay = `${i * 0.03}s`;
      grid.appendChild(el);
    });

    displayedCount += batch.length;
    observeLazyImages(grid);

    // Toggle load more / no results
    const container = document.getElementById('loadMoreContainer');
    const noResults = document.getElementById('noResults');

    if (filteredGames.length === 0) {
      container.style.display = 'none';
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
      container.style.display = displayedCount < filteredGames.length ? 'block' : 'none';
    }
  }

  function setupLoadMore() {
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreGames);
  }

  // --- Game Card (play202 style) ---
  function createGameCard(game) {
    return `
      <div class="game-card" data-category="${game.category}">
        <div class="game-card-thumb">
          ${game.trending ? '<span class="trending-badge">\uD83D\uDD25 HOT</span>' : ''}
          <img src="${game.thumbnail}" alt="${escapeHtml(game.title)}"
               class="lazy-img loaded" loading="lazy" decoding="async"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb-placeholder',innerHTML:'${categoryEmoji[game.category] || '\uD83C\uDFAE'}'}))">
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
    `;
  }

  // --- Search with Debounce ---
  function setupSearch() {
    const input = document.getElementById('searchInput');
    let timer;

    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchQuery = input.value.trim().toLowerCase();
        applyFilters();
      }, 250);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(timer);
        searchQuery = input.value.trim().toLowerCase();
        applyFilters();
      }
    });
  }

  // --- Category Filters ---
  function setupCategoryFilters() {
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;

        document.querySelectorAll('.cat-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.category === currentCategory);
        });

        applyFilters();
        document.getElementById('allGamesGrid').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  function applyFilters() {
    filteredGames = allGames.filter(game => {
      const matchCat = currentCategory === 'all' || game.category === currentCategory;
      const matchSearch = !searchQuery ||
        game.title.toLowerCase().includes(searchQuery) ||
        game.category.toLowerCase().includes(searchQuery) ||
        game.tags.some(t => t.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });
    renderAllGames();
  }

  // --- Lazy Loading with IntersectionObserver ---
  function setupLazyLoading() {
    observeLazyImages(document);
  }

  function observeLazyImages(container) {
    const images = container.querySelectorAll('.lazy-img:not(.loaded)');
    if (!images.length) return;

    const fadeIn = (img) => {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      // If already cached and load fired before listener attached
      if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              fadeIn(img);
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      images.forEach(img => observer.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        if (img.dataset.src) {
          fadeIn(img);
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  // --- Sticky Bottom Ad ---
  function setupStickyAd() {
    const closeBtn = document.getElementById('stickyAdClose');
    const stickyAd = document.getElementById('stickyBottomAd');
    if (closeBtn && stickyAd) {
      closeBtn.addEventListener('click', () => {
        stickyAd.classList.add('hidden');
        document.body.style.paddingBottom = '0';
      });
    }
  }

  // --- Google H5 Ads: On-Demand Button ---
  function setupShowAdButton() {
    document.getElementById('showAdBtn').addEventListener('click', () => {
      try {
        if (typeof adBreak === 'function') {
          adBreak({
            type: 'reward',
            name: 'on-demand-homepage',
            beforeAd: () => console.log('[PlayZone Ads] Reward ad starting...'),
            afterAd: () => console.log('[PlayZone Ads] Reward ad finished.'),
            adBreakDone: (info) => {
              console.log('[PlayZone Ads] Placement result:', info);
              if (info.breakStatus === 'viewed') {
                alert('Thanks for watching! You earned a reward.');
              }
            }
          });
        } else {
          console.log('[PlayZone Ads] adBreak not available (test mode).');
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
