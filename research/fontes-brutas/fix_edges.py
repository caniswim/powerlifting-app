import json, glob, os
D='/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/wt-blevins/research/extract'
# arestas a REMOVER: (id_blevins, alvo_vena)
REMOVER = {
 ('G001-62','V076-19'),
 ('G004-37','V061-19'),
 ('G008-06','V061-19'),
 ('G008-07','V061-19'),
 ('G015-26','V036-01'),
 ('G020-23','V102-09'),
 ('G020-25','V102-12'),
 ('G037-30','V102-09'),
 ('G038-04','V102-16'),
 ('G038-05','V102-16'),
 ('G038-19','V102-09'),
 ('G040-04','V077-20'),
 ('G048-43','V003-07'),
 ('G048-58','V038-02'),
 ('G051-12','V015-27'),
 ('G051-21','V018-28'),
}
# arestas a ACRESCENTAR
ADICIONAR = {
 'G051-11': ['V015-27'],   # retarget: a prática, não o enquadramento
 'G030-24': ['F001-01'],   # profundidade: "exatamente paralelo" x regra IPF
}
rem=0; add=0
for f in sorted(glob.glob(os.path.join(D,'G*.jsonl'))):
    out=[]; ch=False
    for l in open(f,encoding='utf-8'):
        s=l.strip()
        if not s: continue
        d=json.loads(s); cid=d['id']
        if d.get('conflicts'):
            nv=[t for t in d['conflicts'] if (cid,t) not in REMOVER]
            if nv!=d['conflicts']:
                rem += len(d['conflicts'])-len(nv); ch=True
                if nv: d['conflicts']=nv
                else: d.pop('conflicts')
        if cid in ADICIONAR:
            cur=d.get('conflicts') or []
            for t in ADICIONAR[cid]:
                if t not in cur: cur.append(t); add+=1; ch=True
            d['conflicts']=cur
        out.append(json.dumps(d, ensure_ascii=False))
    if ch: open(f,'w',encoding='utf-8').write('\n'.join(out)+'\n')
print('removidas', rem, '| adicionadas', add)
