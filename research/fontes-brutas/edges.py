import json, glob, os
D='/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/wt-blevins/research/extract'
claims={}
for f in sorted(glob.glob(os.path.join(D,'*.jsonl'))):
    for l in open(f,encoding='utf-8'):
        s=l.strip()
        if not s: continue
        d=json.loads(s); claims[d['id']]=d
def show(c,pref=''):
    if c is None: return pref+'NÃO EXISTE'
    p='  '.join(f"{x['name']}={x['value']}{x.get('unit','')}" for x in (c.get('params') or []))
    return (f"{pref}{c['id']} [{c['src']}@{c['at']}] scope:{c.get('scope')} modo:{c.get('modo')} topic:{','.join(c.get('topic') or [])}\n"
            f"{pref}  CLAIM: {c['claim']}\n"
            + (f"{pref}  PARAMS: {p}\n" if p else '')
            + f"{pref}  VERB: \"{c.get('verbatim','')}\"\n")
n=0
for cid,c in sorted(claims.items()):
    if not cid.startswith('G'): continue
    for t in (c.get('conflicts') or []):
        n+=1
        print(f"===== ARESTA {n} : {cid}  x  {t} =====")
        print(show(c,'B| '))
        print(show(claims.get(t),'V| '))
print('TOTAL ARESTAS', n)
