# v13 motion pass: before/after recordings

Not for shipping: this branch only holds the test recordings for `motion-v13` (templates live there). Synthetic sample data, no personal data.

Per card (digest, open, mail, deals, week, stays, usage, manager):
- `<card>-strips.jpg`: frame strips. Each row is one interaction (expand, tick, select, tab/page, toast, send…) recorded with animations
  slowed 10x, one frame about every 25ms of animation time (red labels). Rows: before, after, "(again, then reversed mid-flight)" rows
  that tap a second time mid-animation, and reduced-motion rows (0/60/140/400ms).
- `<card>-before.webm`, `<card>-after.webm`, `<card>-after-ace.webm`: the same steps in real time (original v12, v13, v13 with the ace theme).

Rig: `_motion/test/record.js` + `steps/<card>.js` on motion-v13. Every run: 0 console/page errors; sendPrompt payloads byte-identical
before vs after vs ace; no animations left running under reduced motion.
