# 🎮 Prepp Games — Project Context

**Last Updated:** May 12, 2026
**Status:** Production-ready · Vertoz approved · 13 ad placements with Vertoz-styled placeholders live · waiting for actual ad tag JS

---

## ⏰ WHERE WE LEFT OFF (May 12, 2026)

```
✅ DONE
├── 32 games built & live on fun5games.us + prepp.in/games
├── Brand rebranded: Fun5Games → Prepp Games
├── Hosting target: prepp.in/games (Prepp tech team handles this)
├── ads.txt deployed with 17 Vertoz authorized seller lines
├── prepp.in/ads.txt LIVE & VERIFIED (May 7)
│   └── Prepp team added their own google.com pub-4304762948491681 line on top
├── Vertoz APPROVED ✅ — Ayushmann sent ad placement plan (5 attachments,
│   including INTERSTITIAL.png) on May 11
├── 13 Vertoz-styled ad placeholders implemented matching Ayushmann's screenshots
│   (visible red italic size labels so Ayushmann can verify placements)
├── 320x480 interstitial modal — fires on game card click (homepage), 5s
│   countdown then Skip Ad ✕ button
├── Google Analytics 4 active (G-D16NB8WW33) — 17 unique events tracked
│   (page_view, game_view, game_play, game_iframe_loaded, game_close,
│   game_reload, game_fullscreen, game_error, nav_click, footer_link_click,
│   category_filter, game_select, download_click, ad_dismiss,
│   interstitial_shown, interstitial_dismiss, scroll_depth, time_on_page)
├── Bug fix May 12: Skibidi Toilet — inline style.bottom='-100%' was
│   overriding CSS .up class, toilets stayed invisible. Removed inline
│   style overrides; now relies on classList toggling. (commit f2f95b4)
├── robots.txt + sitemap.xml live
├── 4 legal pages (about/contact/terms/privacy) all on Prepp branding
├── Close (✕) button on iframe gameplay
├── play202-style game flow (PLAY → iframe loads in place)
├── Real Apple App Store icons in "Download Top Mobile Games" section

⏳ PENDING (waiting on others)
├── Vertoz to send actual ad tag JS snippets — 13 unique tags requested:
│   • 4 × 728x90 (with 320x50 mobile fallback)
│   • 5 × 970x250 (with 300x250 mobile fallback)
│   • 1 × 970x90 (with 728x90 / 320x50 fallback)
│   • 2 × 300x600 (desktop ≥1280px only, hide on mobile)
│   • 1 × 320x480 (static interstitial)
├── Prepp tech team (Kunal) needs to redeploy prepp.in/games on next release
│   to pick up Vertoz placeholders + GA4 tracking + Skibidi fix

🎯 LIKELY NEXT TASKS (when continuing this project)
├── Receive Vertoz ad tags → integrate into 9 ad slots
├── Test ad fill rate on mobile + desktop
├── Monitor GA4 → Vertoz dashboard for CPM
├── (optional) Add more games based on engagement data
└── (optional) A/B test ad placements
```

---

## 🚀 BOOTSTRAP A NEW CLAUDE SESSION (read this FIRST)

If you're a new Claude session picking up this project, here's how to get full context in 30 seconds:

### Step 1: Clone or open existing local copy

**Local path on Krishna's Mac (existing):**
```
/Users/dell/Library/Mobile Documents/com~apple~CloudDocs/Claude code/PlayZone
```

**OR fresh clone on a different machine:**
```bash
git clone https://github.com/krishnasharma-collegedunia/fun5gamesus.git
cd fun5gamesus
```

### Step 2: Tell user this is what you'll do

Read these files in order:
1. `CONTEXT.md` (this file) — full architecture & state
2. `data/games.json` — all 32 games config
3. `index.html` + `game.html` — main page templates
4. `js/script.js` + `js/game.js` + `js/analytics.js` — core logic
5. `css/style.css` — single stylesheet (light/dark themes)

### Step 3: Verify deployment status

```bash
# Check git sync
git status
git log origin/main --oneline -5

# Check live site
curl -sI https://fun5games.us/ | head -3
curl -s https://fun5games.us/ads.txt | head -5
```

### Step 4: SSH access to server (testing site)

```bash
ssh root@64.227.184.30
cd /var/www/fun5games-us
git pull origin main
```

### What's where

| Domain | Hosting | Update |
|---|---|---|
| **fun5games.us** | DigitalOcean (root@64.227.184.30) | I have SSH access, auto-pull |
| **prepp.in/games** | Prepp's own infra | Prepp tech team pulls from GitHub |

---

