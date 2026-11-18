/* Open: expand a row, tick, select an option, switch tab. */
module.exports=[
 {name:'expand',run:p=>p.click('.rw[data-id="m1"] [data-op]'),again:p=>p.click('.rw[data-id="m1"] [data-op]')},
 {name:'tick',run:p=>p.click('.rw[data-id="m2"] [data-ck]'),again:p=>p.click('.rw[data-id="m2"] [data-ck]')},
 {name:'select',setup:async p=>{if(!await p.$('.rw[data-id="m1"].open'))await p.click('.rw[data-id="m1"] [data-op]');await p.waitForTimeout(600)},run:p=>p.click('.rw[data-id="m1"] [data-a="Friday"]')},
 {name:'tab',run:p=>p.click('[data-f="lanes"]'),again:p=>p.click('[data-f="me"]')},
];
