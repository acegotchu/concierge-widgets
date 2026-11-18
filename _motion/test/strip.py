#!/usr/bin/env python3
"""Compose frame strips: strip.py <outdir> <card>  ->  <card>-strips.png (rows: before/after per step, frames left to right with ms labels)."""
import json,sys,os
from PIL import Image,ImageDraw
out,card=sys.argv[1],sys.argv[2]
rows=[]
for label in ['before','after']:
    j=os.path.join(out,f'{card}-{label}.json')
    if not os.path.exists(j):continue
    r=json.load(open(j))
    for s in r['steps']:rows.append((f"{label} · {s['name']}",s['frames']))
    for s in r.get('reduced',[]):rows.append((f"{label} · reduced · {s['name']}",s['frames']))
if not rows:sys.exit('no runs')
sc=.5;ims=[[(Image.open(f['f']).convert('RGB'),f['ms']) for f in fr] for _,fr in rows]
w=max(sum(int(i.width*sc)+6 for i,_ in r) for r in ims)+10;hs=[max(int(i.height*sc) for i,_ in r)+40 for r in ims]
S=Image.new('RGB',(w,sum(hs)),'#f4f4f4');d=ImageDraw.Draw(S);y=0
for (name,_),r,h in zip(rows,ims,hs):
    d.text((8,y+6),name,fill='#000');x=8
    for i,ms in r:
        t=i.resize((int(i.width*sc),int(i.height*sc)));S.paste(t,(x,y+24));d.text((x+2,y+h-14),f'{ms}ms',fill='#c00');x+=t.width+6
    y+=h
S.save(os.path.join(out,f'{card}-strips.png'));print(os.path.join(out,f'{card}-strips.png'),S.size)
