/* Week: segmented tap (and a second tap mid-flight), tile tap, a mouse-drag swipe with release velocity, an edge rubber band. */
const swipe=async(p,dx,ms=160)=>{const b=await p.locator('.vp').boundingBox(),x=b.x+b.width/2,y=b.y+120,n=8;await p.mouse.move(x,y);await p.mouse.down();
 for(let i=1;i<=n;i++){await p.mouse.move(x+dx*i/n,y+(i%2));await p.waitForTimeout(ms/n)}await p.mouse.up()};
module.exports=[
 {name:'segment',run:p=>p.click('[data-p="2"]'),again:p=>p.click('[data-p="0"]')},
 {name:'interrupt',run:async p=>{await p.click('[data-p="4"]');await p.waitForTimeout(80);await p.click('[data-p="1"]')}},
 {name:'swipe',setup:async p=>{await p.click('[data-p="1"]');await p.waitForTimeout(700)},run:p=>swipe(p,-140),again:p=>swipe(p,160)},
 {name:'edge',setup:async p=>{await p.click('[data-p="0"]');await p.waitForTimeout(700)},run:p=>swipe(p,120,240)},
 {name:'tile',run:p=>p.click('[data-go="1"]'),again:p=>p.click('[data-p="0"]')},
];
