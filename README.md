# Concierge widgets

Self-contained chat widget templates. Each file reads `window.D` and renders into `<div id="app">`.
The data schema is documented in the comment at the top of each file. No data ships in this repo.

| File | Widget |
|---|---|
| `stays.js` | Concierge · Stay |
| `fly.js` | Concierge · Fly |
| `mail.js` | Concierge · Mail |
| `digest.js` | Concierge · Today |
| `deals.js` | Concierge · Deals |
| `open.js` | Concierge · Open (everything still unresolved; On me is your own to-do list, grouped, tick and send) |
| `week.js` | Concierge · Week (Sunday scoreboard) |
| `usage.js` | Concierge · Usage (plan meters, lane model fit, top 3 savings) |
| `manager.js` | Concierge · Manager scorecard (one grade, six checks, next best moves) |

Usage:

```html
<div id="app"></div>
<script>window.D = { /* data */ };</script>
<script src="https://cdn.jsdelivr.net/gh/acegotchu/concierge-widgets@v13/mail.js"></script>
```

Order matters: `#app` first, then `window.D`, then the template script.

## Themes

Every template ships two looks. The default is the Concierge look (Liquid Glass), and it needs nothing.
The ace theme is the acegotchu.com look: bone and ink, one ember accent, Inter Tight, sharp corners, flat with grain, the signature mark.

Switch per card, either way:

```html
<script>window.D = { theme: "ace", /* data */ };</script>
<!-- or -->
<div id="app" data-theme="ace"></div>
```

Anything else, or nothing, gives the default. Behavior, data and every sendPrompt payload are identical in both themes.
The ace theme loads `ace-logo.png` (light grounds) and `ace-logo-light.png` (dark grounds) from next to the template script, or
`D.logo` / `D.logoLight` if you pass them. The default theme never loads either file. Inter Tight comes from Google Fonts in the ace theme only.

## Motion system

Every template (Fly excepted) carries the same motion layer, the `/*MOTION:BEGIN*/` block, synced from `_motion/motion.js` by `_motion/sync.py`.
Research and sources: `_motion/RESEARCH.md`. Motion is presentation only: data, behavior and sendPrompt payloads don't change.

Three springs, described like SwiftUI (response, damping fraction) and sampled into CSS `linear()` easings:

| Spring | Response, damping | Settles | Used for |
|---|---|---|---|
| snappy | 0.25s, 0.86 | 250ms | press, toggle, option select, segmented thumbs |
| smooth | 0.30s, 1.0 | 360ms | expand/collapse, FLIP moves, tab and page content, number rolls, entry |
| bouncy | 0.32s, 0.68 | 355ms (5% overshoot) | tick pop, toast in |

CSS reads them as `var(--mx-snappy)`, `var(--mx-smooth)`, `var(--mx-bouncy)` (each is "duration easing", set on `#app`). JS helpers, all on `MX`:
`disclose` (expand/collapse with matched geometry: the layout changes once, everything below FLIPs, the row reveals with clip-path, collapse commits when the spring lands),
`flip` (move from old to new position across re-renders), `swap` (tab/page content slides in the direction of travel, the old content leaves as a ghost),
`text` (numbers roll digit by digit, up or down), `pop` (spring scale for ticks and selections), `toast`/`out` (snackbars in and out), `enter` (card and rows rise in once, staggered).

Rules: only transform, opacity and clip-path animate; every animation starts from where things are on screen, and expand/collapse keeps its velocity when reversed mid-flight;
entry plays once per card, not on re-renders; direct feedback lands within about 350ms. With prefers-reduced-motion there is no travel, scale or overshoot: changes crossfade in 150ms.
The ace theme keeps its own CSS transitions; the JS motion above applies in both themes.

## Versions

- v13: motion pass. One spring-based motion system in every template except Fly: cards and rows rise in once, expand/collapse with matched geometry (no jumps), ticks and selections pop on a small spring, counters and numbers roll, tabs and pages slide in the direction of travel, toasts spring in; everything interruptible and transform/opacity only; reduced motion gets crossfades. Data, behavior, sendPrompt payloads and both themes are unchanged. See Motion system above.
- v12: Deals takes an optional per-deal brand skin, `deal.skin` = {bg, fg, accent, accentInk?, muted?, line?, font?, logo?, logoH?, mark?, upper?}. That deal renders as its own branded card (colors, type, a wordmark in place of the name, a mark in the avatar, an accent edge) inside either theme. Logo and mark are data URLs. The skin is visual only: the stage rail, actions and sendPrompt payloads are unchanged.
- v11: every widget shows when its data was last synced, under the header, in both themes: "Synced 10:40 AM ET" from `D.synced` = {at, tz, tzLabel, staleHours, sources: [{label, at}]}. Older than `staleHours` (default 2) it adds "· 3h ago"; any source with no `at` adds "· <labels> not checked", in a warning colour. No `D.synced`, no stamp. Behavior and sendPrompt payloads are unchanged.
- v10: the ace theme for every template (Today, Open, Mail, Deals, Week, Stay, Fly, Usage, Manager), switched with `D.theme = "ace"` or `data-theme="ace"`; the default look is unchanged. Also: Deals stage rail uses the ledger's stage words (inbound, asked rate, quoted, negotiating, agreed, payment received; paused apart) with equal columns and a two-row layout under 560px; Fly map pans and zooms (+, -, reset; tap the map to drag, pinch or scroll; Done hands scrolling back); Stay and Fly show the local time of day in the ace theme; Usage shows extra usage as "Off" when it isn't enabled and "Model not set" for lanes without a model; Week's hero count-up can no longer show a negative or overshooting number.
- v9: the signature marks (ace-logo.png, ace-logo-light.png) for the ace theme header.
- v8: Open's On me tab is the grouped to-do list (D.me); the ace skin, opt in only.
- v7: two new widgets, Usage (4 meters with reset times, lane table with model fit, 3 one-tap savings) and Manager scorecard (grade, follow-through, asks, speed, accuracy, pipeline, Instinct sync, next best moves).
- v6: Ask Concierge bar is Liquid Glass in every widget (Mail gets a soft tinted backdrop); Week becomes 5 swipeable pages (Overview, TikTok, LinkedIn, IG @startupgotchu, IG personal).
- v5: new Week widget (Sunday scoreboard).
- v4: Mail always shows the full email and earlier messages; thread and reply scroll inside the card (about 700px).
- v3: new Open widget (everything still unresolved).
- v2: Mail gets Gmail Schedule send and roomier reply spacing; every widget gets the Ask Concierge bar and one shared sizing scale (cards about 560px tall, long content scrolls inside).
- v1: first release.
