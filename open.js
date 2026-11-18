/* Concierge · Open: everything still unresolved, callable from any session. Built by build_open_data.py from open.json + lanes/*.needs.json.
 "On me" is His Grace's to-do list (it absorbed the Checklist widget): D.me groups from todo_groups.py, each row
 {id,title,sub,chip,urgent,due,detail,action,area,source}; a count and ring in the header track what he has ticked.
 window.D={today:"YYYY-MM-DD",date:"Mon Nov 9",me:[{title,items:[..]}],items:[{id,who:"Ace"|"Manager"|<lane>,area,title,detail|null,due:"YYYY-MM-DD"|null,money:bool,
   status:"open"|"waiting",action:"A / B"|null,source}]}   (done items are left out by the builder; order is the builder's)
 Header counts, segmented filter (On me / Lanes / All, default On me), rows grouped Today / This week / Later.
 Check circle = done locally (strike-through, Undo). Tap a row to open it: detail + action pills (action split on " / ").
 Footer "Send N updates" sends ONE sendPrompt. Ask Concierge bar at the bottom. List scrolls inside the card (about 560px). */
(function(){const D=window.D,A=document.getElementById('app')||(()=>{const s=document.currentScript,r=s&&s.getRootNode?s.getRootNode():null;let a=r&&r.querySelector?r.querySelector('#app'):null;if(!a&&s&&s.parentNode){a=document.createElement('div');a.id='app';s.parentNode.insertBefore(a,s)}return a})();if(!A||!D){if(A)A.textContent='Concierge widget: window.D is missing.';return}
/*SKIN:BEGIN*/
/* Theme layer (shared; synced into every template by _skin/sync.py). The default is the Concierge look and needs nothing.
 window.D.theme="ace" (or data-theme="ace" on #app) adds the ace skin: the acegotchu.com direction F look (bone and ink, one ember
 accent, Inter Tight, sharp corners, flat with grain). The skin is one <style> placed right after #app, scoped to [data-skin=ace],
 so it survives re-renders and every behavior stays the template's own. The signature loads from D.logo (D.logoLight for dark grounds), else ace-logo.png
 and ace-logo-light.png next to the template script; with neither, headers fall back to the title alone. A new theme = a new CSS file per template. */
const SKIN=String(D.theme||A.getAttribute('data-theme')||'').toLowerCase(),SKIN_SRC=(()=>{try{const s=document.currentScript;return s&&s.src?s.src.replace(/[^\/?#]*([?#].*)?$/,''):''}catch(e){return ''}})();
function skin(root,css){if(SKIN!=='ace')return;A.setAttribute('data-skin','ace');
const doc=A.ownerDocument;if(!doc.querySelector('link[data-ace-font]')){const l=doc.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap';l.setAttribute('data-ace-font','');doc.head.appendChild(l)}
const logo=D.logo||(SKIN_SRC?SKIN_SRC+'ace-logo.png':''),logoL=D.logoLight||(SKIN_SRC?SKIN_SRC+'ace-logo-light.png':logo),P='[data-skin=ace] '+root,G="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const base=`& {--a-bone:#F2EEE6;--a-ground:#FFFFFF;--a-stone:#E2DED7;--a-ink:#111111;--a-label:#6F6B65;--a-ember:#9C4A2B;--a-emberT:#9C4A2B;--a-emberS:rgba(156,74,43,.10);--a-on:#FFFFFF;--a-q:200ms;--a-b:320ms;--a-out:cubic-bezier(.2,0,0,1);--a-logoD:${logo?`url("${logo}")`:'none'};--a-logoL:${logoL?`url("${logoL}")`:'none'};--a-logo:var(--a-logoD);--a-grain:${G};
font-family:"Inter Tight",Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;letter-spacing:-.01em;color:var(--a-ink)!important;background:var(--a-grain),var(--a-bone)!important;border-radius:0!important;box-shadow:none!important;-webkit-font-smoothing:antialiased}
@media (prefers-color-scheme:dark){& {--a-bone:#111111;--a-ground:#1A1917;--a-stone:#2D2B28;--a-ink:#F2EEE6;--a-label:#9F998F;--a-emberT:#DB8D6B;--a-emberS:rgba(219,141,107,.14);--a-logo:var(--a-logoL)}}
& ::before,& ::after{text-shadow:none}& >::before,& >::after,&::before,&::after{display:none!important}
&& *,&&{border-radius:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;text-shadow:none!important;font-family:inherit}
& .ace-n{font-weight:600!important;letter-spacing:-.05em!important;font-variant-numeric:tabular-nums}
& .askc{--aT:var(--a-ink);--aP:var(--a-label);--aA:var(--a-ember);height:48px;background:var(--a-ground)!important;box-shadow:inset 0 0 0 1px var(--a-stone)!important;font-family:inherit}
& .askc:focus-within{box-shadow:inset 0 0 0 1px var(--a-ink)!important}& .askc input{font-size:15px;letter-spacing:-.01em;height:48px;font-family:inherit}& .askc.askc .go{height:48px!important;background:none!important}
& .askc .go i{width:30px;height:30px;background:var(--a-ember)!important;box-shadow:none!important}& .askc.tint::before{display:none!important}
@media (prefers-reduced-motion:reduce){& *{transition-duration:0s!important;animation-duration:0s!important;animation-delay:0s!important}}
`;let st=A.nextElementSibling;if(!st||!st.hasAttribute||!st.hasAttribute('data-ace-skin')){st=doc.createElement('style');st.setAttribute('data-ace-skin',root);A.after(st)}
const H='[data-skin=ace]'.repeat(4)+' '+root;st.textContent=(base+css).replace(/&&/g,H).replace(/&/g,P)}
/* Synced stamp (both themes): "Synced 10:40 AM ET" under the header, from D.synced = {at: ISO, tz, tzLabel, staleHours,
 sources: [{label, at|null}]}. Older than staleHours, or any source unchecked, it says so: "Synced 9:02 AM ET · Work and
 School not checked" (labels come from the data). Purely a label: no behavior and no sendPrompt change. Re-attached after every re-render. */
function stampSync(anchor,mode){const S=D.synced;if(!S||!S.at)return;const doc=A.ownerDocument;
if(!doc.getElementById('cz-sync-css')){const c=doc.createElement('style');c.id='cz-sync-css';c.textContent='.cz-sync{display:block;font-size:11px;line-height:14px;font-weight:500;letter-spacing:0;color:inherit;opacity:.58;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:-4px 0 0;font-variant-numeric:tabular-nums}.cz-sync.in{margin:2px 0 0}.cz-sync.warn{opacity:1;color:#c2410c}@media (prefers-color-scheme:dark){.cz-sync.warn{color:#ff9f6b}}[data-skin=ace] .cz-sync{letter-spacing:.02em;opacity:1;color:var(--a-label)}[data-skin=ace] .cz-sync.warn{color:var(--a-emberT)}[data-skin=ace] .fy .hero .cz-sync{color:rgba(242,238,230,.7)}[data-skin=ace] .fy .hero .cz-sync.warn{color:#E7A98C}';(A.getRootNode&&A.getRootNode().head?A.getRootNode().head:doc.head||A.parentNode).appendChild(c)}
const tz=S.tz||'America/New_York',tl=S.tzLabel||'ET',d=new Date(S.at);if(isNaN(d))return;let t;try{t=new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(d)}catch(_){t=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}
const miss=(S.sources||[]).filter(s=>!s.at).map(s=>s.label),old=(Date.now()-d.getTime())/36e5>(S.staleHours||2);
const and=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const txt='Synced '+t+' '+tl+(miss.length?' · '+and(miss)+' not checked':old?' · '+Math.floor((Date.now()-d.getTime())/36e5)+'h ago':'');
const put=()=>{const a=A.querySelector(anchor);if(!a)return;const inside=mode=='in',host=inside?a:a.parentNode;if(!host)return;
let el=host.querySelector(':scope>.cz-sync');if(el&&(inside?el.parentNode===a:el.previousElementSibling===a))return;if(el)el.remove();
el=doc.createElement('span');el.className='cz-sync'+(inside?' in':'')+(miss.length||old?' warn':'');el.textContent=txt;el.title=(S.sources||[]).map(s=>s.label+': '+(s.at?'checked':'not checked')).join(' · ');
inside?a.appendChild(el):a.after(el)};new MutationObserver(put).observe(A,{childList:true,subtree:true});put()}
skin('.op',`
& {--bg:var(--a-bone);--card:var(--a-ground);--fr:var(--a-ground);--rim:var(--a-stone);--l:var(--a-ink);--l2:var(--a-label);--l3:var(--a-label);--ln:var(--a-stone);--fe:var(--a-stone);--chip:transparent;--ph:var(--a-stone);--phb:var(--a-stone);--seg:transparent;--segOn:var(--a-ink);--bl:var(--a-emberT);--bls:var(--a-emberS);--ok:var(--a-ink);--oks:transparent;--or:var(--a-label);--ors:transparent;--wn:var(--a-label);--bad:var(--a-emberT);--bads:transparent;--red:var(--a-emberT);--reds:transparent;--sh:none}
& .hd{gap:12px;padding-bottom:10px;border-bottom:1px solid var(--a-ink);align-items:flex-end}
& .hd .ic{width:62px;height:36px;margin:-4px 0 -2px -3px;background:var(--a-logo) left center/contain no-repeat!important;box-shadow:none!important;color:transparent!important}& .hd .ic svg{display:none!important}
& .hd .ttl{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& button:focus-visible{box-shadow:none!important;outline:2px solid var(--a-ink)!important;outline-offset:2px}
& .ace-cap{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& .cts{font-size:13px;color:var(--a-label)}& .cts b{color:var(--a-ink);font-weight:600;font-size:15px;letter-spacing:-.03em}& .cts .r{color:var(--a-emberT)}
& .sg{height:44px;padding:0;background:none;box-shadow:inset 0 -1px 0 var(--a-stone)}& .sg .th{top:auto;bottom:0;left:0;height:2px;width:calc(100%/3);background:var(--a-ink);box-shadow:none;transition:transform var(--a-b) var(--a-out)}
& .sg button{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label);height:44px!important}& .sg button.on{color:var(--a-ink)}& .sg small{font-size:11px;font-weight:500;color:var(--a-label);letter-spacing:0}
& .ls{gap:0;margin:0;padding:0 0 14px}
& .gh{font-size:11px;font-weight:500;letter-spacing:.08em;color:var(--a-label);padding:14px 0 6px}
& .rw{background:var(--a-ground);box-shadow:inset 0 0 0 1px var(--a-stone);animation:aceRise var(--a-b) var(--a-out) both;transition:opacity var(--a-q),transform var(--a-b) var(--a-out)}& .rw+.rw{margin-top:-1px}@keyframes aceRise{from{transform:translateY(8px);opacity:0}}
& .rw.open{box-shadow:inset 0 0 0 1px var(--a-ink);position:relative;z-index:1}
& .rt{min-height:56px}
& .ck{color:var(--a-ink)}& .ck i{width:18px;height:18px;box-shadow:inset 0 0 0 1.5px var(--a-ink);transition:background-color var(--a-q) var(--a-out),box-shadow var(--a-q) var(--a-out)}& .ck svg{transition:opacity var(--a-q),transform var(--a-b) var(--a-out)}
& .rw.dn .ck{color:var(--a-ember)}& .rw.dn .ck i{background:var(--a-ember);box-shadow:none;color:var(--a-on)}
& .tx b{font-size:15px;font-weight:500;letter-spacing:-.015em;line-height:20px}& .tx span{font-size:13px;color:var(--a-label)}& .rw.dn .tx b{color:var(--a-label);text-decoration-color:var(--a-label)}
& .du{font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;background:none;box-shadow:inset 0 0 0 1px var(--a-stone);color:var(--a-label)}& .du.r{color:var(--a-emberT);box-shadow:inset 0 0 0 1px var(--a-emberT)}& .du.o{color:var(--a-ink);box-shadow:inset 0 0 0 1px var(--a-ink)}
& .ex{transition:grid-template-rows var(--a-b) var(--a-out)}& .xb p{font-size:15px;line-height:21px}& .meta{font-size:12px;color:var(--a-label)}
& .pl button{min-height:44px!important;font-size:14px;font-weight:500;color:var(--a-ink);background:none!important;box-shadow:inset 0 0 0 1px var(--a-ink)!important}& .pl button.on{background:var(--a-ember)!important;color:var(--a-on);box-shadow:none!important}
& .em{color:var(--a-label);font-size:15px}& .em b{font-size:22px;font-weight:600;letter-spacing:-.04em;color:var(--a-ink)}
& .ft{background:var(--a-ground);box-shadow:inset 0 0 0 1px var(--a-ink);padding:4px 4px 4px 14px}& .ft .c{font-size:13px;color:var(--a-label)}
& .go{height:46px!important;background:var(--a-ember)!important;color:var(--a-on);font-size:15px;font-weight:500;transition:transform var(--a-q) var(--a-out),filter var(--a-q)}& .go:active{transform:scale(.98);filter:brightness(.94)}
& .snk{background:var(--a-ink);color:var(--a-bone);box-shadow:none;animation:aceRise var(--a-b) var(--a-out)}& .snk button{color:var(--a-bone);text-decoration:underline;text-underline-offset:3px}
@media (max-width:440px){& .cts{padding-left:0}}
& .hd{display:grid;grid-template-columns:auto 1fr auto;grid-template-areas:"ic ttl ct" "cts cts ct";align-items:end;column-gap:12px;row-gap:6px}
& .hd .ic{grid-area:ic}& .hd .ttl{grid-area:ttl;align-self:end}& .cts{grid-area:cts;text-align:left;padding:0!important}
& .ct{grid-area:ct;align-items:flex-end;gap:10px;color:var(--a-label);margin:0}& .ct .k{display:flex;align-items:baseline;gap:3px}
& .ct .n{font-size:44px;line-height:38px;font-weight:600;letter-spacing:-.06em;color:var(--a-ink)}& .ct .of{font-size:15px;font-weight:500;letter-spacing:-.02em}& .ofw{display:none}& .ofs{display:inline}
& .rg{width:26px;height:26px;margin-bottom:5px}& .rg circle{stroke-width:3}& .rg .t{stroke:var(--a-stone)}& .rg .v{stroke:var(--a-ember);stroke-linecap:butt;transition:stroke-dashoffset var(--a-b) var(--a-out)}
& .gh span[data-gc]{letter-spacing:0;margin-left:auto}& .gh{display:flex}
& .ud{background:var(--a-ember);margin:0 6px}
@media (max-width:440px){& .cts{padding-left:0}}`);stampSync('.hd','after');
/*SKIN:END*/
/*MOTION:BEGIN*/
/* Motion layer (shared; synced into every template by _motion/sync.py, edit it there). Springs, not curves: every animation is a
 damped spring described like SwiftUI (response = seconds per oscillation, damping fraction), sampled into a CSS linear() easing
 for CSS and WAAPI, so it runs on the compositor (transform, opacity, clip-path only). Three presets:
   snappy (.25s, .86): direct feedback. Press, toggle, option select, segmented thumb. Settles in about 260ms.
   smooth (.30s, 1.0): layout. Expand and collapse, FLIP moves, tab content, number rolls, card and row entry. About 350ms.
   bouncy (.32s, .68): confirmation. Tick pop, toast in. Lands in about 250ms, a 4% overshoot settles by 400ms.
 Every move is interruptible: a new target starts from where the element is now, and expand/collapse also keeps its velocity.
 prefers-reduced-motion: no travel, no scale, no overshoot; changes crossfade in 150ms. CSS gets the curves as custom properties on
 #app: var(--mx-snappy), var(--mx-smooth), var(--mx-bouncy) are "<duration> <easing>" pairs, e.g. transition:transform var(--mx-smooth). */
const MX=(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)'),R=()=>RM.matches,now=()=>performance.now(),
LIN=(()=>{try{return CSS.supports('transition-timing-function','linear(0, 1)')}catch(e){return false}})(),
SPR={snappy:[.25,.86,'cubic-bezier(.25,.9,.3,1)'],smooth:[.3,1,'cubic-bezier(.2,.85,.25,1)'],bouncy:[.32,.68,'cubic-bezier(.3,1.35,.5,1)']},CV={};
/* x(t): displacement of a unit spring released at 1 with velocity v0 (units/s), heading to 0 */
function sx(resp,z,v0){const w=2*Math.PI/resp;if(z<1){const wd=w*Math.sqrt(1-z*z),B=(v0+z*w)/wd;return t=>Math.exp(-z*w*t)*(Math.cos(wd*t)+B*Math.sin(wd*t))}const B=v0+w;return t=>(1+B*t)*Math.exp(-w*t)}
/* curve(name,v) -> {e: easing, d: ms, u(t): progress 0..1 at t seconds, du(t): progress per second}; v is the starting progress velocity */
function curve(n,v=0){v=Math.max(-40,Math.min(40,Math.round(v*4)/4));const k=n+v;if(CV[k])return CV[k];const[r,z,fb]=SPR[n]||SPR.smooth,x=sx(r,z,-v);
let T=0;for(let t=0;t<1.2;t+=1/240)if(Math.abs(x(t))>.005)T=t;T=Math.max(.12,T+1/240);
const N=Math.max(12,Math.ceil(T*90)),pts=[];for(let i=0;i<=N;i++){const t=T*i/N;pts.push(i==N?1:+(1-x(t)).toFixed(4))}
const u=t=>t>=T?1:1-x(t),du=t=>t>=T?0:(x(Math.max(0,t-.002))-x(t+.002))/.004;return CV[k]={e:LIN?`linear(${pts.join(',')})`:fb,d:Math.round(T*1000),u,du}}
const card=()=>A.querySelector(':scope>:not(style):not(script):not(link)'),ease=n=>{const c=curve(n);return c.d+'ms '+c.e};
/* one global sheet: rolling-digit ghosts and the reduced-motion crossfade; lives in the document (or shadow root), so it survives re-renders */
(()=>{const r=A.getRootNode&&A.getRootNode(),h=r&&r.host?r:A.ownerDocument.head;if(!h||h.querySelector('style[data-mx]'))return;const s=A.ownerDocument.createElement('style');s.setAttribute('data-mx','');
s.textContent='.mx-d{display:inline-block;position:relative;white-space:pre}.mx-g{position:absolute;left:0;top:0;pointer-events:none}.mx-g::before{content:attr(data-c)}';h.appendChild(s)})();
const vars=()=>{for(const n in SPR)A.style.setProperty('--mx-'+n,R()?'1ms linear':ease(n))};vars();try{RM.addEventListener('change',vars)}catch(e){}
const anim=(el,kf,n,o={})=>{const c=typeof n=='object'?n:curve(n);return el.animate(kf,{duration:c.d,easing:c.e,fill:'both',...o})};
const fade=(el,a,b,ms=150)=>el&&el.animate([{opacity:a},{opacity:b}],{duration:ms,easing:'ease-out'});

/* disclose(row, open, set, {body, root}): expand or collapse one row with matched geometry. set(bool) is the template's own class
 toggle. The layout changes once; what follows the row (rows below, footer, the card's bottom edge) is FLIPped with additive
 translateY, the row reveals or hides its new height with clip-path, so no frame does layout. A collapse keeps the open layout
 until the spring lands, then commits. A second call mid-flight reverses from the current position and velocity. */
const ST=new WeakMap();
function after(el,root){const out=[];while(el&&el!==root&&el.parentElement){let s=el.nextElementSibling;while(s){const p=getComputedStyle(s).position;if(p!='absolute'&&p!='fixed')out.push(s);s=s.nextElementSibling}el=el.parentElement}return out}
function scrollers(el,root){const out=[];while(el&&el!==root){el=el.parentElement;if(el&&el.scrollHeight>el.clientHeight+1)out.push([el,el.scrollTop])}return out}
function disclose(row,open,set,o={}){const st=ST.get(row);if(st&&st.to==open)return;const root=o.root||card(),body=o.body?row.querySelector(o.body):null;
if(body)body.style.transition='none';
if(R()||!row.isConnected||!root){if(st)st.stop();set(open);if(open&&R())fade(body,0,1);return}
let p0=open?0:1,v=0;if(st){p0=st.p();v=st.v();st.stop()}
const F=after(row,root),E=[row,root,...F],sc=scrollers(row,root),rect=()=>E.map(e=>e.getBoundingClientRect()),keep=()=>sc.forEach(([e,t])=>e.scrollTop=t);
let a,b;if(st||!open){b=rect();set(false);a=rect();set(true);keep()}else{a=rect();set(true);b=rect();keep()}
const dh=b[0].height-a[0].height,dr=b[1].height-a[1].height,dy=F.map((e,i)=>b[i+2].top-a[i+2].top);
if(Math.abs(dh)<.5){if(!open)set(false);return}
const to=open?1:0,c=curve('smooth',(to-p0)?v/(to-p0):0),rr=e=>parseFloat(getComputedStyle(e).borderBottomLeftRadius)||0,R0=rr(row),R1=rr(root),
clip=(d,p,r,t)=>`inset(${t}px 0 ${Math.max(0,d*(1-p)).toFixed(1)}px 0 round ${r}px)`,ty=(d,p)=>`translateY(${(-d*(1-p)).toFixed(1)}px)`,
an=[anim(row,[{clipPath:clip(dh,p0,R0,-24)},{clipPath:clip(dh,to,R0,-24)}],c)];
if(Math.abs(dr)>.5)an.push(anim(root,[{clipPath:clip(dr,p0,R1,0)},{clipPath:clip(dr,to,R1,0)}],c));
F.forEach((e,i)=>{if(Math.abs(dy[i])>.5)an.push(anim(e,[{transform:ty(dy[i],p0)},{transform:ty(dy[i],to)}],c,{composite:'add'}))});
if(body)an.push(anim(body,[{opacity:p0,transform:`translateY(${(-6*(1-p0)).toFixed(1)}px)`},{opacity:to,transform:`translateY(${-6*(1-to)}px)`}],c,{composite:'replace'}));
const t0=now(),s={to:open,p:()=>p0+(to-p0)*c.u((now()-t0)/1000),v:()=>(to-p0)*c.du((now()-t0)/1000),stop(){an.forEach(x=>x.cancel());ST.delete(row)}};ST.set(row,s);
an[0].finished.then(()=>{if(ST.get(row)!==s)return;if(!open)set(false);s.stop()}).catch(()=>{})}

/* flip(sel, mutate, n): anything matching sel moves from where it was to where mutate() puts it (re-render safe: matched by
 data-mx key, else by selector order). Width changes scale on X from the left (segmented thumbs, rails). Returns the new elements. */
function flip(sel,mutate,n='smooth'){const key=(e,i)=>e.dataset.mx||(sel+'#'+i),q=()=>[...A.querySelectorAll(sel)],m=new Map();q().forEach((e,i)=>m.set(key(e,i),e.getBoundingClientRect()));mutate();const els=q();if(R())return els;
els.forEach((e,i)=>{const f=m.get(key(e,i));if(!f)return;const l=e.getBoundingClientRect(),dx=f.left-l.left,dy=f.top-l.top,sx=l.width?f.width/l.width:1;
if(Math.abs(dx)<.5&&Math.abs(dy)<.5&&Math.abs(sx-1)<.01)return;anim(e,[{transformOrigin:'0 0',transform:`translate(${dx}px,${dy}px) scaleX(${sx})`},{transformOrigin:'0 0',transform:'none'}],n,{composite:'add',fill:'none'})});return els}

/* swap(get, dir, mutate): tab and page switches. The old content leaves as a ghost (slide -dir and fade), the new content slides in
 from dir and fades up, both on the smooth spring. dir 0 = crossfade only (also what reduced motion gets). Interruptible: a second
 switch ghosts the content where it is, mid-flight. */
let G=null;function swap(get,dir,mutate){const old=get(),root=card();if(G){G.remove();G=null}let g=null;
if(old&&root&&old.isConnected){const r=old.getBoundingClientRect(),o=root.getBoundingClientRect(),cs=getComputedStyle(old);g=old.cloneNode(true);g.removeAttribute('id');g.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
g.setAttribute('aria-hidden','true');g.inert=true;Object.assign(g.style,{position:'absolute',left:r.left-o.left-root.clientLeft+'px',top:r.top-o.top-root.clientTop+'px',width:r.width+'px',height:r.height+'px',margin:'0',pointerEvents:'none',zIndex:'0',transform:cs.transform=='none'?'':cs.transform,opacity:cs.opacity,animation:'none',boxSizing:'border-box'});
g.querySelectorAll('*').forEach(x=>x.style.animation='none');g._st=old.scrollTop}
mutate();const nw=get(),d=R()?0:dir,host=card();if(g&&host){host.insertBefore(g,host.firstChild);g.scrollTop=g._st}
if(g){G=g;const c=curve('smooth');g.animate([{opacity:+g.style.opacity||1,transform:g.style.transform||'none'},{opacity:0,transform:`translateX(${-d*28}px)`}],{duration:R()?150:Math.round(c.d*.6),easing:R()?'ease-out':c.e,fill:'both'}).finished.then(()=>{g.remove();if(G===g)G=null}).catch(()=>{})}
if(nw){if(R())fade(nw,0,1);else anim(nw,[{opacity:0,transform:`translateX(${d*28}px)`},{opacity:1,transform:'none'}],'smooth',{fill:'none'})}return nw}

/* text(el, s): set text; numbers inside roll digit by digit (up when they grow, down when they shrink), like iOS numeric text.
 Words around them stay put. A different shape crossfades. textContent is right as soon as this returns (ghost digits are CSS only). */
function text(el,s){if(!el)return;s=String(s);const o=el.getAttribute('data-mxt')??el.textContent;if(o===s&&el.textContent===s)return;el.setAttribute('data-mxt',s);
if(R()||!el.isConnected||o===s){el.textContent=s;if(R()&&o!==s)fade(el,.35,1);return}const sp=x=>x.split(/(\d[\d.,]*)/),P=sp(o),Q=sp(s),nm=x=>parseFloat(x.replace(/,/g,''))||0;
if(P.length!=Q.length||P.some((t,i)=>i%2==0&&t!==Q[i])){el.textContent=s;anim(el,[{opacity:0,transform:'translateY(.2em)'},{opacity:1,transform:'none'}],'smooth',{fill:'none'});return}
el.textContent='';const c=curve('smooth');Q.forEach((t,i)=>{if(i%2==0||t===P[i]){if(t)el.append(t);return}const up=nm(t)>=nm(P[i])?1:-1,ot=P[i].padStart(t.length,' ');
[...t].forEach((ch,j)=>{const was=ot[ot.length-t.length+j]??'';if(ch===was){el.append(ch);return}const w=document.createElement('span');w.className='mx-d';w.textContent=ch;el.append(w);
w.animate([{transform:`translateY(${.55*up}em)`,opacity:0},{transform:'none',opacity:1}],{duration:c.d,easing:c.e,delay:j*18});
if(was.trim()){const gh=document.createElement('span');gh.className='mx-g';gh.setAttribute('data-c',was);gh.setAttribute('aria-hidden','true');w.append(gh);
gh.animate([{transform:'none',opacity:1},{transform:`translateY(${-.55*up}em)`,opacity:0}],{duration:Math.round(c.d*.7),easing:c.e,delay:j*18,fill:'both'}).finished.then(()=>gh.remove()).catch(()=>{})}})})}

/* pop(el, from): a tick or a selection lands with a small spring scale; a second tap restarts from the current scale. */
const PO=new WeakMap();function pop(el,s=.82,n='bouncy'){if(!el||R())return;const pv=PO.get(el);let f=s;if(pv){const k=pv.c.u((now()-pv.t)/1000);f=Math.min(s,pv.s+(1-pv.s)*k);pv.a.cancel()}
const c=curve(n),a=el.animate([{transform:`scale(${f})`},{transform:'scale(1)'}],{duration:c.d,easing:c.e,composite:'add'});PO.set(el,{a,c,s:f,t:now()});a.finished.then(()=>PO.get(el)&&PO.get(el).a===a&&PO.delete(el)).catch(()=>{})}

/* toast(el) springs a toast or snackbar in; out(el) lets it go (fade and drop, 160ms) and removes it. */
function toast(el,y=18){if(!el)return;el.style.animation='none';if(R())return void fade(el,0,1);anim(el,[{opacity:0,transform:`translateY(${y}px) scale(.96)`},{opacity:1,transform:'none'}],'bouncy',{fill:'none'})}
function out(el,done){if(!el)return;if(el._mxo)return;el._mxo=1;el.style.pointerEvents='none';const a=el.animate([{opacity:getComputedStyle(el).opacity},{opacity:0}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});if(!R())el.animate([{transform:'none'},{transform:'translateY(8px) scale(.98)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards',composite:'add'});
a.finished.then(()=>{el.remove();done&&done()}).catch(()=>{el.remove();done&&done()})}

/* enter(els, {y, step, max}): card and row entry, a short rise and fade, staggered (step ms per row, capped at max rows). */
function enter(els,o={}){if(!els)return;els=els.length!=null?[...els]:[els];const y=o.y??10,st=o.step??28,mx=o.max??8;els.forEach((e,i)=>{if(R())return void fade(e,0,1,180);
const dl=Math.min(i,mx)*st;anim(e,[{transform:`translateY(${y}px)`},{transform:'none'}],'smooth',{delay:dl,fill:'backwards',composite:'add'});e.animate([{opacity:0},{opacity:1}],{duration:220,delay:dl,easing:'cubic-bezier(.2,0,0,1)',fill:'backwards'})})}

return{R,curve,ease,disclose,flip,swap,text,pop,toast,out,enter,fade}})();
/*MOTION:END*/
const SP='cubic-bezier(.32,.72,0,1)';
const css=`.op{--bg:#f2f3f7;--card:rgba(255,255,255,.78);--rim:rgba(255,255,255,.9);--l:#0b0b0c;--l2:rgba(30,30,38,.66);--l3:rgba(30,30,38,.42);--ln:rgba(0,0,0,.07);--chip:rgba(118,118,128,.12);--seg:rgba(118,118,128,.12);--segOn:#fff;--bl:#007aff;--bls:rgba(0,122,255,.1);--ok:#1f9d55;--red:#e5372b;--reds:rgba(229,55,43,.11);--or:#c96a00;--ors:rgba(255,149,0,.14);--sh:0 6px 20px rgba(20,30,70,.08);
font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;background:var(--bg);color:var(--l);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:12px;overflow:hidden;width:100%;min-width:0;box-sizing:border-box;position:relative;-webkit-font-smoothing:antialiased;isolation:isolate}
.op::before{content:"";position:absolute;inset:-40% -20% auto;height:280px;z-index:-1;background:radial-gradient(60% 60% at 20% 30%,rgba(120,150,255,.22),transparent 70%),radial-gradient(50% 60% at 85% 20%,rgba(255,170,120,.18),transparent 70%);pointer-events:none}
@media (prefers-color-scheme:dark){.op{--bg:#0b0d14;--card:rgba(30,32,44,.72);--rim:rgba(255,255,255,.08);--l:#fff;--l2:rgba(235,235,245,.66);--l3:rgba(235,235,245,.4);--ln:rgba(255,255,255,.08);--chip:rgba(118,118,128,.24);--seg:rgba(118,118,128,.24);--segOn:rgba(99,99,102,.9);--bl:#0a84ff;--bls:rgba(10,132,255,.18);--ok:#30d158;--red:#ff453a;--reds:rgba(255,69,58,.18);--or:#ff9f0a;--ors:rgba(255,159,10,.17);--sh:0 6px 20px rgba(0,0,0,.35)}}
.op *{box-sizing:border-box;min-width:0}.op button{all:unset;box-sizing:border-box!important;border:0!important;background:transparent!important;box-shadow:none!important;min-height:0!important;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform var(--mx-snappy),opacity .2s,color .2s}.op button:focus-visible{outline:2px solid var(--bl)!important;outline-offset:2px}.op button:active{transform:scale(.96)}
.op svg{display:block;flex:none;fill:currentColor}
.op .hd{display:flex;align-items:center;gap:10px;min-height:32px}.op .ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#5e5ce6,#0a84ff);flex:none;box-shadow:0 2px 8px rgba(10,132,255,.3)}
.op .ttl{font-size:17px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;flex:none}.op .cts{font-size:12px;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;text-align:right;font-variant-numeric:tabular-nums}.op .cts b{color:var(--l);font-weight:600}.op .cts .r{color:var(--red)}
.op .sg{display:grid;grid-template-columns:repeat(3,1fr);height:44px;padding:4px;border-radius:12px;background:var(--seg);position:relative}.op .sg .th{position:absolute;top:4px;bottom:4px;left:4px;width:calc((100% - 8px)/3);border-radius:9px;background:var(--segOn);box-shadow:0 3px 8px rgba(0,0,0,.12),0 0 0 .5px rgba(0,0,0,.04);transition:transform var(--mx-smooth)}
.op .sg button{position:relative;z-index:1;display:flex!important;align-items:center;justify-content:center;gap:6px;height:36px!important;font-size:13px;font-weight:600;color:var(--l2);white-space:nowrap}.op .sg button.on{color:var(--l)}.op .sg small{font-size:11px;font-weight:600;color:var(--l3);font-variant-numeric:tabular-nums}
.op .ls{display:flex;flex-direction:column;gap:8px;max-height:292px;overflow-y:auto;overflow-x:hidden;margin:0 -4px;padding:0 4px 14px;scrollbar-width:none;-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 18px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 18px),transparent)}.op .ls::-webkit-scrollbar{display:none}.op .ls>*{flex-shrink:0}
.op .gh{display:flex;align-items:baseline;gap:6px;font-size:12px;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--l3);padding:6px 4px 0}.op .gh span{font-variant-numeric:tabular-nums}
.op .rw{background:var(--card);border-radius:16px;box-shadow:var(--sh),inset 0 0 0 .5px var(--rim);-webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%);transition:opacity .3s}
.op .rt{display:flex;align-items:center;gap:2px;min-height:56px;padding-right:12px}
.op .ck{width:44px;height:44px!important;display:grid!important;place-items:center;flex:none;margin-left:2px;color:var(--l3)}.op .ck i{width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 1.5px currentColor;display:grid;place-items:center;transition:background-color .2s,box-shadow .2s,transform var(--mx-bouncy)}.op .ck svg{opacity:0;transform:scale(.4);transition:opacity .15s,transform var(--mx-bouncy)}
.op .rw.dn .ck{color:var(--ok)}.op .rw.dn .ck i{background:var(--ok);box-shadow:none;color:#fff}.op .rw.dn .ck svg{opacity:1;transform:none}
.op .mn{flex:1;display:flex!important;align-items:center;gap:10px;padding:8px 0!important;min-height:44px!important}.op .tx{flex:1;display:flex;flex-direction:column;gap:2px}
.op .tx b{font-size:14px;font-weight:600;line-height:1.35;color:var(--l);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;transition:color .25s}.op .tx span{font-size:13px;line-height:1.35;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.op .rw.dn .tx b{text-decoration:line-through;text-decoration-color:var(--l3);color:var(--l3)}.op .rw.dn .tx span{opacity:.6}
.op .ct{margin-left:auto;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--l2);font-variant-numeric:tabular-nums;white-space:nowrap;flex:none}.op .ct .n{color:var(--l);font-weight:700}.op .ofs{display:none}.op .ct+.cts{flex-basis:100%;text-align:left;padding-left:42px}.op .hd{flex-wrap:wrap;row-gap:4px}
.op .rg{width:26px;height:26px;transform:rotate(-90deg)}.op .rg circle{fill:none;stroke-width:3.5}.op .rg .t{stroke:var(--chip)}.op .rg .v{stroke:var(--ok);stroke-linecap:round;stroke-dasharray:69.1;stroke-dashoffset:calc(69.1 * (1 - var(--p,0)));transition:stroke-dashoffset var(--mx-smooth)}
.op .ud{width:7px;height:7px;border-radius:50%;background:var(--red);flex:none;margin:0 6px}.op .rw.dn .ud,.op .rw.dn .du{opacity:.4}
.op .du{flex:none;font-size:12px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--chip);color:var(--l2);white-space:nowrap;font-variant-numeric:tabular-nums}.op .du.r{background:var(--reds);color:var(--red)}.op .du.o{background:var(--ors);color:var(--or)}
.op .ex{display:grid;grid-template-rows:0fr}.op .rw.open .ex{grid-template-rows:1fr}.op .ex>div{overflow:hidden}
.op .xb{padding:0 14px 14px 46px;display:flex;flex-direction:column;gap:8px}.op .xb p{margin:0;font-size:14px;line-height:1.5;color:var(--l);white-space:pre-wrap;overflow-wrap:anywhere}.op .meta{font-size:12px;color:var(--l3);overflow-wrap:anywhere}
.op .pl{display:flex;flex-wrap:wrap;gap:8px}.op .pl button{display:inline-flex!important;align-items:center;gap:6px;min-height:44px!important;padding:0 16px!important;border-radius:22px!important;font-size:14px;font-weight:600;color:var(--bl);background:var(--bls)!important;max-width:100%;transition:transform var(--mx-snappy),background-color .2s,color .2s}.op .pl button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.op .pl button.on{background:var(--bl)!important;color:#fff}
.op .em{padding:28px 8px;text-align:center;color:var(--l2);font-size:14px;line-height:1.5}.op .em b{display:block;color:var(--l);font-size:16px;margin-bottom:2px}
.op .ft{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:18px;padding:8px 8px 8px 16px;box-shadow:var(--sh),inset 0 0 0 .5px var(--rim);-webkit-backdrop-filter:blur(20px) saturate(170%);backdrop-filter:blur(20px) saturate(170%)}.op .ft .c{flex:1;font-size:13px;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.op .go{display:inline-flex!important;align-items:center;gap:6px;height:44px!important;padding:0 18px!important;border-radius:22px!important;background:var(--bl)!important;color:#fff;font-size:15px;font-weight:600;white-space:nowrap;flex:none}.op .go[disabled]{opacity:.35;cursor:default}
.op .snk{position:absolute;left:16px;right:16px;bottom:16px;z-index:5;display:flex;align-items:center;gap:8px;min-height:48px;padding:4px 4px 4px 16px;border-radius:14px;background:rgba(28,28,30,.92);color:#fff;font-size:14px;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 8px 24px rgba(0,0,0,.25)}.op .snk span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.op .snk button{color:#64d2ff;font-weight:600;height:40px!important;padding:0 12px!important;display:inline-flex!important;align-items:center}
.op .mn{min-width:0!important;overflow:hidden}.op .rt{min-width:0}
@media (max-width:440px){.op{padding:12px}.op .hd{flex-wrap:wrap;row-gap:4px}.op .cts{flex-basis:100%;text-align:left;padding-left:42px}.op .xb{padding-left:14px}}
@media (prefers-reduced-motion:reduce){.op *,.op *::before{animation:none!important;transition:none!important}}`;
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={chk:'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',list:'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',up:'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'};
const I=(k,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[k]}"/></svg>`;
const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const t0=(()=>{const n=new Date();return Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())})();
const dd=s=>{const m=/^(\d{4})-(\d\d)-(\d\d)/.exec(s||'');return m?Math.round((Date.UTC(+m[1],m[2]-1,+m[3])-t0)/864e5):null};
const dl=s=>{const n=dd(s);if(n==null)return'';if(n<0)return`Overdue ${-n}d`;if(n==0)return'Today';if(n==1)return'Tomorrow';const d=new Date(t0+n*864e5);return`${WD[d.getUTCDay()]} ${MO[d.getUTCMonth()]} ${d.getUTCDate()}`};
const dc=s=>{const n=dd(s);return n==null?'':n<=1?' r':n<=3?' o':''};
const onMe=x=>x.who=='Ace'&&x.status!='waiting';const ME=(D.me||[]).flatMap(g=>g.items||[]),MEID=new Set(ME.map(x=>x.id)),HASME=!!D.me;
const IT=(D.items||[]).map(x=>({...x}));const ALL=[...IT.map(x=>{const m=ME.find(y=>y.id==x.id);return m?{...x,title:m.title}:x}),...ME.filter(x=>!IT.some(y=>y.id==x.id)).map(x=>({...x,who:'Ace',status:'open'}))];const byId=id=>ME.find(x=>x.id==id)||ALL.find(x=>x.id==id);let flt='me',open=null,done=new Set(),ans={},snk=null,first=true;
const isMe=x=>HASME?MEID.has(x.id):onMe(x);const vis=()=>(flt=='all'?ALL:IT).filter(x=>flt=='all'||(flt=='me'?isMe(x):!isMe(x)));
const grp=x=>{const n=dd(x.due);return n!=null&&n<=0?0:n!=null&&n<=6?1:2};
function counts(){const me=HASME?ME.length:IT.filter(onMe).length,ln=IT.filter(x=>!isMe(x)).length,tm=IT.filter(x=>dd(x.due)==1).length,od=IT.filter(x=>{const n=dd(x.due);return n!=null&&n<0}).length,td=IT.filter(x=>dd(x.due)==0).length;
return[`<b>${me}</b> on you`,`<b>${ln}</b> on lanes`,od?`<span class="r"><b>${od}</b> overdue</span>`:'',td?`<b>${td}</b> due today`:'',tm?`<span class="x"><b>${tm}</b> due tomorrow</span>`:''].filter(Boolean).join(' · ')}
function row(x,i,gi){const acts=(x.action||'').split(' / ').map(s=>s.trim()).filter(Boolean),d=done.has(x.id),o=open==x.id,td='chip' in x;
return`<div class="rw${d?' dn':''}${o?' open':''}" data-id="${e(x.id)}"${gi!=null?` data-g="${gi}"`:''} style="animation-delay:${Math.min(i,8)*30}ms"><div class="rt"><button class="ck" data-ck aria-label="${d?'Mark not done':'Mark done'}: ${e(x.title)}" aria-pressed="${d}"><i>${I('chk',16)}</i></button>
<button class="mn" data-op aria-expanded="${o}"><span class="tx"><b>${e(x.title)}</b>${td?(x.sub?`<span>${e(x.sub)}</span>`:''):`<span>${e(x.status=='waiting'?'Waiting on '+(x.who=='Ace'?'reply':x.who):(x.detail||x.area||''))}</span>`}</span>${td?(x.chip?`<span class="du${x.urgent?' r':''}">${e(x.chip)}</span>`:x.urgent?'<span class="ud" role="img" aria-label="Urgent"></span>':''):x.due?`<span class="du${dc(x.due)}">${e(dl(x.due))}</span>`:''}</button></div>
<div class="ex"><div><div class="xb">${x.detail?`<p>${e(x.detail)}</p>`:''}${acts.length?`<div class="pl">${acts.map(a=>`<button data-a="${e(a)}" class="${ans[x.id]==a?'on':''}" aria-pressed="${ans[x.id]==a}"><span>${e(a)}</span></button>`).join('')}</div>`:''}<span class="meta">${e([x.area,x.who!='Ace'?'on '+x.who:'',x.money?'money':'',x.source].filter(Boolean).join(' · '))}</span></div></div></div></div>`}
function list(){if(flt=='me'&&HASME){if(!ME.length)return`<div class="em"><b>Nothing on you</b>Everything left is with the lanes.</div>`;let i=0;return D.me.map((g,gi)=>`<div class="gh">${e(g.title)} <span data-gc="${gi}">${g.items.filter(x=>done.has(x.id)).length}/${g.items.length}</span></div>`+g.items.map(x=>row(x,i++,gi)).join('')).join('')}
const v=vis();if(!v.length)return`<div class="em"><b>${flt=='me'?'Nothing on you':'Nothing open'}</b>${flt=='me'?'Everything left is with the lanes.':'All clear.'}</div>`;
const G=[[],[],[]];v.forEach(x=>G[grp(x)].push(x));let i=0;return['Today','This week','Later'].map((n,k)=>G[k].length?`<div class="gh">${n} <span>${G[k].length}</span></div>`+G[k].map(x=>row(x,i++)).join(''):'').join('')}
const nUp=()=>done.size+Object.keys(ans).filter(k=>!done.has(k)).length;
function ring(){const k=ME.filter(x=>done.has(x.id)).length,N=ME.length;return`<span class="ct" aria-label="${k} of ${N} done"><span class="k"><span class="n">${k}</span><span class="of"><span class="ofw"> of </span><span class="ofs">/</span>${N}</span></span><svg class="rg" viewBox="0 0 30 30" aria-hidden="true" style="--p:${N?k/N:0}"><circle class="t" cx="15" cy="15" r="11"/><circle class="v" cx="15" cy="15" r="11"/></svg></span>`}
function render(){const n=nUp(),cm=HASME?ME.length:IT.filter(onMe).length,cl=IT.filter(x=>!isMe(x)).length,ix={me:0,lanes:1,all:2}[flt],st=A.querySelector('.ls'),top=st?st.scrollTop:0;
A.innerHTML=`<style>${css}</style><div class="op"><div class="hd"><span class="ic">${I('list',18)}</span><span class="ttl">Concierge · Open</span>${HASME?ring():''}<span class="cts">${counts()}</span></div>
<div class="sg" role="tablist"><span class="th" style="transform:translateX(${ix*100}%)"></span>${[['me','On me',cm],['lanes','Lanes',cl],['all','All',ALL.length]].map(([k,l,c])=>`<button role="tab" data-f="${k}" class="${flt==k?'on':''}" aria-selected="${flt==k}">${l} <small>${c}</small></button>`).join('')}</div>
<div class="ls">${list()}</div>
<div class="ft"><span class="c">${n?`${done.size} done · ${n-done.size} answered`:'Check off or answer items'}</span><button class="go" id="go"${n?'':' disabled'}>Send ${n||''} update${n==1?'':'s'} ↗</button></div></div>`;
const l=A.querySelector('.ls');if(l)l.scrollTop=top;bind();if(first){first=false;MX.enter(A.querySelector('.op'),{y:12});MX.enter(A.querySelectorAll('.op .ls>*'),{y:8,step:24})}}
function bind(){const R=A.querySelector('.op');R.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{if(flt==b.dataset.f)return;const IX={me:0,lanes:1,all:2},dir=Math.sign(IX[b.dataset.f]-IX[flt]);flt=b.dataset.f;open=null;MX.flip('.op .sg .th',()=>MX.swap(()=>A.querySelector('.ls'),dir,()=>{render();const l=A.querySelector('.ls');if(l)l.scrollTop=0}))});
R.querySelectorAll('.rw').forEach(r=>{const id=r.dataset.id,x=byId(id);
r.querySelector('[data-op]').onclick=()=>{const was=open==id;R.querySelectorAll('.rw.open').forEach(o=>{if(o===r)return;o.querySelector('[data-op]').setAttribute('aria-expanded','false');MX.disclose(o,false,v=>o.classList.toggle('open',v),{body:'.ex'})});open=was?null:id;r.querySelector('[data-op]').setAttribute('aria-expanded',String(!was));MX.disclose(r,!was,v=>r.classList.toggle('open',v),{body:'.ex'})};
r.querySelector('[data-ck]').onclick=()=>{if(done.has(id)){done.delete(id);r.classList.remove('dn');foot();return}done.add(id);r.classList.add('dn');MX.pop(r.querySelector('.ck i'));foot();snack(`Done: ${x.title}`,()=>{done.delete(id);const q=A.querySelector(`.rw[data-id="${CSS.escape(id)}"]`);if(q)q.classList.remove('dn');foot()})};
r.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(ans[id]==a)delete ans[id];else ans[id]=a;MX.pop(b,.94,'snappy');r.querySelectorAll('[data-a]').forEach(p=>{const on=ans[id]==p.dataset.a;p.classList.toggle('on',on);p.setAttribute('aria-pressed',on)});foot()})});
R.querySelector('#go').onclick=send}
function tally(){const R=A.querySelector('.op');if(!R||!HASME)return;const c=R.querySelector('.ct');if(c){const k=ME.filter(x=>done.has(x.id)).length;MX.text(c.querySelector('.n'),k);c.setAttribute('aria-label',k+' of '+ME.length+' done');c.querySelector('.rg').style.setProperty('--p',ME.length?k/ME.length:0)}
R.querySelectorAll('[data-gc]').forEach(el=>{const g=D.me[+el.dataset.gc];MX.text(el,g.items.filter(x=>done.has(x.id)).length+'/'+g.items.length)})}
function foot(){tally();const n=nUp(),f=A.querySelector('.ft');if(!f)return;MX.text(f.querySelector('.c'),n?`${done.size} done · ${n-done.size} answered`:'Check off or answer items');const g=f.querySelector('#go');g.disabled=!n;MX.text(g,`Send ${n||''} update${n==1?'':'s'} ↗`)}
function snack(t,undo){if(snk){clearTimeout(snk.t);MX.out(snk.el)}const R=A.querySelector('.op'),s=document.createElement('div');s.className='snk';s.setAttribute('role','status');s.innerHTML=`<span>${e(t)}</span>${undo?'<button>Undo</button>':''}`;R.appendChild(s);MX.toast(s);
const bye=()=>{MX.out(s);if(snk&&snk.el===s)snk=null};const ub=s.querySelector('button');if(ub)ub.onclick=()=>{clearTimeout(snk&&snk.t);bye();undo()};snk={el:s,t:setTimeout(bye,4500)}}
function send(){const L=[];ALL.forEach(x=>{if(done.has(x.id))L.push(`done: ${x.title} [${x.id}]`);else if(ans[x.id])L.push(`${x.title} [${x.id}]: ${ans[x.id]}`)});if(!L.length)return;
sendPrompt('Open updates: '+L.join('; ')+'. Update open.json and the lane needs files.');done.clear();ans={};render();snack('Updates sent to chat',null)}
render();
/* Ask Concierge bar (standard in every Concierge widget): one-line pill at the bottom of the card. The arrow shows once there is text;
 Enter or the arrow calls sendPrompt("[<what is on screen>] <text>"), clears the field and shows "Sent to chat" for a moment. */
function askBar(sel,ctx,look){const b=document.createElement('form');b.className='askc '+look;b.setAttribute('autocomplete','off');
b.innerHTML=`<style>.askc{all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;min-width:0;height:44px;border-radius:22px;padding:0 0 0 16px;flex:none;position:relative;isolation:isolate;font-family:inherit;
--aT:#0b0b0c;--aP:rgba(30,30,38,.5);--aA:#007aff;--aG:rgba(255,255,255,.5);--aE:rgba(255,255,255,.85);--aH:rgba(255,255,255,.9);--aS:0 4px 16px rgba(30,30,60,.10);
background:var(--aG);-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);box-shadow:inset 0 0 0 .5px var(--aE),inset 0 1px 0 var(--aH),var(--aS);transition:box-shadow .25s}
.askc input{all:unset;box-sizing:border-box;flex:1;min-width:0;height:44px;font-size:14px;color:var(--aT);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.askc input::placeholder{color:var(--aP);opacity:1;transition:color .2s}.askc.ok input::placeholder{color:var(--aA)}
.askc.askc .go{all:unset;box-sizing:border-box!important;width:44px!important;height:44px!important;min-height:0!important;min-width:44px!important;border:0!important;background:transparent!important;box-shadow:none!important;display:grid!important;place-items:center;flex:none;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0;transform:scale(.3);pointer-events:none;transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .2s}
.askc.has .go{opacity:1;transform:none;pointer-events:auto}
.askc .go i{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff;background:color-mix(in srgb,var(--aA) 82%,transparent);-webkit-backdrop-filter:blur(12px) saturate(180%);backdrop-filter:blur(12px) saturate(180%);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.45),inset 0 1px 0 rgba(255,255,255,.55),0 2px 8px color-mix(in srgb,var(--aA) 35%,transparent);transition:transform .3s cubic-bezier(.32,.72,0,1)}.askc .go svg{display:block;fill:currentColor}.askc .go:active i{transform:scale(.9)}
.askc .go:focus-visible i{outline:2px solid var(--aT);outline-offset:2px}.askc:focus-within{box-shadow:inset 0 0 0 .5px var(--aE),inset 0 1px 0 var(--aH),var(--aS),0 0 0 2px color-mix(in srgb,var(--aA) 55%,transparent)}
.askc.tint::before{content:"";position:absolute;inset:-8px -6px;z-index:-1;border-radius:30px;pointer-events:none;filter:blur(14px);opacity:.9;background:radial-gradient(30% 110% at 12% 50%,rgba(66,133,244,.42),transparent 70%),radial-gradient(28% 110% at 42% 60%,rgba(234,67,53,.26),transparent 70%),radial-gradient(28% 110% at 68% 40%,rgba(251,188,4,.32),transparent 70%),radial-gradient(30% 110% at 90% 55%,rgba(52,168,83,.34),transparent 70%)}
@media (prefers-color-scheme:dark){.askc{--aT:#fff;--aP:rgba(235,235,245,.5);--aA:#0a84ff;--aG:rgba(34,36,52,.6);--aE:rgba(255,255,255,.1);--aH:rgba(255,255,255,.14);--aS:0 4px 16px rgba(0,0,0,.35)}.askc.tint::before{opacity:.65}}
@media (prefers-reduced-motion:reduce){.askc,.askc *{transition:none!important}}</style><input type="text" enterkeyhint="send" placeholder="Ask Concierge…" aria-label="Ask Concierge"><button type="submit" class="go" aria-label="Send to chat"><i><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg></i></button>`;
const i=b.querySelector('input'),ph=i.placeholder;let tm;const reset=()=>{b.classList.remove('ok');i.placeholder=ph};
i.oninput=()=>{b.classList.toggle('has',!!i.value.trim());reset()};
b.onsubmit=ev=>{ev.preventDefault();const t=i.value.trim();if(!t)return;sendPrompt('['+ctx()+'] '+t);i.value='';b.classList.remove('has');b.classList.add('ok');i.placeholder='Sent to chat';clearTimeout(tm);tm=setTimeout(reset,2200)};
/* the templates re-render their root, so keep the bar (and what is typed in it) attached as the root's last child */
const put=()=>{const r=A.querySelector(sel);if(r&&r.lastElementChild!==b){const f=document.activeElement===i;r.appendChild(b);if(f)i.focus()}};new MutationObserver(put).observe(A,{childList:true,subtree:true});put()}
askBar('.op',()=>{const x=IT.find(y=>y.id==open);return 'Open · '+(x?x.title:{me:'On me',lanes:'Lanes',all:'All'}[flt])},'glass');})();
