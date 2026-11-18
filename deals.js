/* Concierge · Deals v1: brand pipeline. Built by build_deals_data.py from brand-ledger.md + lane files.
 window.D={date:"YYYY-MM-DD",stages:[[key,label,color]],   // the ledger words: inbound, asked rate, quoted, negotiating, agreed, payment received
   deals:[{id,brand,via,tag,lane,stage,kind:"Paid"|"Affiliate"|"Application",type,channel,status,
     value:{label,amount,unit}|null,last:{who,date,days},next:{text,date,days},deadline:{date,days,label}|null,
     draft,notes,acts:[..],needsId,skin?}],
   skin (optional, visual only): {bg,fg,accent,accentInk?,muted?,line?,font?,logo?,logoH?,mark?,upper?}. One deal renders as its own
     branded card: colors, type, wordmark (logo, a data URL, light on bg) in place of the name, mark (data URL) in the avatar.
     It remaps the card's color variables for both themes, so the stage rail, actions and sendPrompt stay exactly the same.
   paused:{label,count,brands:[{brand,tier,cohort}],restart,restartDate,floor,floorTier,why,from}|null,
   totals:{agreed,paid,onTable,perUnit:[..]}}
 Stage rail on top (tap a stage to filter, tap again for all). Tap a deal to open it and queue one action.
 Paused lane = LinkedIn outbound. Footer sends ONE sendPrompt with every queued action. */
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
skin('.dl',`
& {--bg:var(--a-bone);--card:var(--a-ground);--fr:var(--a-ground);--rim:var(--a-stone);--l:var(--a-ink);--l2:var(--a-label);--l3:var(--a-label);--ln:var(--a-stone);--fe:var(--a-stone);--chip:transparent;--ph:var(--a-stone);--phb:var(--a-stone);--seg:transparent;--segOn:var(--a-ink);--bl:var(--a-emberT);--bls:var(--a-emberS);--ok:var(--a-ink);--oks:transparent;--or:var(--a-label);--ors:transparent;--wn:var(--a-label);--bad:var(--a-emberT);--bads:transparent;--red:var(--a-emberT);--reds:transparent;--sh:none}
& .hd{gap:12px;padding-bottom:10px;border-bottom:1px solid var(--a-ink);align-items:flex-end}
& .hd .ic{width:62px;height:36px;margin:-4px 0 -2px -3px;background:var(--a-logo) left center/contain no-repeat!important;box-shadow:none!important;color:transparent!important}& .hd .ic svg{display:none!important}
& .hd .ttl{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& button:focus-visible{box-shadow:none!important;outline:2px solid var(--a-ink)!important;outline-offset:2px}
& .ace-cap{font-size:11px;line-height:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}
& [style*="--sc"]{--sc:var(--a-ink)!important}
& .sub{font-size:12px;color:var(--a-label)}
& .kp{gap:0;border-top:1px solid var(--a-stone);border-bottom:1px solid var(--a-stone)}& .k{background:none;border:0;box-shadow:none;padding:10px 12px 10px 0}& .k+.k{border-left:1px solid var(--a-stone);padding-left:12px}
& .k small{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--a-label)}& .k b{font-size:28px;line-height:32px;font-weight:600;letter-spacing:-.05em;margin-top:4px}& .k b.mute{font-size:18px;line-height:32px;color:var(--a-label)}& .k.g b{color:var(--a-emberT)}& .k .pu{font-size:12px;font-weight:500;color:var(--a-label);letter-spacing:-.01em}
& .rail::before{background:var(--a-stone);height:1px;top:20px}
& .nd .dot{width:34px;height:34px;font-size:14px;font-weight:600;letter-spacing:-.03em;color:var(--a-ink);background:var(--a-bone);box-shadow:inset 0 0 0 1px var(--a-ink);transition:transform var(--a-b) var(--a-out),background var(--a-q),color var(--a-q)}
& .nd.z .dot{box-shadow:inset 0 0 0 1px var(--a-stone);color:var(--a-label)}& .nd.on .dot{background:var(--a-ember);color:var(--a-on);transform:none;box-shadow:none}
& .nd .lbl{font-size:11px;line-height:13px;font-weight:500;letter-spacing:-.01em;text-transform:none;color:var(--a-label)}& .nd.on .lbl{color:var(--a-ink)}
& .nd.pz .dot{background:repeating-linear-gradient(135deg,transparent 0 4px,var(--a-stone) 4px 5px),var(--a-bone);box-shadow:inset 0 0 0 1px var(--a-label);color:var(--a-label)}& .nd.pz.on .dot{background:var(--a-ink);color:var(--a-bone)}
& .sep{background:var(--a-stone)}
& .fh{font-size:13px;color:var(--a-label);padding:0}& .fh b{color:var(--a-ink);font-weight:500}& .fh .x{color:var(--a-ink);text-decoration:underline;text-underline-offset:3px;font-weight:500}
& .lst{gap:0;margin:0;padding:2px 0 10px}
& .dc{background:var(--a-ground);border:1px solid var(--a-stone);box-shadow:none;animation:aceRise var(--a-b) var(--a-out) both;animation-delay:calc(var(--i) * 60ms)}& .dc+.dc,& .pc+.dc,& .dc+.pc{margin-top:-1px}& .dc.open{border-color:var(--a-ink);position:relative;z-index:1}@keyframes aceRise{from{transform:translateY(8px);opacity:0}}
& .av{width:32px;height:32px;font-size:15px;font-weight:600;letter-spacing:-.04em;background:var(--a-ink);color:var(--a-bone);box-shadow:none}
& .nm b{font-size:15px;font-weight:500;letter-spacing:-.015em}& .nm span{font-size:12px;color:var(--a-label)}& .nx{font-size:13px;color:var(--a-label)}& .nx.q{color:var(--a-emberT);font-weight:500}
& .val{font-size:17px;font-weight:600;letter-spacing:-.04em}& .val.mute{font-size:12px;color:var(--a-label);font-weight:500;letter-spacing:0}
& .pr{gap:1px}& .pr i{width:8px;height:3px;background:var(--a-stone)}& .pr i.f{background:var(--a-ink)}
& .cp{font-size:10.5px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;padding:2px 6px;background:none;box-shadow:inset 0 0 0 1px var(--a-stone);color:var(--a-label)}& .cp.r,& .cp.b{color:var(--a-emberT);box-shadow:inset 0 0 0 1px var(--a-emberT)}& .cp.g{color:var(--a-ink);box-shadow:inset 0 0 0 1px var(--a-ink)}
& .ex{transition:grid-template-rows var(--a-b) var(--a-out)}& .bd{transition:opacity var(--a-q) var(--a-out)}
& .kv{font-size:13px}& .kv dt{color:var(--a-label);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding-top:2px}
& .ac{font-weight:500;min-height:44px!important;background:none!important;box-shadow:inset 0 0 0 1px var(--a-stone)!important;color:var(--a-ink)}& .ac.on{background:var(--a-emberS)!important;color:var(--a-emberT);box-shadow:inset 0 0 0 1.5px var(--a-ember)!important}
& .pc{border:1px dashed var(--a-label);background:none}& .pc .av{background:none;color:var(--a-label);box-shadow:inset 0 0 0 1px var(--a-stone)}
& .tr em{font-size:10.5px;font-weight:500;letter-spacing:.08em;color:var(--a-label)}& .bp{background:var(--a-ground);border:1px solid var(--a-stone);font-size:12.5px}& .bp small{color:var(--a-label)}
& .emp{background:var(--a-ground);border:1px dashed var(--a-stone);color:var(--a-label);font-size:14px}
& .bar{background:var(--a-ground);border:1px solid var(--a-ink);padding:4px 4px 4px 12px}& .bar .c{font-size:13px;color:var(--a-label)}& .bar .c b{color:var(--a-ink);font-weight:500}
& .bar .go{background:var(--a-ember)!important;color:var(--a-on);box-shadow:none!important;font-weight:500;min-height:46px!important}& .bar .go[disabled]{opacity:.35}
& .toast{background:var(--a-ink);color:var(--a-bone);font-weight:500}
@media (max-width:460px){& .k b{font-size:22px}& .nd .dot{width:30px;height:30px}& .nd .lbl{font-size:11px;line-height:13px}}
@media (max-width:560px){& .rail .nd.pz{box-shadow:-1px 0 0 var(--a-stone)}}`);stampSync('.hd','after');
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
const css=`.dl{--bg:#f2f3f7;--card:#fff;--fr:rgba(255,255,255,.72);--l:#0b0b0c;--l2:rgba(30,30,38,.62);--l3:rgba(30,30,38,.4);--fe:rgba(0,0,0,.06);--chip:#f1f2f6;--bl:#0a6cff;--bls:rgba(10,108,255,.09);--ok:#1f9d55;--oks:rgba(31,157,85,.11);--or:#e07a00;--ors:rgba(255,149,0,.13);--bad:#e5372b;--bads:rgba(229,55,43,.1);--sh:0 8px 24px rgba(20,30,70,.09);
font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;background:var(--bg);color:var(--l);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:12px;overflow:hidden;width:100%;min-width:0;box-sizing:border-box;position:relative;-webkit-font-smoothing:antialiased}
@media (prefers-color-scheme:dark){.dl{--bg:#0b0d14;--card:#171922;--fr:rgba(30,32,44,.8);--l:#fff;--l2:rgba(235,235,245,.64);--l3:rgba(235,235,245,.38);--fe:rgba(255,255,255,.08);--chip:rgba(255,255,255,.07);--bl:#3d8bff;--bls:rgba(61,139,255,.16);--ok:#34c759;--oks:rgba(52,199,89,.15);--or:#ff9f0a;--ors:rgba(255,159,10,.15);--bad:#ff453a;--bads:rgba(255,69,58,.15);--sh:0 8px 24px rgba(0,0,0,.4)}}
.dl *{box-sizing:border-box;min-width:0}.dl button{all:unset;box-sizing:border-box!important;border:0!important;box-shadow:none!important;background:transparent!important;min-height:0!important;height:auto!important;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .35s ${SP},background .3s,color .3s,opacity .3s}.dl button:active{transform:scale(.96)}.dl button:focus,.dl button:focus-visible{outline:none!important}.dl button:focus-visible{box-shadow:0 0 0 2px var(--bl)!important}
.dl svg{display:block;flex:none}
.dl .hd{display:flex;align-items:center;gap:10px}.dl .ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;color:#fff;background:linear-gradient(160deg,#34c759,#0b8a7a);box-shadow:0 2px 8px rgba(11,138,122,.35)}.dl .ttl{font-size:17px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;flex:none}.dl .sub{font-size:12px;color:var(--l2);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right}
.dl .kp{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.dl .k{background:var(--card);border:.5px solid var(--fe);border-radius:16px;padding:8px 11px;box-shadow:var(--sh)}.dl .k small{display:block;font-size:11px;font-weight:600;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dl .k b{display:block;font-size:18px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}.dl .k b.mute{color:var(--l3);font-size:15px;font-weight:600;line-height:23px}.dl .k.g b{color:var(--ok)}.dl .k .pu{font-style:normal;font-size:11.5px;font-weight:600;color:var(--l2);letter-spacing:0}
.dl .rail{--n:5;position:relative;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr)) 12px minmax(0,1fr);align-items:start;padding:4px 0 0;column-gap:0}.dl .rail::before{content:"";position:absolute;left:calc((100% - 12px) / (var(--n) + 1) / 2);right:calc((100% - 12px) / (var(--n) + 1) * 1.5 + 12px);top:20px;height:2px;border-radius:2px;background:color-mix(in srgb,var(--l) 14%,transparent)}
.dl .nd{display:flex!important;flex-direction:column;align-items:center;gap:5px;min-height:56px!important;padding:0 2px!important;position:relative}.dl .nd .dot{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:700;color:var(--sc);background:var(--card);box-shadow:inset 0 0 0 2px var(--sc),var(--sh);transition:transform .5s ${SP},background .3s,color .3s,box-shadow .3s;font-variant-numeric:tabular-nums}
.dl .nd .lbl{font-size:11px;font-weight:600;color:var(--l2);text-align:center;line-height:1.15;white-space:normal;overflow-wrap:normal;-webkit-hyphens:auto;hyphens:auto;max-width:100%;padding:0 1px}.dl .nd.z .dot{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--sc) 40%,transparent);color:var(--l3)}.dl .nd.on .dot{background:var(--sc);color:#fff;transform:scale(1.12);box-shadow:0 6px 16px color-mix(in srgb,var(--sc) 45%,transparent)}.dl .nd.on .lbl{color:var(--l)}
.dl .nd.pz .dot{border-radius:12px;box-shadow:inset 0 0 0 1.5px var(--l3);color:var(--l2);background:repeating-linear-gradient(135deg,transparent 0 5px,color-mix(in srgb,var(--l) 5%,transparent) 5px 10px),var(--card)}.dl .nd.pz.on .dot{background:var(--l2);color:var(--card);box-shadow:none}
.dl .sep{align-self:center;width:1px;height:28px;margin:0 auto;background:var(--fe);margin-top:4px}
.dl .fh{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--l2);padding:0 4px;min-height:18px;white-space:nowrap;overflow:hidden}.dl .fh b{color:var(--l);font-weight:600}.dl .fh .x{margin-left:auto;font-weight:600;color:var(--bl);padding:2px 0!important}
.dl .lst{display:flex;flex-direction:column;gap:8px;max-height:236px;overflow-y:auto;overflow-x:hidden;margin:0 -4px;padding:2px 4px 10px;scrollbar-width:none;-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 22px),transparent)}.dl .lst::-webkit-scrollbar{display:none}
.dl .dc{background:var(--card);border-radius:18px;border:.5px solid var(--fe);box-shadow:var(--sh);overflow:hidden;flex:none;animation:in .5s ${SP} both;animation-delay:calc(var(--i) * 35ms)}@keyframes in{from{transform:translateY(12px) scale(.98);opacity:0}}
.dl .row{display:flex!important;align-items:center;gap:10px;padding:9px 12px!important;width:100%;min-height:58px!important}.dl .av{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;flex:none;background:linear-gradient(150deg,color-mix(in srgb,var(--sc) 80%,#fff),var(--sc));box-shadow:0 3px 9px color-mix(in srgb,var(--sc) 35%,transparent)}
.dl .mid{flex:1;display:flex;flex-direction:column;gap:2px}.dl .nm{display:flex;align-items:baseline;gap:6px;white-space:nowrap;overflow:hidden}.dl .nm b{font-size:14.5px;font-weight:600;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;flex:0 1 auto}.dl .nm span{font-size:11.5px;color:var(--l3);overflow:hidden;text-overflow:ellipsis;flex:0 1 auto}
.dl .nx{font-size:12.5px;color:var(--l2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dl .nx.q{color:var(--bl);font-weight:600}
.dl .rt{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex:none;max-width:42%}.dl .val{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.dl .val.mute{color:var(--l3);font-weight:600;font-size:12px}
.dl .pr{display:flex;gap:2px}.dl .pr i{width:9px;height:4px;border-radius:2px;background:color-mix(in srgb,var(--l) 12%,transparent)}.dl .pr i.f{background:var(--sc)}
.dl .chips{display:flex;gap:5px;flex-wrap:wrap}.dl .cp{font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--chip);color:var(--l2);white-space:nowrap;display:inline-flex;align-items:center;gap:4px}.dl .cp.r{background:var(--bads);color:var(--bad)}.dl .cp.o{background:var(--ors);color:var(--or)}.dl .cp.g{background:var(--oks);color:var(--ok)}.dl .cp.b{background:var(--bls);color:var(--bl)}
.dl .ex{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s ${SP}}.dl .dc.open .ex,.dl .pc.open .ex{grid-template-rows:1fr}.dl .ex>div{overflow:hidden}.dl .bd{padding:0 12px 12px;display:flex;flex-direction:column;gap:9px;opacity:0;transition:opacity .35s}.dl .dc.open .bd,.dl .pc.open .bd{opacity:1}
.dl .kv{display:grid;grid-template-columns:auto 1fr;gap:5px 10px;font-size:12.5px;line-height:1.4}.dl .kv dt{color:var(--l3);white-space:nowrap}.dl .kv dd{margin:0;color:var(--l);overflow-wrap:anywhere}
.dl .acts{display:flex;gap:6px;flex-wrap:wrap}.dl .ac{font-size:13px;font-weight:600;color:var(--l);padding:0 14px!important;min-height:40px!important;border-radius:999px!important;background:var(--chip)!important;display:inline-flex!important;align-items:center;gap:6px;box-shadow:inset 0 0 0 1.5px transparent!important}.dl .ac.on{background:var(--bls)!important;color:var(--bl);box-shadow:inset 0 0 0 1.5px var(--bl)!important}
.dl .pc{border-radius:18px;border:1.5px dashed color-mix(in srgb,var(--l) 16%,transparent);background:repeating-linear-gradient(135deg,transparent 0 9px,color-mix(in srgb,var(--l) 2.5%,transparent) 9px 18px);flex:none;overflow:hidden}.dl .pc .av{background:var(--chip);color:var(--l2);box-shadow:none}
.dl .tiers{display:flex;flex-direction:column;gap:6px}.dl .tr{display:flex;gap:5px;flex-wrap:wrap;align-items:center}.dl .tr em{font-style:normal;font-size:11px;font-weight:700;color:var(--l3);width:52px;flex:none;text-transform:uppercase;letter-spacing:.04em}.dl .bp{font-size:12px;padding:3px 9px;border-radius:999px;background:var(--card);border:.5px solid var(--fe);white-space:nowrap}.dl .bp small{color:var(--l3);margin-left:4px;font-size:10.5px}
.dl .emp{font-size:13px;color:var(--l2);text-align:center;padding:22px 10px;background:var(--card);border-radius:18px;border:.5px dashed var(--fe);flex:none}
.dl .bar{display:flex;align-items:center;gap:8px;background:var(--fr);-webkit-backdrop-filter:blur(18px) saturate(180%);backdrop-filter:blur(18px) saturate(180%);border:.5px solid var(--fe);border-radius:18px;padding:8px 8px 8px 12px;font-size:12.5px}.dl .bar .c{color:var(--l2);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dl .bar .c b{color:var(--l);font-weight:600}
.dl .bar .go{font-size:13.5px;font-weight:700;color:#fff;background:var(--ok)!important;padding:0 16px!important;min-height:44px!important;border-radius:999px!important;flex:none;display:inline-flex!important;align-items:center;gap:6px;box-shadow:0 6px 14px color-mix(in srgb,var(--ok) 35%,transparent)!important}.dl .bar .go[disabled]{opacity:.4;cursor:default;box-shadow:none!important}
.dl .toast{position:absolute;left:50%;bottom:72px;transform:translateX(-50%);background:#1f1f24;color:#fff;font-size:13px;font-weight:600;padding:8px 14px;border-radius:999px;z-index:5;pointer-events:none;white-space:nowrap;animation:toast 1.2s ${SP} forwards}@keyframes toast{0%{opacity:0;transform:translate(-50%,10px)}20%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-8px)}}
@media (max-width:560px){.dl .rail{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:10px}.dl .rail::before,.dl .sep{display:none}.dl .rail .nd.pz{grid-column:4}}@media (max-width:460px){.dl .sub{display:none}.dl .nd .lbl{font-size:10.5px}.dl .nd .dot{width:32px;height:32px;font-size:13px}.dl .rail::before{top:18px}.dl .k b{font-size:16px}.dl .k .pu,.dl .k .wo,.dl .pc .rt{display:none}.dl .rt{max-width:38%}}
@media (prefers-reduced-motion:reduce){.dl *,.dl *::before,.dl *::after{animation:none!important;transition:none!important}}
/* shared Concierge scale: 16px padding (12px under 440px), 12px between sections, 8px inside */
@media (max-width:440px){.dl{padding:12px}}
.dl .dc.sk .av{background:transparent;color:var(--k-fg);box-shadow:inset 0 0 0 1px var(--fe);font-weight:800}.dl .dc.sk .av img{width:56%;height:56%;object-fit:contain;display:block}
.dl .dc.sk.sk{background:linear-gradient(100deg,color-mix(in srgb,var(--k-ac) 13%,var(--k-bg)),var(--k-bg) 42%);box-shadow:inset 3px 0 0 var(--k-ac);border-color:color-mix(in srgb,var(--k-ac) 30%,var(--k-bg))}.dl .dc.sk.sk.open{border-color:var(--k-ac)}.dl .nm b.wm{display:flex;align-items:center;align-self:center;flex:0 1 auto}.dl .nm b.wm img{display:block;height:var(--k-lh,12px);width:auto;max-width:100%}
.dl .dc.sk.up .nm b{text-transform:uppercase;letter-spacing:.05em;font-weight:800}`;
const cv=v=>String(v==null?'':v).replace(/[;{}<>"\\]/g,'');
function skv(k){if(!k||typeof k!='object'||!k.bg)return'';const bg=cv(k.bg),fg=cv(k.fg||'#fff'),ac=cv(k.accent||fg),mu=k.muted?cv(k.muted):`color-mix(in srgb,${fg} 64%,transparent)`,ln=k.line?cv(k.line):`color-mix(in srgb,${fg} 15%,transparent)`,as=`color-mix(in srgb,${ac} 18%,transparent)`;
return[`--card:${bg}`,`--l:${fg}`,`--l2:${mu}`,`--l3:color-mix(in srgb,${fg} 42%,transparent)`,`--fe:${ln}`,`--chip:color-mix(in srgb,${fg} 9%,transparent)`,`--bl:${ac}`,`--bls:${as}`,`--sh:none`,
`--a-ground:${bg}`,`--a-bone:${bg}`,`--a-ink:${fg}`,`--a-stone:${ln}`,`--a-label:${mu}`,`--a-ember:${ac}`,`--a-emberT:${ac}`,`--a-emberS:${as}`,`--a-on:${cv(k.accentInk||bg)}`,
`--k-bg:${bg}`,`--k-fg:${fg}`,`--k-ac:${ac}`,k.logoH?`--k-lh:${Number(k.logoH)||12}px`:'',`color:${fg}`,k.font?`font-family:${cv(k.font)}`:''].filter(Boolean).join(';')}
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={deal:'<path d="M3 17l5-5 4 4 8-8"/><path d="M14 8h6v6"/>',chev:'<path d="M6 9l6 6 6-6"/>',pause:'<path d="M9 5v14M15 5v14"/>',send:'<path d="M5 12h13M13 6l6 6-6 6"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'};
const I=(k,s=16,w=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;
const ST=D.stages||[],SK=ST.map(s=>s[0]),SC=Object.fromEntries(ST.map(s=>[s[0],s[2]])),SL=Object.fromEntries(ST.map(s=>[s[0],s[1]]));
const T0=(()=>{const t=new Date();t.setHours(0,0,0,0);return t})();
const pd=s=>{if(!s)return null;const[y,m,d]=s.slice(0,10).split('-').map(Number);return new Date(y,m-1,d)};
const dd=s=>{const d=pd(s);return d?Math.round((d-T0)/864e5):null};
const wd=s=>pd(s).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}).replace(',','');
const usd=n=>'$'+Number(n||0).toLocaleString('en-US');
const ago=n=>n==null?'':n<=0?'today':n==1?'1d ago':n+'d ago';
function dueChip(date,lab){const n=dd(date);if(n==null)return'';const t=n<0?`${lab} ${-n}d late`:n==0?`${lab} today`:n==1?`${lab} tomorrow`:`${lab} ${wd(date)}`;return`<span class="cp ${n<=1?'r':n<=4?'o':''}">${I('flag',11,2.4)}${e(t)}</span>`}
const Q={};let flt=null,open=null;
const deals=D.deals||[],PZ=D.paused;
function render(){const T=D.totals||{},cnt=k=>deals.filter(d=>d.stage==k).length,qn=Object.keys(Q).length;
const shown=flt=='paused'?[]:deals.filter(d=>!flt||d.stage==flt);
A.innerHTML=`<style>${css}</style><div class="dl" style="${SK.map((k,i)=>`--c${i}:${SC[k]}`).join(';')}">
<div class="hd"><span class="ic">${I('deal',17,2.4)}</span><span class="ttl">Concierge · Deals</span><span class="sub">${deals.length} active${PZ?` · ${PZ.count} paused`:''} · ${e(wd(D.date||new Date().toISOString()))}</span></div>
<div class="kp"><div class="k g"><small>Agreed</small><b${T.agreed?'':' class="mute"'}>${T.agreed?usd(T.agreed):'None yet'}</b></div><div class="k"><small title="Flat amounts quoted or offered${(T.perUnit||[]).length?'; plus '+e(T.perUnit.join(', ')):''}">Quoted<span class="wo"> or offered</span></small><b${T.onTable?'':' class="mute"'}>${T.onTable?usd(T.onTable):'None'}${(T.perUnit||[]).length?`<i class="pu"> + ${e(T.perUnit.map(x=>x.replace(/ \(.*\)$/,'')).join(', '))}</i>`:''}</b></div><div class="k"><small>Paid</small><b${T.paid?'':' class="mute"'}>${T.paid?usd(T.paid):'None yet'}</b></div></div>
<div class="rail" role="tablist" lang="en" style="--n:${SK.length}">${SK.map(k=>`<button class="nd${flt==k?' on':''}${cnt(k)?'':' z'}" role="tab" aria-selected="${flt==k}" data-f="${k}" style="--sc:${SC[k]}"><span class="dot">${cnt(k)}</span><span class="lbl">${e(SL[k])}</span></button>`).join('')}<span class="sep"></span>${PZ?`<button class="nd pz${flt=='paused'?' on':''}" role="tab" aria-selected="${flt=='paused'}" data-f="paused" style="--sc:#8e8e93"><span class="dot">${PZ.count}</span><span class="lbl">Paused</span></button>`:'<span></span>'}</div>
<div class="fh">${flt?`<b>${e(flt=='paused'?'Paused':SL[flt])}</b> · ${flt=='paused'?PZ.count+' brands':shown.length+' deal'+(shown.length==1?'':'s')}<button class="x" data-f="${flt}">Show all</button>`:`<b>All deals</b> · closest to money first`}</div>
<div class="lst">${shown.map((d,i)=>card(d,i)).join('')}${!flt||flt=='paused'?pcard(shown.length):''}${flt&&flt!='paused'&&!shown.length?`<div class="emp">${flt=='paid'?'Nothing paid yet.'+((ag=>ag?' Next up: '+e(ag.brand)+' (agreed).':'')(deals.find(d=>d.stage=='agreed'))):'No deals at this stage.'}</div>`:''}</div>
<div class="bar"><span class="c">${qn?`<b>${qn} queued:</b> ${e(Object.entries(Q).map(([id,a])=>(id=='__paused'?'LinkedIn':deals.find(d=>d.id==id).brand)+' '+a.toLowerCase()).join(', '))}`:'Tap a deal to queue an action'}</span><button class="go" id="go"${qn?'':' disabled'}>Send ${qn||''} ${I('send',14,2.4)}</button></div></div>`;
bind()}
function card(d,i){const sc=SC[d.stage],si=SK.indexOf(d.stage),q=Q[d.id],v=d.value,isO=open==d.id;
const nx=q?`Queued: ${q}`:(d.next&&d.next.text)||'',k=skv(d.skin)?d.skin:null;
return`<div class="dc${isO?' open':''}${k?' sk'+(k.upper?' up':''):''}" data-id="${e(d.id)}"${k?` data-brand-skin="${e(k.name||d.id)}"`:''} style="--sc:${sc};--i:${i}${k?';'+skv(k):''}">
<button class="row" data-tg="1" aria-expanded="${isO}"><span class="av">${k&&k.mark?`<img src="${e(k.mark)}" alt="">`:e((d.brand||'?')[0])}</span><span class="mid"><span class="nm">${k&&k.logo?`<b class="wm"><img src="${e(k.logo)}" alt="${e(d.brand)}"></b>`:`<b>${e(d.brand)}</b>`}${d.via?`<span>via ${e(d.via)}</span>`:d.tag?`<span>${e(d.tag)}</span>`:''}</span><span class="nx${q?' q':''}">${e(nx)}</span>
<span class="chips">${d.deadline?dueChip(d.deadline.date,'Due'):d.next&&d.next.date?dueChip(d.next.date,'Next'):''}${d.last&&d.last.date?`<span class="cp">${I('clock',11,2.4)}${e(d.last.who||'')} ${ago(dd(d.last.date)==null?null:-dd(d.last.date))}</span>`:''}${d.draft?`<span class="cp b">${I('mail',11,2.4)}Draft</span>`:''}${d.kind!='Paid'?`<span class="cp">${e(d.kind)}</span>`:''}</span></span>
<span class="rt"><span class="val${v&&v.amount?'':' mute'}">${v?e(v.label):d.kind=='Paid'?'Price TBD':''}</span><span class="pr" title="${e(SL[d.stage])}">${SK.map((k,j)=>`<i class="${j<=si?'f':''}"></i>`).join('')}</span></span></button>
<div class="ex"><div><div class="bd"><dl class="kv"><dt>Stage</dt><dd>${e(SL[d.stage])}${d.type?' · '+e(d.type):''}</dd><dt>Status</dt><dd>${e(d.status)}</dd>${d.draft?`<dt>Draft</dt><dd>${e(d.draft)}</dd>`:''}<dt>Channel</dt><dd>${e(d.channel)}</dd>${d.notes?`<dt>Notes</dt><dd>${e(d.notes)}</dd>`:''}</dl>
${d.acts&&d.acts.length?`<div class="acts">${d.acts.map(a=>`<button class="ac${q==a?' on':''}" data-a="${e(a)}">${e(a)}</button>`).join('')}</div>`:''}</div></div></div></div>`}
function pcard(n){if(!PZ)return'';const isO=open=='__paused'||flt=='paused',q=Q.__paused,T={};PZ.brands.forEach(b=>(T[b.tier||'Other']=T[b.tier||'Other']||[]).push(b));
const rs=PZ.restartDate?dd(PZ.restartDate):null;
return`<div class="pc${isO?' open':''}" data-id="__paused" style="--i:${n}"><button class="row" data-tg="1" aria-expanded="${isO}"><span class="av">${I('pause',16,2.6)}</span><span class="mid"><span class="nm"><b>${e(PZ.label)}</b><span>${PZ.count} brands</span></span><span class="nx${q?' q':''}">${q?'Queued: '+e(q):`Paused${PZ.restart?`, restart about ${e(PZ.restart)}`:''}. Drafts kept.`}</span>
<span class="chips">${PZ.restartDate?`<span class="cp">${I('flag',11,2.4)}Restart ${rs!=null&&rs>=0?'in '+rs+'d':e(PZ.restart)}</span>`:''}${Object.entries(T).map(([t,a])=>`<span class="cp">${a.length} ${e(t)}</span>`).join('')}</span></span>
<span class="rt"><span class="val mute">${PZ.floor?e(PZ.floor)+' floor':''}</span></span></button>
<div class="ex"><div><div class="bd">${PZ.why?`<div class="nx" style="white-space:normal">Why paused, in your words: "${e(PZ.why)}"</div>`:''}<div class="tiers">${Object.entries(T).map(([t,a])=>`<div class="tr"><em>${e(t)}</em>${a.map(b=>`<span class="bp">${e(b.brand)}${b.cohort?`<small>${e(b.cohort)}</small>`:''}</span>`).join('')}</div>`).join('')}</div>
<div class="kv"><dt>From</dt><dd>${e(PZ.from||'')}</dd>${PZ.floor?`<dt>Floor</dt><dd>${e(PZ.floor)} for ${e(PZ.floorTier||'')} tier</dd>`:''}</div>
<div class="acts">${[PZ.restart?'Restart '+PZ.restart:'Restart',  'Keep paused'].map(a=>`<button class="ac${q==a?' on':''}" data-a="${e(a)}">${e(a)}</button>`).join('')}</div></div></div></div></div>`}
function bind(){A.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=b.dataset.f;flt=flt==f?null:f;open=null;render()});
A.querySelectorAll('.dc,.pc').forEach(c=>{const id=c.dataset.id;c.querySelector('[data-tg]').onclick=()=>{const was=c.classList.contains('open');A.querySelectorAll('.dc.open,.pc.open').forEach(x=>{if(x!==c&&!(x.classList.contains('pc')&&flt=='paused'))x.classList.remove('open')});c.classList.toggle('open',!was);open=was?null:id;if(!was)setTimeout(()=>c.scrollIntoView({block:'nearest',behavior:'smooth'}),180)};
c.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(Q[id]==a)delete Q[id];else Q[id]=a;const sc=c.closest('.lst').scrollTop;open=id;render();const L=A.querySelector('.lst');L.scrollTop=sc;A.querySelectorAll('.dc,.pc').forEach(x=>x.style.animation='none');if(Q[id])toast('Queued: '+a)})});
A.querySelector('#go').onclick=send}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;A.querySelector('.dl').appendChild(d);setTimeout(()=>d.remove(),1300)}
function send(){const en=Object.entries(Q);if(!en.length)return;const L=[`Deal actions (${wd(D.date||new Date().toISOString())}):`];
en.forEach(([id,a],i)=>{if(id=='__paused'){L.push(`${i+1}. LinkedIn outbound (${PZ.count} paused brands): ${a}`);return}const d=deals.find(x=>x.id==id);L.push(`${i+1}. ${d.brand}${d.via?' (via '+d.via+')':''} [${SL[d.stage]}${d.value?', '+d.value.label:''}]: ${a}${d.draft&&/draft/i.test(a)?' (draft: '+d.draft+')':''}`)});
L.push('Drafts only: I press Send myself. Update brand-ledger.md and the lane files.');sendPrompt(L.join('\n'))}
render();/* Ask Concierge bar (standard in every Concierge widget): one-line pill at the bottom of the card. The arrow shows once there is text;
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
askBar('.dl',()=>{const d=(D.deals||[]).find(x=>x.id==open);return 'Deals · '+(d?d.brand:open=='__paused'?'LinkedIn outbound (paused)':flt?'stage '+flt:'all deals')},'glass');})();
