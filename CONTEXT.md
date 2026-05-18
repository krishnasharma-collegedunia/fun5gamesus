# 🎮 Prepp Games — Project Context

**Last Updated:** May 15, 2026
**Status:** All 14 Vertoz tags integrated + interstitial fixed (body-end) + browser-verified on fun5games.us. No-fill on fun5games.us is EXPECTED (not registered domain). Kunal redeploying prepp.in/games (registered domain → real fill there). Games confirmed working on prepp.in.

---

## ⏰ WHERE WE LEFT OFF (May 15, 2026)

```
✅ DONE
├── 32 games built & live on fun5games.us + prepp.in/games
├── Brand rebranded: Fun5Games → Prepp Games
├── ads.txt deployed; prepp.in/ads.txt LIVE & VERIFIED (May 7)
│   └── Prepp team added their own google.com pub-4304762948491681 line on top
├── Vertoz APPROVED (May 11) — Ayushmann sent placement plan + 14 ad tags
│   (prepp tags.txt + prepp tags (1).txt in ~/Downloads)
├── 13 Vertoz banner/display tags INTEGRATED & browser-verified on
│   fun5games.us (May 15):
│   • All slots fire correct token+size ad requests, HTTP 200
│   • Programmatic demand active (bt=programmatic postbacks)
│   • Zero JS console errors
│   • Currently empty.gif / no-fill — NORMAL for new account,
│     ramps up 24-72h (NOT a code issue)
│   • .ad-live CSS: unfilled slots collapse cleanly (no ugly boxes)
├── In-grid ad (#adInGrid) injected via createElement in script.js
│   (scripts set via innerHTML do NOT execute — DOM injection required)
├── GA4 active (G-D16NB8WW33) — 17 events (see Analytics section)
├── Skibidi Toilet bug fixed (commit f2f95b4)
├── robots.txt + sitemap.xml live; 4 legal pages on Prepp branding
├── play202-style game flow; real Apple icons in Download section

✅ INTERSTITIAL RE-ENABLED (hang fixed)
├── Root cause of earlier hang: overlayads.js was placed MID-BODY
│   (after sticky wrap, before footer) → synchronous external script
│   blocked HTML parsing → homepage froze
├── FIX (per Ayushmann "body par lagana hai"): moved overlayads.js to
│   the LAST element in <body>, AFTER <script src="js/script.js">,
│   right before </body> → non-blocking, content+JS load first
├── Browser-verified May 15: homepage loads perfectly, screenshot OK,
│   no hang, banners still firing correctly (commit 7f5a994)
├── Custom modal + countdown + card-click interception REMOVED from
│   script.js — Vertoz overlayads.js self-manages overlay/timing/close
└── Interstitial overlay not visually shown yet — expected: no-fill
    (new account) OR overlayads.js timer/trigger logic. Confirm actual
    display with Ayushmann once fill is active.

🔑 KEY INSIGHT — NO-FILL on fun5games.us is EXPECTED
├── Network logs showed di=fun5games.us, allowhost=0, siteid=22483
├── Vertoz approved/registered domain = prepp.in (NOT fun5games.us)
├── So fun5games.us (test domain) → empty.gif/no-fill is CORRECT behavior
└── Real ad fill will happen on prepp.in/games (the registered domain)
    once it has live user traffic. Ayushmann confirmed (May 15):
    "agar user jayega prepp se to check kr skte" — needs real prepp
    traffic to verify/serve fill.

⏳ PENDING / IN PROGRESS
├── Kunal (Prepp tech) redeploying prepp.in/games — pull main @ c728f99
│   (13 Vertoz tags + interstitial + GA4 17-events + Skibidi fix +
│   .ad-live CSS). User notified Kunal May 15.
├── Games CONFIRMED working on prepp.in/games (user play-tested) →
│   subpath/relative-path setup is fine, redeploy is low-risk
├── After redeploy: verify ad fill on prepp.in (real domain → should
│   fill, unlike fun5games.us), confirm interstitial displays, check
│   one game loads (iframe path), browser console clean
└── Spare tag IXY973988VE9E5GC (970x250) unused — backup inventory

🎯 NEXT TASKS
├── Ayushmann: confirm fill timeline + fix interstitial deployment
├── Monitor GA4 + Vertoz dashboard for CPM/RPM per slot once filled
├── Re-enable interstitial once Vertoz gives correct method
└── Tell Kunal to redeploy prepp.in/games (final step)
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

### Status: LIVE (May 15, 2026) — 13 banner tags integrated & working; interstitial disabled

### 🔑 COMPLETE TAG → SLOT MAPPING (source: ~/Downloads/prepp tags (1).txt)

Tag base URL: `//banner.incrementxserv.com/<path>?vzId=<ID>&vzR=`
- `scripts/pageads.js` — most banner slots
- `ixads/pageads.js` — the DISPLAY_970x250_1..5 set
- `scripts/overlayads.js` — interstitial (DISABLED — see below)

