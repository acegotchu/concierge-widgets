#!/usr/bin/env python3
"""Sync _motion/motion.js into every template that carries a MOTION block (fly.js is left alone).
A template without the block gets it right after /*SKIN:END*/ (the first line of the template's own code)."""
import pathlib,re,sys
here=pathlib.Path(__file__).resolve().parent;root=here.parent
block=(here/'motion.js').read_text().strip()
for n in ['digest','open','mail','deals','week','stays','usage','manager']:
    p=root/f'{n}.js';s=p.read_text()
    if '/*MOTION:BEGIN*/' in s:
        s=re.sub(r'/\*MOTION:BEGIN\*/.*?/\*MOTION:END\*/',lambda m:block,s,count=1,flags=re.S)
    else:
        i=s.index('/*SKIN:END*/')+len('/*SKIN:END*/');s=s[:i]+'\n'+block+'\n'+s[i:]
    p.write_text(s);print('synced',n)
