/* Deals: expand a skinned deal, switch the open deal (accordion), queue an action (pill + toast + footer), stage filter, send. */
module.exports=[
 {name:'expand',run:p=>p.click('.dc[data-id="a1"] [data-tg]'),again:p=>p.click('.dc[data-id="a1"] [data-tg]')},
 {name:'accordion',setup:async p=>{if(!await p.$('.dc[data-id="a1"].open'))await p.click('.dc[data-id="a1"] [data-tg]');await p.waitForTimeout(600)},run:p=>p.click('.dc[data-id="a2"] [data-tg]'),again:p=>p.click('.dc[data-id="a1"] [data-tg]')},
 {name:'select',setup:async p=>{if(!await p.$('.dc[data-id="a1"].open'))await p.click('.dc[data-id="a1"] [data-tg]');await p.waitForTimeout(600)},run:p=>p.click('.dc[data-id="a1"] [data-a="Send draft"]'),again:p=>p.click('.dc[data-id="a1"] [data-a="Accept $1,800"]')},
 {name:'filter',run:p=>p.click('.rail [data-f="negotiating"]'),again:p=>p.click('.rail [data-f="inbound"]')},
 {name:'unfilter',setup:async p=>{if(!await p.$('.rail .nd.on'))await p.click('.rail [data-f="inbound"]');await p.waitForTimeout(600)},run:p=>p.click('.rail .nd.on'),again:p=>p.click('.rail [data-f="paused"]')},
 {name:'send',setup:async p=>{if(await p.$('.rail .nd.on'))await p.click('.rail .nd.on');await p.waitForTimeout(600);if(!await p.$('.dc[data-id="a3"].open'))await p.click('.dc[data-id="a3"] [data-tg]');await p.waitForTimeout(600);await p.click('.dc[data-id="a3"] [data-a="Wait"]');await p.waitForTimeout(400)},run:p=>p.click('#go'),frames:2},
];
