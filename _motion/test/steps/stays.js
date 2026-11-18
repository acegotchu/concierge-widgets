/* Stays: entry, details drawer (open / close), next stay with the drawer open (panel slides), bookmark, choose, type filter,
 city switch, and the two sendPrompt buttons (bookmarked + send to concierge). `again` reverses each step. */
const openDet=async p=>{if(!await p.$('.det.open')){await p.click('.row .cd >> nth=1');await p.waitForTimeout(600)}};
module.exports=[
 {name:'entry',run:p=>p.reload(),frames:10},
 {name:'expand',run:p=>p.click('.row .cd >> nth=1'),again:p=>p.click('.det .x')},
 {name:'next',setup:openDet,run:p=>p.click('[data-a="1"]'),again:p=>p.click('[data-a="-1"]')},
 {name:'bookmark',run:p=>p.click('.hr[data-h="a3"]'),again:p=>p.click('.hr[data-h="a3"]')},
 {name:'choose',setup:openDet,run:p=>p.click('.det [data-ch]'),again:p=>p.click('.det [data-ch]')},
 {name:'filter',run:p=>p.selectOption('#fk','hotel'),again:p=>p.selectOption('#fk','all')},
 {name:'city',run:p=>p.click('#cs [data-c="cph"]'),again:p=>p.click('#cs [data-c="ams"]')},
 {name:'send',setup:async p=>{if(await p.$('#go[disabled]')){await openDet(p);await p.click('.det [data-ch]');await p.waitForTimeout(400)}},run:async p=>{await p.click('#ob');await p.click('#go')},frames:6},
];
