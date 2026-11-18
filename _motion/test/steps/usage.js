/* Usage: tap a savings tip (confirmation state), then another. */
module.exports=[
 {name:'tip',run:p=>p.click('.tp button[data-i="0"]'),again:p=>p.click('.tp button[data-i="1"]')},
 {name:'tip2',run:p=>p.click('.tp button[data-i="2"]')},
];
