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

Usage:

```html
<div id="app"></div>
<script>window.D = { /* data */ };</script>
<script src="https://cdn.jsdelivr.net/gh/acegotchu/concierge-widgets@v1/mail.js"></script>
```