## 📌 Project Overview

**Prepp Games** is the games section of [Prepp.in](https://prepp.in) (operated by 3.14 Digital, a Collegedunia subsidiary). It's a free HTML5 games portal for Indian competitive exam aspirants (UPSC/SSC/Banking/Railways) — also accessible at fun5games.us for testing.

- **Production URL:** https://prepp.in/games
- **Testing URL:** https://fun5games.us
- **Brand:** "Prepp Games"
- **Tech Stack:** Static HTML/CSS/JS (no React/build step), served via Nginx
- **Server:** root@64.227.184.30 (DigitalOcean) at `/var/www/fun5games-us`
- **GitHub:** https://github.com/krishnasharma-collegedunia/fun5gamesus
- **Local Path:** `/Users/dell/Library/Mobile Documents/com~apple~CloudDocs/Claude code/PlayZone`

### Sister Site
- **fun5games.com** — Mobile downloads site (200+ Android/iOS games via Apple App Store data). Hosted at `/var/www/fun5games-com` (Next.js). Cross-linked from game pages "Download Top Mobile Games" section.

---

## 🏗️ Architecture

### Pages
- `index.html` — Homepage with game grid + categories
- `game.html` — Universal game player (loads any game via `?slug=X`)
- `about.html` / `contact.html` / `terms.html` / `privacy.html` — Legal pages

### Game Files
- 32 standalone HTML5 games at `public/games/<slug>.html`
- Each game is **single-file** (HTML + CSS + JS inline, no deps)
- Pattern: IIFE wrapper, `var` only, `pointerdown` events, `position:absolute` overlays (NOT fixed - iOS iframe bug), `ontouchstart=""` on buttons

### Assets
- `assets/thumbnails/<slug>.svg` — Game card thumbnails (400x300 viewBox, 4:3)
- `assets/mobile-icons/<game>.svg` — App icons (unused — replaced with real Apple CDN URLs)

### Data
- `data/games.json` — Array of 32 game entries (id, slug, title, category, thumbnail, game_url, description, tags, controls, rating)

### Core JS
- `js/script.js` — Homepage: loads games, renders grid, category filters, dynamic section heading
- `js/game.js` — Game page: PLAY button → iframe loads, Close (X) button → restore preview, Download Games section, related games
- `js/analytics.js` — GA4 + custom events (`game_play`, `game_select`, `category_filter`, `download_click`, `ad_dismiss`)

### CSS
- `css/style.css` — Single stylesheet, dark blue theme (light theme variant for legal/about), responsive (2-col mobile → 6-col desktop)

---

## 🎮 32 Games (current order in games.json)

**Famous classics first** (positions 1-10):
Snake.Go, 2048 Merge, Fruit Slice Master, Pixel Flap, Block Drop, Bubble Shooter, Sudoku Pro, Brick Smash, Memory Flip, Color Sort

**Trending casual** (11-20):
Heart Match, Galaxy Hole, Stack Tower, Basketball Slam, Speed Boat, Goal Keeper, Skibidi Toilet, Style Star, Coin Catcher, Neon Blaster

**Brain & Skills** (21-32):
Quick Math 60, GK Blitz, Memory Master, Number Ninja, Word Groups, Odd One Out, True or False, Code Cracker, Word Wise, Mini Crossword, India Map Master, DI Drill

**UPSC Special** (interactive, not quiz format):
Constitution Quest, Timeline Rush, Scheme Match, PM Quest

**Categories:** all, action, casual, arcade, brain (5 visible filter pills)

---

## 📊 Verified Content (no fake/wrong facts)

- **GK Blitz:** 261 verified MCQs (History/Geography/Polity/Economy/Science/Culture)
- **Word Wise:** 419 vocabulary pairs (Synonyms/Antonyms/Analogies)
- **True or False:** 217 verified statements
- **Odd One Out:** 400+ classification puzzles
- **Constitution Quest:** 40 verified Articles
- **Timeline Rush:** 240 historical events
- **Scheme Match:** 68 verified govt schemes (PMJDY, MGNREGA, Ayushman Bharat etc.)
- **PM Quest:** 95 verified PM acts/events
- **Sources:** GKToday, Testbook, Wikipedia, PIB, Britannica

---

## 💰 Monetization Setup (Vertoz)

### Status: APPROVED ✅ (May 11, 2026) — placeholders live, awaiting ad tag JS

### 13 Vertoz Ad Placements

**Homepage (5 visible + 1 interstitial modal):**
- `#adTop` — 728x90 above category filters (mobile: 320x50)
- `#adInGrid` — 728x90 injected after 6th game card via JS (full-width via grid-column 1/-1)
- `#adMid` — 970x250 after games grid (mobile: 300x250)
- `#adFooter` — 970x250 after About Prepp Games (mobile: 300x250)
- `#adSticky` — 728x90 sticky bottom (mobile: 320x50)
- `#adInterstitial` — 320x480 modal, fires on game card PLAY click,
  5s countdown then Skip Ad ✕ button. Tracks interstitial_shown +
  interstitial_dismiss with seconds_viewed.

**Game page (7):**
- `#adSidebarLeft` — 300x600 left rail (desktop ≥1280px only)
- `#adSidebarRight` — 300x600 right rail (desktop ≥1280px only)
- `#adPreGame` — 970x90 / 728x90 below game preview (mobile: 320x50)
- `#adMid` — 970x250 between How-to-Play and Download (mobile: 300x250)
- `#adBottom` — 970x250 between Download and Related games
- `#adNativeFeed` — 970x250 after Related games
- `#adSticky` — 728x90 sticky bottom (mobile: 320x50)

Each slot has:
- `data-ad-slot="..."` (semantic name, e.g., `header`, `after_grid`, `sidebar_left`)
- `data-ad-size="..."` (comma-separated primary + mobile fallback sizes)
- Visible red italic size label inside placeholder (for review/verification)

**Placeholder visual** matches Ayushmann's screenshots — dashed red border
+ prominent size label so Vertoz tag swap-in is a clean 1:1 replacement.

### ads.txt Lines (deployed at prepp.in/ads.txt)
```
manager domain = incrementx.com
incrementx.com, 28551, DIRECT, 8728b7e97e589da4
google.com, pub-3977122154505186, RESELLER, f08c47fec0942fa0
pubmatic.com, 161652, DIRECT, 5d62403b186f2ace
pubmatic.com, 164418, DIRECT, 5d62403b186f2ace
onetag.com, 774083553572acc, DIRECT
vertoz.com, 500031, DIRECT, 8728b7e97e589da4
e-planning.net, ed3739c69c57b845, DIRECT, c1ba615865ed87b2
adagio.io, 1539, RESELLER
rubiconproject.com, 19116, RESELLER, 0bfd66d529a55807
nextmillennium.io, 17081, DIRECT, 65bd090fa4a1e3d6
admagnetix.io, 202074, DIRECT
minutemedia.com, 01k1xjvjf85r, DIRECT
minutemedia.com, 01k1xjvjf85r, RESELLER
sovrn.com, 331050, DIRECT, fafdf38b16bf6b2b
media.net, 8CUIUMTP7, DIRECT
sharethrough.com, izM1hGJl, DIRECT, d53b998a7bd4ecd3
```

### Vertoz Contact
- **Person:** Ayushmann Rai (Vertoz)
- **Status as of May 7:** ads.txt verified live on prepp.in root; Ayushmann said approval in 1-2 days
- **Expected approval:** Friday May 8 / weekend
- **Next step:** Vertoz sends actual ad tag JS snippets → integrate into 9 ad slots → push to GitHub → Prepp team redeploys prepp.in/games → test fill rate (incognito + mobile + desktop) → monitor GA4 + Vertoz dashboard for CPM

---

## 📈 Analytics

### Google Analytics 4
- **Measurement ID:** `G-D16NB8WW33`
- **File:** `js/analytics.js` (loaded on all 6 HTML pages)
- **Privacy:** `anonymize_ip: true`, `SameSite=None;Secure`

### Custom Events Tracked (17 total — comprehensive coverage)

**Navigation & Discovery:**
- `page_view` (auto via gtag)
- `nav_click` — Header nav links (params: link_text, link_url, location)
- `footer_link_click` — Footer About/Contact/Terms/Privacy
- `category_filter` — Category pill click (param: category)
- `game_select` — Game card click (params: slug, source = homepage_grid / related_games)

**Game Interactions:**
- `game_view` — Game page loaded with valid slug (params: game_slug, game_title, game_category, game_rating)
- `game_play` — PLAY GAME button click (param: slug)
- `game_iframe_loaded` — iframe `load` event fires (params: game_slug, latency_ms)
- `game_close` — ✕ Close button (params: game_slug, game_title, time_played_seconds)
- `game_reload` — 🔄 Reload button (params: game_slug, time_played_seconds_before_reload)
- `game_fullscreen` — ⛶ Fullscreen toggle (params: game_slug, action = enter/exit)
- `game_error` — Slug missing/not found OR iframe load fails (params: reason, game_slug)

**Downloads:**
- `download_click` — Any fun5games.com link (params: link_url, link_text, source = banner / download_grid / download_section / header_nav / link)

**Ads & Monetization:**
- `ad_dismiss` — Sticky ad ✕ close (param: slot = "sticky_bottom")
- `interstitial_shown` — 320x480 modal appears (params: game_slug, trigger = "homepage_card_click")
- `interstitial_dismiss` — Skip Ad clicked (params: game_slug, seconds_viewed)

**Engagement Quality:**
- `scroll_depth` — 25/50/75/100 milestones (fires once per milestone per page, params: percent, page)
- `time_on_page` — On visibilitychange/pagehide (params: seconds, page)

---

## 🎯 SEO

- **robots.txt** — Disallows `/data/` and `/assets/mobile-icons/`, points to sitemap
- **sitemap.xml** — 37 URLs (1 home + 32 games + 4 legal)
- **OG meta + canonical** — All point to `https://prepp.in/games`
- **Structured data** — JSON-LD VideoGame schema on game pages

---

## 🚀 Deploy Workflow

```bash
# 1. Make changes locally
cd "/Users/dell/Library/Mobile Documents/com~apple~CloudDocs/Claude code/PlayZone"

# 2. Commit & push to GitHub
git add -A
git commit -m "describe change"
git push origin main

# 3. Pull on server (testing site)
ssh root@64.227.184.30 "cd /var/www/fun5games-us && git pull origin main"

# 4. Prepp prod site (prepp.in/games) — needs separate deploy by Prepp tech team
# They pull from same GitHub repo into their own folder
```

### Cache-busting
Game iframes use `?v=${Date.now()}` query param to bypass cache when game files update.
games.json fetched with `?v=${Date.now()}` and `cache: 'no-store'`.

---

## 🐛 Known Patterns / Common Bugs to Avoid

1. **`position:fixed` inside iframe** = breaks on iOS Safari. Always use `position:absolute` with positioned parent.
2. **z-index ordering** — Background overlays should be `z-index: 0`, content `z-index: 1+`. Don't make `.ovbg` higher than content.
3. **SVG thumbnails are 4:3** — Container must match aspect ratio OR use `object-fit: contain` to avoid title clipping.
4. **`var` only** — All games use ES5-style `var` for max browser compat. Don't introduce `let`/`const`.
5. **No external dependencies** — Each game is self-contained. Don't add CDN scripts.
6. **`touchmove` preventDefault** — All games disable scroll inside iframe via `document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false})`
7. **Mobile-first** — Test at 390x844 viewport. Hero compressed to ~150px on mobile to surface games quickly.
8. **`window.fun5track`** — Helper exists for tracking custom events (kept name despite rebrand for code stability)

---

## 🎨 Design System

### Colors
- **Primary blue:** `#2563eb` (Prepp brand-aligned)
- **Background:** `#0a1530` (dark navy) — main theme
- **Light theme** (legal pages): white background with subtle gradient
- **Accent:** Yellow `#fbbf24` (CTA buttons, like play202)

### Typography
- **Body:** Inter (Google Fonts)
- **Game titles:** ALL CAPS, weight 900, system fallback

### Layout
- **Mobile:** 2-column game grid, compact hero
- **Tablet:** 3-4 column
- **Desktop:** 5-6 column max-width 1320px container

---

## 📝 game.html Flow (play202-style)

1. Header (Prepp Games brand + Play CTA)
2. Back button + breadcrumb
3. Game title in CAPS (e.g., "SNAKE.GO")
4. **Game preview area** — 4:3 thumbnail with hover ▶ icon
5. **▶ PLAY GAME** button (yellow, large)
6. Click PLAY → preview hidden, iframe loads, container becomes 9:16, ✕ close button appears
7. **"Discover more games"** card → "Let's Play 🔥 More Games" → homepage `#games`
8. Pre-game ad slot
9. Game info (rating, category badge, controls)
10. How to Play section
11. Mid ad slot
12. **📲 Download Top Mobile Games** section — 8 real Apple CDN icons → fun5games.com
13. Bottom ad slot
14. **🎯 You May Also Like** — 6 related games
15. Native feed ad slot (Taboola Discovery)
16. Footer
17. Sticky bottom ad bar (✕ dismissable)

---

## ⚠️ Important: Linked vs Hosted

Two parallel deployments:

| Location | Purpose | Update Method |
|---|---|---|
| **fun5games.us** | Testing/staging | `git pull` on server (auto via my SSH) |
| **prepp.in/games** | Production | Prepp tech team pulls from GitHub manually |

**Always test on fun5games.us first**, then notify Prepp team to redeploy prepp.in/games.

---

## 🔮 Future Tasks (when Vertoz tags arrive)

1. **Receive 13 Vertoz ad tags** (JS snippets — request: separate tags per
   placement for granular CPM/fill-rate tracking, NOT shared tags)
2. **Plug into placeholders** — replace `<div class="ad-inner">...</div>` content
   in each slot with Vertoz `<script>` tag. The placeholders are already
   class-named (`.ad-728x90`, `.ad-970x250`, etc.) and sized correctly.
3. **Test ad fill rate** — incognito + mobile + desktop + tablet
4. **Verify CLS (Cumulative Layout Shift)** — min-heights already set on
   placeholders so ad load shouldn't cause content jump
5. **Monitor GA4 Reports:**
   - Funnel: page_view → game_select → game_play → game_iframe_loaded → game_close
   - Drop-off analysis using scroll_depth + time_on_page
   - Ad performance: interstitial_dismiss.seconds_viewed distribution
   - Game performance: game_iframe_loaded.latency_ms p95 by game
   - Mobile vs Desktop: scroll_depth percentile by device
6. **Vertoz dashboard:** Track CPM/RPM per slot (since each has separate tag)
7. **Tell Prepp tech (Kunal)** to redeploy prepp.in/games once Vertoz tags
   are integrated and tested on fun5games.us
8. **Optional:** Add `game_complete` event when games actually finish
9. **Optional:** A/B test ad placements based on RPM data
10. **Optional:** Add more games based on engagement data

---

## 📞 Stakeholders

- **CEO:** Sahil (final decisions on strategy)
- **Vertoz Account Manager:** Ayushmann Rai
- **Operating Company:** 3.14 Digital (Collegedunia subsidiary)
- **Email:** contactus@prepp.in
- **Phone:** +91 93193 60022
- **Address:** 4th Floor, 418-419, AIHP Signature Tower, Udyog Vihar Phase IV, Gurgaon, Haryana 122015

---

## 🔑 Latest Git Commits (most recent first)

```
f2f95b4 Fix Skibidi Toilet: inline style overriding CSS .up class (toilets invisible bug)
76d25f2 Expand GA4 tracking: 17 events covering navigation, games, ads, engagement
dee44c8 Upgrade sticky + remaining game page placeholders to Vertoz styling (728x90 sticky + 3x 970x250)
c1160a7 Move interstitial trigger from game.html PLAY → homepage card click
b9f9da8 Add Vertoz interstitial 320x480 placeholder on PLAY click
412ddc8 Add Vertoz ad placement placeholders matching Ayushmann's suggested layout (13 slots)
91c2298 Update CONTEXT.md: May 8 status — ads.txt verified live on prepp.in
1a31abc Add README.md — landing doc on GitHub pointing to CONTEXT.md
5328429 Update CONTEXT.md: add Bootstrap section with local path + pending tasks
603bf8e Add CONTEXT.md — comprehensive project context for future sessions
c09a39d ads.txt: Add 17 Vertoz authorized seller lines
a66ee6b Add ads.txt template
daba5d7 Rebrand: Fun5Games -> Prepp Games (hosting at prepp.in/games)
4a1ce6b Complete Vertoz/Taboola ad slot infrastructure (9 slots ready)
3a9a145 Add close (X) button on game iframe
b941486 Activate GA4 Measurement ID G-D16NB8WW33
aa5e255 Add Google Analytics 4 with custom event tracking
```

---

## 🆘 Quick Recovery / Common Operations

### Reset server to GitHub
```bash
ssh root@64.227.184.30 "cd /var/www/fun5games-us && git fetch origin && git reset --hard origin/main"
```

### Test all games
Use `/tmp/pup/` puppeteer scripts (recreate if missing). Pattern:
```js
await p.goto('https://fun5games.us/game.html?slug=' + slug)
await p.click('#playGameBtn')
await p.click('#gameCloseBtn')
```

### Add new game
1. Create `public/games/newgame.html` (follow IIFE pattern, see existing)
2. Create `assets/thumbnails/newgame.svg` (400x300 viewBox)
3. Add entry to `data/games.json`
4. `git push` → server auto-pulls

### Update GA4 ID
Edit `js/analytics.js` line `var GA_ID = 'G-D16NB8WW33';` (currently active)

### Replace ad slot fallback with real Vertoz tag
Find `<div class="ad-slot ad-XXX" id="adXxx">` and replace inner `.ad-inner` with Vertoz `<script>` tag.

---

**END OF CONTEXT**

For new Claude sessions: paste this entire file at start. All architecture, conventions, deploy steps, and project state are captured here.
