/* Concierge · Usage: plan limits, lane model fit, and the 3 biggest savings. Built by build_usage_data.py.
 window.D={updated:"Mon Nov 9, 2:05 AM ET",plan:"Ultra",
   headline:{tone:"ok"|"warn"|"bad",text},
   meters:[{key,label,pct,value|null,sub|null,reset:"Resets Sun 2 AM ET · in 6d"|null}],   // weekly all, weekly Fable, extra spend, manager context
   lanes:[{lane,model,state:"working"|"idle",task,fit:"ok"|"over"|"under",ideal,note}],      // ideal = the model the rule picks for that task
   tips:[{title,detail,action,prompt}]}                                                        // action = button text, prompt = sent to chat on tap
 Rule: Haiku for scraping, Sonnet for writing, Opus only for builds and heavy research. Ask bar: "[Usage] …". */
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
skin('.us',`
& {--bg:var(--a-bone);--card:var(--a-ground);--fr:var(--a-ground);--rim:var(--a-stone);--l:var(--a-ink);--l2:var(--a-label);--l3:var(--a-label);--ln:var(--a-stone);--fe:var(--a-stone);--chip:transparent;--ph:var(--a-stone);--phb:var(--a-stone);--seg:transparent;--segOn:var(--a-ink);--bl:var(--a-emberT);--bls:var(--a-emberS);--ok:var(--a-ink);--oks:transparent;--or:var(--a-label);--ors:transparent;--wn:var(--a-label);--bad:var(--a-emberT);--bads:transparent;--red:var(--a-emberT);--reds:transparent;--sh:none}
& .hd{gap:12px;padding-bottom:10px;border-bottom:1px solid var(--a-ink);align-items:flex-end}
& .hd .ic{width:62px;height:36px;margin:-4px 0 -2px -3px;background:var(--a-logo) left center/contain no-repeat!important;box-shadow:none!important;color:transparent!important}& .hd .ic svg{display:none!important}
& .hd .ttl{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& button:focus-visible{box-shadow:none!important;outline:2px solid var(--a-ink)!important;outline-offset:2px}
& .ace-cap{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& .upd{font-size:12px;color:var(--a-label)}
& .hl{background:none;box-shadow:none;border-left:3px solid var(--c);padding:6px 0 6px 12px;font-size:17px;font-weight:500;letter-spacing:-.02em;line-height:23px}& .hl i{display:none}
& .hl.ok{--c:var(--a-ink)}& .hl.warn{--c:var(--a-label)}& .hl.bad{--c:var(--a-ember)}
& .mt{gap:0;border-top:1px solid var(--a-stone);border-left:1px solid var(--a-stone)}& .m{background:none;box-shadow:none;border-right:1px solid var(--a-stone);border-bottom:1px solid var(--a-stone);padding:14px 10px 12px}
& .m.ok{--c:var(--a-ink)}& .m.warn{--c:var(--a-label)}& .m.bad{--c:var(--a-ember)}
& .rg .t{stroke:var(--a-stone)}& .rg circle{stroke-width:4}& .rg .v{stroke-linecap:butt;animation-duration:var(--a-b);animation-timing-function:var(--a-out)}
& .rg b{font-size:19px;font-weight:600;letter-spacing:-.05em}& .m.bad .rg b{color:var(--a-emberT)}
& .m .lb{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}& .m .sb{font-size:13px;color:var(--a-ink)}& .m .rs{font-size:12px;color:var(--a-label)}
& .sec{background:var(--a-ground);box-shadow:none;border:1px solid var(--a-stone);padding:12px}
& .st{font-size:11px;font-weight:500;letter-spacing:.08em;color:var(--a-label)}& .st span{color:var(--a-label);font-weight:500}
& .ln{border-top-color:var(--a-stone)}& .nm b{font-size:15px;font-weight:500;letter-spacing:-.015em}& .nm span{font-size:12px;color:var(--a-label)}
& .dot{width:7px;height:7px;background:var(--a-stone)}& .dot.on{background:var(--a-ember);box-shadow:none}
& .md{font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;background:none;box-shadow:inset 0 0 0 1px var(--a-ink)}
& .ft{font-size:12px;font-weight:500}& .ft.ok{--c:var(--a-label)}& .ft.over{--c:var(--a-emberT)}& .ft.under{--c:var(--a-emberT)}
& .tp{border-top-color:var(--a-stone)}& .tp .n{width:auto;height:auto;background:none;font-size:22px;font-weight:600;letter-spacing:-.05em;color:var(--a-ink);min-width:20px}
& .tp .t b{font-size:15px;font-weight:500;letter-spacing:-.015em}& .tp .t span{font-size:13px;color:var(--a-label)}
& .tp button{background:var(--a-ember)!important;color:var(--a-on);font-weight:500;min-height:44px!important;transition:transform var(--a-q) var(--a-out),filter var(--a-q)}& .tp button:active{transform:scale(.98);filter:brightness(.94)}& .tp button.sent{background:none!important;box-shadow:inset 0 0 0 1px var(--a-stone)!important;color:var(--a-label)}
& .em{color:var(--a-label)}
& .m.na{--c:var(--a-stone)}& .m.na .rg b{font-size:16px;letter-spacing:-.02em;color:var(--a-label)}& .md.ns{box-shadow:inset 0 0 0 1px var(--a-stone);color:var(--a-label)}& .ft.na{--c:var(--a-label)}`);stampSync('.hd','after');
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
const css=`.us{--bg:#f2f3f7;--card:rgba(255,255,255,.74);--rim:rgba(255,255,255,.95);--l:#0b0b0c;--l2:rgba(30,30,38,.64);--l3:rgba(30,30,38,.4);--ln:rgba(0,0,0,.07);--ph:rgba(118,118,128,.12);--sh:0 8px 24px rgba(20,30,70,.09);--bl:#007aff;--ok:#1f9d55;--wn:#c77700;--bad:#e5372b;
font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;background:var(--bg);color:var(--l);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:12px;width:100%;min-width:0;box-sizing:border-box;position:relative;isolation:isolate;overflow:hidden;-webkit-font-smoothing:antialiased}
.us::before{content:"";position:absolute;inset:-30% -30% auto -30%;height:380px;z-index:-1;pointer-events:none;background:radial-gradient(40% 50% at 18% 40%,rgba(255,159,10,.16),transparent 70%),radial-gradient(45% 55% at 82% 25%,rgba(10,132,255,.18),transparent 70%)}
@media (prefers-color-scheme:dark){.us{--bg:#0a0c12;--card:rgba(28,30,40,.66);--rim:rgba(255,255,255,.09);--l:#fff;--l2:rgba(235,235,245,.66);--l3:rgba(235,235,245,.38);--ln:rgba(255,255,255,.08);--ph:rgba(118,118,128,.2);--sh:0 8px 24px rgba(0,0,0,.4);--bl:#0a84ff;--ok:#30d158;--wn:#ffb340;--bad:#ff453a}}
.us *{box-sizing:border-box;min-width:0}.us button{all:unset;box-sizing:border-box!important;border:0!important;background:transparent!important;box-shadow:none!important;min-height:0!important;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .3s ${SP},opacity .2s}.us button:active{transform:scale(.97)}.us button:focus-visible{outline:2px solid var(--bl)!important;outline-offset:2px}.us svg{display:block;flex:none}
.us .hd{display:flex;align-items:center;gap:10px;min-height:32px}.us .ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;color:#fff;flex:none;background:linear-gradient(135deg,#ff9f0a,#ff375f);box-shadow:0 2px 10px rgba(255,99,50,.3)}.us .ttl{font-size:17px;font-weight:700;letter-spacing:-.02em;white-space:nowrap}.us .upd{margin-left:auto;font-size:12px;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
.us .gl{background:var(--card);border-radius:18px;box-shadow:var(--sh),inset 0 0 0 .5px var(--rim);-webkit-backdrop-filter:blur(24px) saturate(180%);backdrop-filter:blur(24px) saturate(180%)}
.us .hl{display:flex;align-items:center;gap:10px;padding:12px 14px;font-size:15px;font-weight:650;letter-spacing:-.01em;line-height:1.3}.us .hl i{width:10px;height:10px;border-radius:50%;flex:none;background:var(--c)}.us .hl.ok{--c:var(--ok)}.us .hl.warn{--c:var(--wn)}.us .hl.bad{--c:var(--bad)}
.us .mt{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media (min-width:560px){.us .mt{grid-template-columns:repeat(4,minmax(0,1fr))}}
.us .m{padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}.us .m.ok{--c:var(--ok)}.us .m.warn{--c:var(--wn)}.us .m.bad{--c:var(--bad)}
.us .rg{position:relative;width:64px;height:64px}.us .rg svg{width:64px;height:64px;transform:rotate(-90deg)}.us .rg circle{fill:none;stroke-width:7}.us .rg .t{stroke:var(--ph)}.us .rg .v{stroke:var(--c);stroke-linecap:round;stroke-dasharray:var(--cf);stroke-dashoffset:var(--cf);animation:rg 1s .1s ${SP} forwards}@keyframes rg{to{stroke-dashoffset:var(--off)}}
.us .rg b{position:absolute;inset:0;display:grid;place-items:center;font-size:17px;font-weight:750;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.us .m .lb{font-size:13px;font-weight:600;line-height:1.2}.us .m .sb{font-size:12px;color:var(--l2);line-height:1.3;font-variant-numeric:tabular-nums}.us .m .rs{font-size:12px;color:var(--l3);line-height:1.3}
.us .sec{padding:12px;display:flex;flex-direction:column;gap:2px}.us .st{display:flex;align-items:baseline;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--l3);padding-bottom:4px}.us .st span{margin-left:auto;text-transform:none;letter-spacing:0;font-weight:600}
.us .ln{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:8px;min-height:48px;border-top:1px solid var(--ln)}.us .ln.f{border-top:0}
.us .nm{display:flex;flex-direction:column;gap:1px}.us .nm b{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.us .nm span{font-size:12px;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.us .dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--l3)}.us .dot.on{background:var(--ok);box-shadow:0 0 0 3px color-mix(in srgb,var(--ok) 22%,transparent)}
.us .md{font-size:12px;font-weight:700;padding:4px 9px;border-radius:999px;background:var(--ph);white-space:nowrap}
.us .ft{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700;white-space:nowrap;color:var(--c);min-width:84px;justify-content:flex-end}.us .ft.ok{--c:var(--ok)}.us .ft.na{--c:var(--l3);font-weight:600}.us .md.ns{color:var(--l3);background:transparent;box-shadow:inset 0 0 0 1px var(--ln)}.us .m.na{--c:var(--l3)}.us .m.na .rg b{font-size:15px;color:var(--l2)}.us .ft.over{--c:var(--wn)}.us .ft.under{--c:var(--bad)}
.us .tp{display:flex;align-items:center;gap:10px;min-height:56px;border-top:1px solid var(--ln);padding:6px 0}.us .tp.f{border-top:0}.us .tp .n{width:24px;height:24px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:12px;font-weight:750;background:var(--ph);color:var(--l2)}
.us .tp .t{flex:1;display:flex;flex-direction:column;gap:1px}.us .tp .t b{font-size:14px;font-weight:600;line-height:1.3}.us .tp .t span{font-size:12px;color:var(--l2);line-height:1.35}
.us .tp button{display:inline-flex!important;align-items:center;justify-content:center;min-height:44px!important;padding:0 14px!important;border-radius:22px!important;font-size:13px;font-weight:650;color:#fff;background:var(--bl)!important;max-width:44%;text-align:center;line-height:1.15}.us .tp button.sent{background:var(--ph)!important;color:var(--l2)}
.us .em{font-size:13px;color:var(--l3);padding:8px 0}
@media (max-width:420px){.us .tp{flex-wrap:wrap}.us .tp button{max-width:none;flex:1 0 100%}}
@media (prefers-reduced-motion:reduce){.us *{transition:none!important;animation:none!important}.us .rg .v{stroke-dashoffset:var(--off)}}`;
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tone=p=>p>=85?'bad':p>=60?'warn':'ok';
const C=2*Math.PI*26;
const FIT={ok:['✓','Right model'],over:['↓','Overkill'],under:['↑','May be weak'],na:['','Model not set']};
const meter=m=>{const off=m.pct==null,p=off?0:Math.max(0,Math.min(100,+m.pct||0));return`<div class="m gl ${off?'na':tone(p)}"><div class="rg"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="t" cx="32" cy="32" r="26"/><circle class="v" cx="32" cy="32" r="26" style="--cf:${C.toFixed(1)};--off:${(C*(1-p/100)).toFixed(1)}"/></svg><b>${off?E(m.value||'Off'):p+'%'}</b></div><div class="lb">${E(m.label)}</div>${m.sub?`<div class="sb">${E(m.sub)}</div>`:''}${m.reset?`<div class="rs">${E(m.reset)}</div>`:''}</div>`};
const lane=(l,i)=>`<div class="ln${i?'':' f'}"><div class="nm"><b><i class="dot${l.state==='working'?' on':''}"></i>${E(l.lane)}</b><span>${E(l.state==='working'?'Working':'Idle')}${l.task?' · '+E(l.task):''}</span></div><span class="md${l.model?'':' ns'}">${E(l.model||'Not set')}</span><span class="ft ${l.fit}" title="${E(l.note||'')}">${l.fit==='na'?'No model':(FIT[l.fit]||FIT.ok)[0]+' '+(l.fit==='ok'?'Fits':l.fit==='over'?'Use '+E(l.ideal):'Needs '+E(l.ideal))}</span></div>`;
const tip=(t,i)=>`<div class="tp${i?'':' f'}"><span class="n">${i+1}</span><div class="t"><b>${E(t.title)}</b><span>${E(t.detail)}</span></div><button data-i="${i}">${E(t.action)}</button></div>`;
const hl=D.headline||{tone:'ok',text:''};
A.innerHTML=`<style>${css}</style><div class="us"><div class="hd"><div class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></div><div class="ttl">Usage</div><div class="upd">${E(D.plan||'')}${D.plan&&D.updated?' · ':''}${E(D.updated||'')}</div></div>
${hl.text?`<div class="hl gl ${hl.tone}"><i></i><span>${E(hl.text)}</span></div>`:''}
<div class="mt">${(D.meters||[]).map(meter).join('')}</div>
<div class="sec gl"><div class="st">Lanes<span>${(D.lanes||[]).filter(l=>l.state==='working').length} working</span></div>${(D.lanes||[]).length?D.lanes.map(lane).join(''):'<div class="em">No lanes listed.</div>'}</div>
<div class="sec gl"><div class="st">Biggest savings</div>${(D.tips||[]).length?D.tips.slice(0,3).map(tip).join(''):'<div class="em">Nothing to save right now.</div>'}</div></div>`;
A.querySelectorAll('.tp button').forEach(b=>b.onclick=()=>{const t=D.tips[+b.dataset.i];sendPrompt('[Usage] '+t.prompt);b.classList.add('sent');b.textContent='Sent to chat'});
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

askBar('.us',()=>'Usage','glass');})();
