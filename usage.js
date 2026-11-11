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
& .m.na{--c:var(--a-stone)}& .m.na .rg b{font-size:16px;letter-spacing:-.02em;color:var(--a-label)}& .md.ns{box-shadow:inset 0 0 0 1px var(--a-stone);color:var(--a-label)}& .ft.na{--c:var(--a-label)}`);
/*SKIN:END*/const SP='cubic-bezier(.32,.72,0,1)';
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
