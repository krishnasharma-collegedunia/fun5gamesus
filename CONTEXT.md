# 🎮 Prepp Games — Project Context

**Last Updated:** May 2, 2026
**Status:** Production-ready · Vertoz approval pending (24-48h)

---

## ⏰ WHERE WE LEFT OFF (May 2, 2026)

```
✅ DONE
├── 32 games built & live on fun5games.us
├── Brand rebranded: Fun5Games → Prepp Games
├── Hosting target: prepp.in/games (Prepp tech team handles this)
├── ads.txt deployed with 17 Vertoz authorized seller lines
├── Google Analytics 4 active (G-D16NB8WW33)
├── 9 ad slots ready (waiting for Vertoz tags)
├── robots.txt + sitemap.xml live
├── 4 legal pages (about/contact/terms/privacy) all on Prepp branding
├── Close (✕) button on iframe gameplay
├── play202-style game flow (PLAY → iframe loads in place)
├── Real Apple App Store icons in "Download Top Mobile Games" section

⏳ PENDING (waiting on others)
├── Vertoz approval (24-48h after May 2 — should clear by May 4)
├── Vertoz will email/Slack actual ad tag JS snippets
├── Prepp tech team needs to redeploy prepp.in/games occasionally
│   (when we push updates to GitHub)
└── Prepp tech team handles prepp.in/ads.txt at root (already done)

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

### Status: Approval pending (24-48h from May 2, 2026)

### 9 Ad Slots Ready

**Homepage (4):**
- `#adTop` — Header banner (320x50 / 728x90)
- `#adMid` — In-content native (300x250 / 336x280)
- `#adFooter` — Footer native
- `#adSticky` — Sticky bottom banner (with ✕ close button)

**Game page (5):**
- `#adPreGame` — Above game preview
- `#adMid` — Between How-to-Play and Download section
- `#adBottom` — Below Download section
- `#adNativeFeed` — Taboola Discovery Feed
- `#adSticky` — Sticky bottom

Each slot has `data-ad-slot="..."` and `data-ad-size="..."` for tag targeting.

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
- **Status as of May 2:** Asked for approval after ads.txt + games deployed
- **Next step:** Vertoz sends actual ad tag JS snippets → integrate into ad slots

---

## 📈 Analytics

### Google Analytics 4
- **Measurement ID:** `G-D16NB8WW33`
- **File:** `js/analytics.js` (loaded on all 6 HTML pages)
- **Privacy:** `anonymize_ip: true`, `SameSite=None;Secure`

### Custom Events Tracked
- `page_view` (auto)
- `game_select` — Game card click on homepage
- `game_play` — PLAY GAME button click on game page
- `game_close` — Close X button click
- `category_filter` — Category pill click
- `download_click` — Click to fun5games.com
- `ad_dismiss` — Sticky ad close

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

## 🔮 Future Tasks (when Vertoz approves)

1. **Receive Vertoz ad tags** (will be JS snippets)
2. **Plug into 9 ad slots** by ID
3. **Test ad fill rate** in incognito + mobile + desktop
4. **Monitor GA4 + Vertoz dashboard** for CPM/RPM
5. **Optional:** Add `game_complete` event when games actually finish (not just play)
6. **Optional:** A/B test ad placements
7. **Optional:** Add more games based on engagement data

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
c09a39d ads.txt: Add 17 Vertoz authorized seller lines
a66ee6b Add ads.txt template
daba5d7 Rebrand: Fun5Games -> Prepp Games (hosting at prepp.in/games)
4a1ce6b Complete Vertoz/Taboola ad slot infrastructure (9 slots ready)
3a9a145 Add close (X) button on game iframe
b941486 Activate GA4 Measurement ID G-D16NB8WW33
aa5e255 Add Google Analytics 4 with custom event tracking
2a07d5f Add robots.txt and sitemap.xml (37 URLs)
c35a77f Fix thumbnail clipping site-wide
9e88b37 Fix Basketball Slam: ovbg z-index hiding content
2e36827 Fix iOS iframe rendering: position:fixed -> absolute (8 games)
614cd2e Real Apple App Store icons + Skibidi Toilet game
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
