/* Manager: expand a section (and collapse it again), open a second one, tap a move. */
module.exports=[
 {name:'expand',run:p=>p.click('.it[data-i="0"] .rw'),again:p=>p.click('.it[data-i="0"] .rw')},
 {name:'reverse',setup:async p=>{if(await p.$('.it[data-i="1"].open'))await p.click('.it[data-i="1"] .rw');await p.waitForTimeout(600)},run:async p=>{await p.click('.it[data-i="1"] .rw');await p.waitForTimeout(120);await p.click('.it[data-i="1"] .rw')}},
 {name:'move',run:p=>p.click('.mv button[data-i="0"]'),again:p=>p.click('.mv button[data-i="1"]')},
];