| Slot ID | Page | Size | Vertoz Tag ID | Path | Status |
|---|---|---|---|---|---|
| `adTop` | home | 728x90 | `IXB835851V0E320B` | scripts/pageads.js | ✅ live |
| `adInGrid` | home | 728x90 | `IXK716502V4595E6` | scripts/pageads.js | ✅ live (JS-injected) |
| `adMid` | home | 970x250 | `IXR543272V95G4B8` | ixads/pageads.js | ✅ live |
| `adFooter` | home | 970x250 | `IXF179982VD0DB55` | ixads/pageads.js | ✅ live |
| `adSticky` | home | 728x90 | `IXQ850276V0D358B` | scripts/pageads.js | ✅ live |
| `adSidebarLeft` | game | 300x600 | `IXE895614V7D1HGH` | scripts/pageads.js | ✅ live |
| `adSidebarRight` | game | 300x600 | `IXA977414V5F5H19` | scripts/pageads.js | ✅ live |
| `adPreGame` | game | 970x90 | `IXB586694VB63633` | scripts/pageads.js | ✅ live |
| `adMid` | game | 970x250 | `IXE770740V83434E` | ixads/pageads.js | ✅ live |
| `adBottom` | game | 970x250 | `IXM198322V38GD2D` | ixads/pageads.js | ✅ live |
| `adNativeFeed` | game | 970x250 | `IXP396675VEC5B59` | ixads/pageads.js | ✅ live |
| `adSticky` | game | 728x90 | `IXJ265919V051CDC` | scripts/pageads.js | ✅ live |
| `adInterstitial` | home | 320x480 | `IXE150328V0593CG` | scripts/overlayads.js | ✅ live (body-end, non-blocking) |
| _(spare)_ | — | 970x250 | `IXY973988VE9E5GC` | scripts/pageads.js | unused backup |

### Integration Pattern (validated in browser May 15)

- Placeholder `.ad-inner` content replaced with `<script src=Vertoz tag>`
- Class: `ad-vertoz` (red placeholder) → `ad-live` (transparent, collapses
  when empty). Size class (`.ad-728x90` etc.) kept for CLS guard.
- `#adInGrid` is JS-injected by `script.js` → `injectInGridAd()` via
  `createElement` (scripts in `innerHTML` do NOT execute).
- Verified: all slots fire correct token+size requests, HTTP 200,
  `bt=programmatic` postbacks, zero console errors. `empty.gif`/no-fill
  is normal for a new account (ramps 24-72h).

### ✅ INTERSTITIAL RESOLVED (overlayads.js — body-end placement)

Earlier `overlayads.js` (IXE150328V0593CG) made the **homepage
unresponsive** because it was placed MID-BODY (synchronous external
script blocked HTML parsing). Per Ayushmann ("body par lagana hai"),
moved it to the **LAST element in `<body>`** — after
`<script src="js/script.js">`, right before `</body>`. Now non-blocking;
browser-verified homepage loads perfectly (commit 7f5a994). Custom modal
+ countdown + card-click interception removed; overlayads.js self-manages
its own overlay/timing/close. Overlay not visually shown yet (no-fill /
Vertoz trigger logic) — confirm display with Ayushmann once fill active.

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
- **Person:** Ayushmann Rai (Vertoz / IncrementX)
- **May 11:** Approved; sent 14 tags (`~/Downloads/prepp tags.txt` + `prepp tags (1).txt`)
- **May 15:** ALL 14 tags integrated & browser-verified on fun5games.us
  (13 banner + interstitial). Interstitial hang FIXED by moving
  overlayads.js to end of <body> per Ayushmann ("body par lagana hai").
- **OPEN with Ayushmann (1 item):**
  1. **Ad fill timeline** — all slots fire correctly (HTTP 200,
     programmatic) but return `empty.gif` (no-fill), incl. interstitial.
     When will demand/campaigns go live so ads actually render?
     (Expected normal ramp 24-72h for new account.) Also confirm the
     interstitial overlay displays correctly once fill is active.
- **Final step (after fill confirmed):** tell Prepp tech (Kunal) to
  redeploy prepp.in/games — do NOT redeploy piecemeal.

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
c872a8b Disable Vertoz interstitial (overlayads.js) — makes homepage unresponsive
936aacc Integrate all 13 Vertoz ad tags (pattern validated via adTop test)
4b8bf23 TEST: integrate first Vertoz tag in #adTop (728x90) to validate pattern
8ccba1f Update CONTEXT.md: May 12 — Vertoz approved, 13 placements, 17 GA4 events
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
