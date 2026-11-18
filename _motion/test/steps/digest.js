/* Digest: expand an FYI row, switch the open decision (accordion), pick an option, approve (tick + toast), approve all, send. */
module.exports=[
 {name:'expand',run:p=>p.click('.dc[data-id="f1"] [data-tg]'),again:p=>p.click('.dc[data-id="f1"] [data-tg]')},
 {name:'accordion',run:p=>p.click('.dc[data-id="d2"] [data-tg]'),again:p=>p.click('.dc[data-id="d1"] [data-tg]')},
 {name:'select',setup:async p=>{if(!await p.$('.dc[data-id="d1"].open'))await p.click('.dc[data-id="d1"] [data-tg]');await p.waitForTimeout(600)},run:p=>p.click('.dc[data-id="d1"] [data-o="1"]'),again:p=>p.click('.dc[data-id="d1"] [data-o="0"]')},
 {name:'approve',setup:async p=>{if(!await p.$('.dc[data-id="d1"].open'))await p.click('.dc[data-id="d1"] [data-tg]');await p.waitForTimeout(600)},run:p=>p.click('.dc[data-id="d1"] [data-a="ok"]'),again:p=>p.click('.dc[data-id="d1"] [data-tg]')},
 {name:'allpicks',setup:async p=>{await p.waitForTimeout(600);if(await p.$('.dc[data-id="f1"]:not(.open)'))await p.click('.dc[data-id="f1"] [data-tg]');await p.waitForTimeout(500);await p.click('.dc[data-id="f1"] [data-o="0"]');await p.waitForTimeout(500)},run:p=>p.click('#aa')},
 {name:'send',run:p=>p.click('#go'),frames:2},
];
