/* ========================================
   PlayZone - Homepage Script
   play202 style: white cards, blue buttons
   ======================================== */

(function () {
  'use strict';

  let allGames = [];
  let filteredGames = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let displayedCount = 0;
  const GAMES_PER_PAGE = 10;

  const categoryEmoji = {
    action: '\u2694\uFE0F',
    puzzle: '\uD83E\uDDE9',
    arcade: '\uD83C\uDFAE',
    snake: '\uD83D\uDC0D',
    all: '\uD83C\uDF1F'
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadGames();
    handleURLParams();
    renderTrendingGames();
    renderAllGames();
    setupSearch();
    setupCategoryFilters();
    setupShowAdButton();
    setupLoadMore();
  }

  // --- Load Games ---
  async function loadGames() {
    try {
      const res = await fetch('data/games.json');
      allGames = await res.json();
      filteredGames = [...allGames];
    } catch (e) {
      console.error('[PlayZone] Failed to load games:', e);
      allGames = [];
      filteredGames = [];
    }
  }

  // --- URL params (for search redirect from game page) ---
  function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const cat = params.get('category');

    if (search) {
      document.getElementById('searchInput').value = search;
      searchQuery = search.toLowerCase();
      applyFilters();
    }
    if (cat && cat !== 'all') {
      handleCategoryClick(cat);
    }
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
      const cap = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      label.innerHTML = `${categoryEmoji[currentCategory] || '\uD83C\uDFAE'} ${cap} Games`;
    } else if (searchQuery) {
      label.innerHTML = `\uD83D\uDD0D Results for "${escapeHtml(searchQuery)}"`;
    } else {
      label.innerHTML = '\uD83C\uDF1F All Games';
    }

    // Show/hide trending section
    const trendingSection = document.getElementById('trendingSection');
    if (currentCategory !== 'all' || searchQuery) {
      trendingSection.style.display = 'none';
    } else {
      trendingSection.style.display = '';
    }

    loadMoreGames();
  }

  function loadMoreGames() {
    const grid = document.getElementById('allGamesGrid');
    const nextBatch = filteredGames.slice(displayedCount, displayedCount + GAMES_PER_PAGE);

    nextBatch.forEach((game, i) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = createGameCard(game);
      const el = wrapper.firstElementChild;
      el.style.animationDelay = `${i * 0.04}s`;
      grid.appendChild(el);
    });

    displayedCount += nextBatch.length;
    observeLazyImages(grid);

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
          <img data-src="${game.thumbnail}" alt="${escapeHtml(game.title)}"
               class="lazy-img"
               onerror="this.parentElement.innerHTML+='';this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb-placeholder',innerHTML:'${categoryEmoji[game.category] || '\uD83C\uDFAE'}'}))">
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
    `;
  }

  // --- Search ---
  function setupSearch() {
    const input = document.getElementById('searchInput');
    let timer;

    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchQuery = input.value.trim().toLowerCase();
        applyFilters();
      }, 300);
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
      btn.addEventListener('click', () => handleCategoryClick(btn.dataset.category));
    });
  }

  function handleCategoryClick(category) {
    currentCategory = category;

    document.querySelectorAll('.cat-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.category === category);
    });

    applyFilters();

    // Scroll to games
    document.getElementById('allGamesGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // --- Lazy Loading (IntersectionObserver) ---
  function observeLazyImages(container) {
    const images = container.querySelectorAll('.lazy-img:not(.loaded)');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '150px' });

      images.forEach(img => observer.observe(img));
    } else {
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('loaded');
      });
    }
  }

  // --- On-Demand Ad Button ---
  function setupShowAdButton() {
    document.getElementById('showAdBtn').addEventListener('click', () => {
      try {
        if (typeof adBreak === 'function') {
          adBreak({
            type: 'reward',
            name: 'on-demand-ad',
            beforeAd: () => console.log('[PlayZone Ads] Ad starting...'),
            afterAd: () => console.log('[PlayZone Ads] Ad finished.'),
            adBreakDone: (info) => console.log('[PlayZone Ads] Placement:', info)
          });
        } else {
          console.log('[PlayZone Ads] adBreak not available (test mode).');
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

})();
