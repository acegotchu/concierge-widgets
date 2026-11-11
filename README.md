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
<script src="https://cdn.jsdelivr.net/gh/acegotchu/concierge-widgets@v11/mail.js"></script>
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

## Versions

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
