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
| `open.js` | Concierge · Open (everything still unresolved) |
| `week.js` | Concierge · Week (Sunday scoreboard) |
| `usage.js` | Concierge · Usage (plan meters, lane model fit, top 3 savings) |
| `manager.js` | Concierge · Manager scorecard (one grade, six checks, next best moves) |

Usage:

```html
<div id="app"></div>
<script>window.D = { /* data */ };</script>
<script src="https://cdn.jsdelivr.net/gh/acegotchu/concierge-widgets@v7/mail.js"></script>
```

Order matters: `#app` first, then `window.D`, then the template script.

## Versions

- v7: two new widgets, Usage (4 meters with reset times, lane table with model fit, 3 one-tap savings) and Manager scorecard (grade, follow-through, asks, speed, accuracy, pipeline, Instinct sync, next best moves).
- v6: Ask Concierge bar is Liquid Glass in every widget (Mail gets a soft tinted backdrop); Week becomes 5 swipeable pages (Overview, TikTok, LinkedIn, IG @startupgotchu, IG personal).
- v5: new Week widget (Sunday scoreboard).
- v4: Mail always shows the full email and earlier messages; thread and reply scroll inside the card (about 700px).
- v3: new Open widget (everything still unresolved).
- v2: Mail gets Gmail Schedule send and roomier reply spacing; every widget gets the Ask Concierge bar and one shared sizing scale (cards about 560px tall, long content scrolls inside).
- v1: first release.
