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
