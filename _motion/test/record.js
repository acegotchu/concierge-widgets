#!/usr/bin/env node
/* Motion test rig. Renders one template with a sample window.D in Chromium and, for each step in steps/<card>.js:
   - a frame strip: animations slowed 10x via CDP Animation.setPlaybackRate, one frame every ~25ms of animation time
   - a real-time video of all steps (webm)
   - console errors and page errors
   - the same steps under prefers-reduced-motion (strip of 4 frames)
 Usage: node record.js <card> <template.js> <sample.js> <outdir> <label>
   sample.js sets window.D (no data ships in this repo; pass your own). Prints a JSON summary. */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const [card,tpl,sample,out,label='after']=process.argv.slice(2);
const steps=require(path.resolve(__dirname,'steps',card+'.js'));
const W=+(process.env.W||420);
fs.mkdirSync(out,{recursive:true});
const html=(dark)=>`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;padding:16px;background:${dark?'#000':'#fff'};font-family:system-ui}#app{width:${W-32}px}</style></head><body>
<div id="app"></div><script>window.__sent=[];window.sendPrompt=t=>window.__sent.push(t);</script>
<script>${fs.readFileSync(sample,'utf8')}</script><script src="file://${path.resolve(tpl)}"></script></body></html>`;
(async()=>{const b=await chromium.launch();const res={card,label,errors:[],steps:[],sent:[]};
const pageFile=path.join(out,`.${card}-${label}.html`);fs.writeFileSync(pageFile,html(false));
async function open(opts={}){const ctx=await b.newContext({viewport:{width:W,height:900},deviceScaleFactor:1,...opts});const p=await ctx.newPage();
 p.on('console',m=>{if(m.type()=='error')res.errors.push((opts.reducedMotion?'[reduced] ':'')+m.text())});p.on('pageerror',e=>res.errors.push((opts.reducedMotion?'[reduced] ':'')+String(e)));
 await p.goto('file://'+pageFile);await p.waitForTimeout(900);return{ctx,p}}
const app=p=>p.locator('#app');
// 1. frame strips at 10x slow motion
{const {ctx,p}=await open();const cdp=await ctx.newCDPSession(p);await cdp.send('Animation.enable');
 for(const s of steps){if(s.setup)await s.setup(p);await p.waitForTimeout(400);
  await cdp.send('Animation.setPlaybackRate',{playbackRate:.1});const t0=Date.now();await s.run(p);const fr=[];
  for(let i=0;i<(s.frames||14);i++){const f=path.join(out,`${card}-${label}-${s.name}-${String(i).padStart(2,'0')}.png`);await app(p).screenshot({path:f});fr.push({f,ms:Math.round((Date.now()-t0)/10)});await p.waitForTimeout(Math.max(0,(i+1)*(s.every||250)-(Date.now()-t0)))}
  await cdp.send('Animation.setPlaybackRate',{playbackRate:1});await p.waitForTimeout(500);res.steps.push({name:s.name,frames:fr});
  if(s.again&&s.rev!==false){/* reversal: run, then the second tap ~60ms of animation time later (slowed 10x) */await cdp.send('Animation.setPlaybackRate',{playbackRate:.1});const t1=Date.now();await s.again(p);await p.waitForTimeout(600);await s.run(p);const fr2=[];
   for(let i=0;i<(s.frames||14);i++){const f=path.join(out,`${card}-${label}-${s.name}-rev-${String(i).padStart(2,'0')}.png`);await app(p).screenshot({path:f});fr2.push({f,ms:Math.round((Date.now()-t1)/10)});await p.waitForTimeout(Math.max(0,600+(i+1)*(s.every||250)-(Date.now()-t1)))}
   await cdp.send('Animation.setPlaybackRate',{playbackRate:1});await p.waitForTimeout(500);res.steps.push({name:s.name+' (again, then reversed mid-flight)',frames:fr2})}}
 res.sent=await p.evaluate(()=>window.__sent);await ctx.close()}
// 2. real-time video
{const {ctx,p}=await open({recordVideo:{dir:out,size:{width:W,height:900}}});for(const s of steps){if(s.setup)await s.setup(p);await p.waitForTimeout(500);await s.run(p);await p.waitForTimeout(900);if(s.again){await s.again(p);await p.waitForTimeout(900)}}
 const v=await p.video().path();await ctx.close();const dst=path.join(out,`${card}-${label}.webm`);fs.renameSync(v,dst);res.video=dst}
// 3. reduced motion
{const {ctx,p}=await open({reducedMotion:'reduce'});res.reduced=[];for(const s of steps){if(s.setup)await s.setup(p);await p.waitForTimeout(300);await s.run(p);const fr=[];
 for(const ms of [0,60,140,400]){await p.waitForTimeout(ms-(fr.length?[0,60,140,400][fr.length-1]:0));const f=path.join(out,`${card}-${label}-reduced-${s.name}-${fr.length}.png`);await app(p).screenshot({path:f});fr.push({f,ms})}res.reduced.push({name:s.name,frames:fr})}
 res.reducedAnims=await p.evaluate(()=>document.getAnimations().map(a=>a.effect&&a.effect.getKeyframes().map(k=>Object.keys(k).filter(x=>!['offset','easing','composite','computedOffset'].includes(x)).join('+')).join('|')));await ctx.close()}
await b.close();fs.unlinkSync(pageFile);fs.writeFileSync(path.join(out,`${card}-${label}.json`),JSON.stringify(res,null,1));
console.log(JSON.stringify({card,label,errors:res.errors,sent:res.sent.length,steps:res.steps.map(s=>s.name)}))})().catch(e=>{console.error(e);process.exit(1)});
