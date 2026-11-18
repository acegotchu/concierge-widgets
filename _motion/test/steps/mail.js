/* Mail: entry, earlier-message disclose, collapse their message, choice, Edit subject (menu), schedule dialog, Send (snackbar + next
 draft), draft nav ‹ ›, schedule a send, and Outbox (the sendPrompt payload). Every step but entry and outbox has `again` (reverse). */
const esc=async p=>{if(await p.$('.sv'))await p.keyboard.press('Escape')};
module.exports=[
 {name:'entry',run:p=>p.reload(),frames:10},
 {name:'history',run:p=>p.click('.hr[data-h="0"]'),again:p=>p.click('.hr[data-h="0"]')},
 {name:'collapse',run:p=>p.click('.mh'),again:p=>p.click('.mh')},
 {name:'choice',run:p=>p.selectOption('select[data-k="choice"]','b'),again:p=>p.selectOption('select[data-k="choice"]','a')},
 {name:'subject',setup:p=>p.click('[data-m="rp"]'),run:p=>p.click('.mu [data-i="sub"]'),again:async p=>{await p.click('[data-m="rp"]');await p.waitForTimeout(300);await p.click('.mu [data-i="sub"]')}},
 {name:'menu',run:p=>p.click('[data-m="sd"]'),again:p=>p.click('.sj h2')},
 {name:'dialog',setup:async p=>{if(!await p.$('.mu'))await p.click('[data-m="sd"]')},run:p=>p.click('.mu [data-i="sch"]'),again:p=>p.keyboard.press('Escape')},
 {name:'send',setup:esc,run:p=>p.click('.cm [data-a="ok"]'),again:p=>p.click('.snk .ua:not(.vm)')},
 {name:'nav',setup:async p=>{await esc(p);if(await p.$('.snk'))await p.click('.snk .ib')},run:p=>p.click('[data-n="1"]'),again:p=>p.click('[data-n="-1"]')},
 {name:'schedule',setup:async p=>{await p.click('.cm [data-m="sd"]');await p.waitForTimeout(300);await p.click('.mu [data-i="sch"]');await p.waitForTimeout(400)},run:p=>p.click('.sv [data-t]'),again:p=>p.click('.snk .ua:not(.vm)')},
 {name:'outbox',setup:async p=>{if(!await p.$('#ob:not([disabled])')){await p.click('.cm [data-a="ok"]');await p.waitForTimeout(600)}},run:p=>p.click('#ob'),frames:8},
];
