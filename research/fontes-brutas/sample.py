import json, glob, random, re, sys, collections
rows=[]
for f in sorted(glob.glob('/Users/brunnovert/Documents/Dev/powerlifting-app/research/extract/*.jsonl')):
    for line in open(f):
        line=line.strip()
        if not line: continue
        d=json.loads(line)
        if d.get('scope'): rows.append(d)
def fp(v):
    return bool(re.search(r"\b(i|i'm|i've|i'd|i'll|my|me|myself|mine)\b", v.lower()))
def you(v):
    return bool(re.search(r"\b(you|your|you're|you've|yourself)\b", v.lower()))
random.seed(42)
G=[d for d in rows if d['scope']=='GERAL']
P=[d for d in rows if d['scope']=='PESSOAL']
# spread across videos: sort by src, take stratified
def spread(pool, n):
    bysrc=collections.defaultdict(list)
    for d in pool: bysrc[d['src']].append(d)
    srcs=sorted(bysrc)
    out=[]; i=0
    while len(out)<n and i<50:
        for s in srcs:
            if i<len(bysrc[s]):
                random.shuffle(bysrc[s])
                out.append(bysrc[s][i])
                if len(out)>=n: break
        i+=1
    return out
mode=sys.argv[1]
if mode=='A': sel=spread(G,100)
elif mode=='B': sel=spread(P,55)
elif mode=='C': sel=spread([d for d in G if fp(d['verbatim']) and not you(d['verbatim'])],60)
elif mode=='D': sel=spread([d for d in P if not fp(d['verbatim'])],40)
elif mode=='E':
    pat=re.compile(r"\b(beginner|novice|intermediate|advanced|if you|new lifter|first year|elite|powerlifter)\b", re.I)
    sel=spread([d for d in G if pat.search(d['verbatim'])],40)
elif mode=='F':
    pat=re.compile(r"(don't recommend|wouldn't recommend|not recommend|most people should|i wouldn't|not for everyone|aggressive|probably shouldn't|i don't think you|personally)", re.I)
    sel=[d for d in rows if pat.search(d['verbatim'])][:60]
for d in sel:
    p=';'.join(f"{x['name']}={x['value']}{x['unit']}" for x in d.get('params',[]))
    print(f"{d['id']}|{d['src']}@{d['at']}|{d['scope']}|{'/'.join(d['topic'])}|{d['claim']}|>>{d['verbatim']}|{p}")
